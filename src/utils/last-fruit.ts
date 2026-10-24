import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_FRUIT_KEY = '@epices/last-identified-fruit';

export async function setLastIdentifiedFruit(name: string): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_FRUIT_KEY, name);
  } catch {
    // ignore storage errors, this is a non-critical convenience feature
  }
}

export async function getLastIdentifiedFruit(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LAST_FRUIT_KEY);
  } catch {
    return null;
  }
}
