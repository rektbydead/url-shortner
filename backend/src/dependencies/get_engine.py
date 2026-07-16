from functools import lru_cache

from sqlalchemy.engine import Engine, create_engine

from enums.EngineType import EngineType
from settings.settings import Settings


@lru_cache(maxsize=2)
def get_engine(type: EngineType = EngineType.WRITE) -> Engine:
    settings = Settings()

    url = (
        settings.WRITE_DATABASE_URL
        if type is EngineType.WRITE
        else settings.READ_DATABASE_URL
    )

    print(f"Creating {type=} {url=}")

    return create_engine(
        url,
        pool_size=10,       # Default 10 connections
        max_overflow=20,    # Optional connection on traffic spike
        pool_timeout=30,    # Maximum time waiting for resource
    )