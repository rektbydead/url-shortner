from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends

from dependencies.get_short_url_service import get_short_url_service
from dto.short_url_create import ShortUrlCreate
from dto.short_url_getter import ShortUrlGetter
from services.short_url_service import ShortUrlService

router = APIRouter()


@router.post("/", response_model=ShortUrlGetter,)
async def create_url_shortner(
        service: Annotated[ShortUrlService, Depends(get_short_url_service)],
        dto: ShortUrlCreate
) -> ShortUrlGetter:
    return await service.create(dto)


@router.get("/{identifier}", response_model=ShortUrlGetter, response_model_exclude_none=True)
async def get_url_shortner(
        service: Annotated[ShortUrlService, Depends(get_short_url_service)],
        identifier: UUID,
) -> ShortUrlGetter:
    return await service.get(identifier)

@router.get("/random/{number_of_rows}", response_model=list[UUID], response_model_exclude_none=True)
async def get_random_existing_uuids(
        service: Annotated[ShortUrlService, Depends(get_short_url_service)],
        number_of_rows: int,
) -> list[UUID]:
    return await service.get_random_short_urls(number_of_rows)

