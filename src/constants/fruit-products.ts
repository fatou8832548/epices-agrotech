export type FruitProductProcess = {
  fabrication: string[];
  parametres: { label: string; value: string }[];
  conservation: string[];
};

export type FruitProductIcon = { ios: string; android: string; web: string };

export type FruitProduct = {
  name: string;
  icon: FruitProductIcon;
  photo?: number;
  formationSlug?: string;
  process?: FruitProductProcess;
};

export type FruitProducts = {
  fruit: string;
  products: FruitProduct[];
};

// Reusable icon sets by product category (SF Symbol / Material Symbol / lucide-web names).
const ICON_DRINK: FruitProductIcon = { ios: 'cup.and.saucer.fill', android: 'local_drink', web: 'cup-soda' };
const ICON_JAM: FruitProductIcon = { ios: 'shippingbox.fill', android: 'inventory_2', web: 'package' };
const ICON_DRIED: FruitProductIcon = { ios: 'sun.max.fill', android: 'grain', web: 'sun' };
const ICON_POWDER: FruitProductIcon = { ios: 'sparkles', android: 'science', web: 'flask-conical' };
const ICON_SYRUP: FruitProductIcon = { ios: 'drop.fill', android: 'water_drop', web: 'droplet' };
const ICON_PUREE: FruitProductIcon = { ios: 'fork.knife', android: 'restaurant', web: 'utensils' };
const ICON_FLOWER: FruitProductIcon = { ios: 'leaf.fill', android: 'eco', web: 'leaf' };

// Real product photos (cropped from a provided reference image).
const PHOTO_JUS_DE_MANGUE = require('../../assets/images/products/jus-de-mangue.png');
const PHOTO_CONFITURE_DE_MANGUE = require('../../assets/images/products/confiture-de-mangue.png');
const PHOTO_MANGUE_SECHEE = require('../../assets/images/products/mangue-sechee.png');
const PHOTO_PUREE_DE_MANGUE = require('../../assets/images/products/puree-de-mangue.png');
const PHOTO_NECTAR_DE_MANGUE = require('../../assets/images/products/nectar-de-mangue.png');
const PHOTO_POUDRE_DE_MANGUE = require('../../assets/images/products/poudre-de-mangue.png');

const jusDeMangueProcess: FruitProductProcess = {
  fabrication: [
    'Réception des mangues',
    'Tri et lavage',
    'Épluchage et découpe',
    'Extraction / Pulpage',
    'Filtration',
    'Pasteurisation (95°C)',
    'Conditionnement',
    'Refroidissement',
    'Étiquetage / Stockage',
  ],
  parametres: [
    { label: 'Température de pasteurisation', value: '95°C' },
    { label: 'Durée de pasteurisation', value: '2 à 3 min' },
    { label: 'Filtration', value: 'Tamis fin, retrait des fibres' },
    { label: 'Conditionnement', value: 'Bouteille PET 1L, remplissage à chaud' },
  ],
  conservation: [
    "À conserver à l'abri de la lumière et de la chaleur excessive",
    "Bouteille fermée : plusieurs mois à température ambiante",
    'Après ouverture : à conserver au frais et à consommer rapidement',
  ],
};

const confitureDeMangueProcess: FruitProductProcess = {
  fabrication: [
    'Réception des mangues',
    'Tri et lavage',
    'Epluchage et dénoyautage',
    'Découpe de la pulpe',
    'Cuisson avec sucre / pectine',
    'Mise en pot à chaud',
    'Stérilisation des bocaux',
    'Refroidissement',
    'Etiquetage / Stockage',
  ],
  parametres: [
    { label: 'Ratio sucre/fruit', value: 'Environ 1:1 selon la recette' },
    { label: 'Température de cuisson', value: 'Jusqu’à ébullition, test de prise' },
    { label: 'Stérilisation', value: 'Bocaux fermés retournés ou passés à la chaleur' },
    { label: 'Conditionnement', value: 'Bocal en verre 250g, remplissage à chaud' },
  ],
  conservation: [
    "À conserver dans un endroit propre, sec et à l'abri de la lumière",
    'Bocal fermé sous vide : plusieurs mois à température ambiante',
    'Après ouverture : à conserver au réfrigérateur et à consommer rapidement',
  ],
};

