from sqlalchemy.ext.asyncio import async_sessionmaker

from settings.async_routing_session import AsyncRoutingSession

SessionLocal = async_sessionmaker(
    class_=AsyncRoutingSession,
    expire_on_commit=False,
)
