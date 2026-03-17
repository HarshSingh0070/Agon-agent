"""
FitBite AI - User Model
MongoDB document schema for users
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    height: float = Field(..., gt=100, lt=250, description="Height in cm")
    weight: float = Field(..., gt=20, lt=300, description="Weight in kg")
    age: int = Field(..., gt=10, lt=120)
    gender: Literal["male", "female"]
    diet_type: Literal["veg", "nonveg", "both"]
    fitness_goal: Literal["weight_loss", "fat_loss", "muscle_gain", "maintain"]
    activity_level: Literal["sedentary", "walker", "gym"]


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    name: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    age: Optional[int] = None
    gender: Optional[Literal["male", "female"]] = None
    diet_type: Optional[Literal["veg", "nonveg", "both"]] = None
    fitness_goal: Optional[Literal["weight_loss", "fat_loss", "muscle_gain", "maintain"]] = None
    activity_level: Optional[Literal["sedentary", "walker", "gym"]] = None
    expo_push_token: Optional[str] = None


class UserInDB(UserBase):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    hashed_password: str
    bmi: Optional[float] = None
    bmr: Optional[float] = None
    tdee: Optional[float] = None
    daily_calorie_goal: Optional[float] = None
    daily_protein_target: Optional[float] = None
    daily_water_intake: Optional[float] = None
    daily_step_goal: Optional[int] = None
    expo_push_token: Optional[str] = None
    is_active: bool = True
    is_onboarded: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    height: float
    weight: float
    age: int
    gender: str
    diet_type: str
    fitness_goal: str
    activity_level: str
    bmi: Optional[float]
    bmr: Optional[float]
    tdee: Optional[float]
    daily_calorie_goal: Optional[float]
    daily_protein_target: Optional[float]
    daily_water_intake: Optional[float]
    daily_step_goal: Optional[int]
    is_onboarded: bool
    created_at: datetime
