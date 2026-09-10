export type FormationModule = {
  title: string;
  duration: string;
  document?: FormationDocument;
  quiz?: QuizQuestion[];
  content?: string[];
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
  video?: number;
  commercialisation: Commercialisation;
};

const hygieneCourseVideo = require('../../assets/videos/cours-normes-hygiene.mp4');

const hygieneCourseDocument: FormationDocument = {
  title: 'Cours normes hygiène',
  fileType: 'PPTX',
  asset: require('../../assets/documents/cours-normes-hygiene.pptx'),
};

const qualiteCourseDocument: FormationDocument = {
  title: 'Cours gestion de la qualité et conservation',
  fileType: 'PPTX',
  asset: require('../../assets/documents/cours-qualite-khadidiatou.pptx'),
};

const conceptionUniteCourseDocument: FormationDocument = {
  title: "Conception d'une unité de transformation",
  fileType: 'PPTX',
  asset: require('../../assets/documents/conception-unite-transformation.pptx'),
};

// Introduction course for module 1 of "Jus de mangue".
const introJusMangueContent: string[] = [
  "La transformation de la mangue en jus est une activité agroalimentaire qui permet de valoriser les fruits, de réduire les pertes post-récolte et de créer un produit à plus longue durée de conservation que le fruit frais.",
  "Ce module vous présente les grandes étapes du procédé : réception et tri des fruits, lavage, extraction du jus, pasteurisation, conditionnement et étiquetage, avant la commercialisation.",
  "Une bonne transformation commence toujours par le choix de mangues saines et arrivées à bonne maturité : c'est la base d'un jus de qualité, sûr pour la santé du consommateur et agréable en goût.",
  "Tout au long de cette formation, vous apprendrez également les bonnes pratiques d'hygiène, les techniques de pasteurisation, le conditionnement et enfin la gestion de la qualité et de la conservation du produit fini.",
];

// Introduction course for module 1 of "Confiture de mangue".
const selectionPreparationContent: string[] = [
  "La confiture de mangue est un produit transformé obtenu par cuisson de la pulpe de mangue avec du sucre, ce qui permet de conserver le fruit bien au-delà de sa saison de récolte.",
  "Ce module d'introduction présente les étapes clés de la sélection et de la préparation des fruits : tri par maturité, lavage, épluchage, dénoyautage et découpe de la pulpe.",
  "Le choix de fruits sains, bien mûrs et sans meurtrissures est essentiel : il conditionne directement la qualité, le goût et la sécurité sanitaire de la confiture obtenue.",
  "Les modules suivants aborderont les bonnes pratiques d'hygiène, la cuisson et le dosage sucre/pectine, la mise en pot et la stérilisation, puis la gestion de la qualité et de la conservation.",
];

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

