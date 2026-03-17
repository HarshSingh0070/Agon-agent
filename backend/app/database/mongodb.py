"""
FitBite AI - MongoDB Connection
Async MongoDB client using Motor
"""
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import IndexModel, ASCENDING, DESCENDING
import logging

from app.config import settings

logger = logging.getLogger(__name__)


class MongoDB:
    client: AsyncIOMotorClient = None
    db = None


db_instance = MongoDB()


async def connect_to_mongo():
    """Create MongoDB connection and ensure indexes."""
    db_instance.client = AsyncIOMotorClient(settings.MONGODB_URL)
    db_instance.db = db_instance.client[settings.MONGODB_DB_NAME]
    await create_indexes()
    logger.info(f"Connected to MongoDB: {settings.MONGODB_DB_NAME}")


async def close_mongo_connection():
    """Close MongoDB connection."""
    if db_instance.client:
        db_instance.client.close()
        logger.info("MongoDB connection closed")


async def create_indexes():
    """Create database indexes for performance."""
    db = db_instance.db

    # Users collection indexes
    await db.users.create_indexes([
        IndexModel([("email", ASCENDING)], unique=True),
        IndexModel([("created_at", DESCENDING)]),
    ])

    # Food items collection indexes
    await db.food_items.create_indexes([
        IndexModel([("name", ASCENDING)], unique=True),
        IndexModel([("category", ASCENDING)]),
        IndexModel([("tags", ASCENDING)]),
        IndexModel([("name", "text"), ("category", "text"), ("tags", "text")]),
    ])

    # Meals collection indexes
    await db.meals.create_indexes([
        IndexModel([("user_id", ASCENDING), ("date", DESCENDING)]),
        IndexModel([("created_at", DESCENDING)]),
    ])

    # Daily progress collection indexes
    await db.daily_progress.create_indexes([
        IndexModel([("user_id", ASCENDING), ("date", ASCENDING)], unique=True),
    ])

    # Notifications collection indexes
    await db.notifications.create_indexes([
        IndexModel([("user_id", ASCENDING), ("created_at", DESCENDING)]),
        IndexModel([("is_read", ASCENDING)]),
    ])

    logger.info("Database indexes created")


def get_db():
    """Get database instance."""
    return db_instance.db
