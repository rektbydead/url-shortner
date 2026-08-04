from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql.sqltypes import String, DateTime, UUID, Uuid

from entities.base_entity import BaseEntity
from enums.K6ContainerStatus import K6ContainerStatus


class K6ContainerEntity(BaseEntity):
    __tablename__ = "k6_container"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)

    status: Mapped[str] = mapped_column(String, nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    test_performed: Mapped[str] = mapped_column(String)

    __table_args__ = (
        Index(
            "one_active_container",
            "status",
            unique=True,
            postgresql_where=(status.in_([K6ContainerStatus.PENDING, K6ContainerStatus.RUNNING]))
        ),
    )
