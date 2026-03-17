"""
FitBite AI - Food Routes
Food database and AI analysis endpoints
"""
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from typing import List, Optional
import base64
import logging

from app.database.mongodb import get_db
from app.models.food_item import FoodItemResponse, FoodAnalysisRequest, FoodAnalysisResponse
from app.services.ai_service import analyze_food_image
from app.services.calorie_service import calculate_food_macros
from app.routers.auth import get_current_user
from app.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/", response_model=List[dict])
async def list_foods(
    category: Optional[str] = None,
    food_type: Optional[str] = None,
    limit: int = 50,
    skip: int = 0,
):
    """List all food items with optional filtering."""
    db = get_db()
    query = {}
    if category:
        query["category"] = category
    if food_type:
        query["food_type"] = food_type
    
    cursor = db.food_items.find(query).skip(skip).limit(limit)
    foods = await cursor.to_list(length=limit)
    
    for food in foods:
        food["id"] = str(food.pop("_id"))
    
    return foods


@router.get("/search")
async def search_foods(q: str, limit: int = 20):
    """Search foods by name, category, or tags."""
    db = get_db()
    
    cursor = db.food_items.find(
        {"$text": {"$search": q}},
        {"score": {"$meta": "textScore"}}
    ).sort([("score", {"$meta": "textScore"})]).limit(limit)
    
    foods = await cursor.to_list(length=limit)
    for food in foods:
        food["id"] = str(food.pop("_id"))
    
    return foods


@router.get("/{food_id}")
async def get_food(food_id: str):
    """Get a specific food item by ID."""
    db = get_db()
    from bson import ObjectId
    
    food = await db.food_items.find_one({"_id": ObjectId(food_id)})
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    
    food["id"] = str(food.pop("_id"))
    return food


@router.post("/analyze")
async def analyze_food(
    image: Optional[UploadFile] = File(None),
    food_name: Optional[str] = Form(None),
    portion_grams: float = Form(150),
    current_user: dict = Depends(get_current_user)
):
    """
    AI-powered food analysis.
    Accepts either an image upload or a food name for database lookup.
    """
    db = get_db()
    
    if image:
        # Validate image
        if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail="Invalid image format. Use JPEG, PNG, or WebP.")
        
        image_bytes = await image.read()
        if len(image_bytes) > settings.MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="Image too large. Max 10MB.")
        
        image_base64 = base64.b64encode(image_bytes).decode()
        
        # Call OpenAI Vision API
        ai_result = await analyze_food_image(image_base64, user_context={
            "fitness_goal": current_user.get("fitness_goal"),
            "diet_type": current_user.get("diet_type"),
        })
        
        detected_name = ai_result.get("food_name", "Unknown Food")
        
        # Try to find in database
        food_item = await db.food_items.find_one(
            {"name": {"$regex": detected_name, "$options": "i"}}
        )
        
        if food_item:
            # Use database values (more accurate)
            macros = calculate_food_macros(
                food_item["calories_per_100g"], food_item["protein"],
                food_item["carbs"], food_item["fats"], food_item.get("fiber", 0),
                portion_grams
            )
        else:
            # Use AI-estimated values
            macros = calculate_food_macros(
                ai_result.get("calories_per_100g", 150),
                ai_result.get("protein_per_100g", 5),
                ai_result.get("carbs_per_100g", 25),
                ai_result.get("fats_per_100g", 4),
                ai_result.get("fiber_per_100g", 2),
                portion_grams
            )
            
            food_item = {
                "_id": "ai_estimated",
                "name": detected_name,
                "category": ai_result.get("category", "Custom"),
                "food_type": ai_result.get("food_type", "solid"),
                "calories_per_100g": ai_result.get("calories_per_100g", 150),
                "protein": ai_result.get("protein_per_100g", 5),
                "carbs": ai_result.get("carbs_per_100g", 25),
                "fats": ai_result.get("fats_per_100g", 4),
                "fiber": ai_result.get("fiber_per_100g", 2),
                "digestion_time": ai_result.get("digestion_time", "2-3 hours"),
                "emoji": "🍽️",
                "benefits": ai_result.get("health_benefits", []),
                "disadvantages": ai_result.get("disadvantages", []),
                "tags": [],
            }
        
        confidence = ai_result.get("confidence", 0.85)
        
    elif food_name:
        # Database lookup by name
        food_item = await db.food_items.find_one(
            {"name": {"$regex": food_name, "$options": "i"}}
        )
        if not food_item:
            raise HTTPException(status_code=404, detail=f"Food '{food_name}' not found in database")
        
        macros = calculate_food_macros(
            food_item["calories_per_100g"], food_item["protein"],
            food_item["carbs"], food_item["fats"], food_item.get("fiber", 0),
            portion_grams
        )
        confidence = 0.95  # High confidence for database lookup
    else:
        raise HTTPException(status_code=400, detail="Provide either an image or food_name")
    
    food_item["id"] = str(food_item.pop("_id", "unknown"))
    
    return {
        "detected_food": food_item,
        "portion_grams": portion_grams,
        **macros,
        "confidence": confidence,
        "is_ai_estimated": True,
        "health_benefits": food_item.get("benefits", []),
        "disadvantages": food_item.get("disadvantages", []),
        "suitability_message": "Analysis complete. Review nutritional data.",
        "suitability_score": 3,
        "alternative_suggestion": None,
        "meal_type": "Meal",
        "ai_note": "All calorie values are AI-generated estimates and should not replace professional medical advice."
    }
