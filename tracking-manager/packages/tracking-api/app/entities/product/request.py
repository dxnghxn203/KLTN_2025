import json

from pydantic import BaseModel, Field, model_validator
from typing import List, Optional


class ItemProductReq(BaseModel):
    product_id: str = ""
    name: str = ""
    quantity: int = 0
    price: float = 0

class ItemPriceDBReq(BaseModel):
    id: str = ""
    price: float = 0
    original_price: float = 0
    unit_price: str = ""
    discount: float = 0
    unit: str = ""

class ItemPriceDBInReq(BaseModel):
    price: float
    original_price: float
    unit_price: str
    discount: float
    unit: str

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
    id: str = ""
    url: str = ""

class ItemCategoryDBReq(BaseModel):
    id: str = ""
    name: str = ""
    slug: str = ""

class ItemCategoryDBInReq(BaseModel):
    name: str = ""
    slug: str = ""

    @model_validator(mode="before")
    @classmethod
    def to_py_dict(cls, data):
        if isinstance(data, str):
            return json.loads(data)
        elif isinstance(data, dict):
            return data
        raise ValueError("Invalid ItemCategoryDBInReq format")

class ItemIngredientDBReq(BaseModel):
    name: str = ""
    amount: str = ""

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
    name: str = ""
    address: str = ""
    contact: str = ""

    @model_validator(mode="before")
    @classmethod
    def to_py_dict(cls, data):
        if isinstance(data, str):
            return json.loads(data)
        elif isinstance(data, dict):
            return data
        raise ValueError("Invalid ItemManufacturerDBReq format")

class ItemProductDBReq(BaseModel):
    name: str = ""
    name_primary: str = ""
    prices: List[ItemPriceDBReq] = None
    slug: str = ""
    description: str = ""
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

class ItemProductDBInReq(BaseModel):
    name: Optional[str] = Field(default="")
    name_primary: Optional[str] = Field(default="")
    prices: Optional[ListPriceDBInReq] = Field(None)
    slug: Optional[str] = Field(default="")
    description: Optional[str] = Field(default="")
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