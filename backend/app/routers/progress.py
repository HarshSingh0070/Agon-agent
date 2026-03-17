"""
FitBite AI - Progress Routes
Daily progress tracking
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import Optional, List
import logging

from app.database.mongodb import get_db
from app.routers.auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()


class WaterUpdate(BaseModel):
    glasses: int = Field(..., ge=1, le=20)


class StepsUpdate(BaseModel):
    steps: int = Field(..., ge=0, le=100000)


@router.get("/today")
async def get_today_progress(current_user: dict = Depends(get_current_user)):
    """Get today's progress."""
    db = get_db()
    today = date.today().isoformat()
    
    progress = await db.daily_progress.find_one({
        "user_id": str(current_user["_id"]),
        "date": today
    })
    
    if not progress:
        return {
            "date": today,
            "calories_consumed": 0,
            "protein_consumed": 0,
            "carbs_consumed": 0,
            "fats_consumed": 0,
            "water_intake": 0,
            "steps": 0,
        }
    
    progress["id"] = str(progress.pop("_id"))
    return progress


@router.put("/water")
async def update_water(update: WaterUpdate, current_user: dict = Depends(get_current_user)):
    """Update water intake."""
    db = get_db()
    today = date.today().isoformat()
    
    await db.daily_progress.update_one(
        {"user_id": str(current_user["_id"]), "date": today},
        {
            "$inc": {"water_intake": update.glasses},
            "$setOnInsert": {"created_at": datetime.utcnow()},
            "$set": {"updated_at": datetime.utcnow()},
        },
        upsert=True
    )
    
    return {"message": f"Added {update.glasses} glass(es) of water"}


@router.put("/steps")
async def update_steps(update: StepsUpdate, current_user: dict = Depends(get_current_user)):
    """Update step count."""
    db = get_db()
    today = date.today().isoformat()
    
    await db.daily_progress.update_one(
        {"user_id": str(current_user["_id"]), "date": today},
        {
            "$set": {"steps": update.steps, "updated_at": datetime.utcnow()},
            "$setOnInsert": {"created_at": datetime.utcnow()},
        },
        upsert=True
    )
    
    return {"message": f"Steps updated to {update.steps}"}


@router.get("/history")
async def get_progress_history(
    days: int = 7,
    current_user: dict = Depends(get_current_user)
):
    """Get progress history for the past N days."""
    db = get_db()
    
    cursor = db.daily_progress.find(
        {"user_id": str(current_user["_id"])}
    ).sort("date", -1).limit(days)
    
    history = await cursor.to_list(length=days)
    for item in history:
        item["id"] = str(item.pop("_id"))
    
    return history
