from typing import Any, Generator

from settings.session_local import SessionLocal


def get_session() -> Generator[Any, Any, None]:
    session = SessionLocal()

    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
