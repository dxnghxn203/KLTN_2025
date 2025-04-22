import base64
import json
import os
from datetime import datetime, timedelta
from typing import Optional, List, Tuple

import httpx
from bson import ObjectId
from bson.errors import InvalidId
from starlette import status

from app.core import logger, response, rabbitmq, database
from app.entities.order.request import ItemOrderInReq, ItemOrderReq, OrderRequest, ItemUpdateStatusReq
from app.entities.order.response import ItemOrderRes
from app.entities.product.request import ItemProductRedisReq, ItemProductInReq, ItemProductReq
from app.entities.user.response import ItemUserRes
from app.helpers import redis
from app.helpers.constant import get_create_order_queue, generate_id, PAYMENT_COD, BANK_IDS, \
    FEE_INDEX, get_update_status_queue
from app.helpers.es_helpers import search_es
from app.helpers.redis import get_product_transaction, save_product, remove_cart_item
from app.models.cart import remove_product_from_cart
from app.models.fee import calculate_shipping_fee
from app.models.location import determine_route
from app.models.product import get_product_by_id, restore_product_sell
from app.models.time import get_range_time
from app.models.user import get_by_id

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

async def get_all_order(page: int, page_size: int):
    try:
        collection = database.db[collection_name]
        skip_count = (page - 1) * page_size
        order_list = collection.find().skip(skip_count).limit(page_size)
        logger.info(f"Order list: {order_list}")
        return [ItemOrderRes.from_mongo(order) for order in order_list]
    except Exception as e:
        logger.error(f"Failed [get_all_order]: {e}")
        raise e

async def get_tracking_order_by_order_id(order_id: str):
    try:
        collection = database.db["trackings"]
        trackings = collection.find({"order_id": order_id})
        lst = []
        for tracking in trackings:
            data = tracking
            data["_id"] = str(tracking["_id"])
            lst.append(data)
        return lst
    except Exception as e:
        logger.error(f"Failed [get_tracking_order_by_order_id]: {e}")
        return []

async def process_order_products(products: List[ItemProductInReq]) -> Tuple[List[ItemProductReq], float, float, List[str]]:
    total_price = 0
    weight = 0
    product_items = []
    out_of_stock_ids = []

    for product in products:
        product_info = await get_product_by_id(product_id=product.product_id, price_id=product.price_id)
        data = redis.get_product_transaction(product_id=product.product_id)
        logger.info(f"Product data from Redis: {data}")

        if not data:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không tìm thấy sản phẩm"
            )

        inventory = data.get("inventory", 0)
        sell = data.get("sell", 0)
        total_requested = product.quantity * product_info.prices[0].amount + sell

        if total_requested > inventory:
            out_of_stock_ids.append(product.product_id)
            continue

        price_info = product_info.prices[0]

        total_price += price_info.price * product.quantity
        weight += price_info.weight * product.quantity

        product_item = ItemProductReq(
            product_id=product.product_id,
            price_id=product.price_id,
            product_name=product_info.product_name,
            unit=price_info.unit,
            quantity=product.quantity,
            price=price_info.price,
            weight=price_info.weight,
            original_price=price_info.original_price,
            discount=price_info.discount,
            images_primary=product_info.images_primary,
        )
        product_items.append(product_item)

    return product_items, total_price, weight, out_of_stock_ids

async def check_shipping_fee(
        sender_province_code: int,
        receiver_province_code: int,
        product_price: float,
        weight: float
    ):
    try:
        route_code = await determine_route(
                sender_code=sender_province_code,
                receiver_code=receiver_province_code
            )

        delivery_time = await get_range_time(route_code)

        if product_price > 100_000:
            shipping_fee = 0
        else:
            fee_data = await search_es(index=FEE_INDEX, conditions={"route_code": route_code})
            if isinstance(fee_data, response.JsonException):
                raise fee_data

            shipping_fee = calculate_shipping_fee(fee_data, weight)
        return {
            "product_fee": product_price,
            "shipping_fee": shipping_fee,
            "delivery_time": delivery_time,
            "weight": weight,
            "total_fee": product_price + shipping_fee
        }

    except Exception as e:
        logger.error(f"Failed [check_shipping_fee]: {e}")
        raise e

