export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readTime: string;
  image: string;
  sections: { heading?: string; paragraphs: string[]; bullets?: string[] }[];
};

export const posts: BlogPost[] = [
  {
    slug: "broyeur-kenwood",
    title: "Broyeur Kenwood : l'outil incontournable pour une cuisine pratique et performante",
    excerpt:
      "Polyvalent, robuste et facile à utiliser, le broyeur Kenwood s'impose comme un allié de choix pour gagner du temps en cuisine et réussir toutes vos préparations.",
    category: "Cuisine",
    date: "2025-03-18",
    readTime: "5 min",
    image:
      "https://www.verodav-home.com/wp-content/uploads/2025/03/KFV_54xB7lJ4MoC2Yl_600x600@2x-copy.jpg",
    sections: [
      {
        paragraphs: [
          "Choisir le bon broyeur, c'est se simplifier la vie au quotidien. Kenwood propose une gamme pensée pour les passionnés comme pour les cuisiniers pressés : un moteur puissant, des accessoires bien conçus et une finition durable qui fait la différence dans la durée.",
        ],
      },
      {
        heading: "Pourquoi un broyeur Kenwood ?",
        paragraphs: [
          "La marque s'est imposée grâce à la qualité de ses moteurs et à la pertinence de ses accessoires. Que vous prépariez des sauces minute, des pâtés maison ou que vous mouliez vos propres épices, l'appareil reste stable, précis et silencieux.",
        ],
        bullets: [
          "Polyvalence : fruits, légumes, viandes, noix, graines, épices.",
          "Prise en main rapide grâce à des commandes intuitives.",
          "Robustesse et matériaux pensés pour un usage quotidien.",
          "Entretien simplifié, pièces amovibles compatibles lave-vaisselle.",
        ],
      },
      {
        heading: "Bien choisir son modèle",
        paragraphs: [
          "Avant tout, déterminez la fréquence d'utilisation et le volume préparé. Une famille nombreuse appréciera un grand bol et un moteur généreux ; un foyer plus modeste se contentera d'un modèle compact, plus rapide à sortir et à nettoyer.",
        ],
        bullets: [
          "Capacité adaptée à votre quotidien.",
          "Puissance suffisante pour les ingrédients durs.",
          "Accessoires inclus en fonction de vos recettes.",
        ],
      },
      {
        heading: "Quelques idées pour démarrer",
        paragraphs: [
          "Une fois l'appareil installé, les possibilités sont nombreuses : smoothies du matin, soupes onctueuses, viandes hachées pour des burgers maison ou amandes broyées pour la pâtisserie. Le broyeur Kenwood transforme rapidement la corvée en plaisir.",
        ],
      },
    ],
  },
  {
    slug: "le-moulin-a-pavot",
    title: "Le moulin à pavot : un outil indispensable pour sublimer vos préparations",
    excerpt:
      "Petit accessoire, grand effet. Le moulin à pavot révèle tout l'arôme des graines et ouvre la porte à une multitude de recettes traditionnelles et créatives.",
    category: "Accessoires",
    date: "2025-03-04",
    readTime: "4 min",
    image:
      "https://www.verodav-home.com/wp-content/uploads/2025/03/HMM_5_Tisch_web_600x600@2x.jpeg",
    sections: [
      {
        paragraphs: [
          "Les graines de pavot sont précieuses en pâtisserie comme en cuisine salée, mais c'est moulues qu'elles libèrent tout leur parfum. Un moulin spécialisé permet d'obtenir une mouture régulière, idéale pour les gâteaux d'Europe de l'Est, les pains briochés ou les sauces gourmandes.",
        ],
      },
      {
        heading: "Pourquoi moudre ses graines soi-même ?",
        paragraphs: [
          "Le pavot moulu industriellement perd vite de sa saveur. En le préparant juste avant utilisation, vous conservez les huiles essentielles et donc l'arôme. Le résultat est plus parfumé, plus authentique et plus digeste.",
        ],
        bullets: [
          "Fraîcheur et arôme intacts.",
          "Texture homogène, idéale pour la pâtisserie.",
          "Polyvalent : pavot, sésame, lin, chia.",
        ],
      },
      {
        heading: "Que cuisiner ?",
        paragraphs: [
          "Pensez aux strudels, aux roulés au pavot, mais aussi aux topping de salades, aux pâtes au beurre noisette ou aux pains maison. Une cuillère suffit souvent à transformer une recette toute simple.",
        ],
      },
    ],
  },
  {
    slug: "colle-chaussure-action-la-solution",
    title: "Colle chaussure Action : la solution idéale pour réparer vos chaussures en 2025",
    excerpt:
      "Une semelle qui décolle ne signifie pas qu'il faut jeter la paire. Avec la bonne colle, vous prolongez la vie de vos chaussures en quelques minutes.",
    category: "Bricolage",
    date: "2024-12-12",
    readTime: "4 min",
    image:
      "https://www.verodav-home.com/wp-content/uploads/2024/12/2320.jpg",
    sections: [
      {
        paragraphs: [
          "Réparer plutôt que remplacer : le bon réflexe pour le portefeuille comme pour la planète. Une colle adaptée permet de recoller une semelle, fixer une bride ou consolider un talon en limitant le passage chez le cordonnier.",
        ],
      },
      {
        heading: "Ce qui fait une bonne colle à chaussures",
        paragraphs: [
          "La colle doit rester souple une fois sèche pour suivre les mouvements du pied. Elle doit aussi résister à l'humidité, aux frottements et aux écarts de température. Inutile de mettre une dose énorme : une fine couche bien appliquée tient mieux.",
        ],
        bullets: [
          "Souplesse après séchage.",
          "Résistance à l'eau et aux UV.",
          "Compatibilité cuir, caoutchouc, textile et synthétique.",
        ],
      },
      {
        heading: "Les étapes d'une réparation propre",
        paragraphs: [
          "Nettoyez et dégraissez la zone, poncez légèrement pour faciliter l'accroche, appliquez une fine couche sur les deux surfaces, attendez quelques minutes puis pressez fermement. Maintenez sous presse pendant 12 à 24 heures avant utilisation.",
        ],
      },
    ],
  },
  {
    slug: "adaptateur-de-hachoir-a-viande",
    title: "Adaptateur de hachoir à viande pour KitchenAid® : transformez votre robot en outil polyvalent",
    excerpt:
      "Un seul accessoire et votre robot pâtissier devient une véritable station de préparation : hachage, saucisses, kibbe, le tout sans encombrer le plan de travail.",
    category: "Accessoires",
    date: "2024-04-22",
    readTime: "5 min",
    image:
      "https://www.verodav-home.com/wp-content/uploads/2024/04/KFW-600-Detail_FW_print_MH_600x600@2x-1.jpeg",
    sections: [
      {
        paragraphs: [
          "Votre robot KitchenAid® dispose d'une prise frontale conçue pour accueillir une multitude d'accessoires. L'adaptateur hachoir est l'un des plus utiles : il vous permet de hacher viandes et légumes avec une régularité difficile à obtenir au couteau.",
        ],
      },
      {
        heading: "Ce que vous pouvez préparer",
        paragraphs: [
          "Du steak haché extra-frais aux farces de tomates, en passant par les saucisses maison et les terrines, l'adaptateur ouvre la porte à toutes les recettes du quotidien comme aux préparations plus festives.",
        ],
        bullets: [
          "Viandes hachées au calibre désiré.",
          "Saucisses fraîches avec l'embout poussoir.",
          "Légumes et fruits pour coulis, soupes, compotes.",
        ],
      },
      {
        heading: "Conseils d'utilisation",
        paragraphs: [
          "Travaillez avec de la viande bien froide pour un hachage net et un nettoyage facile. Démontez et rincez l'accessoire juste après usage : tout reste impeccable. Stockez les grilles à plat pour préserver leur tranchant.",
        ],
      },
    ],
  },
  {
    slug: "splendide-grille-extra-fine-1-mm",
    title: "Splendide grille extra-fine 1 mm pour moulin à légumes : la précision au service de vos préparations",
    excerpt:
      "La grille 1 mm transforme votre moulin à légumes en outil de chef : purées veloutées, coulis sans pépins et préparations bébé d'une finesse irréprochable.",
    category: "Accessoires",
    date: "2024-05-10",
    readTime: "4 min",
    image:
      "https://www.verodav-home.com/wp-content/uploads/2024/05/40110-685aX2dAk0vN9v_600x600@2x.jpeg",
    sections: [
      {
        paragraphs: [
          "La finesse de la grille change tout. Avec une grille 1 mm, vous obtenez une texture lisse et homogène, sans avoir à passer au tamis. Idéale pour les coulis de fruits rouges, les soupes raffinées ou les premières purées de bébé.",
        ],
      },
      {
        heading: "Pourquoi cette grille fait la différence",
        paragraphs: [
          "Une grille trop large laisse passer pépins et fibres, une grille trop fine bouche vite. Le 1 mm est le bon compromis : il retient les indésirables tout en gardant un débit confortable.",
        ],
        bullets: [
          "Texture lisse, sans pépins ni peaux.",
          "Inox de qualité alimentaire, facile à nettoyer.",
          "Compatible avec les moulins standards du marché.",
        ],
      },
      {
        heading: "Mettez-la à l'épreuve",
        paragraphs: [
          "Coulis de framboises pour napper un cheesecake, soupe de tomates onctueuse, compotes maison sans morceaux : la grille extra-fine vous fait gagner un cran de qualité sans effort supplémentaire.",
        ],
      },
    ],
  },
  {
    slug: "lunique-colle-klebfest-60-g",
    title: "L'unique colle Klebfest 60 g : la solution idéale pour vos travaux de maison et bricolage",
    excerpt:
      "Une colle compacte mais redoutable d'efficacité : Klebfest 60 g s'adapte à presque tous les matériaux et reste un classique des boîtes à outils bien équipées.",
    category: "Bricolage",
    date: "2024-05-02",
    readTime: "3 min",
    image:
      "https://www.verodav-home.com/wp-content/uploads/2024/05/Kleb_tubemlYX6OVeFndyN_600x600@2x.png",
    sections: [
      {
        paragraphs: [
          "Pour les petites réparations comme pour les projets DIY, il faut une colle fiable, polyvalente et facile à doser. Klebfest 60 g coche toutes les cases avec un format pratique qui se range partout.",
        ],
      },
      {
        heading: "Pour quels usages ?",
        paragraphs: [
          "Bois, métal, plastique rigide, céramique : Klebfest tient sur la plupart des matériaux du quotidien. Idéal pour recoller une anse de tasse, fixer un cadre, réparer un jouet ou consolider un meuble.",
        ],
        bullets: [
          "Multi-matériaux pour la maison.",
          "Format 60 g, suffisant pour des dizaines de réparations.",
          "Application précise grâce à l'embout fin.",
        ],
      },
      {
        heading: "Notre conseil",
        paragraphs: [
          "Nettoyez et séchez les surfaces avant application. Une fine couche suffit : pressez 30 à 60 secondes, puis laissez sécher sans manipuler. Bouchez bien le tube après usage pour préserver la colle.",
        ],
      },
    ],
  },
  {
    slug: "sublime-moulin-a-coulis-en-fil",
    title: "Sublime moulin à coulis en fil inoxydable : l'outil parfait pour des préparations fines et savoureuses",
    excerpt:
      "Un classique indémodable pour transformer fruits et légumes en coulis, purées et compotes d'une finesse remarquable. Robuste, durable, sans électricité.",
    category: "Cuisine",
    date: "2024-05-18",
    readTime: "4 min",
    image:
      "https://www.verodav-home.com/wp-content/uploads/2024/05/MG_9840_600x600@2x.png",
    sections: [
      {
        paragraphs: [
          "Le moulin à coulis en fil inoxydable est l'un de ces ustensiles qui traversent les générations. Sans moteur, sans bruit, il fait le travail à la main avec une régularité étonnante.",
        ],
      },
      {
        heading: "Pourquoi l'adopter",
        paragraphs: [
          "L'inox tressé résiste à l'acidité des fruits et au passage régulier au lave-vaisselle. Le maillage offre une filtration fine qui retient pépins et peaux tout en conservant la chair et le jus.",
        ],
        bullets: [
          "Construction durable en acier inoxydable.",
          "Filtration fine, sans pépins ni fibres.",
          "Pas d'électricité, idéal en cuisine d'été.",
        ],
      },
      {
        heading: "Idées de recettes",
        paragraphs: [
          "Coulis de fraises pour napper une pavlova, soupe froide de tomates, compote de pommes maison ou purée pour bébé : le moulin transforme rapidement les fruits et légumes de saison en préparations soignées.",
        ],
      },
    ],
  },
  {
    slug: "essoreuse-a-salade-en-inox",
    title: "Sublime essoreuse à salade en inox : le secret d'une salade fraîche et croustillante",
    excerpt:
      "Plus solide qu'une essoreuse plastique et beaucoup plus élégante, l'essoreuse à salade en inox sèche vos feuilles parfaitement et s'invite à table sans complexe.",
    category: "Cuisine",
    date: "2024-06-05",
    readTime: "4 min",
    image:
      "https://www.verodav-home.com/wp-content/uploads/2024/04/KFW-600-Detail_FW_print_MH_600x600@2x-1.jpeg",
    sections: [
      {
        paragraphs: [
          "Une salade vraiment bonne, c'est d'abord une salade bien sèche. Sans cela, la vinaigrette glisse et le résultat reste fade. L'essoreuse en inox change la donne : robuste, hygiénique et au rendu impeccable.",
        ],
      },
      {
        heading: "L'inox plutôt que le plastique",
        paragraphs: [
          "L'acier inoxydable ne se déforme pas, ne se tache pas et ne garde pas les odeurs. Une essoreuse en inox traverse les années sans broncher, là où les modèles plastique finissent souvent fendus.",
        ],
        bullets: [
          "Mécanisme silencieux et fluide.",
          "Panier amovible utilisable comme passoire.",
          "Bol qui peut servir de saladier à table.",
        ],
      },
      {
        heading: "Le geste parfait",
        paragraphs: [
          "Rincez votre salade en grandes quantités, égouttez, puis essorez par petites séquences plutôt qu'en une seule longue session. Vos feuilles seront sèches sans être abîmées et tiendront l'assaisonnement à merveille.",
        ],
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
