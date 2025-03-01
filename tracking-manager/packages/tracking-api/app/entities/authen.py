from typing import Any

from pydantic import BaseModel

class GoogleAuthRequest(BaseModel):
    access_token: str = None
    id_token: str = None
    email: str = None