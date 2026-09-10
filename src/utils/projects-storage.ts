export type Intrant = {
  id: string;
  name: string;
  quantity: string;
  unitPrice: string;
};

export type SavedProject = {
  intrants: Intrant[];
  quantiteObtenue: string;
  marge: string;
  quantiteVendue?: string;
};

export const PROJECTS_STORAGE_PREFIX = '@epices/mes-projets/';

export function projectStorageKey(slug: string) {
  return `${PROJECTS_STORAGE_PREFIX}${slug}`;
}

export function slugFromStorageKey(key: string) {
  return key.slice(PROJECTS_STORAGE_PREFIX.length);
}

export function toNumber(value: string): number {
  const n = parseFloat(value.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

export function formatAmount(value: number): string {
  return value.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
}

export function computeProjectTotals(project: SavedProject) {
  const coutProduction = project.intrants.reduce((sum, i) => sum + toNumber(i.quantity) * toNumber(i.unitPrice), 0);
  const quantite = toNumber(project.quantiteObtenue);
  const prixUnitaireProduit = quantite > 0 ? coutProduction / quantite : 0;
  const margeValue = toNumber(project.marge);
  const prixVenteRecommande = margeValue * prixUnitaireProduit;
  return { coutProduction, prixUnitaireProduit, prixVenteRecommande };
}
