from sqlalchemy.orm import Session
from sqlalchemy.sql import Insert, Update, Delete

from dependencies.get_engine import get_engine
from enums.EngineType import EngineType


class RoutingSession(Session):
    def get_bind(self, mapper=None, clause=None, **kw):
        print(
            "flushing=", self._flushing,
            "clause=", clause,
            "mapper=", mapper,
        )

        if self._flushing:
            print("WRITE")
            return get_engine(EngineType.WRITE)

        if isinstance(clause, (Insert, Update, Delete)):
            print("WRITE")
            return get_engine(EngineType.WRITE)

        print("READ")
        return get_engine(EngineType.READ)