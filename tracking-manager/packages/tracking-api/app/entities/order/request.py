from pydantic import BaseModel
from typing import List

from app.entities.product.request import ItemProductReq

class AddressOrderReq(BaseModel):
    address: str
    ward: str
    district:  str
    province: str

class ItemOrderReq(BaseModel):
    order_id: str
    tracking_id: str
    status: str
    product: List[ItemProductReq]
    pick_from: AddressOrderReq
    pick_to: AddressOrderReq
    sender_province_code: int
    sender_district_code: int
    sender_commune_code: int
    receiver_province_code: int
    receiver_district_code: int
    receiver_commune_code: int
    created_by: str
    delivery_instruction: str = ""

class ItemOrderInReq(BaseModel):
    product: List[ItemProductReq]
    pick_from: AddressOrderReq
    pick_to: AddressOrderReq
    sender_province_code: int
    sender_district_code: int
    sender_commune_code: int
    receiver_province_code: int
    receiver_district_code: int
    receiver_commune_code: int
    delivery_instruction: str = ""

class OrderRequest(BaseModel):
    order_id: str