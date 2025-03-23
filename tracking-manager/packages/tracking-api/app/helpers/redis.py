import json

from app.core import redis_client
from app.entities.order.request import ItemOrderReq
from app.entities.product.request import ItemProductRedisReq

redis = redis_client.redis
REQUEST_COUNT_MAX=5

def opt_key(username: str) -> str:
    return f"otp_request:{username}"

def request_count_key(username: str) -> str:
    return f"otp_request_count:{username}"

def block_key(username: str) -> str:
    return f"block_user:{username}"

def get_ttl(key: str):
    return redis.ttl(key)

def check_request_count(username):
    req_count_key=request_count_key(username)

    value = redis.get(req_count_key)
    count = value.decode('utf-8') if value else None

    if count is None:
        return True
    count = int(count)

    if count<REQUEST_COUNT_MAX:
        return True
    if count==REQUEST_COUNT_MAX:
        delete_otp_request(username)
        block_send_otp(req_count_key)

    return False

def block_send_otp(key):
    redis.incr(key)
    redis.expire(key, 1800)

def update_otp_request_count_value(key: str):
    ttl = get_ttl(key)
    redis.incr(key)

    # Restore the TTL (if it had a TTL set)
    ttl = ttl if ttl > 0 else 300
    redis.expire(key, ttl)

def save_otp(key: str, otp: str):
    redis.set(key, otp, 300)

def save_otp_and_update_request_count(username: str, otp: str):
    save_otp(opt_key(username), otp)
    update_otp_request_count_value(request_count_key(username))

def check_otp(username: str, otp: str):
    key = opt_key(username)
    value = redis.get(key)
    return value.decode('utf-8') == otp if value else False

def jwt_token_key(username: str) -> str:
    return f"jwt_token:{username}"

def get_jwt_token(username: str):
    key = jwt_token_key(username)
    token = redis.get(key)
    return token.decode('utf-8') if token else None


def save_jwt_token(username: str, token: str):
    key = jwt_token_key(username)
    redis.set(key, token, 86400)

def delete_jwt_token(username: str):
    key = jwt_token_key(username)
    redis.delete(key)

def product_key(product_id: str) -> str:
    return f"product:{product_id}"

def get_product_transaction(product_id: str):
    key = product_key(product_id)
    data = redis.hgetall(key)

    return {
        "inventory": int(data.get("inventory", 0)),
        "sell": int(data.get("sell", 0)),
    } if data else None

def save_product(product: ItemProductRedisReq, id: str):
    key = product_key(id)
    redis.hmset(key, {
        "inventory": product.inventory,
        "sell": product.sell,
        "delivery": product.delivery
    })
    redis.persist(key)

def order_key(order_id: str) -> str:
    return f"order:{order_id}"

def save_order(order: ItemOrderReq):
    key = order_key(order.order_id)
    order_json = json.dumps(order.dict(), ensure_ascii=False)
    redis.set(key, order_json, 600)
    redis.persist(key)

def get_order(order_id: str):
    key = order_key(order_id)
    data = redis.get(key)
    return data if data else None

def delete_otp_request(username: str):
    key = opt_key(username)
    redis.delete(key)

def delete_otp_request_count(username: str):
    key = request_count_key(username)
    redis.delete(key)

def delete_otp(username: str):
    delete_otp_request_count(username)
    delete_otp_request(username)