import uuid
from datetime import datetime, timedelta, UTC
from http import HTTPStatus
from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException
from pydantic import AnyHttpUrl

from annotations.use_primary import use_primary
from annotations.use_replica import use_replica
from dependencies.get_short_url_repository import get_short_url_repository
from dto.short_url_create import ShortUrlCreate
from dto.short_url_getter import ShortUrlGetter
from entities.short_url_entity import ShortUrlEntity
from repositories.short_url_repository import ShortUrlRepository


class ShortUrlService:

    def __init__(
            self,
            short_url_repository: Annotated[ShortUrlRepository, Depends(get_short_url_repository)]
    ):
        self.short_url_repository = short_url_repository

    async def create(self, dto: ShortUrlCreate) -> ShortUrlGetter:
        create_at = datetime.now(UTC)
        expires_at = create_at + timedelta(days=dto.duration)

        entity = ShortUrlEntity(
            uuid=uuid.uuid4(),
            original_url=str(dto.original_url),
            created_at=create_at,
            expires_at=expires_at,
        )

        await self.short_url_repository.create(entity)

        return ShortUrlGetter(
            uuid=entity.uuid,
            original_url=AnyHttpUrl(entity.original_url),
            expires_at=expires_at,
        )

    @use_replica
    async def get(self, identifier: UUID) -> ShortUrlGetter:
        short_url_getter = await self.short_url_repository.get_by_uuid(identifier)

        if short_url_getter is None:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Short url not found")

        return short_url_getter

    @use_replica
    async def get_random_short_urls(self, number_of_rows: int) -> list[ShortUrlGetter]:
        return await self.short_url_repository.get_random_rows(number_of_rows)