// Module "Introduction à la transformation de la mangue" (jus de mangue).
const introJusMangueQuiz: QuizQuestion[] = [
  {
    question: 'Quel est le principal critère pour choisir les mangues destinées à la transformation en jus ?',
    options: ['Leur couleur uniquement', 'Leur degré de maturité et leur bon état sanitaire', 'Leur taille la plus grande possible', 'Leur prix le plus bas'],
    correctIndex: 1,
  },
  {
    question: "Pourquoi trie-t-on les mangues avant transformation ?",
    options: [
      "Pour éliminer les fruits abîmés, pourris ou trop verts",
      "Pour les compter plus facilement",
      "Ce n'est pas nécessaire",
      "Pour les vendre plus cher",
    ],
    correctIndex: 0,
  },
  {
    question: 'Quelle est la première étape avant le pressage/extraction du jus ?',
    options: ['La mise en bouteille', 'Le lavage et l’épluchage des fruits', 'L’étiquetage', 'La pasteurisation'],
    correctIndex: 1,
  },
  {
    question: 'À quel stade de maturité la mangue est-elle la plus adaptée pour faire du jus ?',
    options: ['Verte et dure', 'Mûre à point, sucrée et parfumée', 'Pourrie', 'Immature et acide'],
    correctIndex: 1,
  },
  {
    question: 'Pourquoi peser les fruits en début de production est-il utile ?',
    options: [
      'Pour calculer les rendements et les besoins en intrants',
      'Ce n’est jamais utile',
      'Uniquement pour la décoration',
      'Pour fixer le prix de vente au hasard',
    ],
    correctIndex: 0,
  },
  {
    question: 'Que risque-t-on si on utilise des mangues trop mûres ou abîmées ?',
    options: [
      'Une meilleure qualité du jus',
      'Un jus de moins bonne qualité et un risque sanitaire accru',
      'Aucun risque',
      'Un jus plus sucré sans inconvénient',
    ],
    correctIndex: 1,
  },
  {
    question: 'Quel matériel est essentiel pour bien laver les mangues avant transformation ?',
    options: ['Eau propre et bacs de lavage adaptés', 'Aucun matériel particulier', 'Uniquement un chiffon sec', 'De la peinture'],
    correctIndex: 0,
  },
  {
    question: "Pourquoi planifie-t-on l'approvisionnement en fruits selon la saison de récolte ?",
    options: [
      'Pour garantir la disponibilité et la fraîcheur des matières premières',
      "Ce n'est pas nécessaire",
      'Pour augmenter les coûts inutilement',
      'Le calendrier n’a aucune importance',
    ],
    correctIndex: 0,
  },
  {
    question: 'Quel est un objectif clé du module d’introduction à la transformation ?',
    options: [
      'Comprendre les étapes générales du procédé et les bonnes pratiques de départ',
      'Apprendre à vendre le produit fini uniquement',
      'Se concentrer uniquement sur l’étiquetage',
      'Ignorer les normes de qualité',
    ],
    correctIndex: 0,
  },
  {
    question: 'Pourquoi établir une fiche technique du produit dès le début du projet ?',
    options: [
      'Pour formaliser les étapes, ingrédients et paramètres clés du procédé',
      'Ce n’est jamais utile',
      'Uniquement pour la publicité',
      'Pour fixer un prix au hasard',
    ],
    correctIndex: 0,
  },
];

// Module "Techniques d'extraction et de pasteurisation".
const extractionPasteurisationQuiz: QuizQuestion[] = [
  {
    question: "Quel est l'objectif principal de la pasteurisation du jus ?",
    options: [
      'Améliorer uniquement la couleur du jus',
      'Détruire les microorganismes pathogènes et prolonger la conservation',
      'Ajouter du sucre',
      'Réduire le volume du jus',
    ],
    correctIndex: 1,
  },
  {
    question: 'Que faut-il surveiller pendant la pasteurisation ?',
    options: ['Le bruit ambiant', 'La température et la durée de traitement', 'La couleur des emballages', 'Le nombre de bouteilles'],
    correctIndex: 1,
  },
  {
    question: "Après extraction, pourquoi filtre-t-on souvent le jus de mangue ?",
    options: [
      "Pour retirer les fibres et particules solides",
      "Pour le colorer",
      "Pour augmenter son volume",
      "Ce n'est jamais fait",
    ],
    correctIndex: 0,
  },
  {
    question: 'Quelle méthode est couramment utilisée pour extraire le jus de la pulpe de mangue ?',
    options: ['Le pressage/broyage mécanique de la pulpe', 'La combustion', 'Le séchage au soleil uniquement', 'La congélation seule'],
    correctIndex: 0,
  },
  {
    question: 'Que se passe-t-il si la température de pasteurisation est trop basse ?',
    options: [
      'Les microorganismes ne sont pas suffisamment détruits, risque sanitaire',
      'Le jus est de meilleure qualité',
      'Rien de particulier',
      'Le jus devient plus sucré',
    ],
    correctIndex: 0,
  },
  {
    question: 'Pourquoi refroidit-on rapidement le jus après pasteurisation ?',
    options: [
      'Pour limiter la prolifération de microorganismes et préserver la qualité',
      "Ce n'est pas nécessaire",
      'Pour le rendre plus acide',
      'Pour changer sa couleur',
    ],
    correctIndex: 0,
  },
  {
    question: "Quel équipement est généralement utilisé pour la pasteurisation à petite échelle ?",
    options: ['Un bain-marie ou une marmite avec contrôle de température', 'Un four à micro-ondes', 'Un réfrigérateur', 'Une centrifugeuse'],
    correctIndex: 0,
  },
  {
    question: "Pourquoi est-il important de standardiser (homogénéiser) le jus avant conditionnement ?",
    options: [
      "Pour obtenir une texture et une qualité constantes d'un lot à l'autre",
      "Ce n'est pas important",
      "Pour le rendre plus liquide uniquement",
      "Pour réduire son volume",
    ],
    correctIndex: 0,
  },
  {
    question: 'Quel paramètre du jus peut-on ajuster après extraction (ex : dilution, sucre) ?',
    options: ['Le degré Brix (teneur en sucre) et l’acidité', 'La couleur des bouteilles', 'La date de récolte', 'Le nom du produit'],
    correctIndex: 0,
  },
  {
    question: 'Pourquoi contrôle-t-on la couleur et l’odeur du jus après pasteurisation ?',
    options: [
      'Pour détecter tout signe d’altération avant conditionnement',
      "Ce n'est jamais vérifié",
      'Pour changer la recette',
      'Uniquement pour la publicité',
    ],
    correctIndex: 0,
  },
];

