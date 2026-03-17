"""
FitBite AI - User Routes
User profile management
"""
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
import logging

from app.database.mongodb import get_db
from app.models.user import UserUpdate
from app.services.calorie_service import compute_full_user_stats
from app.routers.auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/me")
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile."""
    user = dict(current_user)
    user["id"] = str(user.pop("_id"))
    user.pop("hashed_password", None)
    return user


@router.put("/me")
async def update_profile(
    update_data: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update user profile and recalculate stats."""
    db = get_db()
    
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    
    if any(k in update_dict for k in ["height", "weight", "age", "gender", "activity_level", "fitness_goal"]):
        merged = {**current_user, **update_dict}
        stats = compute_full_user_stats(
            merged.get("weight"), merged.get("height"),
            merged.get("age"), merged.get("gender"),
            merged.get("activity_level"), merged.get("fitness_goal")
        )
        update_dict.update(stats)
    
    update_dict["updated_at"] = datetime.utcnow()
    
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": update_dict}
    )
    
    return {"message": "Profile updated successfully", **update_dict}


@router.post("/onboarding")
async def complete_onboarding(
    onboarding_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Mark onboarding as complete."""
    db = get_db()
    
    stats = compute_full_user_stats(
        onboarding_data.get("weight", current_user.get("weight")),
        onboarding_data.get("height", current_user.get("height")),
        onboarding_data.get("age", current_user.get("age")),
        onboarding_data.get("gender", current_user.get("gender")),
        onboarding_data.get("activity_level", current_user.get("activity_level")),
        onboarding_data.get("fitness_goal", current_user.get("fitness_goal")),
    )
    
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {
            **onboarding_data,
            **stats,
            "is_onboarded": True,
            "updated_at": datetime.utcnow()
        }}
    )
    
    return {"message": "Onboarding complete", **stats}
