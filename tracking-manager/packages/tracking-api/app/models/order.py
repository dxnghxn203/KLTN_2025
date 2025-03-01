import random
import random
import string
from datetime import datetime

from app.core import logger, response
from app.entities.order.request import ItemOrderInReq, ItemOrderReq


def generate_random_string(length: int) -> str:
    charset = string.ascii_uppercase + string.digits
    return ''.join(random.choices(charset, k=length))

async def add_order(item: ItemOrderInReq):
    try:
        random_order_id = generate_random_string(3)
        timestamp = int(datetime.utcnow().timestamp())

        order_id = f"{random_order_id}{timestamp}"
        item_data = ItemOrderReq(**dict(item),
                                 order_id=order_id,
                                 created_by= f"system{timestamp}")
        logger.info("item", json=item_data)

        return response.BaseResponse(status="success", message="Log insert", data="send message rabitmq success!")

    except Exception as e:
        logger.error("Failed [add_order] :", error=e)
        return response.BaseResponse(status="failed", message="Không thể add order")