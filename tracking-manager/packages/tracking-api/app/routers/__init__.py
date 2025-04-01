from .user import router as user_router
from .auth import router as authen_router
from .order import router as order_router
from .product import router as product_router
from .location import router as location_router
from .category import router as category_router
from .review import router as review_router
from .comment import router as comment_router
__all__ = [
    'user_router',
    'authen_router',
    'order_router',
    'product_router',
    'location_router',
    'category_router',
    'review_router',
    'comment_router'
]