const mangueSecheeProcess: FruitProductProcess = {
  fabrication: [
    'Réception des mangues',
    'Tri et lavage',
    'Épluchage et dénoyautage',
    'Découpe en tranches fines',
    'Prétraitement (trempage anti-oxydation)',
    'Séchage (four/séchoir solaire)',
    'Contrôle de l’humidité résiduelle',
    'Conditionnement sous vide ou sachet hermétique',
    'Étiquetage / Stockage',
  ],
  parametres: [
    { label: 'Épaisseur des tranches', value: 'Environ 3 à 5 mm' },
    { label: 'Température de séchage', value: '55 à 60°C' },
    { label: 'Durée de séchage', value: '8 à 12h selon l’humidité ambiante' },
    { label: 'Humidité finale visée', value: '≤ 15% pour une bonne conservation' },
  ],
  conservation: [
    "À conserver dans un sachet hermétique, à l'abri de l'humidité et de la lumière",
    'Sachet fermé : plusieurs mois à température ambiante',
    'Après ouverture : refermer hermétiquement et consommer rapidement',
  ],
};

const pureeDeMangueProcess: FruitProductProcess = {
  fabrication: [
    'Réception des mangues',
    'Tri et lavage',
    'Épluchage et dénoyautage',
    'Découpe de la pulpe',
    'Mixage / Broyage',
    'Tamisage (retrait des fibres)',
    'Pasteurisation',
    'Conditionnement à chaud',
    'Refroidissement / Stockage',
  ],
  parametres: [
    { label: 'Tamisage', value: 'Passoire fine, texture lisse et homogène' },
    { label: 'Température de pasteurisation', value: '85 à 90°C' },
    { label: 'Durée de pasteurisation', value: '2 à 3 min' },
    { label: 'Conditionnement', value: 'Pot ou poche hermétique, remplissage à chaud' },
  ],
  conservation: [
    "À conserver au frais, à l'abri de la lumière",
    'Conditionnement fermé : plusieurs semaines/mois selon le contenant',
    'Après ouverture : à conserver au réfrigérateur et à consommer rapidement',
  ],
};

const nectarDeMangueProcess: FruitProductProcess = {
  fabrication: [
    'Réception des mangues',
    'Tri et lavage',
    'Épluchage et dénoyautage',
    'Extraction de la pulpe',
    'Mélange avec eau et sucre',
    'Homogénéisation',
    'Pasteurisation',
    'Conditionnement',
    'Refroidissement / Étiquetage',
  ],
  parametres: [
    { label: 'Taux de pulpe', value: 'Environ 25 à 50% selon la réglementation' },
    { label: 'Dosage sucre/eau', value: 'Ajusté selon le degré Brix visé' },
    { label: 'Température de pasteurisation', value: '90 °C' },
    { label: 'Conditionnement', value: 'Bouteille ou brique, remplissage à chaud' },
  ],
  conservation: [
    "À conserver à l'abri de la lumière et de la chaleur excessive",
    'Bouteille fermée : plusieurs mois à température ambiante',
    'Après ouverture : à conserver au frais et à consommer rapidement',
  ],
};

const poudreDeMangueProcess: FruitProductProcess = {
  fabrication: [
    'Réception des mangues',
    'Tri et lavage',
    'Épluchage et dénoyautage',
    'Découpe en fines lamelles',
    'Séchage complet',
    'Broyage en poudre',
    'Tamisage',
    'Conditionnement hermétique',
    'Étiquetage / Stockage',
  ],
  parametres: [
    { label: 'Température de séchage', value: '55 à 60°C jusqu’à dessiccation complète' },
    { label: 'Broyage', value: 'Broyeur fin, granulométrie homogène' },
    { label: 'Tamisage', value: 'Tamis fin pour éliminer les grumeaux' },
    { label: 'Humidité finale visée', value: '≤ 10% pour une bonne conservation' },
  ],
  conservation: [
    "À conserver dans un contenant hermétique, à l'abri de l'humidité et de la lumière",
    'Contenant fermé : plusieurs mois à température ambiante',
    'Après ouverture : refermer hermétiquement pour éviter la reprise d’humidité',
  ],
};

