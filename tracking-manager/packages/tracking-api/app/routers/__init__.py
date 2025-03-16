from .user import router as user_router
from .authen import router as authen_router
from .order import router as order_router
from .product import router as product_router
from .location import router as location_router
__all__ = [
    'user_router',
    'authen_router',
    'order_router',
    'product_router',
    'location_router',
]
