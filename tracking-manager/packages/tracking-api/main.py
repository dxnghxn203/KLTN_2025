import logging

import uvicorn
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.core import response, exception
from app.routers import (
    user_router,
    authen_router,
    order_router,
    product_router,
    location_router,
    category_router,
    review_router,
    comment_router,
    cart_router
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:8000",
    "http://localhost:3000",
    "https://kltn-2025.vercel.app",
    "https://kltn-2025-payment.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
app.add_exception_handler(response.JsonException, exception.json_exception_handler)
app.add_exception_handler(RequestValidationError, exception.validation_exception_handler)

# Routers
app.include_router(authen_router, prefix="/v1", tags=["Auth"])
app.include_router(user_router, prefix="/v1", tags=["User"])
app.include_router(product_router, prefix="/v1", tags=["Product"])
app.include_router(order_router, prefix="/v1", tags=["Order"])
app.include_router(cart_router, prefix="/v1", tags=["Cart"])
app.include_router(location_router, prefix="/v1", tags=["Location"])
app.include_router(category_router, prefix="/v1", tags=["Category"])
app.include_router(review_router, prefix="/v1", tags=["Review"])
app.include_router(comment_router, prefix="/v1", tags=["Comment"])

@app.get("/read-root")
def read_root():
    return {
        "service": "Tracking API",
        "version": "1.0.0",
        "status": "active"
    }
@app.get("/")
def home():
    return {
        "service": "Tracking API",
        "version": "1.0.0",
        "status": "active"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
