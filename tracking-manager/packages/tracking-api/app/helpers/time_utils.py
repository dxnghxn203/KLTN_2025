from datetime import datetime, timezone

def get_utc_now():
    return datetime.now(timezone.utc)

def format_timestamp(dt: datetime) -> str:
    return dt.isoformat()
