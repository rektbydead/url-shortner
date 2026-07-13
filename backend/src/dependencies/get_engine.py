from functools import lru_cache

from sqlalchemy.engine import Engine, create_engine

from settings.settings import Settings


@lru_cache(maxsize=1)
def get_engine() -> Engine:
    settings = Settings()

    return create_engine(
        settings.database_url,
        echo=True,
    )
