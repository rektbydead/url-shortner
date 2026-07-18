from sqlalchemy.ext.asyncio import AsyncSession

from settings.routing_session import RoutingSession


class AsyncRoutingSession(AsyncSession):
    sync_session_class = RoutingSession
