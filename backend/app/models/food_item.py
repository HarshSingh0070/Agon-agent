"""
FitBite AI - Food Item Model
MongoDB schema for Indian food database
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime
from bson import ObjectId


class FoodItemBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    category: str
    food_type: Literal["solid", "liquid"]
    calories_per_100g: float = Field(..., gt=0)
    protein: float = Field(..., ge=0)
    carbs: float = Field(..., ge=0)
    fats: float = Field(..., ge=0)
    fiber: float = Field(0, ge=0)
    digestion_time: str
    emoji: str = "🍽️"
    benefits: List[str] = []
    disadvantages: List[str] = []
    tags: List[str] = []
    is_verified: bool = True


class FoodItemCreate(FoodItemBase):
    pass


class FoodItemInDB(FoodItemBase):
    id: Optional[str] = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class FoodItemResponse(FoodItemBase):
    id: str
    created_at: datetime


class FoodAnalysisRequest(BaseModel):
    food_name: Optional[str] = None
    portion_grams: float = Field(150, gt=0, lt=2000)
    image_base64: Optional[str] = None  # Base64 encoded image


class FoodAnalysisResponse(BaseModel):
    detected_food: FoodItemResponse
    portion_grams: float
    calories: float
    protein: float
    carbs: float
    fats: float
    fiber: float
    confidence: float
    is_ai_estimated: bool = True
    health_benefits: List[str]
    disadvantages: List[str]
    suitability_message: str
    suitability_score: int  # 1-5
    alternative_suggestion: Optional[str]
    meal_type: str
    ai_note: str = "All calorie values are AI-generated estimates and should not replace professional medical advice."
