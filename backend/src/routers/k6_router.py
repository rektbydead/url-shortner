from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from services.k6_service import K6Service
from dependencies.get_session import get_session
from repositories.k6_repository import K6Repository

router = APIRouter()


@router.websocket("/ws")
async def websocket_handler(websocket: WebSocket, ):
    await websocket.accept()

    try:
        while True:
            payload = await websocket.receive_json()

            async with get_session() as session:
                service = K6Service(K6Repository(session))
                await service.handle_command(websocket, payload)
                await websocket.send_text(f"completed: {payload}")
    except WebSocketDisconnect:
        pass
