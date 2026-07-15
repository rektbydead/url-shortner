from pydantic import BaseModel, AnyHttpUrl, PositiveInt, Field


class ShortUrlCreate(BaseModel):
    original_url: AnyHttpUrl
    duration: PositiveInt = Field(gt=0)