// Generic process templates by product category, reused across fruits (fruit name is interpolated).
function drinkProcess(fruit: string): FruitProductProcess {
  return {
    fabrication: [
      `Réception des ${fruit}`,
      'Tri et lavage',
      'Épluchage et découpe',
      'Extraction / Pulpage',
      'Filtration',
      'Pasteurisation',
      'Conditionnement',
      'Refroidissement',
      'Étiquetage / Stockage',
    ],
    parametres: [
      { label: 'Température de pasteurisation', value: '85 à 95°C' },
      { label: 'Durée de pasteurisation', value: '2 à 3 min' },
      { label: 'Filtration', value: 'Tamis fin, retrait des fibres' },
      { label: 'Conditionnement', value: 'Bouteille, remplissage à chaud' },
    ],
    conservation: [
      "À conserver à l'abri de la lumière et de la chaleur excessive",
      'Bouteille fermée : plusieurs mois à température ambiante',
      'Après ouverture : à conserver au frais et à consommer rapidement',
    ],
  };
}

function nectarProcess(fruit: string): FruitProductProcess {
  return {
    fabrication: [
      `Réception des ${fruit}`,
      'Tri et lavage',
      'Épluchage et découpe',
      'Extraction de la pulpe',
      'Mélange avec eau et sucre',
      'Homogénéisation',
      'Pasteurisation',
      'Conditionnement',
      'Refroidissement / Étiquetage',
    ],
    parametres: [
      { label: 'Taux de pulpe', value: 'Environ 25 à 50% selon la réglementation' },
      { label: 'Dosage sucre/eau', value: 'Ajusté selon le degré Brix visé' },
      { label: 'Température de pasteurisation', value: '90°C' },
      { label: 'Conditionnement', value: 'Bouteille ou brique, remplissage à chaud' },
    ],
    conservation: [
      "À conserver à l'abri de la lumière et de la chaleur excessive",
      'Bouteille fermée : plusieurs mois à température ambiante',
      'Après ouverture : à conserver au frais et à consommer rapidement',
    ],
  };
}

function jamProcess(fruit: string): FruitProductProcess {
  return {
    fabrication: [
      `Réception des ${fruit}`,
      'Tri et lavage',
      'Épluchage et préparation',
      'Découpe de la pulpe',
      'Cuisson avec sucre / pectine',
      'Mise en pot à chaud',
      'Stérilisation des bocaux',
      'Refroidissement',
      'Étiquetage / Stockage',
    ],
    parametres: [
      { label: 'Ratio sucre/fruit', value: 'Environ 1:1 selon la recette' },
      { label: 'Température de cuisson', value: 'Jusqu’à ébullition, test de prise' },
      { label: 'Stérilisation', value: 'Bocaux fermés retournés ou passés à la chaleur' },
      { label: 'Conditionnement', value: 'Bocal en verre, remplissage à chaud' },
    ],
    conservation: [
      "À conserver dans un endroit propre, sec et à l'abri de la lumière",
      'Bocal fermé sous vide : plusieurs mois à température ambiante',
      'Après ouverture : à conserver au réfrigérateur et à consommer rapidement',
    ],
  };
}

