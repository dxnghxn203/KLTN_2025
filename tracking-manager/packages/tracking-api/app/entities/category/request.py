from pydantic import BaseModel
from typing import List

class ChildCategoryReq(BaseModel):
    child_category_id: str = ""
    child_category_name: str = ""
    child_category_slug: str = ""

class SubCategoryReq(BaseModel):
    sub_category_id: str = ""
    sub_category_name: str = ""
    sub_category_slug: str = ""
    child_category: List[ChildCategoryReq]

class MainCategoryReq(BaseModel):
    main_category_id: str = ""
    main_category_name: str = ""
    main_category_slug: str = ""
    sub_category: List[SubCategoryReq]

class ChildCategoryInReq(BaseModel):
    child_category_name: str = ""
    child_category_slug: str = ""

class SubCategoryInReq(BaseModel):
    sub_category_name: str = ""
    sub_category_slug: str = ""
    child_category: List[ChildCategoryReq]

class MainCategoryInReq(BaseModel):
    main_category_name: str = ""
    main_category_slug: str = ""
    sub_category: List[SubCategoryReq]

