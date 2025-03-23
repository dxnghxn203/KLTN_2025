import json
import os

import httpx
from fastapi.responses import StreamingResponse

from app.core import logger, response, rabbitmq
from app.entities.order.request import ItemOrderInReq, ItemOrderReq, OrderRequest
from app.helpers import redis
from app.helpers.constant import get_create_order_queue, get_create_tracking_queue, generate_id

PAYMENT_API_URL = os.getenv("PAYMENT_API_URL")

async def check_order(item: ItemOrderInReq):
    try:
        order_id = generate_id("ORDER")
        tracking_id = generate_id("TRACKING")

        item_data = ItemOrderReq(**dict(item),
                                 order_id=order_id,
                                 tracking_id=tracking_id,
                                 status="create_order",
                                 created_by="system")
        logger.info("item", json=item_data)

        total_price = 0

        for product in item.product:
            total_price += product.price * product.quantity
            data = redis.get_product_transaction(product_id=f"{product.product_id}_{product.price_id}")
            logger.info(f"Product data from Redis: {data}")

            if not data:
                raise ValueError("Không tìm thấy sản phẩm trong hệ thống")

            inventory = data.get("inventory", 0)
            sell = data.get("sell", 0)

            total_requested = product.quantity + sell

            if total_requested > inventory:
                raise ValueError("Hàng tồn không đủ")

        qr_payload = {
            "bank_id": "TPB",
            "order_id": order_id,
            "amount": total_price
        }

        async with httpx.AsyncClient() as client:
            qr_response = await client.post(
                f"{PAYMENT_API_URL}api/v1/payment/qr",
                headers={"accept": "application/json", "Content-Type": "application/json"},
                json=qr_payload
            )

        if qr_response.status_code != 200:
            logger.error(f"Failed to generate QR: {qr_response.text}")
            raise ValueError("Không thể tạo QR code")

        redis.save_order(item_data)

        return StreamingResponse(
            status_code=200,
            content=iter([qr_response.content]),
            media_type="image/png",
            headers={
                "Content-Disposition": f'attachment; filename=sepay_qr_{order_id}.png'
            }
        )

    except Exception as e:
        logger.error("Failed [check_order]:", error=e)
        raise e

async def add_order(item: OrderRequest):
    try:
        order_data = redis.get_order(item.order_id)
        if not order_data:
            return response.BaseResponse(status="failed", message="Không tìm thấy order")

        order_dict = json.loads(order_data)
        logger.info(order_dict)
        order_json = json.dumps(order_dict, ensure_ascii=False)

        rabbitmq.send_message(get_create_order_queue(), order_json)
        rabbitmq.send_message(get_create_tracking_queue(), order_json)

        return item.order_id
    except Exception as e:
        logger.error("Failed [add_order]:", error=e)
        raise e