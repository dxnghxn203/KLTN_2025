import json

from fastapi import APIRouter, status

from app.core import logger, response
from app.core.response import JsonException
from app.helpers.redis import get_session, save_session, get_cart, save_cart, remove_cart_item
from app.models.product import get_product_by_list_id, get_product_by_cart_id

router = APIRouter()

@router.get("/cart/session/", response_model=response.BaseResponse)
async def get_cart_session(session: str):
    try:
        check = get_session(session)
        cur_session = session if check else save_session()
        cart_data = get_cart(cur_session)
        logger.info(f"cart_data: {type (cart_data)}")
        cart = {
            product_id if isinstance(product_id, str) else product_id.decode():
            json.loads(data if isinstance(data, str) else data.decode())
            for product_id, data in cart_data.items()
        }
        logger.info(f"cart: {cart}")
        product_ids = list(cart.keys())
        products = await get_product_by_cart_id(product_ids, cart)
        return response.BaseResponse(
            status="success",
            message="Cart retrieved successfully",
            data={
                "session_id": cur_session,
                "products": products
            })

    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting cart session", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.delete("/cart/session/", response_model=response.BaseResponse)
async def delete_cart_session(session: str, product_id: str):
    try:
        check = get_session(session)
        if not check:
            return response.BaseResponse(
                status="error",
                message="Session not found",
                data=None
            )
        remove_cart_item(session, product_id)
        return response.BaseResponse(
            status="success",
            message="Cart deleted successfully",
        )

    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error deleting cart session", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/cart/session/", response_model=response.BaseResponse)
async def add_to_cart(session: str, product_id: str,price_id: str,  quantity: int):
    try:
        check = get_session(session)
        cur_session = session if check else save_session()
        save_cart(cur_session, product_id, price_id, quantity)
        return response.BaseResponse(
            status="success",
            message="Product added to cart successfully",
            data={
                "session_id": cur_session
            }
        )

    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error adding product to cart", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )
