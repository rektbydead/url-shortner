from sqlalchemy.orm import Session

from settings.session_local import SessionLocal


def get_session() -> Session:
    return SessionLocal()
