from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field

class ItemReplyRes(BaseModel):
    user_id: str
    user_name: Optional[str] = None
    image: Optional[str] = None
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ItemReviewRes(BaseModel):
    id: str = Field(..., alias='_id')
    product_id: str
    user_id: str
    user_name: Optional[str] = None
    rating: float = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    image: Optional[str] = None
    replies: List[ItemReplyRes] = []
    created_at: datetime

    @classmethod
    def from_mongo(cls, data):
        data['_id'] = str(data.get('_id'))
        return cls(**data)