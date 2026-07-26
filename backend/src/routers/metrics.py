from typing import Annotated

from fastapi import APIRouter, Response, Depends
from prometheus_client import CONTENT_TYPE_LATEST
from starlette.responses import StreamingResponse

from dependencies.get_prometheus_service import get_prometheus_service
from services.prometheus_service import PrometheusService

router = APIRouter()


@router.get("/")
async def metrics(
        service: Annotated[PrometheusService, Depends(get_prometheus_service)],
):
    return Response(service.get_metrics(), media_type=CONTENT_TYPE_LATEST)


@router.get("/stream")
async def stream_metrics(
        service: Annotated[PrometheusService, Depends(get_prometheus_service)],
):
    return StreamingResponse(
        service.get_metrics_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
        }
    )