function pasteProcess(fruit: string): FruitProductProcess {
  return {
    fabrication: [
      `Réception des ${fruit}`,
      'Tri et lavage',
      'Épluchage et préparation de la pulpe',
      'Cuisson longue avec sucre',
      'Réduction jusqu’à épaississement',
      'Moulage / Étalage en couche',
      'Séchage léger',
      'Découpe et conditionnement',
      'Étiquetage / Stockage',
    ],
    parametres: [
      { label: 'Cuisson', value: 'Feu doux, réduction jusqu’à consistance épaisse' },
      { label: 'Ratio sucre/fruit', value: 'Environ 1:1, ajusté selon l’acidité du fruit' },
      { label: 'Séchage léger', value: 'Quelques heures pour raffermir la pâte' },
      { label: 'Conditionnement', value: 'Papier alimentaire ou boîte hermétique' },
    ],
    conservation: [
      "À conserver dans un endroit propre, sec et à l'abri de la lumière",
      'Bien emballée : plusieurs semaines à température ambiante',
      'Après ouverture : à conserver au frais et à consommer rapidement',
    ],
  };
}

function driedProcess(fruit: string): FruitProductProcess {
  return {
    fabrication: [
      `Réception des ${fruit}`,
      'Tri et lavage',
      'Épluchage et préparation',
      'Découpe en tranches fines',
      'Prétraitement (trempage anti-oxydation)',
      'Séchage (four/séchoir solaire)',
      'Contrôle de l’humidité résiduelle',
      'Conditionnement sous vide ou sachet hermétique',
      'Étiquetage / Stockage',
    ],
    parametres: [
      { label: 'Épaisseur des tranches', value: 'Environ 3 à 5 mm' },
      { label: 'Température de séchage', value: '55 à 60°C' },
      { label: 'Durée de séchage', value: '8 à 12h selon l’humidité ambiante' },
      { label: 'Humidité finale visée', value: '≤ 15% pour une bonne conservation' },
    ],
    conservation: [
      "À conserver dans un sachet hermétique, à l'abri de l'humidité et de la lumière",
      'Sachet fermé : plusieurs mois à température ambiante',
      'Après ouverture : refermer hermétiquement et consommer rapidement',
    ],
  };
}

function syrupProcess(fruit: string): FruitProductProcess {
  return {
    fabrication: [
      `Réception des ${fruit}`,
      'Tri et lavage',
      'Épluchage et découpe',
      'Extraction du jus / macération',
      'Cuisson avec sucre',
      'Filtration',
      'Mise en bouteille à chaud',
      'Refroidissement',
      'Étiquetage / Stockage',
    ],
    parametres: [
      { label: 'Ratio sucre/jus', value: 'Ajusté selon le degré Brix visé' },
      { label: 'Cuisson', value: 'Jusqu’à consistance sirupeuse' },
      { label: 'Filtration', value: 'Tamis fin pour un sirop limpide' },
      { label: 'Conditionnement', value: 'Bouteille en verre, remplissage à chaud' },
    ],
    conservation: [
      "À conserver à l'abri de la lumière et de la chaleur excessive",
      'Bouteille fermée : plusieurs mois à température ambiante',
      'Après ouverture : à conserver au réfrigérateur',
    ],
  };
}

function powderProcess(fruit: string): FruitProductProcess {
  return {
    fabrication: [
      `Réception des ${fruit}`,
      'Tri et lavage',
      'Épluchage et préparation',
      'Découpe en fines lamelles',
      'Séchage complet',
      'Broyage en poudre',
      'Tamisage',
      'Conditionnement hermétique',
      'Étiquetage / Stockage',
    ],
    parametres: [
      { label: 'Température de séchage', value: '55 à 60°C jusqu’à dessiccation complète' },
      { label: 'Broyage', value: 'Broyeur fin, granulométrie homogène' },
      { label: 'Tamisage', value: 'Tamis fin pour éliminer les grumeaux' },
      { label: 'Humidité finale visée', value: '≤ 10% pour une bonne conservation' },
    ],
    conservation: [
      "À conserver dans un contenant hermétique, à l'abri de l'humidité et de la lumière",
      'Contenant fermé : plusieurs mois à température ambiante',
      'Après ouverture : refermer hermétiquement pour éviter la reprise d’humidité',
    ],
  };
}

