import datetime

from pydantic import BaseModel, Field
from typing import List, Optional, Union

from app.entities.product.response import ItemProductRes


class AddressOrderRes(BaseModel):
    address: Optional[Union[str, None]] = None
    ward: Optional[Union[str, None]] = None
    district:  Optional[Union[str, None]] = None
    province: Optional[Union[str, None]] = None

class InfoAddressOrderRes(BaseModel):
    name: Optional[Union[str, None]] = None
    phone_number: Optional[Union[str, None]] = None
    email: Optional[Union[str, None]] = None
    address:  AddressOrderRes

class ItemOrderRes(BaseModel):
    id: str = Field(..., alias='_id')
    order_id: Optional[Union[str, None]] = None
    tracking_id: Optional[Union[str, None]] = None
    status: Optional[Union[str, None]] = None
    product: List[Optional[Union[ItemProductRes, None]]] = None
    pick_from: Optional[Union[InfoAddressOrderRes, None]] = None
    pick_to: Optional[Union[InfoAddressOrderRes, None]] = None
    sender_province_code: int = 0
    sender_district_code: int = 0
    sender_commune_code: int = 0
    receiver_province_code: int = 0
    receiver_district_code: int = 0
    receiver_commune_code: int = 0
    created_by: Optional[Union[str, None]] = None
    delivery_instruction: Optional[Union[str, None]] = None
    payment_type: Optional[Union[str, None]] = None
    weight: float = 0
    total_fee: float = 0
    shipping_fee: float = 0
    product_fee: float = 0
    created_date: Optional[Union[datetime.datetime, None]] = None
    updated_date: Optional[Union[datetime.datetime, None]] = None

    @classmethod
    def from_mongo(cls, data):
        data['_id'] = str(data.get('_id'))
        return cls(**data)