// Module "Conditionnement et étiquetage" (jus de mangue).
const conditionnementEtiquetageQuiz: QuizQuestion[] = [
  {
    question: "Pourquoi remplit-on les bouteilles de jus à chaud (à haute température) ?",
    options: [
      "Pour limiter la contamination et favoriser une bonne conservation",
      "Pour gagner du temps uniquement",
      "Pour améliorer le goût",
      "Ce n'est pas important",
    ],
    correctIndex: 0,
  },
  {
    question: "Quelle information est obligatoire sur l'étiquette d'un produit alimentaire ?",
    options: [
      "La date de fabrication/péremption et la liste des ingrédients",
      "Le nom du transporteur",
      "La couleur préférée du fabricant",
      "Aucune information n'est obligatoire",
    ],
    correctIndex: 0,
  },
  {
    question: 'Quel est un avantage d’un bon conditionnement du produit ?',
    options: ['Il augmente les coûts sans bénéfice', 'Il protège le produit et rassure le consommateur', 'Il rend le produit périssable plus vite', 'Il n’a aucun effet'],
    correctIndex: 1,
  },
  {
    question: 'Pourquoi vérifie-t-on l’étanchéité des bouteilles après remplissage ?',
    options: [
      'Pour éviter les fuites et la contamination du produit',
      "Ce n'est pas nécessaire",
      'Pour améliorer uniquement l’esthétique',
      'Pour augmenter le poids du produit',
    ],
    correctIndex: 0,
  },
  {
    question: 'Quel type d’emballage est recommandé pour le jus de mangue en bouteille ?',
    options: ['Un emballage alimentaire sécurisé et recyclable (ex : PET)', 'N’importe quel contenant non alimentaire', 'Un sac en papier simple', 'Un contenant non hermétique'],
    correctIndex: 0,
  },
  {
    question: 'Que doit indiquer le numéro de lot sur l’étiquette ?',
    options: [
      'Il permet la traçabilité du produit en cas de problème',
      'Il n’a aucune utilité',
      'Il indique uniquement le prix',
      'Il remplace la date de péremption',
    ],
    correctIndex: 0,
  },
  {
    question: 'Pourquoi stocke-t-on les bouteilles à l’abri de la lumière directe après conditionnement ?',
    options: [
      'Pour préserver la couleur et la qualité nutritionnelle du jus',
      "Ce n'est pas important",
      'Pour accélérer la fermentation',
      'Pour changer le goût du produit',
    ],
    correctIndex: 0,
  },
  {
    question: "Quel élément d'étiquetage aide le consommateur à connaître la composition du produit ?",
    options: ['La liste des ingrédients', 'Le nom du transporteur', 'La couleur du bouchon', 'Le numéro de téléphone du magasin'],
    correctIndex: 0,
  },
  {
    question: "Pourquoi contrôle-t-on le poids/volume des bouteilles avant expédition ?",
    options: [
      'Pour garantir la conformité avec ce qui est annoncé sur l’étiquette',
      "Ce n'est jamais vérifié",
      'Pour augmenter le prix de vente',
      'Pour changer la recette',
    ],
    correctIndex: 0,
  },
  {
    question: 'Pourquoi appose-t-on un cachet ou sceau de garantie sur certains emballages ?',
    options: [
      'Pour prouver l’intégrité du produit avant première ouverture',
      'Ce n’est jamais fait',
      'Uniquement pour la décoration',
      'Pour augmenter le poids du produit',
    ],
    correctIndex: 0,
  },
];

