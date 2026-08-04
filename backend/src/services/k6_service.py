import asyncio
import json
from datetime import datetime, timezone

import httpx
from pathlib import Path
from sqlite3 import IntegrityError
from typing import Annotated
from uuid import UUID

import docker
from docker.errors import APIError
from fastapi import Depends, WebSocket

from dependencies.get_k6_repository import get_k6_repository
from enums.K6ContainerStatus import K6ContainerStatus
from repositories.k6_repository import K6Repository
from settings.session_local import SessionLocal
from settings.settings import Settings

# Eventually refactor this class ... Makes no sense the service send the websocket message
class K6Service:
    client = docker.from_env()
    settings = Settings()

    K6_NAME = "k6"
    K6_IMAGE = "docker.io/grafana/k6:latest"
    K6_NETWORK = "url-shortner_default"
    K6_SCRIPTS_PATH = str(Path(settings.K6_TESTS_DIRECTORY))
    K6_VOLUME = {K6_SCRIPTS_PATH: {"bind": "/scripts", "mode": "ro"}}

    def __init__(
            self,
            k6_repository: Annotated[K6Repository, Depends(get_k6_repository)]
    ):
        self.k6_repository = k6_repository


    @classmethod
    def _metric_sample(cls, metrics_data: list, metric_id: str) -> dict:
        for metric in metrics_data:
            if metric.get("id") == metric_id:
                return metric.get("attributes", {}).get("sample", {})

        return {}

    async def get_k6_test_status(self, websocket: WebSocket):
        entity = await self.k6_repository.get_running_container()

        if not entity:
            return

        try:
            containers = await asyncio.to_thread(
                self.client.containers.list,
                filters={"ancestor": self.K6_IMAGE, "status": K6ContainerStatus.RUNNING}
            )

            if not containers:
                return

            container = containers[0]
            container.reload()

            ip = container.attrs["NetworkSettings"]["Networks"][self.K6_NETWORK]["IPAddress"]

            async with httpx.AsyncClient() as async_client:
                status_response = await async_client.get(
                    f"http://{ip}:6565/v1/status",
                    timeout=2,
                )
                metrics_response = await async_client.get(
                    f"http://{ip}:6565/v1/metrics",
                    timeout=2,
                )

            status_attributes = status_response.json()["data"]["attributes"]
            metrics_data = metrics_response.json()["data"]

            await websocket.send_text(json.dumps({
                "status": entity.status,
                "test": entity.test_performed,
                "started_at": entity.started_at.isoformat(),
                "running_time": round((datetime.now(timezone.utc) - entity.started_at).total_seconds(), 1),
                "metrics": {
                    "progress_percentage": self._metric_sample(metrics_data, "test_progress").get("value", 0),
                    "vus": status_attributes.get("vus") or 0,
                    "max_vus": status_attributes.get("vus-max") or 0,
                    "total_requests": self._metric_sample(metrics_data, "http_reqs").get("count", 0),
                }
            }))
        except httpx.HTTPError as e:
            await websocket.send_json({"error": str(e)})
        except docker.errors.APIError as e:
            await websocket.send_json({"error": str(e)})

    async def _run_k6(self, websocket: WebSocket, entity_id: UUID, test_name: str):
        try:
            container = await asyncio.to_thread(
                self.client.containers.run,
                image=self.K6_IMAGE,
                command=f"run --address 0.0.0.0:6565 /scripts/{test_name}",
                volumes={self.K6_SCRIPTS_PATH: {"bind": "/scripts", "mode": "ro"}},
                network=self.K6_NETWORK,
                detach=True,
                auto_remove=True
            )

            async with SessionLocal() as session:
                await K6Repository(session).set_running(entity_id)

            await websocket.send_text(json.dumps({"status": K6ContainerStatus.RUNNING, "test": test_name}))

            result = await asyncio.to_thread(container.wait)

            async with SessionLocal() as session:
                await K6Repository(session).set_ended(entity_id)

            await websocket.send_text(json.dumps({
                "status": K6ContainerStatus.ENDED,
                "exit_code": result.get("StatusCode", -1),
            }))

        except APIError as e:
            async with SessionLocal() as session:
                await K6Repository(session).set_ended(entity_id)
            await websocket.send_text(json.dumps({"error": str(e)}))

    async def _handle_start(self, websocket: WebSocket, test_name: str):
        try:
            entity = await self.k6_repository.create(test_name)
        except IntegrityError:
            await websocket.send_text(json.dumps({"error": "a test is already running"}))
            return
        except Exception as e:
            await websocket.send_text(json.dumps({"error": str(e)}))
            return

        await websocket.send_text(json.dumps({"status": K6ContainerStatus.PENDING, "test": test_name}))
        asyncio.create_task(self._run_k6(websocket, entity.id, test_name))

    async def _handle_stop(self, websocket: WebSocket):
        entity = await self.k6_repository.get_running_container()

        if not entity:
            await websocket.send_text(json.dumps({"error": "no test running"}))
            return

        try:
            containers = await asyncio.to_thread(
                self.client.containers.list,
                filters={"ancestor": self.K6_IMAGE, "status": K6ContainerStatus.RUNNING}
            )

            for container in containers:
                await asyncio.to_thread(container.stop)

            await self.k6_repository.set_ended(entity.id)
            await websocket.send_text(json.dumps({"status": K6ContainerStatus.ENDED}))
        except APIError as e:
            await websocket.send_text(json.dumps({"error": str(e)}))

    async def handle_command(self, websocket: WebSocket, payload: dict):
        action = payload.get("action", None)
        test_name = payload.get("test", "")

        match action:
            case "start":
                await self._handle_start(websocket, test_name)
            case "stop":
                await self._handle_stop(websocket)
            case _:
                await websocket.send_text(json.dumps({"error": f"unknown action: {action}"}))