function flourProcess(fruit: string): FruitProductProcess {
  return {
    fabrication: [
      `Réception des ${fruit}`,
      'Tri et lavage',
      'Épluchage et découpe en rondelles',
      'Séchage complet',
      'Broyage / Mouture',
      'Tamisage fin',
      'Conditionnement hermétique',
      'Étiquetage / Stockage',
    ],
    parametres: [
      { label: 'Température de séchage', value: '55 à 60°C jusqu’à dessiccation complète' },
      { label: 'Mouture', value: 'Moulin/broyeur fin, granulométrie farine' },
      { label: 'Tamisage', value: 'Tamis fin pour une farine homogène' },
      { label: 'Humidité finale visée', value: '≤ 10% pour une bonne conservation' },
    ],
    conservation: [
      "À conserver dans un contenant hermétique, à l'abri de l'humidité et de la lumière",
      'Contenant fermé : plusieurs mois à température ambiante',
      'Après ouverture : refermer hermétiquement pour éviter la reprise d’humidité',
    ],
  };
}

function chipsProcess(fruit: string): FruitProductProcess {
  return {
    fabrication: [
      `Réception des ${fruit}`,
      'Tri et lavage',
      'Épluchage et découpe fine',
      'Prétraitement (trempage anti-oxydation)',
      'Friture ou séchage',
      'Égouttage',
      'Salage / Assaisonnement léger',
      'Conditionnement',
      'Étiquetage / Stockage',
    ],
    parametres: [
      { label: 'Épaisseur des tranches', value: 'Environ 1 à 2 mm' },
      { label: 'Température de friture', value: '160 à 180°C (si friture)' },
      { label: 'Égouttage', value: 'Retrait de l’excès d’huile avant conditionnement' },
      { label: 'Conditionnement', value: 'Sachet hermétique, à l’abri de l’air' },
    ],
    conservation: [
      "À conserver dans un sachet hermétique, à l'abri de l'humidité",
      'Sachet fermé : plusieurs semaines à température ambiante',
      'Après ouverture : refermer hermétiquement et consommer rapidement',
    ],
  };
}

function confitProcess(fruit: string): FruitProductProcess {
  return {
    fabrication: [
      `Réception des ${fruit}`,
      'Tri et lavage',
      'Préparation (découpe / zestage selon le fruit)',
      'Blanchiment (retrait de l’amertume)',
      'Cuisson lente dans un sirop de sucre',
      'Égouttage',
      'Séchage léger',
      'Conditionnement',
      'Étiquetage / Stockage',
    ],
    parametres: [
      { label: 'Blanchiment', value: 'Un à plusieurs bains d’eau bouillante selon le fruit' },
      { label: 'Cuisson dans le sirop', value: 'Plusieurs passages à feu doux pour bien confire' },
      { label: 'Séchage léger', value: 'Pour éviter que le confit ne colle' },
      { label: 'Conditionnement', value: 'Bocal ou boîte hermétique' },
    ],
    conservation: [
      "À conserver dans un endroit propre, sec et à l'abri de la lumière",
      'Bien fermé : plusieurs mois à température ambiante',
      'Après ouverture : à conserver au frais et à consommer rapidement',
    ],
  };
}

function conserveProcess(fruit: string): FruitProductProcess {
  return {
    fabrication: [
      `Réception des ${fruit}`,
      'Tri et lavage',
      'Épluchage et découpe',
      'Préparation du sirop',
      'Mise en boîte avec le sirop',
      'Sertissage / Fermeture hermétique',
      'Stérilisation',
      'Refroidissement',
      'Étiquetage / Stockage',
    ],
    parametres: [
      { label: 'Sirop', value: 'Dosage sucre/eau selon la recette' },
      { label: 'Stérilisation', value: 'Autoclave ou bain-marie à haute température' },
      { label: 'Fermeture', value: 'Sertissage hermétique avant stérilisation' },
      { label: 'Conditionnement', value: 'Boîte métallique ou bocal en verre' },
    ],
    conservation: [
      "À conserver dans un endroit propre et sec, à l'abri de la lumière",
      'Boîte/bocal fermé : plusieurs mois à température ambiante',
      'Après ouverture : à conserver au réfrigérateur et à consommer rapidement',
    ],
  };
}

