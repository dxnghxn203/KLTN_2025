import redis as r
def get_redis_connection():
    try:
        # Create a Redis connection
        redis = r.Redis(
            host='redis-18988.c124.us-central1-1.gce.redns.redis-cloud.com',
            port=18988,
            decode_responses=True,
            username="default",
            password="m3kR4XnG3rIGEaDu8Q9uabOdFpFsjaLT"
        )
        return redis
    except r.ConnectionError as e:
        print("Error: Unable to connect to Redis.", e)
    except Exception as e:
        print("An unexpected error occurred:", e)

redis_client = get_redis_connection()