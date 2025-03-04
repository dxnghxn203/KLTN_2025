import json
import random
import random
import string
from datetime import datetime

from app.core import logger, response
from app.entities.order.request import ItemOrderInReq, ItemOrderReq
from app.helpers import redis


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

        # Lấy dữ liệu từ Redis

        for product in item.products:
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

        redis.save_order(item_data)
        return response.BaseResponse(status="success", message="Có đủ hàng, tiếp tục xử lý")

    except Exception as e:
        logger.error("Failed [check_order]:", error=e)
        return response.BaseResponse(status="failed", message="Không thể check order")
