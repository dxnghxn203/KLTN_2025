import os
from datetime import datetime, timedelta

import jwt

from app.core import logger
from app.entities.user.response import ItemUserRes
from app.helpers import redis
from app.middleware import middleware
from app.middleware.middleware import get_private_key
from app.models import user

collection_name = "authorizations"


async def get_token(username: str):
    expire = datetime.now() + timedelta(
        seconds=60 * 60 * 24
    )
    to_encode = {
        "exp": expire, "username": username
    }

    private_key = get_private_key()

    encoded_jwt = jwt.encode(to_encode, private_key, algorithm=os.getenv("ALGORITHM"))

    redis.save_jwt_token(username, encoded_jwt)
    return encoded_jwt


async def get_current(token: str) -> ItemUserRes:
    try:
        payload = middleware.decode_jwt(token=token)
        userInfo = await user.get_by_id(payload.get("username"))

        # Initialize userInfo with token
        userInfo['token'] = token

        return ItemUserRes.from_mongo(userInfo)
    except Exception as e:
        logger.error("Error get_current", error=str(e))
        raise e
