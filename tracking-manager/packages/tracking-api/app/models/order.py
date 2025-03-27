import json
import os

import httpx
from fastapi.responses import StreamingResponse
from starlette import status

from app.core import logger, response, rabbitmq, database
from app.entities.order.request import ItemOrderInReq, ItemOrderReq, OrderRequest
from app.entities.order.response import ItemOrderRes
from app.helpers import redis
from app.helpers.constant import get_create_order_queue, get_create_tracking_queue, generate_id

PAYMENT_API_URL = os.getenv("PAYMENT_API_URL")

collection_name = "orders"

async def check_order(item: ItemOrderInReq, user_id: str):
    try:
        order_id = generate_id("ORDER")
        tracking_id = generate_id("TRACKING")

        total_price = 0

        for product in item.product:
            total_price += product.price * product.quantity
            data = redis.get_product_transaction(product_id=f"{product.product_id}_{product.price_id}")
            logger.info(f"Product data from Redis: {data}")

            if not data:
                return response.JsonException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    message="Không tìm thấy sản phẩm"
                )

            inventory = data.get("inventory", 0)
            sell = data.get("sell", 0)

            total_requested = product.quantity + sell

            if total_requested > inventory:
                return response.JsonException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    message="Sản phẩm không đủ hàng"
                )

        logger.info(f"Total price: {total_price}")

        qr_payload = {
            "bank_id": "TPB",
            "order_id": order_id,
            "amount": total_price
        }

        logger.info(f"QR Payload: {qr_payload}")
        logger.info(f"{PAYMENT_API_URL}api/v1/payment/qr")

        async with httpx.AsyncClient() as client:
            qr_response = await client.post(
                f"{PAYMENT_API_URL}/api/v1/payment/qr",
                headers={"accept": "application/json", "Content-Type": "application/json"},
                json=qr_payload
            )

        logger.info(f"QR Response: {qr_response}")

        if qr_response.status_code != 200:
            logger.error(f"Failed to generate QR: {qr_response.text}")

        item_data = ItemOrderReq(**dict(item),
                                 order_id=order_id,
                                 tracking_id=tracking_id,
                                 status="create_order",
                                 created_by=user_id)
        logger.info("item", json=item_data)

        redis.save_order(item_data)

        return StreamingResponse(
            status_code=status.HTTP_200_OK,
            content=iter([qr_response.content]),
            media_type="image/png",
            headers={
                "Content-Disposition": f'attachment; filename=sepay_qr_{order_id}.png'
            }
        )

    except Exception as e:
        logger.error(f"Failed [check_order]: {e}")
        raise e

async def add_order(item: OrderRequest):
    try:
        order_data = redis.get_order(item.order_id)
        if not order_data:
            return response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không tìm thấy thông tin đơn hàng"
            )

        order_dict = json.loads(order_data)
        logger.info(order_dict)
        order_json = json.dumps(order_dict, ensure_ascii=False)

        rabbitmq.send_message(get_create_order_queue(), order_json)
        rabbitmq.send_message(get_create_tracking_queue(), order_json)

        return item.order_id
    except Exception as e:
        logger.error(f"Failed [add_order]: {e}")
        raise e

async def get_order_by_user(user_id: str):
    try:
        collection = database.db[collection_name]
        order_list = collection.find({"created_by": user_id})
        logger.info(f"Order list: {order_list}")
        return [ItemOrderRes(**prod) for prod in order_list]
    except Exception as e:
        logger.error(f"Failed [get_order_by_user]: {e}")
        raise e
