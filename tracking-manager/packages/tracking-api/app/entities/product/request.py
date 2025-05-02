import json

from pydantic import BaseModel, Field, model_validator
from typing import List, Optional


class ItemProductReq(BaseModel):
    product_id: str = ""
    price_id: str = ""
    product_name: str = ""
    unit: str = ""
    quantity: int = 0
    price: float = 0
    weight: float = 0
    original_price: float = 0
    discount: float = 0
    images_primary: str = ""

class ItemProductInReq(BaseModel):
    product_id: str = ""
    price_id: str = ""
    quantity: int = 0

class ItemProductRedisReq(BaseModel):
    inventory: int = 0
    sell: int = 0
    delivery: int = 0

class ItemPriceDBReq(BaseModel):
    price_id: str = ""
    price: float = 0
    discount: float = 0
    unit: str = ""
    weight: float = 0
    amount: int = 0
    original_price: float = 0

class ItemPriceDBInReq(BaseModel):
    discount: float
    unit: str
    weight: float = 0
    amount: int = 0
    original_price: float = 0

    @model_validator(mode="before")
    @classmethod
    def to_py_dict(cls, data):
        if isinstance(data, str):
            return json.loads(data)
        elif isinstance(data, dict):
            return data
        raise ValueError("Invalid ItemPriceDBInReq format")

class ListPriceDBInReq(BaseModel):
    prices: List[ItemPriceDBInReq]

    @model_validator(mode="before")
    @classmethod
    def to_py_dict(cls, data):
        if isinstance(data, str):
            return json.loads(data)
        elif isinstance(data, dict):
            return data
        raise ValueError("Invalid ListPriceDBInReq format")

class ItemImageDBReq(BaseModel):
    images_id: str = ""
    images_url: str = ""

class ItemCategoryDBReq(BaseModel):
    main_category_id: str = ""
    main_category_slug: str = ""
    main_category_name: str = ""
    sub_category_id: str = ""
    sub_category_slug: str = ""
    sub_category_name: str = ""
    child_category_id: str = ""
    child_category_slug: str = ""
    child_category_name: str = ""

class ItemCategoryDBInReq(BaseModel):
    main_category_id: str = ""
    sub_category_id: str = ""
    child_category_id: str = ""

    @model_validator(mode="before")
    @classmethod
    def to_py_dict(cls, data):
        if isinstance(data, str):
            return json.loads(data)
        elif isinstance(data, dict):
            return data
        raise ValueError("Invalid ItemCategoryDBInReq format")

class ItemIngredientDBReq(BaseModel):
    ingredient_name: str = ""
    ingredient_amount: str = ""

    @model_validator(mode="before")
    @classmethod
    def to_py_dict(cls, data):
        if isinstance(data, str):
            return json.loads(data)
        elif isinstance(data, dict):
            return data
        raise ValueError("Invalid ItemIngredientDBReq format")

class ListIngredientDBReq(BaseModel):
    ingredients: List[ItemIngredientDBReq]

    @model_validator(mode="before")
    @classmethod
    def to_py_dict(cls, data):
        if isinstance(data, str):
            return json.loads(data)
        elif isinstance(data, dict):
            return data
        raise ValueError("Invalid ListIngredientDBReq format")

class ItemManufacturerDBReq(BaseModel):
    manufacture_name: str = ""
    manufacture_address: str = ""
    manufacture_contact: str = ""

    @model_validator(mode="before")
    @classmethod
    def to_py_dict(cls, data):
        if isinstance(data, str):
            return json.loads(data)
        elif isinstance(data, dict):
            return data
        raise ValueError("Invalid ItemManufacturerDBReq format")

class ItemProductDBReq(BaseModel):
    product_id: str = ""
    product_name: str = ""
    name_primary: str = ""
    prices: List[ItemPriceDBReq] = None
    inventory: int = 0
    sell: int = 0
    delivery: int = 0
    slug: str = ""
    description: str = ""
    full_descriptions: str = ""
    images_primary: str = ""
    images: List[ItemImageDBReq] = None
    category: ItemCategoryDBReq
    origin: str = ""
    ingredients: List[ItemIngredientDBReq] = None
    uses: str = ""
    dosage: str = ""
    side_effects: str = ""
    precautions: str = ""
    storage: str = ""
    manufacturer: ItemManufacturerDBReq = None
    dosage_form: str = ""
    brand: str = ""
    registration_number: str = ""
    certificate_file: str = ""
    active: bool = False
    prescription_required: bool = False
    verified_by: str = ""

class ItemProductDBInReq(BaseModel):
    product_name: Optional[str] = Field(default="")
    name_primary: Optional[str] = Field(default="")
    prices: Optional[ListPriceDBInReq] = Field(None)
    inventory: Optional[int] = Field(default=0)
    slug: Optional[str] = Field(default="")
    description: Optional[str] = Field(default="")
    full_description: Optional[str] = Field(default="")
    category: Optional[ItemCategoryDBInReq] = Field(None)
    origin: Optional[str] = Field(default="")
    ingredients: Optional[ListIngredientDBReq] = Field(None)
    uses: Optional[str] = Field(default="")
    dosage: Optional[str] = Field(default="")
    side_effects: Optional[str] = Field(default="")
    precautions: Optional[str] = Field(default="")
    storage: Optional[str] = Field(default="")
    manufacturer: Optional[ItemManufacturerDBReq] = Field(None)
    dosage_form: Optional[str] = Field(default="")
    brand: Optional[str] = Field(default="")
    prescription_required: bool = False
    registration_number: Optional[str] = Field(default="")

class UpdateCategoryReq(BaseModel):
    product_id: str = ""
    main_category_id: str = ""
    sub_category_id: str = ""
    child_category_id: str = ""

class ApproveProductReq(BaseModel):
    product_id: str = ""