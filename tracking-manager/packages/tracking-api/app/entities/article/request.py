from datetime import datetime

from pydantic import BaseModel

from app.helpers.time_utils import get_current_time


class ItemArticle(BaseModel):
    article_id: str
    title: str = None
    content: str = None
    image_url: str = None
    category: str = None
    tags: list[str] = None
    created_by: str = None
    created_date: datetime = get_current_time()
    updated_date: datetime = get_current_time()
    active: bool = True

class ItemArticleRequestCreate(BaseModel):
    title: str
    content: str = None
    category: str = None
    tags: list[str] = None
    created_by: str = None
    active: bool = True

class ItemArticleRequestUpdate(BaseModel):
    article_id: str
    title: str = None
    content: str = None
    category: str = None
    created_by: str = None
    tags: list[str] = None
    updated_date: datetime = get_current_time()
    active: bool = True
