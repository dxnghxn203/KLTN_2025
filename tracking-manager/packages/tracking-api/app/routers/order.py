from fastapi import APIRouter, status, Depends

from app.core import logger, response
from app.entities.order.request import ItemOrderInReq, OrderRequest
from app.middleware import middleware
from app.models import order, auth

router = APIRouter()

@router.post("/order/check", response_model=response.BaseResponse)
async def check_order(item: ItemOrderInReq, token: str = Depends(middleware.verify_token_optional)):
    try:
        user_id = "guest"
        if token:
            user_info = await auth.get_current(token)
            user_id = user_info.id
        return await order.check_order(item, user_id)
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error checking order {e}")
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
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error adding order", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/order/order", response_model=response.BaseResponse)
async def get_order_by_user(token: str = Depends(middleware.verify_token)):
    try:
        user_info = await auth.get_current(token)
        logger.info(f"user_info: {user_info}")
        result = await order.get_order_by_user(user_info.id)
        return response.BaseResponse(
            message=f"order found",
            data=result
        )
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error adding order", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/order/all-orders-admin", response_model=response.BaseResponse)
async def get_all_order(page: int = 1, pageSize: int = 10):
    try:
        result = await order.get_all_order(page, pageSize)
        return response.BaseResponse(
            message=f"orders found",
            data=result
        )
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error adding order", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )