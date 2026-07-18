from functools import wraps
from typing import TypeVar, Callable

from dependencies.get_session import engine_type_context
from enums.EngineType import EngineType

F = TypeVar('F', bound=Callable)


def use_primary(func: F) -> F:
    """Decorator: Make use replica engine."""

    @wraps(func)
    async def wrapper(*args, **kwargs):
        token = engine_type_context.set(EngineType.WRITE)

        try:
            return await func(*args, **kwargs)
        finally:
            engine_type_context.reset(token)

    return wrapper
