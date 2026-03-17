export interface UserProfile {
  name: string;
  email: string;
  height: number; // cm
  weight: number; // kg
  age: number;
  gender: 'male' | 'female';
  dietType: 'veg' | 'nonveg' | 'both';
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'maintain' | 'fat_loss';
  activityLevel: 'sedentary' | 'walker' | 'gym';
  bmi?: number;
  bmr?: number;
  tdee?: number;
  dailyCalorieGoal?: number;
  dailyProteinTarget?: number;
  dailyWaterIntake?: number;
  dailyStepGoal?: number;
}

export function calculateBMI(weight: number, height: number): number {
  const heightM = height / 100;
  return parseFloat((weight / (heightM * heightM)).toFixed(1));
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function calculateBMR(weight: number, height: number, age: number, gender: string): number {
  // Mifflin-St Jeor Formula
  if (gender === 'male') {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  } else {
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  }
}

export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    walker: 1.375,
    gym: 1.55,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.2));
}

export function calculateDailyCalorieGoal(tdee: number, fitnessGoal: string): number {
  const adjustments: Record<string, number> = {
    weight_loss: -500,
    fat_loss: -300,
    muscle_gain: +300,
    maintain: 0,
  };
  return Math.max(1200, tdee + (adjustments[fitnessGoal] || 0));
}

export function calculateProteinTarget(weight: number, fitnessGoal: string): number {
  const multipliers: Record<string, number> = {
    weight_loss: 2.0,
    fat_loss: 2.2,
    muscle_gain: 2.5,
    maintain: 1.6,
  };
  return Math.round(weight * (multipliers[fitnessGoal] || 1.6));
}

export function calculateWaterIntake(weight: number, activityLevel: string): number {
  // in liters
  const base = weight * 0.033;
  const activityBonus: Record<string, number> = {
    sedentary: 0,
    walker: 0.5,
    gym: 1.0,
  };
  return parseFloat((base + (activityBonus[activityLevel] || 0)).toFixed(1));
}

export function calculateStepGoal(activityLevel: string, fitnessGoal: string): number {
  const baseSteps: Record<string, number> = {
    sedentary: 7000,
    walker: 10000,
    gym: 12000,
  };
  const goalBonus: Record<string, number> = {
    weight_loss: 2000,
    fat_loss: 2000,
    muscle_gain: 0,
    maintain: 0,
  };
  return (baseSteps[activityLevel] || 7000) + (goalBonus[fitnessGoal] || 0);
}

export function computeFullProfile(profile: Partial<UserProfile>): UserProfile {
  const p = profile as UserProfile;
  const bmi = calculateBMI(p.weight, p.height);
  const bmr = calculateBMR(p.weight, p.height, p.age, p.gender);
  const tdee = calculateTDEE(bmr, p.activityLevel);
  const dailyCalorieGoal = calculateDailyCalorieGoal(tdee, p.fitnessGoal);
  const dailyProteinTarget = calculateProteinTarget(p.weight, p.fitnessGoal);
  const dailyWaterIntake = calculateWaterIntake(p.weight, p.activityLevel);
  const dailyStepGoal = calculateStepGoal(p.activityLevel, p.fitnessGoal);
  return { ...p, bmi, bmr, tdee, dailyCalorieGoal, dailyProteinTarget, dailyWaterIntake, dailyStepGoal };
}
