from datetime import datetime
from typing import List

from pydantic import BaseModel, Field

from app.entities.product.request import ItemProductReq, ItemProductInReq

class AddressOrderReq(BaseModel):
    address: str = ""
    ward: str = ""
    district:  str = ""
    province: str = ""

class InfoAddressOrderReq(BaseModel):
    name: str = ""
    phone_number: str = ""
    email: str = ""
    address:  AddressOrderReq

class ItemOrderReq(BaseModel):
    order_id: str = ""
    tracking_id: str = ""
    status: str = ""
    shipper_id: str = ""
    shipper_name: str = ""
    product: List[ItemProductReq]
    pick_from: InfoAddressOrderReq
    pick_to: InfoAddressOrderReq
    sender_province_code: int = 0
    sender_district_code: int = 0
    sender_commune_code: int = 0
    receiver_province_code: int = 0
    receiver_district_code: int = 0
    receiver_commune_code: int = 0
    created_by: str = ""
    delivery_time: datetime
    delivery_instruction: str = ""
    payment_type: str = ""
    weight: float = 0
    shipping_fee: float = 0
    product_fee: float = 0
    total_fee: float = 0

class ItemOrderInReq(BaseModel):
    product: List[ItemProductInReq]
    pick_to: InfoAddressOrderReq
    receiver_province_code: int
    receiver_district_code: int
    receiver_commune_code: int
    delivery_instruction: str = ""
    payment_type: str = ""

class OrderRequest(BaseModel):
    order_id: str = ""

class ItemUpdateStatusReq(BaseModel):
    order_id: str = ""
    status: str = ""
    shipper_id: str = ""
    shipper_name: str = ""
    delivery_instruction: str = ""

class ItemOrderForPTReq(BaseModel):
    request_id: str = ""
    status: str = "pending"
    product: List[ItemProductReq]
    pick_to: InfoAddressOrderReq
    receiver_province_code: int
    receiver_district_code: int
    receiver_commune_code: int
    created_by: str = ""
    verified_by: str = ""
    pharmacist_name: str = ""
    note: str = ""

class ItemOrderForPTInReq(BaseModel):
    product: List[ItemProductInReq]
    pick_to: InfoAddressOrderReq
    receiver_province_code: int = 0
    receiver_district_code: int = 0
    receiver_commune_code: int = 0

class ItemOrderApproveReq(BaseModel):
    request_id: str = ""
    status: str = ""
    product: List[ItemProductInReq]
    note: str = ""