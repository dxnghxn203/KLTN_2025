from typing import Optional, Union, List

from pydantic import BaseModel


class ItemProductRes(BaseModel):
    product_id: Optional[Union[str, None]] = None
    price_id: Optional[Union[str, None]] = None
    product_name: Optional[Union[str, None]] = None
    unit: Optional[Union[str, None]] = None
    quantity: int = 0
    price: float = 0
    original_price: float = 0
    discount: float = 0
    weight: float = 0
    images_primary: Optional[Union[str, None]] = None

class ItemPriceDBRes(BaseModel):
    price_id: Optional[Union[str, None]] = None
    price: float = 0
    original_price: float = 0
    unit_price: Optional[Union[str, None]] = None
    discount: float = 0
    unit: Optional[Union[str, None]] = None
    inventory: int = 0
    sell: int = 0
    delivery: int = 0
    amount_per_unit: Optional[Union[str, None]] = None
    weight: float = 0

class ItemImageDBRes(BaseModel):
    images_id: Optional[Union[str, None]] = None
    images_url: Optional[Union[str, None]] = None

class ItemCategoryDBInRes(BaseModel):
    main_category_id: Optional[Union[str, None]] = None
    main_category_slug: Optional[Union[str, None]] = None
    main_category_name: Optional[Union[str, None]] = None
    sub_category_id: Optional[Union[str, None]] = None
    sub_category_slug: Optional[Union[str, None]] = None
    sub_category_name: Optional[Union[str, None]] = None
    child_category_id: Optional[Union[str, None]] = None
    child_category_slug: Optional[Union[str, None]] = None
    child_category_name: Optional[Union[str, None]] = None

class ItemIngredientDBRes(BaseModel):
    ingredient_name: Optional[Union[str, None]] = None
    ingredient_amount: Optional[Union[str, None]] = None

class ItemManufacturerDBRes(BaseModel):
    manufacture_name: Optional[Union[str, None]] = None
    manufacture_address: Optional[Union[str, None]] = None
    manufacture_contact: Optional[Union[str, None]] = None

class ItemFullDescriptionDBRes(BaseModel):
    title: Optional[Union[str, None]] = None
    content: Optional[Union[str, None]] = None


class ItemProductDBRes(BaseModel):
    product_id: Optional[Union[str, None]] = None
    product_name: Optional[Union[str, None]] = None
    name_primary: Optional[Union[str, None]] = None
    prices: List[Optional[Union[ItemPriceDBRes, None]]] = None
    slug: Optional[Union[str, None]] = None
    description: Optional[Union[str, None]] = None
    full_descriptions: List[Optional[Union[ItemFullDescriptionDBRes, None]]] = None
    images_primary: Optional[Union[str, None]] = None
    images: List[Optional[Union[ItemImageDBRes, None]]] = None
    category: Optional[Union[ItemCategoryDBInRes, None]] = None
    origin: Optional[Union[str, None]] = None
    ingredients: List[Optional[Union[ItemIngredientDBRes, None]]] = None
    uses: Optional[Union[str, None]] = None
    dosage: Optional[Union[str, None]] = None
    side_effects: Optional[Union[str, None]] = None
    precautions: Optional[Union[str, None]] = None
    storage: Optional[Union[str, None]] = None
    manufacturer: Optional[Union[ItemManufacturerDBRes, None]] = None
    dosage_form: Optional[Union[str, None]] = None
    brand: Optional[Union[str, None]] = None
    count_review: Optional[Union[int, None]] = None
    count_comment: Optional[Union[int, None]] = None
    rating: Optional[Union[float, None]] = None

    @classmethod
    def from_mongo(cls, data):
        data['_id'] = str(data.get('_id'))
        return cls(**data)