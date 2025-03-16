def get_create_order_queue():
    return "CREATE_ORDER"

def get_create_tracking_queue():
    return "CREATE_TRACKING"

prefix = "stg"
CITY_INDEX = f"{prefix}_cities"
DISTRICT_INDEX = f"{prefix}_districts"
WARD_INDEX = f"{prefix}_wards"
REGION_INDEX = f"{prefix}_regions"