async def check_order(item: ItemOrderInReq, user_id: str):
    try:
        order_id = generate_id("ORDER")
        tracking_id = f"{generate_id('TRACKING')}_V{1:03}"

        product_items, product_price, weight, out_of_stock_ids = await process_order_products(item.product)

        if out_of_stock_ids:
            return response.BaseResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Một số sản phẩm đã hết hàng",
                data={"out_of_stock": out_of_stock_ids}
            )

        fee_data = await check_shipping_fee(
            sender_province_code=item.sender_province_code,
            receiver_province_code=item.receiver_province_code,
            product_price=product_price,
            weight=weight
        )
        logger.info(f"Fee data: {fee_data}")

        if not await save_order_to_redis(item, order_id, tracking_id, user_id, fee_data, product_items):
            return response.BaseResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message="Không thể lưu đơn hàng"
            )

        qr_code = None
        if item.payment_type and item.payment_type != PAYMENT_COD:
            qr_code = await generate_qr_code(order_id, fee_data["total_fee"], item.payment_type)
            if not qr_code:
                return response.BaseResponse(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    message="Không thể tạo QR thanh toán"
                )

        if item.payment_type == PAYMENT_COD:
            await add_order(OrderRequest(order_id=order_id))

        return response.BaseResponse(
            status_code=status.HTTP_200_OK,
            status="success",
            message="Đơn hàng đã được tạo",
            data={"order_id": order_id, "qr_code": qr_code} if qr_code else {"order_id": order_id}
        )

    except Exception as e:
        logger.error(f"Failed [check_order]: {e}")
        raise e

async def remove_item_cart_by_order(orders: ItemOrderReq, identifier: str):
    try:
        try:
            user_info = ItemUserRes.from_mongo(await get_by_id(ObjectId(identifier)))
        except (InvalidId, TypeError):
            user_info = None
        logger.info(f"user_info: {user_info}")
        if user_info:
            for product in orders.product:
                logger.info(f"product: {product}")
                await remove_product_from_cart(user_info.id, product.product_id, product.price_id)
            return True
        else:
            for product in orders.product:
                remove_cart_item(identifier, f"{product.product_id}_{product.price_id}")
            return True
    except Exception as e:
        logger.error(f"Failed [remove_item_cart_by_order]: {e}")
        return False

async def generate_qr_code(order_id: str, total_price: float, payment_type: str) -> Optional[str]:
    try:
        qr_payload = {
            "bank_id": BANK_IDS.get(payment_type),
            "order_id": order_id,
            "amount": total_price
        }

        async with httpx.AsyncClient() as client:
            qr_response = await client.post(
                f"{PAYMENT_API_URL}/api/v1/payment/qr",
                headers={"accept": "application/json", "Content-Type": "application/json"},
                json=qr_payload
            )

        if qr_response.status_code == 200:
            return base64.b64encode(qr_response.content).decode("utf-8")

        logger.error(f"Failed to generate QR: {qr_response.text}")
        return None

    except Exception as e:
        logger.error(f"Error generating QR code: {e}")
        return None

async def save_order_to_redis(
        item: ItemOrderInReq,
        order_id: str,
        tracking_id: str,
        user_id: str,
        fee_data: dict,
        product_items: List[ItemProductReq]
    ):
    try:
        item_data = ItemOrderReq(
            **item.model_dump(exclude={"product"}),
            product=product_items,
            order_id=order_id,
            tracking_id=tracking_id,
            status="created",
            created_by=user_id,
            delivery_time=fee_data["delivery_time"],
            shipping_fee=fee_data["shipping_fee"],
            product_fee=fee_data["product_fee"],
            total_fee=fee_data["total_fee"],
            weight=fee_data["weight"]
        )
        logger.info("item", json=item_data)

        redis.save_order(item_data)
        return True
    except Exception as e:
        logger.error(f"Failed [save_order_to_redis]: {e}")
        return False

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

        await remove_item_cart_by_order(ItemOrderReq(**order_dict), order_dict["created_by"])
        return item.order_id
    except Exception as e:
        logger.error(f"Failed [add_order]: {e}")
        raise e

async def update_status_order(item: ItemUpdateStatusReq):
    try:
        order_info = await get_order_by_id(item.order_id)
        if not order_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không tìm thấy thông tin đơn hàng"
            )
        order_dict = item.dict()
        logger.info(order_dict)
        order_json = json.dumps(order_dict, ensure_ascii=False)

        rabbitmq.send_message(get_update_status_queue(), order_json)

        return item.order_id
    except Exception as e:
        logger.error(f"Failed [update_status_order]: {e}")
        raise e

async def get_order_by_user(user_id: str):
    try:
        collection = database.db[collection_name]
        order_list = collection.find({"created_by": user_id})
        logger.info(f"Order list: {order_list}")

        return [ItemOrderRes.from_mongo(order) for order in order_list]
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

        return ItemOrderRes.from_mongo(order)

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
        if order.status != "created":
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không thể hủy đơn hàng"
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

                logger.info(f"Đã cập nhật Redis cho sản phẩm {product.product_id}: giảm sell: {product.quantity}")
            else:
                logger.error(f"Không tìm thấy dữ liệu trong Redis: {product_key_redis}")

            await restore_product_sell(product.product_id, product.price_id, product.quantity)
        logger.info(f"Đã hủy đơn hàng: {order_id}")
        return response.SuccessResponse(message="Hủy đơn hàng thành công")

    except Exception as e:
        logger.error(f"Failed [cancel_order]: {e}")
        raise e

