from fastapi import APIRouter, status, Depends
from starlette.responses import FileResponse

from app.core import logger, response
from app.entities.order.request import ItemOrderInReq, OrderRequest, ItemUpdateStatusReq
from app.helpers.constant import PAYMENT_COD
from app.middleware import middleware
from app.models import order, user

router = APIRouter()

@router.post("/order/check_shipping_fee", response_model=response.BaseResponse)
async def check_shipping_fee(item: ItemOrderInReq, session: str= None):
    try:
        _, total_price, weight, out_of_stock_ids = await order.process_order_products(item.product)
        if out_of_stock_ids:
            return response.BaseResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Một số sản phẩm đã hết hàng",
                data={
                    "product_fee": 0,
                    "shipping_fee": 0,
                    "delivery_time": "",
                    "weight": 0,
                    "total_fee": 0,
                    "out_of_stock_ids": out_of_stock_ids
                }
            )
        return response.SuccessResponse(
            data=await order.check_shipping_fee(
                item.receiver_province_code,
                total_price,
                weight
            )
        )
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error checking order {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/order/check", response_model=response.BaseResponse)
async def check_order(item: ItemOrderInReq, session: str= None, token: str = Depends(middleware.verify_token_optional)):
    try:
        user_id = session
        is_session_user = True

        if token:
            user_info = await user.get_current(token)
            user_id = user_info.id
            is_session_user = False

        if is_session_user and item.payment_type == PAYMENT_COD:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Vui lòng đăng nhập để sử dụng phương thức thanh toán COD"
            )

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
        logger.error(f"Error adding order: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )
@router.get("/order/tracking", response_model=response.BaseResponse)
async def get_tracking_order(order_id: str, token: str = Depends(middleware.verify_token)):
    try:
        result = await order.get_tracking_order_by_order_id(order_id)
        return response.BaseResponse(
            message=f"order found",
            data=result
        )
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting tracking order: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )
@router.put("/order/update_status", response_model=response.BaseResponse)
async def update_status_order(item: ItemUpdateStatusReq):
    try:
        result = await order.update_status_order(item)
        return response.BaseResponse(
            status_code=status.HTTP_200_OK,
            status="created",
            message=f"status order updated successfully",
            data=result
        )
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error updating status order: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/order/order", response_model=response.BaseResponse)
async def get_order_by_user(token: str = Depends(middleware.verify_token)):
    try:
        user_info = await user.get_current(token)
        logger.info(f"user_info: {user_info}")
        result = await order.get_order_by_user(user_info.id)
        return response.BaseResponse(
            message=f"order found",
            data=result
        )
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting order by user: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/order/all-orders-admin", response_model=response.BaseResponse)
async def get_all_order(page: int = 1, page_size: int = 10):
    try:
        result = await order.get_all_order(page, page_size)
        return response.BaseResponse(
            message=f"orders found",
            data=result
        )
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting all order: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/order/statistic-last-365-days", response_model=response.BaseResponse)
async def get_total_orders_last_365_days():
    try:
        total = await order.get_total_orders_last_365_days()
        new = await order.get_new_orders_last_365_days()
        cancel = await order.get_cancel_orders_last_365_days()
        completed = await order.get_completed_orders_last_365_days()
        return response.BaseResponse(
            message="Statistic orders in the last 365 days found",
            data={
                "total": total,
                "new": new,
                "cancel": cancel,
                "completed": completed
            }
        )
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting total orders last 365 days: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.delete("/order/delete", response_model=response.BaseResponse)
async def cancel_order(order_id: str):
    try:
        return await order.cancel_order(order_id)
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error cancelling order: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/order/invoice", response_model=response.BaseResponse)
async def get_invoice(order_id: str):
    try:
        return await order.get_order_invoice(order_id)
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting invoice: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )