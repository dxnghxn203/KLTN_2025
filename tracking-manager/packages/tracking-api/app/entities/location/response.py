from pydantic import BaseModel


class City(BaseModel):
    name: str
    code: int
    full_name_en: str
    name_en: str
    code_name: str
    unit_id: int
    region_id: int
    unit_name: str
    domestic_name: str
    domestic_name_en: str


class District(BaseModel):
    name: str
    code: int
    full_name_en: str
    name_en: str
    code_name: str
    unit_id: int
    unit_name: str
    city_code: int


class Ward(BaseModel):
    name: str
    code: int
    full_name_en: str
    name_en: str
    code_name: str
    unit_id: int
    unit_name: str
    district_code: int
    city_code: int

class Region(BaseModel):
    id: int
    name: str
    name_en: str
    code_name: str
    code_name_en: str
    domestic_name: str
    domestic_name_en: str
