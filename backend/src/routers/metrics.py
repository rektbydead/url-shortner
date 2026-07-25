from fastapi import APIRouter, Request, Response, HTTPException
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST, CollectorRegistry, multiprocess

router = APIRouter()


@router.get("/")
def metrics(request: Request):
    if request.client.host not in ("prometheus", "localhost", "127.0.0.1"):
        raise HTTPException(status_code=403)

    registry = CollectorRegistry()
    multiprocess.MultiProcessCollector(registry)
    return Response(generate_latest(registry), media_type=CONTENT_TYPE_LATEST)
