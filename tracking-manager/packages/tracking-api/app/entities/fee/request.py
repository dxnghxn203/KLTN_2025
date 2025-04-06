from pydantic import BaseModel
from typing import List

class ItemPricingReq(BaseModel):
    weight_less_than_equal: float
    price: float

class RouteReq(BaseModel):
    id: str
    code: str
    vn_route: str
    eng_route: str

class AdditionalPricingReq(BaseModel):
    threshold_weight: float
    additional_price_per_step: float
    step_weight: float

class FeeReq(BaseModel):
    route: RouteReq
    pricing: List[ItemPricingReq]
    additional_pricing: AdditionalPricingReq