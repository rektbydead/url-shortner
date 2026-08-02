import logging

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from dependencies.get_engine import get_engine
from entities.base_entity import BaseEntity
from entities.k6_container_entity import K6ContainerEntity  # noqa: F401
from entities.short_url_entity import ShortUrlEntity  # noqa: F401
from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator
from routers import url_shortner_router, health_check, k6_router
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio.engine import AsyncEngine
from starlette.middleware.cors import CORSMiddleware

logger = logging.getLogger(__name__)


async def create_db_and_tables(engine: AsyncEngine):
    try:
        async with engine.begin() as conn:
            await conn.run_sync(BaseEntity.metadata.create_all)
    except IntegrityError:
        logger.warning("table creation skipped (already exists)")


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncGenerator:
    engine = get_engine()
    await create_db_and_tables(engine)
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
app.include_router(k6_router.router, prefix="/k6", tags=["k6"])
