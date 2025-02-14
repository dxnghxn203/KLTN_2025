
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Dict, Any

class TrackingEvent(BaseModel):
    event_type: str = Field(..., description="Type of the tracking event")
    data: Dict[str, Any] = Field(..., description="Event payload data")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())