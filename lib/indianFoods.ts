export interface FoodItem {
  id: string;
  name: string;
  category: string;
  type: 'solid' | 'liquid';
  caloriesPer100g: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  digestionTime: string;
  emoji: string;
  benefits: string[];
  disadvantages: string[];
  tags: string[];
}

export const INDIAN_FOODS: FoodItem[] = [
  {
    id: '1', name: 'Idli', category: 'South Indian', type: 'solid',
    caloriesPer100g: 39, protein: 2.0, carbs: 7.9, fats: 0.1, fiber: 0.5,
    digestionTime: '1.5-2 hours', emoji: '🫓',
    benefits: ['Low calorie', 'Fermented - good for gut', 'Gluten-free', 'Easy to digest'],
    disadvantages: ['Low protein', 'High glycemic index'],
    tags: ['veg', 'breakfast', 'low-calorie', 'south-indian'],
  },
  {
    id: '2', name: 'Dosa', category: 'South Indian', type: 'solid',
    caloriesPer100g: 133, protein: 3.5, carbs: 26.0, fats: 1.5, fiber: 0.8,
    digestionTime: '2-2.5 hours', emoji: '🫔',
    benefits: ['Fermented food', 'Rich in carbs for energy', 'Good for gut health'],
    disadvantages: ['High in carbs', 'Can be oily if prepared with excess oil'],
    tags: ['veg', 'breakfast', 'south-indian'],
  },
  {
    id: '3', name: 'Upma', category: 'South Indian', type: 'solid',
    caloriesPer100g: 150, protein: 4.0, carbs: 22.0, fats: 5.0, fiber: 1.5,
    digestionTime: '2 hours', emoji: '🍚',
    benefits: ['Good source of fiber', 'Filling', 'Vitamins from vegetables'],
    disadvantages: ['Moderate calorie', 'Semolina is refined grain'],
    tags: ['veg', 'breakfast', 'south-indian'],
  },
  {
    id: '4', name: 'Sambar', category: 'South Indian', type: 'liquid',
    caloriesPer100g: 60, protein: 3.5, carbs: 8.0, fats: 1.5, fiber: 2.0,
    digestionTime: '1.5 hours', emoji: '🍲',
    benefits: ['High in protein from lentils', 'Rich in vegetables', 'Anti-inflammatory spices'],
    disadvantages: ['Can be high in sodium'],
    tags: ['veg', 'lunch', 'south-indian', 'high-protein'],
  },
  {
    id: '5', name: 'Rasam', category: 'South Indian', type: 'liquid',
    caloriesPer100g: 30, protein: 1.5, carbs: 5.0, fats: 0.5, fiber: 0.5,
    digestionTime: '1 hour', emoji: '🍵',
    benefits: ['Digestive aid', 'Immunity booster', 'Very low calorie'],
    disadvantages: ['Very low protein', 'High sodium'],
    tags: ['veg', 'lunch', 'south-indian', 'low-calorie'],
  },
  {
    id: '6', name: 'Paneer', category: 'North Indian', type: 'solid',
    caloriesPer100g: 265, protein: 18.3, carbs: 1.2, fats: 20.8, fiber: 0.0,
    digestionTime: '3-4 hours', emoji: '🧀',
    benefits: ['High protein', 'Rich in calcium', 'Good for muscle building', 'Keto-friendly'],
    disadvantages: ['High in saturated fats', 'High calorie'],
    tags: ['veg', 'high-protein', 'north-indian'],
  },
  {
    id: '7', name: 'Dal', category: 'North Indian', type: 'liquid',
    caloriesPer100g: 116, protein: 9.0, carbs: 20.0, fats: 0.4, fiber: 7.6,
    digestionTime: '2-3 hours', emoji: '🫕',
    benefits: ['High in plant protein', 'Rich in fiber', 'Iron source', 'Heart healthy'],
    disadvantages: ['Can cause bloating', 'Moderate glycemic index'],
    tags: ['veg', 'high-protein', 'north-indian', 'lunch'],
  },
  {
    id: '8', name: 'Chapati', category: 'North Indian', type: 'solid',
    caloriesPer100g: 297, protein: 9.0, carbs: 60.0, fats: 3.7, fiber: 3.9,
    digestionTime: '2-3 hours', emoji: '🫓',
    benefits: ['Whole wheat - fiber rich', 'Complex carbs', 'Good energy source'],
    disadvantages: ['High in carbs', 'Moderate glycemic index'],
    tags: ['veg', 'north-indian', 'lunch', 'dinner'],
  },
  {
    id: '9', name: 'Paratha', category: 'North Indian', type: 'solid',
    caloriesPer100g: 326, protein: 8.0, carbs: 52.0, fats: 10.0, fiber: 3.0,
    digestionTime: '3 hours', emoji: '🫔',
    benefits: ['Filling', 'Good energy', 'Can be stuffed with vegetables'],
    disadvantages: ['High calorie', 'High fat if made with butter/ghee'],
    tags: ['veg', 'north-indian', 'breakfast'],
  },
  {
    id: '10', name: 'Butter Chicken', category: 'North Indian', type: 'solid',
    caloriesPer100g: 150, protein: 12.0, carbs: 6.0, fats: 9.0, fiber: 0.5,
    digestionTime: '3-4 hours', emoji: '🍗',
    benefits: ['High protein', 'Rich in spices', 'Good for muscle building'],
    disadvantages: ['High in saturated fats', 'High calorie from cream/butter'],
    tags: ['nonveg', 'north-indian', 'high-protein', 'dinner'],
  },
  {
    id: '11', name: 'Biryani', category: 'Mughlai', type: 'solid',
    caloriesPer100g: 200, protein: 8.0, carbs: 30.0, fats: 6.0, fiber: 1.0,
    digestionTime: '4-5 hours', emoji: '🍛',
    benefits: ['Complete meal', 'Rich in spices', 'Protein from meat/paneer'],
    disadvantages: ['Very high calorie', 'High carbs', 'Slow to digest'],
    tags: ['both', 'mughlai', 'dinner', 'high-calorie'],
  },
  {
    id: '12', name: 'Rajma', category: 'North Indian', type: 'solid',
    caloriesPer100g: 127, protein: 8.7, carbs: 22.0, fats: 0.5, fiber: 6.4,
    digestionTime: '3-4 hours', emoji: '🫘',
    benefits: ['High plant protein', 'Rich in fiber', 'Iron and potassium', 'Heart healthy'],
    disadvantages: ['Can cause bloating', 'Slow digestion'],
    tags: ['veg', 'north-indian', 'high-protein', 'lunch'],
  },
  {
    id: '13', name: 'Chole', category: 'North Indian', type: 'solid',
    caloriesPer100g: 164, protein: 9.0, carbs: 27.0, fats: 2.6, fiber: 7.6,
    digestionTime: '3-4 hours', emoji: '🫘',
    benefits: ['High protein', 'Rich in fiber', 'Low GI', 'Iron rich'],
    disadvantages: ['Can cause gas', 'High in carbs'],
    tags: ['veg', 'north-indian', 'high-protein', 'lunch'],
  },
  {
    id: '14', name: 'Tandoori Chicken', category: 'North Indian', type: 'solid',
    caloriesPer100g: 165, protein: 25.0, carbs: 3.0, fats: 6.0, fiber: 0.3,
    digestionTime: '3-4 hours', emoji: '🍗',
    benefits: ['Very high protein', 'Low carb', 'Grilled not fried', 'Muscle building'],
    disadvantages: ['High sodium from marinade'],
    tags: ['nonveg', 'north-indian', 'high-protein', 'low-carb'],
  },
  {
    id: '15', name: 'Fish Curry', category: 'Coastal', type: 'solid',
    caloriesPer100g: 130, protein: 18.0, carbs: 5.0, fats: 5.0, fiber: 0.5,
    digestionTime: '2.5-3 hours', emoji: '🐟',
    benefits: ['High protein', 'Omega-3 fatty acids', 'Heart healthy', 'Brain health'],
    disadvantages: ['High sodium', 'Possible allergen'],
    tags: ['nonveg', 'coastal', 'high-protein', 'omega3'],
  },
  {
    id: '16', name: 'Lassi', category: 'Beverages', type: 'liquid',
    caloriesPer100g: 70, protein: 3.5, carbs: 9.0, fats: 2.0, fiber: 0.0,
    digestionTime: '1-1.5 hours', emoji: '🥛',
    benefits: ['Probiotic', 'Cooling effect', 'Calcium rich', 'Good for digestion'],
    disadvantages: ['High sugar if sweetened', 'Moderate calorie'],
    tags: ['veg', 'beverage', 'probiotic'],
  },
  {
    id: '17', name: 'Buttermilk', category: 'Beverages', type: 'liquid',
    caloriesPer100g: 40, protein: 3.3, carbs: 4.8, fats: 0.9, fiber: 0.0,
    digestionTime: '1 hour', emoji: '🥛',
    benefits: ['Very low calorie', 'Probiotic', 'Cooling', 'Digestive aid'],
    disadvantages: ['Low protein overall', 'High sodium if salted'],
    tags: ['veg', 'beverage', 'low-calorie', 'probiotic'],
  },
  {
    id: '18', name: 'Milk', category: 'Beverages', type: 'liquid',
    caloriesPer100g: 61, protein: 3.2, carbs: 4.7, fats: 3.3, fiber: 0.0,
    digestionTime: '1.5-2 hours', emoji: '🥛',
    benefits: ['Complete protein', 'Calcium rich', 'Vitamin D', 'Bone health'],
    disadvantages: ['Lactose intolerance risk', 'Moderate fat'],
    tags: ['veg', 'beverage', 'calcium'],
  },
  {
    id: '19', name: 'Tea', category: 'Beverages', type: 'liquid',
    caloriesPer100g: 30, protein: 0.5, carbs: 5.0, fats: 1.0, fiber: 0.0,
    digestionTime: '30 min', emoji: '🍵',
    benefits: ['Antioxidants', 'Low calorie', 'Alertness', 'Metabolism boost'],
    disadvantages: ['Caffeine dependency', 'High sugar if sweetened', 'Inhibits iron absorption'],
    tags: ['veg', 'beverage', 'low-calorie'],
  },
  {
    id: '20', name: 'Coffee', category: 'Beverages', type: 'liquid',
    caloriesPer100g: 37, protein: 0.6, carbs: 6.0, fats: 1.0, fiber: 0.0,
    digestionTime: '30 min', emoji: '☕',
    benefits: ['Antioxidants', 'Metabolism boost', 'Performance enhancer', 'Low calorie black'],
    disadvantages: ['Caffeine dependency', 'Anxiety if excess', 'Sleep disruption'],
    tags: ['veg', 'beverage', 'low-calorie'],
  },
  {
    id: '21', name: 'Protein Shake', category: 'Supplements', type: 'liquid',
    caloriesPer100g: 120, protein: 22.0, carbs: 5.0, fats: 2.0, fiber: 1.0,
    digestionTime: '1-1.5 hours', emoji: '🥤',
    benefits: ['Very high protein', 'Muscle recovery', 'Convenient', 'Fast absorbing'],
    disadvantages: ['Processed food', 'Expensive', 'May cause bloating'],
    tags: ['both', 'supplement', 'high-protein', 'post-workout'],
  },
  {
    id: '22', name: 'Fresh Juice', category: 'Beverages', type: 'liquid',
    caloriesPer100g: 45, protein: 0.5, carbs: 10.5, fats: 0.2, fiber: 0.3,
    digestionTime: '30-45 min', emoji: '🥤',
    benefits: ['Vitamins and minerals', 'Natural sugars', 'Hydrating'],
    disadvantages: ['High in natural sugar', 'Low fiber compared to whole fruit', 'Spikes blood sugar'],
    tags: ['veg', 'beverage'],
  },
  {
    id: '23', name: 'Poha', category: 'Snacks', type: 'solid',
    caloriesPer100g: 130, protein: 3.0, carbs: 26.0, fats: 2.0, fiber: 1.5,
    digestionTime: '1.5-2 hours', emoji: '🍽️',
    benefits: ['Light on stomach', 'Iron rich', 'Easy to digest', 'Low fat'],
    disadvantages: ['Low protein', 'Refined carbs'],
    tags: ['veg', 'breakfast', 'light'],
  },
  {
    id: '24', name: 'Khichdi', category: 'Comfort Food', type: 'solid',
    caloriesPer100g: 140, protein: 6.0, carbs: 25.0, fats: 2.5, fiber: 2.5,
    digestionTime: '2-2.5 hours', emoji: '🍲',
    benefits: ['Easy to digest', 'Complete protein', 'Light meal', 'Good for illness'],
    disadvantages: ['High carbs', 'Moderate calorie'],
    tags: ['veg', 'comfort', 'lunch'],
  },
  {
    id: '25', name: 'Egg Bhurji', category: 'Snacks', type: 'solid',
    caloriesPer100g: 185, protein: 13.0, carbs: 3.0, fats: 14.0, fiber: 0.5,
    digestionTime: '2-3 hours', emoji: '🍳',
    benefits: ['High protein', 'Complete amino acids', 'Vitamin B12', 'Muscle building'],
    disadvantages: ['High cholesterol', 'High fat'],
    tags: ['nonveg', 'high-protein', 'breakfast'],
  },
];

export function searchFoods(query: string): FoodItem[] {
  const q = query.toLowerCase();
  return INDIAN_FOODS.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.category.toLowerCase().includes(q) ||
    f.tags.some(t => t.includes(q))
  );
}

export function getFoodById(id: string): FoodItem | undefined {
  return INDIAN_FOODS.find(f => f.id === id);
}

export function calculateFoodMacros(food: FoodItem, grams: number) {
  const ratio = grams / 100;
  return {
    calories: Math.round(food.caloriesPer100g * ratio),
    protein: parseFloat((food.protein * ratio).toFixed(1)),
    carbs: parseFloat((food.carbs * ratio).toFixed(1)),
    fats: parseFloat((food.fats * ratio).toFixed(1)),
    fiber: parseFloat((food.fiber * ratio).toFixed(1)),
  };
}
