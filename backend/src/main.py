from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from sqlalchemy.ext.asyncio.engine import AsyncEngine

from dependencies.get_engine import get_engine
from routers import url_shortner_router, health_check


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

app.include_router(health_check.router, prefix="/health", tags=["health-check"])
app.include_router(url_shortner_router.router, prefix="/shortner", tags=["urls"])
