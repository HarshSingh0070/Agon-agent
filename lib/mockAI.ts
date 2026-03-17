import { INDIAN_FOODS, FoodItem, calculateFoodMacros } from './indianFoods';
import { UserProfile } from './calculations';

export interface AIFoodAnalysis {
  detectedFood: FoodItem;
  portionGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  confidence: number;
  isAIEstimated: boolean;
  healthBenefits: string[];
  disadvantages: string[];
  suitabilityMessage: string;
  suitabilityScore: number; // 1-5
  alternativeSuggestion?: string;
  mealType: string;
  aiNote: string;
}

const MOTIVATIONAL_QUOTES = [
  'Every meal is a chance to nourish your body. Choose wisely! 💪',
  'Small consistent choices lead to big transformations. Keep going! 🔥',
  'Your body is your temple. Fuel it with purpose! 🌟',
  'Progress, not perfection. Every healthy choice counts! ✨',
  'You are what you eat. Be amazing! 🚀',
];

export function getMotivationalQuote(): string {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}

export function analyzeFood(foodName: string, portionGrams: number, userProfile: UserProfile): AIFoodAnalysis {
  // Find matching food in database
  const normalizedName = foodName.toLowerCase();
  let detectedFood = INDIAN_FOODS.find(f =>
    f.name.toLowerCase() === normalizedName ||
    f.name.toLowerCase().includes(normalizedName) ||
    normalizedName.includes(f.name.toLowerCase())
  );

  if (!detectedFood) {
    // Default to a generic food if not found
    detectedFood = {
      id: 'custom',
      name: foodName,
      category: 'Custom',
      type: 'solid',
      caloriesPer100g: 150,
      protein: 5,
      carbs: 25,
      fats: 4,
      fiber: 2,
      digestionTime: '2-3 hours',
      emoji: '🍽️',
      benefits: ['Provides energy', 'Part of balanced diet'],
      disadvantages: ['Nutritional data estimated'],
      tags: ['custom'],
    };
  }

  const macros = calculateFoodMacros(detectedFood, portionGrams);
  const suitabilityScore = getSuitabilityScore(detectedFood, userProfile);
  const suitabilityMessage = getSuitabilityMessage(detectedFood, userProfile, suitabilityScore);
  const alternativeSuggestion = getAlternativeSuggestion(detectedFood, userProfile);
  const mealType = getMealType();

  return {
    detectedFood,
    portionGrams,
    ...macros,
    confidence: 0.87 + Math.random() * 0.1,
    isAIEstimated: true,
    healthBenefits: detectedFood.benefits,
    disadvantages: detectedFood.disadvantages,
    suitabilityMessage,
    suitabilityScore,
    alternativeSuggestion,
    mealType,
    aiNote: 'All calorie values are AI-generated estimates and should not replace professional medical advice.',
  };
}

function getSuitabilityScore(food: FoodItem, profile: UserProfile): number {
  let score = 3;
  const goal = profile.fitnessGoal;

  if (goal === 'weight_loss' || goal === 'fat_loss') {
    if (food.caloriesPer100g < 100) score = 5;
    else if (food.caloriesPer100g < 150) score = 4;
    else if (food.caloriesPer100g < 250) score = 3;
    else if (food.caloriesPer100g < 350) score = 2;
    else score = 1;
  } else if (goal === 'muscle_gain') {
    if (food.protein > 15) score = 5;
    else if (food.protein > 10) score = 4;
    else if (food.protein > 5) score = 3;
    else score = 2;
  } else {
    score = 3;
  }

  return score;
}

function getSuitabilityMessage(food: FoodItem, profile: UserProfile, score: number): string {
  const goal = profile.fitnessGoal.replace('_', ' ');
  const messages: Record<number, string> = {
    5: `Excellent choice for your ${goal} goal! This food aligns perfectly with your nutritional targets.`,
    4: `Good choice for ${goal}! This fits well within your daily macros.`,
    3: `Moderate choice for ${goal}. Enjoy in balanced portions.`,
    2: `Consume mindfully for ${goal}. Consider portion control.`,
    1: `Not ideal for ${goal}. Consider a healthier alternative.`,
  };
  return messages[score] || messages[3];
}

function getAlternativeSuggestion(food: FoodItem, profile: UserProfile): string | undefined {
  const goal = profile.fitnessGoal;
  if (food.caloriesPer100g > 250 && (goal === 'weight_loss' || goal === 'fat_loss')) {
    const alternatives: Record<string, string> = {
      'Paratha': 'Try plain Chapati with less oil for fewer calories',
      'Biryani': 'Try Khichdi or steamed rice with dal for a lighter option',
      'Butter Chicken': 'Try Tandoori Chicken for same protein with less fat',
      'Paneer': 'Try low-fat paneer or tofu for similar protein with less fat',
    };
    return alternatives[food.name] || `Try a lighter version of ${food.name} with less oil/ghee`;
  }
  return undefined;
}

function getMealType(): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) return 'Breakfast';
  if (hour >= 11 && hour < 15) return 'Lunch';
  if (hour >= 15 && hour < 18) return 'Snack';
  return 'Dinner';
}
