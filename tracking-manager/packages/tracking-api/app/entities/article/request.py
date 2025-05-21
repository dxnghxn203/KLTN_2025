from pydantic import BaseModel


class ItemArticle(BaseModel):
    article_id: str
    title: str = None
    content: str = None
    image_url: str = None
    category: str = None
    tags: list[str] = None
    active: bool = True

class ItemArticleRequestCreate(BaseModel):
    title: str
    content: str = None
    category: str = None
    tags: list[str] = None
    active: bool = True

class ItemArticleRequestUpdate(BaseModel):
    article_id: str
    title: str = None
    content: str = None
    category: str = None
    tags: list[str] = None
    active: bool = True
