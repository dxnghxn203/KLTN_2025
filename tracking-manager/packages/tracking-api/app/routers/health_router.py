from fastapi import APIRouter, status
from app.core.schemas import HealthCheck
from datetime import datetime

router = APIRouter(
)

@router.get(
    "",
   
)
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }