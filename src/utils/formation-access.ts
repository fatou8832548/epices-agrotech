import AsyncStorage from '@react-native-async-storage/async-storage';

const FORMACTIONS_UNLOCKED_KEY = 'formations_unlocked';
export const FORMATION_ACCESS_PRICE = 5000;

export async function getUnlockedFormations(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(FORMACTIONS_UNLOCKED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [];
  } catch {
    return [];
  }
}

export async function isFormationUnlocked(slug: string): Promise<boolean> {
  const unlocked = await getUnlockedFormations();
  return unlocked.includes(slug);
}

export async function unlockFormation(slug: string): Promise<void> {
  const unlocked = await getUnlockedFormations();
  if (unlocked.includes(slug)) return;
  await AsyncStorage.setItem(FORMACTIONS_UNLOCKED_KEY, JSON.stringify([...unlocked, slug]));
}
