"""
FitBite AI - Authentication Routes
JWT-based registration, login, and token management
"""
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from datetime import timedelta
import logging

from app.database.mongodb import get_db
from app.models.user import UserCreate, UserResponse
from app.services.auth_service import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.services.calorie_service import compute_full_user_stats

logger = logging.getLogger(__name__)
router = APIRouter()
security = HTTPBearer()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency to get current authenticated user."""
    token = credentials.credentials
    payload = decode_token(token)
    
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    db = get_db()
    user = await db.users.find_one({"email": payload.get("sub")})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(user_data: UserCreate):
    """Register a new user."""
    db = get_db()
    
    # Check if email already exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Compute health stats
    stats = compute_full_user_stats(
        user_data.weight, user_data.height, user_data.age,
        user_data.gender, user_data.activity_level, user_data.fitness_goal
    )
    
    # Create user document
    user_doc = {
        **user_data.dict(exclude={"password"}),
        "hashed_password": hash_password(user_data.password),
        **stats,
        "is_active": True,
        "is_onboarded": False,
        "expo_push_token": None,
    }
    
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = str(result.inserted_id)
    
    # Create tokens
    access_token = create_access_token({"sub": user_data.email})
    refresh_token = create_refresh_token({"sub": user_data.email})
    
    logger.info(f"New user registered: {user_data.email}")
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user={"id": user_doc["_id"], "name": user_data.name, "email": user_data.email, **stats}
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    """Login with email and password."""
    db = get_db()
    
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.get("is_active", True):
        raise HTTPException(status_code=403, detail="Account is deactivated")
    
    access_token = create_access_token({"sub": credentials.email})
    refresh_token = create_refresh_token({"sub": credentials.email})
    
    logger.info(f"User logged in: {credentials.email}")
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user={"id": str(user["_id"]), "name": user["name"], "email": user["email"]}
    )


@router.post("/refresh")
async def refresh_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Refresh access token."""
    payload = decode_token(credentials.credentials)
    
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    access_token = create_access_token({"sub": payload["sub"]})
    return {"access_token": access_token, "token_type": "bearer"}