// Module "Sélection et préparation des fruits" (confiture de mangue).
const selectionPreparationQuiz: QuizQuestion[] = [
  {
    question: 'Pour une confiture de qualité, quel type de mangues privilégie-t-on ?',
    options: ['Des mangues bien mûres, saines et sans meurtrissures', 'Des mangues encore vertes', 'Des mangues abîmées pour ne rien perdre', "N'importe quel fruit"],
    correctIndex: 0,
  },
  {
    question: 'Quelle étape suit généralement le lavage des fruits ?',
    options: ['L’épluchage et le découpage de la pulpe', 'La mise en carton', "L'étiquetage final", 'Le transport vers le client'],
    correctIndex: 0,
  },
  {
    question: 'Pourquoi élimine-t-on le noyau et la peau de la mangue avant cuisson ?',
    options: [
      "Ils ne sont pas comestibles/adaptés à la confiture et nuisent à la texture",
      'Pour augmenter le poids du produit',
      "Ce n'est jamais fait",
      'Pour colorer la confiture',
    ],
    correctIndex: 0,
  },
  {
    question: 'Pourquoi découpe-t-on la pulpe de mangue en petits morceaux avant cuisson ?',
    options: [
      'Pour faciliter et accélérer une cuisson homogène',
      "Ce n'est pas nécessaire",
      'Pour la rendre plus dure',
      'Pour changer sa couleur',
    ],
    correctIndex: 0,
  },
  {
    question: 'Quel est un signe qu’une mangue n’est plus propre à la transformation ?',
    options: ['Présence de moisissures ou odeur anormale', 'Une couleur jaune-orangé normale', 'Un parfum sucré agréable', 'Une texture ferme et saine'],
    correctIndex: 0,
  },
  {
    question: 'Pourquoi trie-t-on les fruits par degré de maturité avant préparation ?',
    options: [
      'Pour obtenir une cuisson et un goût homogènes',
      'Ce n’a aucune importance',
      'Pour les vendre séparément uniquement',
      'Pour les compter plus vite',
    ],
    correctIndex: 0,
  },
  {
    question: 'Quel ustensile est couramment utilisé pour peser les fruits et ingrédients ?',
    options: ['Une balance', 'Un thermomètre uniquement', 'Une règle', 'Un chronomètre'],
    correctIndex: 0,
  },
  {
    question: 'Pourquoi rincer les fruits à l’eau claire avant préparation ?',
    options: [
      'Pour éliminer poussières, résidus et micro-organismes de surface',
      "Ce n'est pas nécessaire",
      'Pour les ramollir',
      'Pour changer leur goût',
    ],
    correctIndex: 0,
  },
  {
    question: 'Quel est un critère important pour choisir les ustensiles de préparation ?',
    options: ['Qu’ils soient propres et adaptés au contact alimentaire', 'Leur couleur uniquement', 'Leur prix le plus bas', 'Leur poids le plus lourd'],
    correctIndex: 0,
  },
  {
    question: 'Pourquoi retirer les parties abimées d’un fruit avant de l’utiliser ?',
    options: [
      'Pour éviter d’altérer le goût et la qualité sanitaire du produit final',
      "Ce n'est pas nécessaire",
      'Pour augmenter le rendement',
      'Pour changer la couleur du produit',
    ],
    correctIndex: 0,
  },
];

