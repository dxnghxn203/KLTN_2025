from fastapi import APIRouter

router = APIRouter()

@router.get("/metrics/summary")
async def get_metrics_summary():
    return {
        "events_processed": 0,
        "average_processing_time": "0ms"
    }
