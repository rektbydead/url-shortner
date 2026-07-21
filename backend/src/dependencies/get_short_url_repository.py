from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from dependencies.get_session import get_session
from repositories.short_url_repository import ShortUrlRepository


def get_short_url_repository(session: Annotated[AsyncSession, Depends(get_session)]) -> ShortUrlRepository:
    return ShortUrlRepository(session)