// Module "Cuisson et dosage du sucre/pectine".
const cuissonDosageQuiz: QuizQuestion[] = [
  {
    question: 'Quel est le rôle principal du sucre dans la confiture ?',
    options: ['Aucun rôle particulier', "Assurer la conservation et la texture en plus du goût", 'Colorer uniquement', 'Remplacer les fruits'],
    correctIndex: 1,
  },
  {
    question: 'À quoi sert la pectine dans la préparation de la confiture ?',
    options: ['À accélérer la cuisson', 'À obtenir la texture gélifiée caractéristique de la confiture', 'À conserver la couleur uniquement', 'Elle est inutile'],
    correctIndex: 1,
  },
  {
    question: 'Comment vérifie-t-on généralement que la cuisson de la confiture est suffisante ?',
    options: [
      'En testant la prise (nappage/goutte qui fige) et la température',
      'En comptant uniquement le temps écoulé',
      'En regardant la couleur du récipient',
      "On ne vérifie jamais rien",
    ],
    correctIndex: 0,
  },
  {
    question: 'Pourquoi ajoute-t-on parfois du jus de citron dans la confiture ?',
    options: [
      'Pour ajuster l’acidité et favoriser la prise de la pectine',
      "Ce n'est jamais fait",
      'Pour le colorer',
      'Pour le rendre plus sucré',
    ],
    correctIndex: 0,
  },
  {
    question: 'Que se passe-t-il si on ajoute trop peu de sucre dans la confiture ?',
    options: [
      'La conservation est moins bonne et la texture peut être altérée',
      'La confiture se conserve mieux',
      'Rien de particulier',
      'La confiture devient plus ferme',
    ],
    correctIndex: 0,
  },
  {
    question: 'Pourquoi faut-il remuer régulièrement la confiture pendant la cuisson ?',
    options: [
      'Pour éviter qu’elle n’attache et ne brûle au fond',
      "Ce n'est pas nécessaire",
      'Pour la refroidir plus vite',
      'Pour changer sa couleur',
    ],
    correctIndex: 0,
  },
  {
    question: 'Quel est un risque si la confiture est cuite trop longtemps ?',
    options: [
      'Elle peut caraméliser, durcir ou perdre sa texture',
      'Elle devient toujours meilleure',
      'Aucun risque',
      'Elle devient plus liquide',
    ],
    correctIndex: 0,
  },
  {
    question: 'Quel type de récipient est recommandé pour la cuisson de la confiture ?',
    options: ['Une marmite/bassine à fond épais adaptée à l’usage alimentaire', 'Un récipient en plastique fin', 'Un contenant non alimentaire', 'Un simple sac plastique'],
    correctIndex: 0,
  },
  {
    question: 'Pourquoi respecter un dosage précis sucre/fruit/pectine est-il important ?',
    options: [
      'Pour garantir une texture, un goût et une conservation constants',
      'Le dosage n’a aucune importance',
      'Pour rendre le produit plus cher uniquement',
      'Pour changer la couleur du produit',
    ],
    correctIndex: 0,
  },
  {
    question: 'Pourquoi laisse-t-on parfois reposer les fruits avec le sucre avant cuisson (maceration) ?',
    options: [
      'Pour faire ressortir le jus des fruits et faciliter la cuisson',
      "Ce n'est jamais fait",
      'Pour les rendre plus durs',
      'Pour changer leur couleur',
    ],
    correctIndex: 0,
  },
];

