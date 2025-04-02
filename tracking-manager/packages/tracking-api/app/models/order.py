import json
import os
from datetime import datetime, timedelta

import httpx
from fastapi.responses import StreamingResponse
from starlette import status

from app.core import logger, response, rabbitmq, database
from app.entities.order.request import ItemOrderInReq, ItemOrderReq, OrderRequest
from app.entities.order.response import ItemOrderRes
from app.entities.product.request import ItemProductRedisReq
from app.helpers import redis
from app.helpers.constant import get_create_order_queue, get_create_tracking_queue, generate_id
from app.helpers.redis import get_product_transaction, save_product

PAYMENT_API_URL = os.getenv("PAYMENT_API_URL")

collection_name = "orders"

async def get_total_orders():
    try:
        collection = database.db[collection_name]
        total_orders = collection.count_documents({})
        return total_orders
    except Exception as e:
        logger.error(f"Failed [get_total_orders]: {e}")
        raise e

async def get_total_orders_last_365_days():
    try:
        collection = database.db[collection_name]
        one_year_ago = datetime.now() - timedelta(days=365)
        total_orders = collection.count_documents({"created_date": {"$gte": one_year_ago}})
        return total_orders
    except Exception as e:
        logger.error(f"Failed [get_total_orders_last_365_days]: {e}")
        raise e

async def get_new_orders_last_365_days():
    try:
        collection = database.db[collection_name]
        one_year_ago = datetime.now() - timedelta(days=365)
        new_orders = collection.count_documents({"status": "created", "created_date": {"$gte": one_year_ago}})
        return new_orders
    except Exception as e:
        logger.error(f"Failed [get_new_orders_last_365_days]: {e}")
        raise e

async def get_completed_orders_last_365_days():
    try:
        collection = database.db[collection_name]
        one_year_ago = datetime.now() - timedelta(days=365)
        completed_orders = collection.count_documents({"status": "completed", "created_date": {"$gte": one_year_ago}})
        return completed_orders
    except Exception as e:
        logger.error(f"Failed [get_completed_orders_last_365_days]: {e}")
        raise e

async def get_popular_products(top_n=3):
    try:
        orders_collection = database.db[collection_name]
        pipeline = [
            {"$unwind": "$product"},
            {"$group": {"_id": "$product.product_id", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": top_n}
        ]
        logger.info(f"Pipeline: {pipeline}")
        popular_products = list(orders_collection.aggregate(pipeline))
        return [p["_id"] for p in popular_products]
    except Exception as e:
        logger.error(f"Failed [get_popular_products]: {e}")
        raise e

async def get_cancel_orders_last_365_days():
    try:
        collection = database.db[collection_name]
        one_year_ago = datetime.now() - timedelta(days=365)
        cancel_orders = collection.count_documents({"status": "canceled", "created_date": {"$gte": one_year_ago}})
        return cancel_orders
    except Exception as e:
        logger.error(f"Failed [get_cancel_orders_last_365_days]: {e}")
        raise e

async def get_all_order(page: int, pageSize: int):
    try:
        collection = database.db[collection_name]
        skip_count = (page - 1) * pageSize
        order_list = collection.find().skip(skip_count).limit(pageSize)
        logger.info(f"Order list: {order_list}")
        return [ItemOrderRes(**prod) for prod in order_list]
    except Exception as e:
        logger.error(f"Failed [get_all_order]: {e}")
        raise e

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
                raise response.JsonException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    message="Không tìm thấy sản phẩm"
                )

            inventory = data.get("inventory", 0)
            sell = data.get("sell", 0)

            total_requested = product.quantity + sell

            if total_requested > inventory:
                raise response.JsonException(
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
                                 status="created",
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
            raise response.JsonException(
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

async def get_order_by_id(order_id: str):
    try:
        collection = database.db[collection_name]
        order = collection.find_one({"order_id": order_id})

        if not order:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Không tìm thấy đơn hàng"
            )

        return ItemOrderRes(**order)

    except Exception as e:
        logger.error(f"Failed [get_order_by_id]: {e}")
        raise e


async def cancel_order(order_id: str):
    try:
        order = await get_order_by_id(order_id)
        if not order:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Không tìm thấy đơn hàng"
            )
        if order.status in ["completed", "canceled"]:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không thể hủy đơn hàng đã hoàn tất hoặc đã bị hủy"
            )

        collection = database.db[collection_name]
        update_result = collection.update_one(
            {"order_id": order_id},
            {"$set": {"status": "canceled"}}
        )

        if update_result.modified_count == 0:
            raise response.JsonException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message="Hủy đơn hàng thất bại"
            )

        for product in order.product:
            product_key_redis = f"{product.product_id}_{product.price_id}"
            redis_data = get_product_transaction(product_key_redis)

            if redis_data:
                new_sell = max(0, redis_data["sell"] - product.quantity)
                save_product(ItemProductRedisReq(
                    inventory=redis_data["inventory"],
                    sell=new_sell,
                    delivery=redis_data.get("delivery", 0)
                ), product_key_redis)

                logger.info(f"Đã cập nhật Redis cho sản phẩm {product.product_id}: giảm {product.quantity} đã bán")

        logger.info(f"Đã hủy đơn hàng: {order_id}")
        return response.SuccessResponse(message="Hủy đơn hàng thành công")

    except Exception as e:
        logger.error(f"Failed [cancel_order]: {e}")
        raise e
