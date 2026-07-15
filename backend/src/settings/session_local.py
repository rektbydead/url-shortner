from sqlalchemy.orm import sessionmaker

from settings.routing_session import RoutingSession

SessionLocal = sessionmaker(
    class_=RoutingSession,
    expire_on_commit=False,
)
