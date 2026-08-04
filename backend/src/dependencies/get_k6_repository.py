from typing import Annotated

from dependencies.get_session import get_session
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from repositories.k6_repository import K6Repository


def get_k6_repository(session: Annotated[AsyncSession, Depends(get_session)]) -> K6Repository:
    return K6Repository(session)
