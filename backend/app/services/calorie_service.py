"""
FitBite AI - Calorie Calculation Service
BMI, BMR, TDEE, and macro calculations
"""
from typing import Dict, Tuple


def calculate_bmi(weight_kg: float, height_cm: float) -> float:
    """Calculate BMI."""
    height_m = height_cm / 100
    return round(weight_kg / (height_m ** 2), 1)


def get_bmi_category(bmi: float) -> str:
    """Get BMI category."""
    if bmi < 18.5:
        return "Underweight"
    elif bmi < 25:
        return "Normal"
    elif bmi < 30:
        return "Overweight"
    else:
        return "Obese"


def calculate_bmr(weight_kg: float, height_cm: float, age: int, gender: str) -> float:
    """
    Calculate BMR using Mifflin-St Jeor Formula.
    Male: BMR = 10W + 6.25H - 5A + 5
    Female: BMR = 10W + 6.25H - 5A - 161
    """
    base = 10 * weight_kg + 6.25 * height_cm - 5 * age
    if gender == "male":
        return round(base + 5)
    else:
        return round(base - 161)


def calculate_tdee(bmr: float, activity_level: str) -> float:
    """
    Calculate TDEE (Total Daily Energy Expenditure).
    Activity multipliers:
    - Sedentary: 1.2 (desk job, little exercise)
    - Walker: 1.375 (light exercise 1-3 days/week)
    - Gym: 1.55 (moderate exercise 3-5 days/week)
    """
    multipliers = {
        "sedentary": 1.2,
        "walker": 1.375,
        "gym": 1.55,
    }
    multiplier = multipliers.get(activity_level, 1.2)
    return round(bmr * multiplier)


def calculate_daily_calorie_goal(tdee: float, fitness_goal: str) -> float:
    """Calculate daily calorie goal based on fitness goal."""
    adjustments = {
        "weight_loss": -500,   # 0.5kg/week loss
        "fat_loss": -300,      # Moderate deficit
        "muscle_gain": +300,   # Caloric surplus
        "maintain": 0,         # No adjustment
    }
    adjustment = adjustments.get(fitness_goal, 0)
    return max(1200, tdee + adjustment)  # Minimum 1200 kcal


def calculate_protein_target(weight_kg: float, fitness_goal: str) -> float:
    """Calculate daily protein target in grams."""
    multipliers = {
        "weight_loss": 2.0,    # Higher protein to preserve muscle
        "fat_loss": 2.2,       # High protein for fat loss
        "muscle_gain": 2.5,    # Maximum protein for muscle building
        "maintain": 1.6,       # Moderate protein maintenance
    }
    multiplier = multipliers.get(fitness_goal, 1.6)
    return round(weight_kg * multiplier)


def calculate_water_intake(weight_kg: float, activity_level: str) -> float:
    """Calculate daily water intake in liters."""
    base_liters = weight_kg * 0.033
    activity_bonus = {
        "sedentary": 0,
        "walker": 0.5,
        "gym": 1.0,
    }
    bonus = activity_bonus.get(activity_level, 0)
    return round(base_liters + bonus, 1)


def calculate_step_goal(activity_level: str, fitness_goal: str) -> int:
    """Calculate daily step goal."""
    base_steps = {
        "sedentary": 7000,
        "walker": 10000,
        "gym": 12000,
    }
    goal_bonus = {
        "weight_loss": 2000,
        "fat_loss": 2000,
        "muscle_gain": 0,
        "maintain": 0,
    }
    return base_steps.get(activity_level, 7000) + goal_bonus.get(fitness_goal, 0)


def calculate_food_macros(calories_per_100g: float, protein_per_100g: float,
                          carbs_per_100g: float, fats_per_100g: float,
                          fiber_per_100g: float, portion_grams: float) -> Dict:
    """Calculate macros for a given portion size."""
    ratio = portion_grams / 100
    return {
        "calories": round(calories_per_100g * ratio),
        "protein": round(protein_per_100g * ratio, 1),
        "carbs": round(carbs_per_100g * ratio, 1),
        "fats": round(fats_per_100g * ratio, 1),
        "fiber": round(fiber_per_100g * ratio, 1),
    }


def compute_full_user_stats(weight_kg: float, height_cm: float, age: int,
                             gender: str, activity_level: str, fitness_goal: str) -> Dict:
    """Compute all user health stats."""
    bmi = calculate_bmi(weight_kg, height_cm)
    bmr = calculate_bmr(weight_kg, height_cm, age, gender)
    tdee = calculate_tdee(bmr, activity_level)
    daily_calorie_goal = calculate_daily_calorie_goal(tdee, fitness_goal)
    daily_protein_target = calculate_protein_target(weight_kg, fitness_goal)
    daily_water_intake = calculate_water_intake(weight_kg, activity_level)
    daily_step_goal = calculate_step_goal(activity_level, fitness_goal)

    return {
        "bmi": bmi,
        "bmi_category": get_bmi_category(bmi),
        "bmr": bmr,
        "tdee": tdee,
        "daily_calorie_goal": daily_calorie_goal,
        "daily_protein_target": daily_protein_target,
        "daily_water_intake": daily_water_intake,
        "daily_step_goal": daily_step_goal,
    }
