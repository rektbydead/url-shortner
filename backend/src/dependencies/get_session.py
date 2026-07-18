from _contextvars import ContextVar
from typing import Any, AsyncGenerator

from sqlalchemy.ext.asyncio.session import AsyncSession

from dependencies.get_engine import get_engine
from enums.EngineType import EngineType

engine_type_context: ContextVar[EngineType] = ContextVar(
    "engine_type_context", default=EngineType.WRITE
)

async def get_session() -> AsyncGenerator[Any, Any]:
    engine_type = engine_type_context.get()
    engine = get_engine(engine_type)
    session = AsyncSession(bind=engine)

    try:
        yield session
        await session.commit()
    except Exception:
        await session.rollback()
        raise
    finally:
        await session.close()
