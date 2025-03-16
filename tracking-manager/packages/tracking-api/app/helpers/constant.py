import random
import string

def get_create_order_queue():
    return "CREATE_ORDER"

def get_create_tracking_queue():
    return "CREATE_TRACKING"

def generate_random_string(length: int) -> str:
    charset = string.ascii_uppercase + string.digits
    return ''.join(random.choices(charset, k=length))

prefix = "stg"
CITY_INDEX = f"{prefix}_cities"
DISTRICT_INDEX = f"{prefix}_districts"
WARD_INDEX = f"{prefix}_wards"
REGION_INDEX = f"{prefix}_regions"