// Module "Mise en pot et stérilisation".
const misePotSterilisationQuiz: QuizQuestion[] = [
  {
    question: 'Pourquoi verse-t-on la confiture chaude directement dans les bocaux ?',
    options: [
      "Pour créer un vide d'air favorisant une bonne conservation à la fermeture",
      'Pour gagner du temps uniquement',
      "Pour améliorer la couleur",
      "Ce n'est pas important",
    ],
    correctIndex: 0,
  },
  {
    question: "Que doit-on vérifier sur les bocaux avant de les réutiliser ?",
    options: [
      "Qu'ils sont propres, sans fissures et correctement stérilisés",
      'Rien, tous les bocaux conviennent',
      'Uniquement leur couleur',
      'Leur date de fabrication du verre',
    ],
    correctIndex: 0,
  },
  {
    question: "Quel est l'objectif de la stérilisation des bocaux remplis ?",
    options: [
      'Éliminer les microorganismes restants et assurer une bonne conservation',
      "Rendre le verre plus solide",
      'Améliorer uniquement l’aspect visuel',
      'Aucun objectif particulier',
    ],
    correctIndex: 0,
  },
  {
    question: 'Pourquoi retourne-t-on parfois les bocaux juste après fermeture ?',
    options: [
      'Pour aider à stériliser le couvercle et créer un vide d’air',
      "Ce n'est jamais fait",
      'Pour refroidir plus vite',
      'Pour changer la couleur du produit',
    ],
    correctIndex: 0,
  },
  {
    question: 'Comment sait-on qu’un bocal est correctement fermé sous vide ?',
    options: [
      'Le couvercle est incurvé vers l’intérieur et ne « clique » pas au toucher',
      'Le couvercle fait un bruit de clic quand on appuie dessus',
      'Cela ne se vérifie jamais',
      'Le bocal est plus léger que prévu',
    ],
    correctIndex: 0,
  },
  {
    question: 'À quelle température remplit-on généralement les bocaux de confiture ?',
    options: ['À chaud, juste après la cuisson', 'À température ambiante uniquement', 'Toujours froide', 'Congelée'],
    correctIndex: 0,
  },
  {
    question: 'Pourquoi laisse-t-on un petit espace vide en haut du bocal avant fermeture ?',
    options: [
      'Pour permettre la formation du vide d’air à la fermeture',
      "Ce n'est pas nécessaire",
      'Pour économiser de la confiture',
      'Pour changer le goût',
    ],
    correctIndex: 0,
  },
  {
    question: 'Que faire si un couvercle de bocal est rouillé ou déformé ?',
    options: ['Ne pas l’utiliser et le remplacer', 'L’utiliser quand même', 'Le repeindre', 'Le réchauffer avant usage'],
    correctIndex: 0,
  },
  {
    question: 'Où doit-on stocker les bocaux de confiture après stérilisation ?',
    options: [
      'Dans un endroit propre, sec et à l’abri de la lumière',
      "Peu importe l'endroit",
      'En plein soleil',
      'Dans un lieu humide',
    ],
    correctIndex: 0,
  },
  {
    question: 'Pourquoi étiqueter la date de mise en pot sur chaque bocal de confiture ?',
    options: [
      'Pour assurer la traçabilité et suivre la durée de conservation',
      "Ce n'est jamais fait",
      'Uniquement pour la décoration',
      'Pour fixer un prix au hasard',
    ],
    correctIndex: 0,
  },
];