function driedFlowerProcess(): FruitProductProcess {
  return {
    fabrication: [
      'Récolte des fleurs de bissap',
      'Tri (retrait des impuretés)',
      'Lavage rapide',
      'Égouttage',
      'Séchage à l’ombre ou séchoir',
      'Contrôle de l’humidité résiduelle',
      'Conditionnement hermétique',
      'Étiquetage / Stockage',
    ],
    parametres: [
      { label: 'Séchage', value: 'À l’ombre, à l’abri du soleil direct pour préserver la couleur' },
      { label: 'Durée de séchage', value: 'Plusieurs jours selon l’humidité ambiante' },
      { label: 'Humidité finale visée', value: '≤ 12% pour une bonne conservation' },
      { label: 'Conditionnement', value: 'Sachet hermétique à l’abri de la lumière' },
    ],
    conservation: [
      "À conserver dans un sachet hermétique, à l'abri de l'humidité et de la lumière",
      'Sachet fermé : plusieurs mois à température ambiante',
      'Après ouverture : refermer hermétiquement pour préserver l’arôme',
    ],
  };
}

const catalog: FruitProducts[] = [
  {
    fruit: 'Mangue',
    products: [
      { name: 'Jus de mangue', icon: ICON_DRINK, photo: PHOTO_JUS_DE_MANGUE, formationSlug: 'jus-de-mangue', process: jusDeMangueProcess },
      { name: 'Confiture de mangue', icon: ICON_JAM, photo: PHOTO_CONFITURE_DE_MANGUE, formationSlug: 'confiture-de-mangue', process: confitureDeMangueProcess },
      { name: 'Mangue séchée', icon: ICON_DRIED, photo: PHOTO_MANGUE_SECHEE, process: mangueSecheeProcess },
      { name: 'Purée de mangue', icon: ICON_PUREE, photo: PHOTO_PUREE_DE_MANGUE, process: pureeDeMangueProcess },
      { name: 'Nectar de mangue', icon: ICON_DRINK, photo: PHOTO_NECTAR_DE_MANGUE, process: nectarDeMangueProcess },
      { name: 'Poudre de mangue', icon: ICON_POWDER, photo: PHOTO_POUDRE_DE_MANGUE, process: poudreDeMangueProcess },
    ],
  },
  {
    fruit: 'Ananas',
    products: [
      { name: 'Jus d’ananas', icon: ICON_DRINK, process: drinkProcess('ananas') },
      { name: 'Confiture d’ananas', icon: ICON_JAM, process: jamProcess('ananas') },
      { name: 'Ananas séché', icon: ICON_DRIED, process: driedProcess('ananas') },
      { name: 'Sirop d’ananas', icon: ICON_SYRUP, process: syrupProcess('ananas') },
      { name: 'Ananas au sirop (conserve)', icon: ICON_JAM, process: conserveProcess('ananas') },
    ],
  },
  {
    fruit: 'Banane',
    products: [
      { name: 'Banane séchée', icon: ICON_DRIED, process: driedProcess('bananes') },
      { name: 'Farine de banane', icon: ICON_POWDER, process: flourProcess('bananes') },
      { name: 'Chips de banane', icon: ICON_DRIED, process: chipsProcess('bananes') },
      { name: 'Confiture de banane', icon: ICON_JAM, process: jamProcess('bananes') },
      { name: 'Purée de banane', icon: ICON_PUREE, process: jamProcess('bananes') },
    ],
  },
  {
    fruit: 'Papaye',
    products: [
      { name: 'Jus de papaye', icon: ICON_DRINK, process: drinkProcess('papayes') },
      { name: 'Confiture de papaye', icon: ICON_JAM, process: jamProcess('papayes') },
      { name: 'Papaye séchée', icon: ICON_DRIED, process: driedProcess('papayes') },
      { name: 'Punch/nectar de papaye', icon: ICON_DRINK, process: nectarProcess('papayes') },
    ],
  },
  {
    fruit: 'Orange',
    products: [
      { name: 'Jus d’orange', icon: ICON_DRINK, process: drinkProcess('oranges') },
      { name: 'Confiture d’orange', icon: ICON_JAM, process: jamProcess('oranges') },
      { name: 'Écorces d’orange confites', icon: ICON_JAM, process: confitProcess('oranges') },
      { name: 'Sirop d’orange', icon: ICON_SYRUP, process: syrupProcess('oranges') },
    ],
  },
  {
    fruit: 'Citron',
    products: [
      { name: 'Jus de citron', icon: ICON_DRINK, process: drinkProcess('citrons') },
      { name: 'Sirop de citron', icon: ICON_SYRUP, process: syrupProcess('citrons') },
      { name: 'Citron confit', icon: ICON_JAM, process: confitProcess('citrons') },
      { name: 'Poudre de citron séché', icon: ICON_POWDER, process: powderProcess('citrons') },
    ],
  },
  {
    fruit: 'Goyave',
    products: [
      { name: 'Jus de goyave', icon: ICON_DRINK, process: drinkProcess('goyaves') },
      { name: 'Confiture de goyave', icon: ICON_JAM, process: jamProcess('goyaves') },
      { name: 'Pâte de goyave', icon: ICON_JAM, process: pasteProcess('goyaves') },
      { name: 'Goyave séchée', icon: ICON_DRIED, process: driedProcess('goyaves') },
    ],
  },
  {
    fruit: 'Tamarin',
    products: [
      { name: 'Jus de tamarin', icon: ICON_DRINK, process: drinkProcess('gousses de tamarin') },
      { name: 'Sirop de tamarin', icon: ICON_SYRUP, process: syrupProcess('gousses de tamarin') },
      { name: 'Confiture de tamarin', icon: ICON_JAM, process: jamProcess('gousses de tamarin') },
      { name: 'Pâte de tamarin', icon: ICON_JAM, process: pasteProcess('gousses de tamarin') },
    ],
  },
  {
    fruit: 'Pastèque',
    products: [
      { name: 'Jus de pastèque', icon: ICON_DRINK, process: drinkProcess('pastèques') },
      { name: 'Sirop de pastèque', icon: ICON_SYRUP, process: syrupProcess('pastèques') },
      { name: 'Confiture de pastèque', icon: ICON_JAM, process: jamProcess('pastèques') },
    ],
  },
  {
    fruit: 'Bissap',
    products: [
      { name: 'Jus de bissap', icon: ICON_DRINK, process: drinkProcess('fleurs de bissap') },
      { name: 'Sirop de bissap', icon: ICON_SYRUP, process: syrupProcess('fleurs de bissap') },
      { name: 'Confiture de bissap', icon: ICON_JAM, process: jamProcess('fleurs de bissap') },
      { name: 'Bissap séché (fleurs)', icon: ICON_FLOWER, process: driedFlowerProcess() },
    ],
  },
  {
    fruit: 'Gingembre',
    products: [
      { name: 'Jus de gingembre', icon: ICON_DRINK, process: drinkProcess('rhizomes de gingembre') },
      { name: 'Sirop de gingembre', icon: ICON_SYRUP, process: syrupProcess('rhizomes de gingembre') },
      { name: 'Poudre de gingembre', icon: ICON_POWDER, process: powderProcess('rhizomes de gingembre') },
      { name: 'Gingembre confit', icon: ICON_JAM, process: confitProcess('rhizomes de gingembre') },
    ],
  },
];

// Finds the product catalog matching an identified fruit name (case/accent-insensitive substring match).
export function getProductsForFruit(name: string): FruitProducts | null {
  const normalized = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return (
    catalog.find((entry) => normalized.includes(entry.fruit.toLowerCase())) ?? null
  );
}

export function getProductByName(name: string): FruitProduct | null {
  for (const entry of catalog) {
    const product = entry.products.find((p) => p.name === name);
    if (product) return product;
  }
  return null;
}
