export type FormationModule = {
  title: string;
  duration: string;
};

export type FormationDocument = {
  title: string;
  fileType: string;
  asset: number;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export type DistributionChannel = {
  label: string;
  icon: { ios: string; android: string; web: string };
};

export type Commercialisation = {
  packagingTitle: string;
  packagingEmoji: string;
  packagingFeatures: string[];
  distributionChannels: DistributionChannel[];
};

export type Formation = {
  slug: string;
  title: string;
  subtitle: string;
  fruit: string;
  modules: FormationModule[];
  documents: FormationDocument[];
  quiz: QuizQuestion[];
  video?: number;
  commercialisation: Commercialisation;
};

const hygieneCourseVideo = require('../../assets/videos/cours-normes-hygiene.mp4');

const hygieneCourseDocument: FormationDocument = {
  title: 'Cours normes hygiène',
  fileType: 'PPTX',
  asset: require('../../assets/documents/cours-normes-hygiene.pptx'),
};

// Questions based on the "Cours Normes Hygiène" course content.
const hygieneQuiz: QuizQuestion[] = [
  {
    question: 'Quel est le premier outil de travail en contact direct avec les denrées alimentaires ?',
    options: ['Les mains', 'Les gants', 'Le masque', 'La coiffe'],
    correctIndex: 0,
  },
  {
    question: 'Quand faut-il se laver les mains ?',
    options: [
      'Une seule fois en début de journée',
      'Après chaque geste sale et avant chaque geste propre',
      'Uniquement à la sortie de l’atelier',
      'Seulement si les mains sont visiblement sales',
    ],
    correctIndex: 1,
  },
  {
    question: 'Où doit-on se laver les mains selon la procédure ?',
    options: [
      'Avant d’entrer en zone de production et dans les ateliers de production',
      'Uniquement dans les toilettes',
      'Une seule fois par jour, peu importe le lieu',
      'Ce n’est pas nécessaire si on porte des gants',
    ],
    correctIndex: 0,
  },
  {
    question: 'Quel est le rôle de la coiffe dans la tenue de travail ?',
    options: [
      'Décorer la tenue',
      'Protéger les yeux',
      'Prévenir les chutes de cheveux dans les denrées',
      'Réduire le bruit ambiant',
    ],
    correctIndex: 2,
  },
  {
    question: 'Que doit-on faire des gants en quittant la zone de production ?',
    options: [
      'Les jeter',
      'Les laver et les réutiliser',
      'Les ranger dans un tiroir',
      'Les donner à un collègue',
    ],
    correctIndex: 0,
  },
  {
    question: 'Quelle est la différence entre nettoyage et désinfection ?',
    options: [
      'Ce sont deux mots pour la même action',
      'Le nettoyage élimine les microorganismes',
      'Le nettoyage enlève les souillures physiques/chimiques, la désinfection élimine les microorganismes',
      'La désinfection ne sert à rien après le nettoyage',
    ],
    correctIndex: 2,
  },
  {
    question: 'Dans la méthode QQOQCP pour construire un plan de nettoyage, que signifie le "Quoi" ?',
    options: [
      'Définir qui est responsable',
      'Identifier toutes les surfaces et équipements à nettoyer',
      'Définir la fréquence',
      'Décrire la procédure de nettoyage',
    ],
    correctIndex: 1,
  },
  {
    question: 'Qui doit être responsabilisé pour le nettoyage/désinfection, même si celui-ci est externalisé ?',
    options: ['Le personnel de production', 'Uniquement le prestataire externe', 'Personne', 'Le client'],
    correctIndex: 0,
  },
  {
    question: 'Quel type de dépistage est réalisé pour la santé du personnel ?',
    options: ['Test de vue', 'Analyse de sang complète', 'Analyse bactériologique (recherche de Salmonelles)', 'Aucun dépistage'],
    correctIndex: 2,
  },
  {
    question: 'Quel est le seul moyen de garantir la salubrité de l’entreprise et du matériel ?',
    options: ['La décoration des locaux', "L'augmentation du personnel", 'Le nettoyage/désinfection régulier', 'La climatisation'],
    correctIndex: 2,
  },
];

export const formations: Formation[] = [
  {
    slug: 'jus-de-mangue',
    title: 'Formation',
    subtitle: 'Jus de mangue',
    fruit: 'Mangue',
    modules: [
      { title: 'Introduction à la transformation de la mangue', duration: '10 min' },
      { title: "Bonnes pratiques d'hygiène et de fabrication", duration: '12 min' },
      { title: "Techniques d'extraction et de pasteurisation", duration: '15 min' },
      { title: 'Conditionnement et étiquetage', duration: '8 min' },
      { title: 'Gestion de la qualité et conservation', duration: '10 min' },
    ],
    documents: [hygieneCourseDocument],
    quiz: hygieneQuiz,
    video: hygieneCourseVideo,
    commercialisation: {
      packagingTitle: 'Bouteille PET 1L',
      packagingEmoji: '🍾',
      packagingFeatures: ['Sécurisé', 'Recyclable', 'Bonne conservation', 'Format apprécié'],
      distributionChannels: [
        { label: 'Vente directe', icon: { ios: 'hand.raised.fill', android: 'handshake', web: 'handshake' } },
        { label: 'Boutiques / Épiceries', icon: { ios: 'storefront.fill', android: 'store', web: 'store' } },
        { label: 'Supermarchés', icon: { ios: 'cart.fill', android: 'shopping_cart', web: 'shopping-cart' } },
        { label: 'Restauration / Hôtels', icon: { ios: 'fork.knife', android: 'restaurant', web: 'utensils' } },
        { label: 'Vente en ligne', icon: { ios: 'globe', android: 'language', web: 'globe' } },
      ],
    },
  },
  {
    slug: 'confiture-de-mangue',
    title: 'Formation',
    subtitle: 'Confiture de mangue',
    fruit: 'Mangue',
    modules: [
      { title: 'Sélection et préparation des fruits', duration: '10 min' },
      { title: "Bonnes pratiques d'hygiène et de fabrication", duration: '12 min' },
      { title: 'Cuisson et dosage du sucre/pectine', duration: '15 min' },
      { title: 'Mise en pot et stérilisation', duration: '12 min' },
      { title: 'Gestion de la qualité et conservation', duration: '8 min' },
    ],
    documents: [hygieneCourseDocument],
    quiz: hygieneQuiz,
    video: hygieneCourseVideo,
    commercialisation: {
      packagingTitle: 'Bocal en verre 250g',
      packagingEmoji: '🍯',
      packagingFeatures: ['Hermétique', 'Réutilisable', 'Longue conservation', 'Image artisanale'],
      distributionChannels: [
        { label: 'Vente directe', icon: { ios: 'hand.raised.fill', android: 'handshake', web: 'handshake' } },
        { label: 'Marchés locaux', icon: { ios: 'basket.fill', android: 'shopping_basket', web: 'shopping-basket' } },
        { label: 'Boutiques / Épiceries', icon: { ios: 'storefront.fill', android: 'store', web: 'store' } },
        { label: 'Épiceries fines', icon: { ios: 'star.fill', android: 'star', web: 'star' } },
        { label: 'Vente en ligne', icon: { ios: 'globe', android: 'language', web: 'globe' } },
      ],
    },
  },
];

