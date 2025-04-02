from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class GeneratePaymentQr(BaseModel):
    bank_id: str = Field(..., description="Bank ID")
    order_id: str = Field(..., description="Order ID for payment")
    amount: float = Field(..., description="Payment amount")

class ItemCallBackReq(BaseModel):
    gateway: str = None
    transaction_date: str = None
    account_number: str = None
    sub_account: Optional[str] = None
    code: Optional[str] = None
    content: str = None
    transfer_type: str = None
    description: str = None
    transfer_amount: int = None
    reference_code: str = None
    accumulated: int = None
    id: int = None
    created_at: datetime = datetime.now()



