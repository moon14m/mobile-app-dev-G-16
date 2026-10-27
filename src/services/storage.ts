import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const PREFIX = 'formalearn:';

// Reads a saved list. The first time, it saves and returns the starting data.
export async function readData<T>(key: string, startingData: T): Promise<T> {
  const saved = await AsyncStorage.getItem(PREFIX + key);
  if (saved === null) {
    await writeData(key, startingData);
    return startingData;
  }
  return JSON.parse(saved) as T;
}

export async function writeData<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export async function clearData(): Promise<void> {
  const keys = (await AsyncStorage.getAllKeys()).filter((k) => k.startsWith(PREFIX));
  await AsyncStorage.multiRemove(keys);
}

// On the web every browser tab runs its own copy of the app. When one tab saves,
// the other tabs get a "storage" event, so they can show the new data straight away.
export function onSavedInAnotherTab<T>(key: string, update: (value: T) => void): () => void {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return () => {};
  const listener = (event: StorageEvent) => {
    if (event.key === PREFIX + key && event.newValue) update(JSON.parse(event.newValue) as T);
  };
  window.addEventListener('storage', listener);
  return () => window.removeEventListener('storage', listener);
}
