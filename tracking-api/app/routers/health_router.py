from fastapi import APIRouter, status
from app.core.schemas import HealthCheck
from datetime import datetime

router = APIRouter(
    prefix="/health",
    tags=["Health"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal server error"}
    }
)

@router.get(
    "",
    response_model=HealthCheck,
    status_code=status.HTTP_200_OK,
    summary="Service Health Check",
    description="Check the health status of the API service"
)
async def health_check():
    """
    Checks the health status of the service
    
    Returns:
        HealthCheck: Service health information
        
    Example:
        ```json
        {
            "status": "healthy",
            "version": "1.0.0",
            "timestamp": "2024-01-01T00:00:00Z"
        }
        ```
    """
    return {
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }