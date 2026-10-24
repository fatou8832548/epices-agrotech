import AsyncStorage from '@react-native-async-storage/async-storage';

const FORMACTIONS_UNLOCKED_KEY = 'formations_unlocked_v2';
const DIAGRAMS_UNLOCKED_KEY = 'fabrication_diagrams_unlocked';
const FREE_DIAGRAM_KEY = 'free_fabrication_diagram';
const PROJECTS_UNLOCKED_KEY = 'paid_projects_unlocked';
const FREE_PROJECT_KEY = 'free_project_slug';
export const FORMATION_ACCESS_PRICE = 1500;

export type PaymentMethod = 'wave' | 'orange_money' | 'paypal';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

type CheckoutSession = {
  checkoutUrl: string;
  paymentId: string;
};

function getPaymentApiUrl() {
  const baseUrl = process.env.EXPO_PUBLIC_PAYMENT_API_URL?.replace(/\/$/, '');
  if (!baseUrl) throw new Error('Le service de paiement n’est pas configuré.');
  return baseUrl;
}

export async function createPaymentCheckout(
  slug: string,
  method: PaymentMethod,
  resourceType: 'formation' | 'diagram' | 'project' = 'formation',
): Promise<CheckoutSession> {
  const response = await fetch(`${getPaymentApiUrl()}/payments/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resourceType, resourceSlug: slug, method, amount: FORMATION_ACCESS_PRICE, currency: 'XOF' }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || typeof payload.checkoutUrl !== 'string' || typeof payload.paymentId !== 'string') {
    throw new Error(payload.error ?? 'Impossible de créer le paiement. Réessayez plus tard.');
  }

  return { checkoutUrl: payload.checkoutUrl, paymentId: payload.paymentId };
}

export async function getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
  const response = await fetch(`${getPaymentApiUrl()}/payments/${encodeURIComponent(paymentId)}`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !['pending', 'paid', 'failed', 'cancelled'].includes(payload.status)) {
    throw new Error(payload.error ?? 'Impossible de vérifier le paiement.');
  }

  return payload.status as PaymentStatus;
}

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

export async function isDiagramUnlocked(slug: string): Promise<boolean> {
  const raw = await AsyncStorage.getItem(DIAGRAMS_UNLOCKED_KEY);
  if (!raw) return false;
  try {
    const unlocked = JSON.parse(raw);
    return Array.isArray(unlocked) && unlocked.includes(slug);
  } catch {
    return false;
  }
}

export async function unlockDiagram(slug: string): Promise<void> {
  const raw = await AsyncStorage.getItem(DIAGRAMS_UNLOCKED_KEY);
  let unlocked: string[] = [];
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) unlocked = parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    unlocked = [];
  }
  if (!unlocked.includes(slug)) {
    await AsyncStorage.setItem(DIAGRAMS_UNLOCKED_KEY, JSON.stringify([...unlocked, slug]));
  }
}

export async function getFreeDiagramSlug(): Promise<string | null> {
  return AsyncStorage.getItem(FREE_DIAGRAM_KEY);
}

export async function claimFreeDiagram(slug: string): Promise<boolean> {
  const existingSlug = await getFreeDiagramSlug();
  if (existingSlug) return existingSlug === slug;
  await AsyncStorage.setItem(FREE_DIAGRAM_KEY, slug);
  await unlockDiagram(slug);
  return true;
}

export async function isProjectUnlocked(slug: string): Promise<boolean> {
  const raw = await AsyncStorage.getItem(PROJECTS_UNLOCKED_KEY);
  if (!raw) return false;
  try {
    const unlocked = JSON.parse(raw);
    return Array.isArray(unlocked) && unlocked.includes(slug);
  } catch {
    return false;
  }
}

export async function unlockProject(slug: string): Promise<void> {
  const raw = await AsyncStorage.getItem(PROJECTS_UNLOCKED_KEY);
  let unlocked: string[] = [];
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) unlocked = parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    unlocked = [];
  }
  if (!unlocked.includes(slug)) {
    await AsyncStorage.setItem(PROJECTS_UNLOCKED_KEY, JSON.stringify([...unlocked, slug]));
  }
}

export async function getFreeProjectSlug(): Promise<string | null> {
  return AsyncStorage.getItem(FREE_PROJECT_KEY);
}

export async function claimFreeProject(slug: string): Promise<boolean> {
  const existingSlug = await getFreeProjectSlug();
  if (existingSlug) return existingSlug === slug;
  await AsyncStorage.setItem(FREE_PROJECT_KEY, slug);
  await unlockProject(slug);
  return true;
}
