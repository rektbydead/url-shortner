from _contextvars import ContextVar

from sqlalchemy.orm import Session

from dependencies.get_engine import get_engine
from enums.EngineType import EngineType

engine_type_context: ContextVar[EngineType] = ContextVar(
    "engine_type_context", default=EngineType.WRITE
)


class RoutingSession(Session):

    def get_bind(self, mapper=None, clause=None, **kw):
        engine_type = engine_type_context.get()
        return get_engine(engine_type).sync_engine
