from uuid import UUID

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, session
from sqlalchemy.orm import Session
from sqlalchemy.sql import func, select

from dto.short_url_getter import ShortUrlGetter
from entities.short_url_entity import ShortUrlEntity


class ShortUrlRepository:

    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, short_url_entity: ShortUrlEntity):
        self._session.add(short_url_entity)
        return short_url_entity

    async def get_by_uuid(self, uuid: UUID) -> ShortUrlGetter | None:
        statement = (select(ShortUrlEntity.uuid, ShortUrlEntity.original_url)
                     .where(ShortUrlEntity.uuid == uuid)
                     .where(ShortUrlEntity.expires_at > func.now()))

        result = await self._session.execute(statement)
        row = result.one_or_none()

        if row is None:
            return None

        return ShortUrlGetter(
            uuid=row.uuid,
            original_url=row.original_url,
        )

    async def get_random_rows(self, number_of_rows: int) -> list[ShortUrlGetter]:
        statement = (select(ShortUrlEntity.uuid, ShortUrlEntity.original_url)
                     .where(ShortUrlEntity.expires_at > func.now())
                     .order_by(func.random())
                     .limit(number_of_rows))

        result = await self._session.execute(statement)

        return [
            ShortUrlGetter(
                uuid=row.uuid,
                original_url=row.original_url,
            )
            for row in result.all()
        ]