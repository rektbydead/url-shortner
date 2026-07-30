from typing import Annotated

from fastapi import Depends

from dependencies.get_k6_repository import get_k6_repository
from dependencies.get_short_url_repository import get_short_url_repository
from repositories.k6_repository import K6Repository
from repositories.short_url_repository import ShortUrlRepository
from services.k6_service import K6Service
from services.short_url_service import ShortUrlService


def get_k6_service(k6_repository: Annotated[K6Repository, Depends(get_k6_repository)]) -> K6Service:
    return K6Service(k6_repository)
