import asyncio
import json
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


class K6Service:
    client = docker.from_env()

    K6_IMAGE = "docker.io/grafana/k6:latest"
    K6_NETWORK = "url-shortner_default"
    K6_SCRIPTS_PATH = "/scripts"

    def __init__(
            self,
            k6_repository: Annotated[K6Repository, Depends(get_k6_repository)]
    ):
        self.k6_repository = k6_repository

    async def _handle_status(self, websocket: WebSocket):
        container = await self.k6_repository.get_running_container()

        if not container:
            return await websocket.send_text(json.dumps({"status": "idle"}))

        return await websocket.send_text(json.dumps({
            "status": container.status,
            "test": container.test_performed,
            "started_at": container.started_at.isoformat(),
        }))

    async def _run_k6(self, websocket: WebSocket, entity_id: UUID, test_name: str):
        try:
            container = await asyncio.to_thread(
                self.client.containers.run,
                image=self.K6_IMAGE,
                command=f"run /scripts/{test_name}.js",
                volumes={self.K6_SCRIPTS_PATH: {"bind": "/scripts", "mode": "ro"}},
                network=self.K6_NETWORK,
                remove=True,
                detach=True,
            )

            async with SessionLocal() as session:
                await K6Repository(session).set_running(entity_id)

            await websocket.send_text(json.dumps({"status": "running", "test": test_name}))

            result = await asyncio.to_thread(container.wait)

            async with SessionLocal() as session:
                await K6Repository(session).set_ended(entity_id)

            await websocket.send_text(json.dumps({
                "status": "ended",
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

        await websocket.send_text(json.dumps({"status": "starting", "test": test_name}))
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
            await websocket.send_text(json.dumps({"status": "stopped"}))
        except APIError as e:
            await websocket.send_text(json.dumps({"error": str(e)}))

    async def handle_command(self, websocket: WebSocket, payload: dict):
        action = payload.get("action")
        test_name = payload.get("test")  # e.g. "stress", "smoke"

        match action:
            case "status":
                await self._handle_status(websocket)
            case "start":
                await self._handle_start(websocket, test_name)
            case "stop":
                await self._handle_stop(websocket)
            case _:
                await websocket.send_text(json.dumps({"error": f"unknown action: {action}"}))
