from typing import Annotated

from fastapi import APIRouter, Depends

from dependencies.get_short_url_service import get_short_url_service
from dto.short_url_create import ShortUrlCreate
from dto.short_url_getter import ShortUrlGetter
from services.short_url_service import ShortUrlService

router = APIRouter()


@router.post("/", response_model=ShortUrlGetter,)
def create_url_shortner(
        service: Annotated[ShortUrlService, Depends(get_short_url_service)],
        dto: ShortUrlCreate
) -> ShortUrlGetter:
    return service.create(dto)


@router.get("/{identifier}", response_model=ShortUrlGetter, response_model_exclude_none=True)
def get_url_shortner(
        service: Annotated[ShortUrlService, Depends(get_short_url_service)],
        identifier: str,
) -> ShortUrlGetter:
    return service.get(identifier)
