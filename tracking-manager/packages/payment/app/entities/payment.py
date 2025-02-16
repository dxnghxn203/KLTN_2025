from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class GeneratePaymentQr(BaseModel):
    bank_id: str = Field(..., description="Bank ID")
    order_id: str = Field(..., description="Order ID for payment")
    amount: float = Field(..., description="Payment amount")

    