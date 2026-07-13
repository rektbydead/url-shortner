from pydantic import BaseModel, AnyHttpUrl


class ShortUrlCreate(BaseModel):
    original_url: AnyHttpUrl
    duration: int
