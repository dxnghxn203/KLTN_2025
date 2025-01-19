import redis as r
from dotenv import load_dotenv
import os

load_dotenv()
redis_host = os.getenv('REDIS_HOST')

try:
    # Create a Redis connection
    redis = r.Redis(
        host='redis-17271.c246.us-east-1-4.ec2.redns.redis-cloud.com',
        port=17271,
        decode_responses=True,
        username="default",
        password="2FizrCYPIFT4cK5TtPGNci2Kp34vLSqJ"
    )

    # Test the connection
    redis.ping()
    print("Connected to Redis successfully!")

except r.ConnectionError as e:
    print("Error: Unable to connect to Redis.", e)
except Exception as e:
    print("An unexpected error occurred:", e)


# def set(key, value, ex):
#     redis.set(key, value, ex)
#
def get_decode_value(key):
    value = redis.get(key)
    return value.decode('utf-8') if value else None
