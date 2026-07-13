from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from sqlalchemy.engine import Engine

from dependencies.get_engine import get_engine
from entities.base_entity import BaseEntity
from routers import url_shortner_router

def create_db_and_tables(engine: Engine):
    print("Preparing DB...")
    BaseEntity.metadata.create_all(engine)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncGenerator:
    engine = get_engine()
    create_db_and_tables(engine)
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(url_shortner_router.router, prefix="/shortner", tags=["urls"])
