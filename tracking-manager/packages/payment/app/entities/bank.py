from pydantic import BaseModel, Field
from enum import Enum

class BankQRRequest(BaseModel):
    order_id: str = Field(..., description="Order ID")
    bank_id: str = Field(..., description="Bank code")
    amount: float = Field(default=0, description="Payment amount")

