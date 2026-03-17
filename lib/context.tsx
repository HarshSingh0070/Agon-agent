import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Storage, StorageKeys } from './storage';
import { UserProfile, computeFullProfile } from './calculations';
import { Colors } from './theme';

export interface MealEntry {
  id: string;
  foodName: string;
  emoji: string;
  portionGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: string;
  timestamp: number;
  isAIEstimated: boolean;
}

export interface DailyProgress {
  date: string;
  caloriesConsumed: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatsConsumed: number;
  waterIntake: number; // glasses
  steps: number;
  meals: MealEntry[];
}

interface AppContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof Colors.dark;
  userProfile: UserProfile | null;
  setUserProfile: (p: UserProfile) => void;
  isLoggedIn: boolean;
  login: (profile: UserProfile) => void;
  logout: () => void;
  dailyProgress: DailyProgress;
  addMeal: (meal: MealEntry) => void;
  removeMeal: (mealId: string) => void;
  addWater: (glasses: number) => void;
  updateSteps: (steps: number) => void;
  isOnboarded: boolean;
  setIsOnboarded: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getEmptyProgress(): DailyProgress {
  return {
    date: getTodayDate(),
    caloriesConsumed: 0,
    proteinConsumed: 0,
    carbsConsumed: 0,
    fatsConsumed: 0,
    waterIntake: 0,
    steps: 0,
    meals: [],
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(true);
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnboarded, setIsOnboardedState] = useState(false);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>(getEmptyProgress());

  const colors = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    const theme = await Storage.get(StorageKeys.THEME);
    if (theme !== null) setIsDark(theme === 'dark');
    else setIsDark(systemScheme === 'dark');

    const profile = await Storage.get(StorageKeys.USER_PROFILE);
    if (profile) {
      setUserProfileState(profile);
      setIsLoggedIn(true);
    }

    const onboarded = await Storage.get(StorageKeys.ONBOARDING_DONE);
    if (onboarded) setIsOnboardedState(true);

    const today = getTodayDate();
    const progress = await Storage.get(StorageKeys.DAILY_PROGRESS);
    if (progress && progress.date === today) {
      setDailyProgress(progress);
    } else {
      setDailyProgress(getEmptyProgress());
    }
  }

  function toggleTheme() {
    const newDark = !isDark;
    setIsDark(newDark);
    Storage.set(StorageKeys.THEME, newDark ? 'dark' : 'light');
  }

  async function setUserProfile(profile: UserProfile) {
    const computed = computeFullProfile(profile);
    setUserProfileState(computed);
    await Storage.set(StorageKeys.USER_PROFILE, computed);
  }

  async function login(profile: UserProfile) {
    await setUserProfile(profile);
    setIsLoggedIn(true);
  }

  async function logout() {
    setIsLoggedIn(false);
    setUserProfileState(null);
    setIsOnboardedState(false);
    await Storage.remove(StorageKeys.USER_PROFILE);
    await Storage.remove(StorageKeys.ONBOARDING_DONE);
    await Storage.remove(StorageKeys.DAILY_PROGRESS);
  }

  async function addMeal(meal: MealEntry) {
    setDailyProgress(prev => {
      const updated = {
        ...prev,
        caloriesConsumed: prev.caloriesConsumed + meal.calories,
        proteinConsumed: parseFloat((prev.proteinConsumed + meal.protein).toFixed(1)),
        carbsConsumed: parseFloat((prev.carbsConsumed + meal.carbs).toFixed(1)),
        fatsConsumed: parseFloat((prev.fatsConsumed + meal.fats).toFixed(1)),
        meals: [...prev.meals, meal],
      };
      Storage.set(StorageKeys.DAILY_PROGRESS, updated);
      return updated;
    });
  }

  async function removeMeal(mealId: string) {
    setDailyProgress(prev => {
      const meal = prev.meals.find(m => m.id === mealId);
      if (!meal) return prev;
      const updated = {
        ...prev,
        caloriesConsumed: Math.max(0, prev.caloriesConsumed - meal.calories),
        proteinConsumed: Math.max(0, parseFloat((prev.proteinConsumed - meal.protein).toFixed(1))),
        carbsConsumed: Math.max(0, parseFloat((prev.carbsConsumed - meal.carbs).toFixed(1))),
        fatsConsumed: Math.max(0, parseFloat((prev.fatsConsumed - meal.fats).toFixed(1))),
        meals: prev.meals.filter(m => m.id !== mealId),
      };
      Storage.set(StorageKeys.DAILY_PROGRESS, updated);
      return updated;
    });
  }

  async function addWater(glasses: number) {
    setDailyProgress(prev => {
      const updated = { ...prev, waterIntake: prev.waterIntake + glasses };
      Storage.set(StorageKeys.DAILY_PROGRESS, updated);
      return updated;
    });
  }

  async function updateSteps(steps: number) {
    setDailyProgress(prev => {
      const updated = { ...prev, steps };
      Storage.set(StorageKeys.DAILY_PROGRESS, updated);
      return updated;
    });
  }

  async function setIsOnboarded(v: boolean) {
    setIsOnboardedState(v);
    await Storage.set(StorageKeys.ONBOARDING_DONE, v);
  }

  return (
    <AppContext.Provider value={{
      isDark, toggleTheme, colors,
      userProfile, setUserProfile,
      isLoggedIn, login, logout,
      dailyProgress, addMeal, removeMeal, addWater, updateSteps,
      isOnboarded, setIsOnboarded,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