// Module "Gestion de la qualité et conservation" (commun aux deux formations).
const qualiteConservationQuiz: QuizQuestion[] = [
  {
    question: "Pourquoi contrôle-t-on régulièrement la qualité du produit fini ?",
    options: [
      "Pour détecter tout défaut avant la commercialisation",
      "Ce n'est pas nécessaire une fois le produit conditionné",
      "Uniquement pour respecter une formalité administrative",
      "Pour augmenter artificiellement le prix",
    ],
    correctIndex: 0,
  },
  {
    question: 'Quel facteur influence le plus la durée de conservation d’un produit transformé ?',
    options: [
      'Le respect des bonnes pratiques d’hygiène et de conditionnement',
      'La couleur de l’emballage',
      'Le nombre d’employés',
      'Le jour de la semaine',
    ],
    correctIndex: 0,
  },
  {
    question: 'Où et comment doit-on stocker les produits transformés pour bien les conserver ?',
    options: [
      "Dans un endroit propre, sec, à l'abri de la lumière et de la chaleur excessive",
      "Peu importe l'endroit",
      "À l'extérieur en plein soleil",
      "Dans un lieu humide sans précaution",
    ],
    correctIndex: 0,
  },
  {
    question: 'Quel est l’intérêt de tenir un registre de traçabilité des lots produits ?',
    options: [
      'Pouvoir retrouver l’origine et retirer un lot en cas de problème',
      'Aucun intérêt particulier',
      'Uniquement pour la comptabilité',
      'Pour décorer le carnet de production',
    ],
    correctIndex: 0,
  },
  {
    question: 'Quel signe indique qu’un produit transformé n’est plus consommable ?',
    options: [
      'Odeur anormale, moisissure ou gonflement de l’emballage',
      'Une couleur habituelle et stable',
      'Une date de fabrication récente',
      'Un emballage intact et propre',
    ],
    correctIndex: 0,
  },
  {
    question: 'Pourquoi respecter la chaîne du froid est-il important pour certains produits ?',
    options: [
      'Pour limiter la prolifération de microorganismes et préserver la qualité',
      "Ce n'est jamais nécessaire",
      'Pour changer la couleur du produit',
      'Pour réduire le poids du produit',
    ],
    correctIndex: 0,
  },
  {
    question: 'Que doit-on vérifier avant de mettre un produit en vente ?',
    options: [
      'Sa conformité (qualité, étiquetage, date de péremption)',
      'Rien, tout produit peut être vendu tel quel',
      'Uniquement son prix',
      'Uniquement sa couleur',
    ],
    correctIndex: 0,
  },
  {
    question: 'Quel est un des piliers de la démarche qualité en agroalimentaire ?',
    options: [
      'L’amélioration continue et le contrôle à chaque étape du procédé',
      'Ignorer les défauts mineurs',
      'Produire le plus vite possible sans contrôle',
      'Réduire les coûts au détriment de la sécurité',
    ],
    correctIndex: 0,
  },
  {
    question: 'Pourquoi former le personnel aux bonnes pratiques de conservation est-il utile ?',
    options: [
      'Pour garantir une application uniforme des règles de qualité et de sécurité',
      "Ce n'est pas nécessaire si le matériel est bon",
      'Uniquement pour respecter une formalité',
      'Cela n’a aucun impact sur la qualité finale',
    ],
    correctIndex: 0,
  },
  {
    question: 'Que doit prévoir un plan de gestion de la qualité en cas de non-conformité détectée ?',
    options: [
      'Des actions correctives et, si besoin, le retrait des produits concernés',
      'Ignorer le problème et continuer la production',
      'Uniquement informer le client après coup',
      'Aucune action n’est nécessaire',
    ],
    correctIndex: 0,
  },
];
export const formations: Formation[] = [
  {
    slug: 'jus-de-mangue',
    title: 'Formation',
    subtitle: 'Jus de mangue',
    fruit: 'Mangue',
    modules: [
      { title: 'Introduction à la transformation de la mangue', duration: '10 min', quiz: introJusMangueQuiz, content: introJusMangueContent },
      { title: "Bonnes pratiques d'hygiène et de fabrication", duration: '12 min', document: hygieneCourseDocument, quiz: hygieneQuiz },
      { title: "Techniques d'extraction et de pasteurisation", duration: '15 min', quiz: extractionPasteurisationQuiz },
      { title: 'Conditionnement et étiquetage', duration: '8 min', document: conceptionUniteCourseDocument, quiz: conditionnementEtiquetageQuiz },
      { title: 'Gestion de la qualité et conservation', duration: '10 min', document: qualiteCourseDocument, quiz: qualiteConservationQuiz },
    ],
    documents: [],
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
      { title: 'Sélection et préparation des fruits', duration: '10 min', quiz: selectionPreparationQuiz, content: selectionPreparationContent },
      { title: "Bonnes pratiques d'hygiène et de fabrication", duration: '12 min', document: hygieneCourseDocument, quiz: hygieneQuiz },
      { title: 'Cuisson et dosage du sucre/pectine', duration: '15 min', quiz: cuissonDosageQuiz },
      { title: 'Mise en pot et stérilisation', duration: '12 min', document: conceptionUniteCourseDocument, quiz: misePotSterilisationQuiz },
      { title: 'Gestion de la qualité et conservation', duration: '8 min', document: qualiteCourseDocument, quiz: qualiteConservationQuiz },
    ],
    documents: [],
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

