import random
import string
from datetime import datetime


def get_create_order_queue():
    return "CREATE_ORDER"

def get_create_tracking_queue():
    return "CREATE_TRACKING"

def generate_random_string(length: int) -> str:
    charset = string.ascii_uppercase + string.digits
    return ''.join(random.choices(charset, k=length))

def generate_id(prefix: str) -> str:
    random_id = generate_random_string(3)
    timestamp = int(datetime.utcnow().timestamp())
    return f"{prefix}{random_id}{timestamp}"

prefix = "stg"
CITY_INDEX = f"{prefix}_cities"
DISTRICT_INDEX = f"{prefix}_districts"
WARD_INDEX = f"{prefix}_wards"
REGION_INDEX = f"{prefix}_regions"
FEE_INDEX = f"{prefix}_fee"
TIME_INDEX = f"{prefix}_time"

PAYMENT_COD = "COD"
PAYMENT_TP_BANK_QR = "TPBANK_QR"
PAYMENT_BIDV_BANK_QR = "BIDV_QR"
BANK_IDS = {
    PAYMENT_TP_BANK_QR: "TPB",
    PAYMENT_BIDV_BANK_QR: "BIDV"
}

