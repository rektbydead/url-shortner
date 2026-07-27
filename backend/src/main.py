from contextlib import asynccontextmanager
from typing import AsyncGenerator

from dependencies.get_engine import get_engine
from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator
from routers import url_shortner_router, health_check, metrics
from sqlalchemy.ext.asyncio.engine import AsyncEngine
from starlette.middleware.cors import CORSMiddleware


def create_db_and_tables(engine: AsyncEngine):
    ...
    # print("Preparing DB...")
    # BaseEntity.metadata.create_all(engine)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncGenerator:
    engine = get_engine()
    create_db_and_tables(engine)
    yield


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Instrumentator().instrument(app).expose(app)

app.include_router(health_check.router, prefix="/health", tags=["health-check"])
app.include_router(url_shortner_router.router, prefix="/shortner", tags=["urls"])
