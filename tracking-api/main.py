from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from app.core import response, exception
from app.routers import (
    events_router,
    tracking_router,
    metrics_router,
    health_router
)
from app.core import database
import uvicorn
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
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
app.include_router(events_router, prefix="/v1", tags=["Events"])
app.include_router(tracking_router, prefix="/v1", tags=["Tracking"])
app.include_router(metrics_router, prefix="/v1", tags=["Metrics"])
app.include_router(health_router, prefix="/v1", tags=["Health"])

@app.get("/")
def read_root():
    return {
        "service": "Tracking API",
        "version": "1.0.0",
        "status": "active"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
