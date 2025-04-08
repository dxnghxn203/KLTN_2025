from typing import List

from pydantic import BaseModel

from app.entities.product.request import ItemProductReq, ItemProductInReq


class AddressOrderReq(BaseModel):
    address: str
    ward: str
    district:  str
    province: str

class InfoAddressOrderReq(BaseModel):
    name: str
    phone_number: str
    email: str
    address:  AddressOrderReq

class ItemOrderReq(BaseModel):
    order_id: str
    tracking_id: str
    status: str
    shipper_id: str
    shipper_name: str
    product: List[ItemProductReq]
    pick_from: InfoAddressOrderReq
    pick_to: InfoAddressOrderReq
    sender_province_code: int
    sender_district_code: int
    sender_commune_code: int
    receiver_province_code: int
    receiver_district_code: int
    receiver_commune_code: int
    created_by: str
    delivery_time: str
    delivery_instruction: str = ""
    payment_type: str = ""
    weight: float = 0
    shipping_fee: float = 0
    product_fee: float = 0
    total_fee: float = 0

class ItemOrderInReq(BaseModel):
    product: List[ItemProductInReq]
    pick_from: InfoAddressOrderReq
    pick_to: InfoAddressOrderReq
    sender_province_code: int
    sender_district_code: int
    sender_commune_code: int
    receiver_province_code: int
    receiver_district_code: int
    receiver_commune_code: int
    delivery_instruction: str = ""
    payment_type: str = ""

class OrderRequest(BaseModel):
    order_id: str