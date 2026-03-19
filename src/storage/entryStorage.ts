import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entry } from '../types/Entry';

const STORAGE_KEY = 'travel_entries';

export const getEntries = async (): Promise<Entry[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
};

export const saveEntry = async (entry: Entry): Promise<void> => {
  try {
    const existing = await getEntries();
    const updated = [entry, ...existing];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    console.error('Failed to save entry.');
  }
};

export const deleteEntry = async (id: string): Promise<void> => {
  try {
    const existing = await getEntries();
    const updated = existing.filter(e => e.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    console.error('Failed to delete entry.');
  }
};