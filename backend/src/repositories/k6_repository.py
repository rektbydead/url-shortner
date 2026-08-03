from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import select

from entities.k6_container_entity import K6ContainerEntity
from enums.K6ContainerStatus import K6ContainerStatus


class K6Repository:

    def __init__(self, async_session: AsyncSession):
        self._session = async_session

    async def get_running_container(self) -> K6ContainerEntity | None:
        return await self._session.scalar(
            select(K6ContainerEntity).where(
                K6ContainerEntity.status.in_([K6ContainerStatus.PENDING, K6ContainerStatus.RUNNING])
            )
        )

    async def set_running(self, entity_id: UUID) -> None:
        entity = await self._session.get(K6ContainerEntity, entity_id)
        entity.status = K6ContainerStatus.RUNNING
        await self._session.commit()

    async def set_ended(self, entity_id: UUID) -> None:
        entity = await self._session.get(K6ContainerEntity, entity_id)
        entity.status = K6ContainerStatus.ENDED
        entity.ended_at = datetime.now(timezone.utc)
        await self._session.commit()

    async def create(self, test_name: str) -> K6ContainerEntity:
        is_running = await self.get_running_container()

        if is_running:
            raise ValueError(f"A container is already active")

        container = K6ContainerEntity(status=K6ContainerStatus.PENDING, test_performed=test_name)
        self._session.add(container)
        await self._session.flush()
        await self._session.refresh(container)
        await self._session.commit()
        return container
