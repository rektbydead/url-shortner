from typing import Annotated

from fastapi import Depends

from dependencies.get_short_url_repository import get_short_url_repository
from repositories.short_url_repository import ShortUrlRepository
from services.short_url_service import ShortUrlService


def get_short_url_service(session: Annotated[ShortUrlRepository, Depends(get_short_url_repository)]) -> ShortUrlService:
    return ShortUrlService(session)
