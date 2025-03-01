from fastapi import APIRouter, status

from app.core import logger, response
from app.entities.order.request import ItemOrderInReq
from app.models import order

router = APIRouter()

@router.post("/order/", response_model=response.BaseResponse)
async def add_order(item: ItemOrderInReq):
    try:
        return await order.add_order(item)
    except Exception as e:
        logger.error("Error getting current", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )