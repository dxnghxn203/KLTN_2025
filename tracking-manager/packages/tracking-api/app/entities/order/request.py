from pydantic import BaseModel
from typing import List

from app.entities.product.request import ItemProductReq


class ItemOrderReq(BaseModel):
    order_id: str
    products: List[ItemProductReq]
    created_by: str

class ItemOrderInReq(BaseModel):
    products: List[ItemProductReq]