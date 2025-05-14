from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional, List

class ItemVoucherDBReq(BaseModel):
    voucher_id: str = ""
    voucher_name: str = ""
    inventory: int = 0
    used: int = 0
    description: str = ""
    discount: float = 0
    active: bool = True
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    created_by: str = ""
    updated_by: str = ""
    min_order_value: float = 0
    max_discount_value: float = 0
    voucher_type: str = "order"
    used_by: List[str] = []

class ItemVoucherDBInReq(BaseModel):
    voucher_name: str = ""
    inventory: int = 0
    description: str = ""
    discount: float = 0
    min_order_value: float = 0
    max_discount_value: float = 0
    voucher_type: str = "order"
