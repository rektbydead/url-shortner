from functools import lru_cache
from itertools import cycle

from sqlalchemy.engine import Engine, create_engine

from enums.EngineType import EngineType
from settings.settings import Settings

_settings = Settings()
_read_url_cycle = cycle(_settings.READ_DATABASE_URLS)


@lru_cache()
def _create_engine(
        url: str,
) -> Engine:
    return create_engine(
        url,
        pool_size=10,  # Default 10 connections
        max_overflow=20,  # Optional connection on traffic spike
        pool_timeout=30,  # Maximum time waiting for resource
    )


def get_engine(engine_type: EngineType = EngineType.WRITE) -> Engine:
    if engine_type == EngineType.WRITE:
        return _create_engine(_settings.WRITE_DATABASE_URL)

    url = next(_read_url_cycle)
    return _create_engine(url)
