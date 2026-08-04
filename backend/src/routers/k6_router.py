import asyncio

from fastapi import APIRouter, WebSocket
from starlette.websockets import WebSocketDisconnect

from repositories.k6_repository import K6Repository
from services.k6_service import K6Service
from settings.session_local import SessionLocal

router = APIRouter()


@router.websocket("/ws")
async def websocket_handler(websocket: WebSocket):
    await websocket.accept()

    async def sender():
        while True:
            async with SessionLocal() as session:
                service = K6Service(K6Repository(session))
                await service.get_k6_test_status(websocket)

            await asyncio.sleep(1)

    async def receiver():
        while True:
            payload = await websocket.receive_json()

            async with SessionLocal() as session:
                service = K6Service(K6Repository(session))
                await service.handle_command(websocket, payload)

    sender_task = asyncio.create_task(sender())
    receiver_task = asyncio.create_task(receiver())

    try:
        await asyncio.gather(sender_task, receiver_task)
    except WebSocketDisconnect:
        ...
    finally:
        sender_task.cancel()
        receiver_task.cancel()