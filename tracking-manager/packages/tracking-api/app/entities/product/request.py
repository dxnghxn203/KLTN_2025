from pydantic import BaseModel


class ItemProductReq(BaseModel):
    product_id: str
    name: str
    quantity: int
    price: float
