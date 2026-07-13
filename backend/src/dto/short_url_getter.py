from datetime import datetime
from uuid import UUID

from pydantic import AnyHttpUrl

from settings.app_base_model import AppBaseModel


class ShortUrlGetter(AppBaseModel):
    original_url: AnyHttpUrl
    uuid: UUID
    expires_at: datetime | None = None
