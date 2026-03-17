"""
FitBite AI - Database Seeder
Seeds the MongoDB database with initial Indian food data

Usage:
    python -m scripts.seed_foods
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

MONGODB_URL = "mongodb://localhost:27017"
DB_NAME = "fitbite_ai"

INDIAN_FOODS = [
    {
        "name": "Idli",
        "category": "South Indian",
        "food_type": "solid",
        "calories_per_100g": 39,
        "protein": 2.0,
        "carbs": 7.9,
        "fats": 0.1,
        "fiber": 0.5,
        "digestion_time": "1.5-2 hours",
        "emoji": "🫓",
        "benefits": ["Low calorie", "Fermented - good for gut", "Gluten-free", "Easy to digest"],
        "disadvantages": ["Low protein", "High glycemic index"],
        "tags": ["veg", "breakfast", "low-calorie", "south-indian"],
        "is_verified": True,
    },
    {
        "name": "Dosa",
        "category": "South Indian",
        "food_type": "solid",
        "calories_per_100g": 133,
        "protein": 3.5,
        "carbs": 26.0,
        "fats": 1.5,
        "fiber": 0.8,
        "digestion_time": "2-2.5 hours",
        "emoji": "🫔",
        "benefits": ["Fermented food", "Rich in carbs for energy", "Good for gut health"],
        "disadvantages": ["High in carbs", "Can be oily if excess oil used"],
        "tags": ["veg", "breakfast", "south-indian"],
        "is_verified": True,
    },
    {
        "name": "Dal",
        "category": "North Indian",
        "food_type": "liquid",
        "calories_per_100g": 116,
        "protein": 9.0,
        "carbs": 20.0,
        "fats": 0.4,
        "fiber": 7.6,
        "digestion_time": "2-3 hours",
        "emoji": "🫕",
        "benefits": ["High plant protein", "Rich in fiber", "Iron source", "Heart healthy"],
        "disadvantages": ["Can cause bloating", "Moderate glycemic index"],
        "tags": ["veg", "high-protein", "north-indian", "lunch"],
        "is_verified": True,
    },
    {
        "name": "Chapati",
        "category": "North Indian",
        "food_type": "solid",
        "calories_per_100g": 297,
        "protein": 9.0,
        "carbs": 60.0,
        "fats": 3.7,
        "fiber": 3.9,
        "digestion_time": "2-3 hours",
        "emoji": "🫓",
        "benefits": ["Whole wheat - fiber rich", "Complex carbs", "Good energy source"],
        "disadvantages": ["High in carbs", "Moderate glycemic index"],
        "tags": ["veg", "north-indian", "lunch", "dinner"],
        "is_verified": True,
    },
    {
        "name": "Biryani",
        "category": "Mughlai",
        "food_type": "solid",
        "calories_per_100g": 200,
        "protein": 8.0,
        "carbs": 30.0,
        "fats": 6.0,
        "fiber": 1.0,
        "digestion_time": "4-5 hours",
        "emoji": "🍛",
        "benefits": ["Complete meal", "Rich in spices", "Protein from meat/paneer"],
        "disadvantages": ["Very high calorie", "High carbs", "Slow to digest"],
        "tags": ["both", "mughlai", "dinner", "high-calorie"],
        "is_verified": True,
    },
    {
        "name": "Tandoori Chicken",
        "category": "North Indian",
        "food_type": "solid",
        "calories_per_100g": 165,
        "protein": 25.0,
        "carbs": 3.0,
        "fats": 6.0,
        "fiber": 0.3,
        "digestion_time": "3-4 hours",
        "emoji": "🍗",
        "benefits": ["Very high protein", "Low carb", "Grilled not fried", "Muscle building"],
        "disadvantages": ["High sodium from marinade"],
        "tags": ["nonveg", "north-indian", "high-protein", "low-carb"],
        "is_verified": True,
    },
]


async def seed_database():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]

    print("Seeding Indian food database...")
    inserted = 0
    skipped = 0

    for food in INDIAN_FOODS:
        existing = await db.food_items.find_one({"name": food["name"]})
        if existing:
            print(f"  Skipping {food['name']} (already exists)")
            skipped += 1
            continue

        food["created_at"] = datetime.utcnow()
        food["updated_at"] = datetime.utcnow()
        await db.food_items.insert_one(food)
        print(f"  Inserted: {food['name']}")
        inserted += 1

    print(f"\nSeeding complete: {inserted} inserted, {skipped} skipped")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
