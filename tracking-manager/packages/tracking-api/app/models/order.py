import json
import random
import string
from datetime import datetime

import httpx
from fastapi.responses import StreamingResponse

from app.core import logger, response, rabbitmq
from app.entities.order.request import ItemOrderInReq, ItemOrderReq, OrderRequest
from app.helpers import redis
from app.helpers.constant import get_create_queue

PAYMENT_API_URL = "http://127.0.0.1:8081/api/v1/payment/qr"

def generate_random_string(length: int) -> str:
    charset = string.ascii_uppercase + string.digits
    return ''.join(random.choices(charset, k=length))

async def check_order(item: ItemOrderInReq):
    try:
        # Tạo order ID ngẫu nhiên
        random_order_id = generate_random_string(3)
        timestamp = int(datetime.utcnow().timestamp())
        order_id = f"{random_order_id}{timestamp}"

        # Chuyển đổi item thành đối tượng hợp lệ
        item_data = ItemOrderReq(**dict(item),
                                 order_id=order_id,
                                 created_by=f"system{timestamp}")
        logger.info("item", json=item_data)

        total_price = 0
        # Lấy dữ liệu từ Redis

        for product in item.product:
            total_price += product.price * product.quantity
            data = redis.get_product_transaction(product_id=product.product_id)
            logger.info(f"Product data from Redis: {data}")

            if not data:
                return response.BaseResponse(status="failed", message="Không tìm thấy sản phẩm trong hệ thống")

            # Lấy giá trị ton, ban từ Redis
            ton = data.get("ton", 0)
            ban = data.get("ban", 0)

            total_requested = product.quantity + ban

            # Kiểm tra tồn kho
            if total_requested > ton:
                return response.BaseResponse(status="failed", message="Hàng tồn không đủ")

        qr_payload = {
            "bank_id": "TPB",
            "order_id": order_id,
            "amount": total_price
        }

        async with httpx.AsyncClient() as client:
            qr_response = await client.post(
                f"{PAYMENT_API_URL}",
                headers={"accept": "application/json", "Content-Type": "application/json"},
                json=qr_payload
            )

        if qr_response.status_code != 200:
            logger.error(f"Failed to generate QR: {qr_response.text}")
            return response.BaseResponse(status="failed", message="Không thể tạo QR code")

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
        return response.BaseResponse(status="failed", message="Không thể check order")

async def add_order(item: OrderRequest):
    try:
        order_data = redis.get_order(item.order_id)
        if not order_data:
            return response.BaseResponse(status="failed", message="Không tìm thấy order")

        order_dict = json.loads(order_data)
        logger.info(order_dict)

        rabbitmq.send_message(get_create_queue(), json.dumps(order_dict))

        return response.BaseResponse(status="success", message=f"Order {item.order_id} is added to Queue")
    except Exception as e:
        logger.error("Failed [add_order]:", error=e)
        return response.BaseResponse(status="failed", message="Không thể add order")