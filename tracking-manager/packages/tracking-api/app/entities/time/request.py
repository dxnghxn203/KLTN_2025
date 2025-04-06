from pydantic import BaseModel

class RouteReq(BaseModel):
    id: str
    code: str
    vn_route: str
    eng_route: str

class TimeReq(BaseModel):
    route: RouteReq
    range_time: float