from typing import Any, AsyncGenerator

from settings.session_local import SessionLocal


async def get_session() -> AsyncGenerator[Any, Any]:
    session = SessionLocal()

    try:
        yield session
        await session.commit()
    except Exception:
        await  session.rollback()
        raise
    finally:
        await  session.close()
