from fastapi import APIRouter, status

from app.core import logger, response
from app.entities.order.request import ItemOrderInReq, OrderRequest
from app.models import order

router = APIRouter()

@router.post("/order/check", response_model=response.BaseResponse)
async def check_order(item: ItemOrderInReq):
    try:
        return await order.check_order(item)
    except ValueError as e:
        raise response.JsonException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=str(e)
        )
    except Exception as e:
        logger.error("Error getting current", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/order/add", response_model=response.BaseResponse)
async def add_order(item: OrderRequest):
    try:
        result = await order.add_order(item)
        return response.BaseResponse(
            status_code=status.HTTP_201_CREATED,
            status="created",
            message=f"order added successfully",
            data=result
        )
    except Exception as e:
        logger.error("Error adding order", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )