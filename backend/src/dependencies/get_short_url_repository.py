from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from dependencies.get_session import get_session
from repositories.short_url_repository import ShortUrlRepository


def get_short_url_repository(session: Annotated[Session, Depends(get_session)]) -> ShortUrlRepository:
    return ShortUrlRepository(session)
