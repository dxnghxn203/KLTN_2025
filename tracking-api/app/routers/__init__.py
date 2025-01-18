from .events_router import router as events_router
from .tracking_router import router as tracking_router
from .metrics_router import router as metrics_router
from .health_router import router as health_router

__all__ = [
    'events_router',
    'tracking_router',
    'metrics_router',
    'health_router'
]
