from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import func, select

from entities.short_url_entity import ShortUrlEntity


class ShortUrlRepository:

    def __init__(self, async_session: AsyncSession):
        self._session = async_session

    async def create(self, short_url_entity: ShortUrlEntity) -> ShortUrlEntity:
        self._session.add(short_url_entity)
        return short_url_entity

    async def get_by_uuid(self, uuid: UUID) -> ShortUrlEntity | None:
        statement = (select(ShortUrlEntity)
                     .where(ShortUrlEntity.uuid == uuid)
                     .where(ShortUrlEntity.expires_at > func.now()))

        result = await self._session.scalars(statement)
        return result.first()

    async def get_random_rows(self, number_of_rows: int) -> list[UUID]:
        statement = (select(ShortUrlEntity.uuid)
                     .where(ShortUrlEntity.expires_at > func.now())
                     .order_by(func.random())
                     .limit(number_of_rows))

        result = await self._session.execute(statement)

        return [
            row.uuid
            for row in result.all()
        ]