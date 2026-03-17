import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  USER_TOKEN: 'fitbite_user_token',
  USER_PROFILE: 'fitbite_user_profile',
  ONBOARDING_DONE: 'fitbite_onboarding_done',
  DAILY_PROGRESS: 'fitbite_daily_progress',
  MEALS_TODAY: 'fitbite_meals_today',
  THEME: 'fitbite_theme',
  WATER_INTAKE: 'fitbite_water_intake',
  STEPS: 'fitbite_steps',
};

export const Storage = {
  async get(key: string): Promise<any> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch { return null; }
  },
  async set(key: string, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  },
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch {}
  },
};
