from fastapi import APIRouter

router = APIRouter()


@router.get("")
def create_url_shortner() -> str:
    return "Live"
