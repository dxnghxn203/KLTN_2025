from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class ErrorResponse(BaseModel):
    status: str = Field("error", description="Error status")
    message: str = Field(..., description="Error message")
    code: int = Field(..., description="Error code")

class SuccessResponse(BaseModel):
    status: str = Field("success", description="Success status")
    data: Dict[str, Any] = Field(..., description="Response data")

class HealthCheck(BaseModel):
    status: str = Field(..., description="Service status")
    version: str = Field(..., description="API version")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
