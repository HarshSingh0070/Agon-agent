"""
FitBite AI - FastAPI Backend
Production-ready modular FastAPI application
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import logging
import time

from app.config import settings
from app.database.mongodb import connect_to_mongo, close_mongo_connection
from app.routers import auth, users, food, meals, progress, notifications

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="FitBite AI API",
    description="AI-Powered Indian Food & Fitness Tracking API",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "message": str(exc)}
    )

# Startup & Shutdown events
@app.on_event("startup")
async def startup_event():
    logger.info("Starting FitBite AI API...")
    await connect_to_mongo()
    logger.info("Connected to MongoDB")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down FitBite AI API...")
    await close_mongo_connection()

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(food.router, prefix="/food", tags=["Food"])
app.include_router(meals.router, prefix="/meals", tags=["Meals"])
app.include_router(progress.router, prefix="/progress", tags=["Progress"])
app.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])

@app.get("/")
async def root():
    return {
        "app": "FitBite AI",
        "version": "1.0.0",
        "status": "running",
        "disclaimer": "All calorie values are AI-generated estimates and should not replace professional medical advice."
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": time.time()}
