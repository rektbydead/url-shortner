from datetime import datetime, timedelta, UTC
from http import HTTPStatus
from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException
from pydantic import AnyHttpUrl

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

    def create(self, dto: ShortUrlCreate) -> ShortUrlGetter:
        create_at = datetime.now(UTC)
        expires_at = create_at + timedelta(days=dto.duration)

        entity = ShortUrlEntity(
            original_url=str(dto.original_url),
            created_at=create_at,
            expires_at=expires_at,
        )

        self.short_url_repository.create(entity)

        return ShortUrlGetter(
            uuid=entity.uuid,
            original_url=AnyHttpUrl(entity.original_url),
            expires_at=expires_at,
        )

    def get(self, identifier: str) -> ShortUrlGetter:
        short_url_getter = self.short_url_repository.get_by_uuid(UUID(identifier))

        if short_url_getter is None:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Short url not found")

        return short_url_getter
