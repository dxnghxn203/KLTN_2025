
import redis
import os

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))

# Khởi tạo redis_client để các module khác có thể import và sử dụng
try:
    redis_client = redis.Redis(
        host='redis-18988.c124.us-central1-1.gce.redns.redis-cloud.com',
        port=18988,
        decode_responses=True,
        username="default",
        password="m3kR4XnG3rIGEaDu8Q9uabOdFpFsjaLT"
    )
    redis_client.ping() # Kiểm tra kết nối
    print(f"Successfully connected to Redis at {REDIS_HOST}:{REDIS_PORT}")
except redis.exceptions.ConnectionError as e:
    print(f"Could not connect to Redis: {e}")
    redis_client = None # Xử lý trường hợp không kết nối được

# Bạn có thể thêm các hàm tiện ích liên quan đến Redis ở đây nếu cần