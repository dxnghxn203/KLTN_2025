import json

from app.core import redis_client
from app.entities.order.request import ItemOrderReq
from app.entities.product.request import ItemProductRedisReq

redis = redis_client.redis
REQUEST_COUNT_MAX=5

# ==== OTP & REQUEST COUNT MANAGEMENT ====

def otp_key(username: str) -> str:
    return f"otp_request:{username}"

def request_count_key(username: str) -> str:
    return f"otp_request_count:{username}"

def get_ttl(key: str):
    return redis.ttl(key)

def check_request_count(username):
    key=request_count_key(username)
    count = redis.get(key)

    if count is None:
        return True
    count = int(count.decode() if isinstance(count, bytes) else count)

    if count < REQUEST_COUNT_MAX:
        return True

    delete_otp(username)
    redis.incr(key)
    redis.expire(key, 1800)
    return False

def update_otp_request_count_value(username: str):
    key = request_count_key(username)
    redis.incr(key)
    redis.expire(key, max(get_ttl(key), 300))

def save_otp(username: str, otp: str):
    redis.set(otp_key(username), otp, 300)

def save_otp_and_update_request_count(username: str, otp: str):
    save_otp(username, otp)
    update_otp_request_count_value(username)

def get_otp(username: str):
    value = redis.get(otp_key(username))
    return value.decode() if isinstance(value, bytes) else value

def delete_otp(username: str):
    redis.delete(otp_key(username))

# ==== JWT TOKEN MANAGEMENT ====

def jwt_token_key(username: str) -> str:
    return f"jwt_token:{username}"

def get_jwt_token(username: str):
    token = redis.get(jwt_token_key(username))
    return token.decode() if isinstance(token, bytes) else token

def save_jwt_token(username: str, token: str):
    redis.set(jwt_token_key(username), token, 86400)

def delete_jwt_token(username: str):
    redis.delete(jwt_token_key(username))

# ==== PRODUCT MANAGEMENT ====

def product_key(product_id: str) -> str:
    return f"product:{product_id}"

def get_product_transaction(product_id: str):
    key = product_key(product_id)
    data = redis.hgetall(key)

    return {field: int(data[field]) for field in ["inventory", "sell"] if field in data} if data else None

def save_product(product: ItemProductRedisReq, id: str):
    redis.hmset(product_key(id), {
        "inventory": product.inventory,
        "sell": product.sell,
        "delivery": product.delivery
    })
    redis.persist(product_key(id))

# ==== ORDER MANAGEMENT ====

def order_key(order_id: str) -> str:
    return f"order:{order_id}"

def save_order(order: ItemOrderReq):
    redis.set(order_key(order.order_id), json.dumps(order.dict(), ensure_ascii=False), 600)
    redis.persist(order_key(order.order_id))

def get_order(order_id: str):
    data = redis.get(order_key(order_id))
    return data.decode() if isinstance(data, bytes) else data

