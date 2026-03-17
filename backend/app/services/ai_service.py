"""
FitBite AI - AI Service
OpenAI Vision API integration for food recognition
"""
import openai
import base64
import json
import logging
from typing import Optional, Dict, Any

from app.config import settings

logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


FOOD_ANALYSIS_PROMPT = """
You are an expert Indian food nutritionist and AI food recognition system.

Analyze this food image and provide detailed information in JSON format.

Respond with ONLY valid JSON in this exact format:
{
  "food_name": "Name of the Indian food dish",
  "food_type": "solid" or "liquid",
  "estimated_portion_grams": estimated weight in grams (number),
  "confidence": confidence score 0.0 to 1.0,
  "calories_per_100g": estimated calories per 100g,
  "protein_per_100g": protein in grams per 100g,
  "carbs_per_100g": carbs in grams per 100g,
  "fats_per_100g": fats in grams per 100g,
  "health_benefits": ["benefit1", "benefit2", "benefit3"],
  "disadvantages": ["consideration1", "consideration2"],
  "digestion_time": "estimated digestion time as string",
  "category": "food category (e.g., South Indian, North Indian, Beverages)"
}

Focus on common Indian foods like idli, dosa, biryani, dal, chapati, etc.
Be accurate with portion estimation based on visual cues.
All nutritional values should be per 100g of the food.
"""


async def analyze_food_image(image_base64: str, user_context: Optional[Dict] = None) -> Dict[str, Any]:
    """
    Analyze food image using OpenAI Vision API.
    
    Args:
        image_base64: Base64 encoded image string
        user_context: Optional user profile for personalized analysis
    
    Returns:
        Dict containing food analysis results
    """
    try:
        # Prepare the image for OpenAI
        image_url = f"data:image/jpeg;base64,{image_base64}"
        
        response = await client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": FOOD_ANALYSIS_PROMPT
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_url,
                                "detail": "high"
                            }
                        }
                    ]
                }
            ],
            max_tokens=settings.OPENAI_MAX_TOKENS,
            response_format={"type": "json_object"}
        )
        
        result_text = response.choices[0].message.content
        result = json.loads(result_text)
        
        logger.info(f"AI food analysis completed: {result.get('food_name', 'Unknown')}")
        return result
        
    except openai.RateLimitError:
        logger.error("OpenAI rate limit exceeded")
        raise Exception("AI service temporarily unavailable. Please try again.")
    except openai.InvalidRequestError as e:
        logger.error(f"Invalid OpenAI request: {e}")
        raise Exception("Invalid image format or content.")
    except json.JSONDecodeError:
        logger.error("Failed to parse AI response as JSON")
        raise Exception("AI analysis failed. Please try again.")
    except Exception as e:
        logger.error(f"AI service error: {e}")
        raise Exception(f"AI analysis error: {str(e)}")


async def get_food_recommendations(user_profile: Dict, recent_meals: list) -> str:
    """
    Get personalized food recommendations based on user profile.
    
    Args:
        user_profile: User's profile with fitness goals
        recent_meals: List of recently logged meals
    
    Returns:
        Personalized recommendation string
    """
    try:
        prompt = f"""
        Based on this user profile and recent meals, provide a brief personalized nutrition tip.
        
        User Profile:
        - Goal: {user_profile.get('fitness_goal')}
        - Daily Calorie Goal: {user_profile.get('daily_calorie_goal')} kcal
        - Protein Target: {user_profile.get('daily_protein_target')}g
        - Activity Level: {user_profile.get('activity_level')}
        - Diet Type: {user_profile.get('diet_type')}
        
        Recent Meals: {json.dumps(recent_meals[-5:] if recent_meals else [])}
        
        Provide a single, actionable nutrition tip in 2-3 sentences. Be specific to Indian food culture.
        Focus on their {user_profile.get('fitness_goal')} goal.
        """
        
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )
        
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Recommendation error: {e}")
        return "Stay hydrated and aim for balanced meals throughout the day! 💪"
