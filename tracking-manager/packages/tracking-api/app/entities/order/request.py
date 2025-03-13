from pydantic import BaseModel
from typing import List

from app.entities.product.request import ItemProductReq


class ItemOrderReq(BaseModel):
    order_id: str
    tracking_id: str
    status: str
    product: List[ItemProductReq]
    created_by: str

class ItemOrderInReq(BaseModel):
    product: List[ItemProductReq]

class OrderRequest(BaseModel):
    order_id: str