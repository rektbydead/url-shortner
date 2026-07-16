from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession

from settings.routing_session import RoutingSession

SessionLocal = async_sessionmaker(
    class_=AsyncSession,
    sync_session_class=RoutingSession,
    expire_on_commit=False,
)
