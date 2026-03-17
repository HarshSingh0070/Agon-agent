"""
FitBite AI - Meal Routes
Meal logging and retrieval
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, date
import logging

from app.database.mongodb import get_db
from app.routers.auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()


class MealCreate(BaseModel):
    food_name: str
    food_id: Optional[str] = None
    emoji: str = "🍽️"
    portion_grams: float = Field(..., gt=0)
    calories: float
    protein: float
    carbs: float
    fats: float
    meal_type: str = "Meal"  # Breakfast, Lunch, Dinner, Snack
    is_ai_estimated: bool = True
    notes: Optional[str] = None


@router.get("/today")
async def get_today_meals(current_user: dict = Depends(get_current_user)):
    """Get all meals logged today."""
    db = get_db()
    today = date.today().isoformat()
    
    cursor = db.meals.find({
        "user_id": str(current_user["_id"]),
        "date": today
    }).sort("created_at", -1)
    
    meals = await cursor.to_list(length=50)
    for meal in meals:
        meal["id"] = str(meal.pop("_id"))
    
    return meals


@router.post("/", status_code=201)
async def log_meal(meal: MealCreate, current_user: dict = Depends(get_current_user)):
    """Log a new meal."""
    db = get_db()
    today = date.today().isoformat()
    
    meal_doc = {
        **meal.dict(),
        "user_id": str(current_user["_id"]),
        "date": today,
        "created_at": datetime.utcnow(),
    }
    
    result = await db.meals.insert_one(meal_doc)
    
    # Update daily progress
    await db.daily_progress.update_one(
        {"user_id": str(current_user["_id"]), "date": today},
        {
            "$inc": {
                "calories_consumed": meal.calories,
                "protein_consumed": meal.protein,
                "carbs_consumed": meal.carbs,
                "fats_consumed": meal.fats,
            },
            "$setOnInsert": {"created_at": datetime.utcnow()},
            "$set": {"updated_at": datetime.utcnow()},
        },
        upsert=True
    )
    
    logger.info(f"Meal logged: {meal.food_name} for user {current_user['email']}")
    return {"id": str(result.inserted_id), "message": "Meal logged successfully"}


@router.delete("/{meal_id}")
async def delete_meal(meal_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a logged meal."""
    db = get_db()
    from bson import ObjectId
    today = date.today().isoformat()
    
    meal = await db.meals.find_one({
        "_id": ObjectId(meal_id),
        "user_id": str(current_user["_id"])
    })
    
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    await db.meals.delete_one({"_id": ObjectId(meal_id)})
    
    # Update daily progress
    await db.daily_progress.update_one(
        {"user_id": str(current_user["_id"]), "date": today},
        {
            "$inc": {
                "calories_consumed": -meal["calories"],
                "protein_consumed": -meal["protein"],
                "carbs_consumed": -meal["carbs"],
                "fats_consumed": -meal["fats"],
            }
        }
    )
    
    return {"message": "Meal deleted successfully"}
