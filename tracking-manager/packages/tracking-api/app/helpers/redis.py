import json

from app.core import redis_client, logger
from app.entities.order.request import ItemOrderReq

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
    if int(count)<REQUEST_COUNT_MAX:
        return True
    if int(count)>REQUEST_COUNT_MAX:
        return False
    if int(count)==REQUEST_COUNT_MAX:
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
    if not data:
        return None

    return {
        "ton": int(data.get("ton", 0)),
        "ban": int(data.get("ban", 0)),
    }
def order_key(order_id: str) -> str:
    return f"order:{order_id}"

def save_order(order: ItemOrderReq):
    key = order_key(order.order_id)
    order_json = json.dumps(order.dict())
    redis.set(key, order_json, 86400)

def delete_otp_request(username: str):
    key = opt_key(username)
    redis.delete(key)

def delete_otp_request_count(username: str):
    key = request_count_key(username)
    redis.delete(key)

def delete_otp(username: str):
    delete_otp_request_count(username)
    delete_otp_request(username)