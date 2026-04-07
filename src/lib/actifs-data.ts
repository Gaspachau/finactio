export interface Chiffre {
  ratio: string;
  valeur: string;
  explication: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explication: string;
}

export interface ActifData {
  slug: string;
  ticker: string;
  name: string;
  type: "ACTION" | "ETF" | "CRYPTO";
  typeBadgeClass: string;
  price: string;
  change: string;
  changePositive: boolean;
  metrics: { label: string; value: string }[];
  description: string;
  histoire: string[];
  chiffres: Chiffre[];
  tauxAnnuelSimu: number;
  performanceLabel: string;
  quiz: QuizQuestion[];
}

const ACTIFS: ActifData[] = [
  {
    slug: "apple",
    ticker: "AAPL",
    name: "Apple Inc.",
    type: "ACTION",
    typeBadgeClass: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    price: "182,52 $",
    change: "+1,34 %",
    changePositive: true,
    metrics: [
      { label: "PER", value: "31x" },
      { label: "Dividende", value: "0,92 %" },
      { label: "Perf. 10 ans", value: "+847 %" },
      { label: "Capitalisation", value: "$3,3 T" },
    ],
    description:
      "Géant technologique américain, concepteur de l'iPhone, du Mac et d'un écosystème de services.",
    histoire: [
      "En 1997, Apple frôle la faillite. L'entreprise perd des centaines de millions de dollars, ses parts de marché s'effondrent face à Microsoft, et ses propres actionnaires parlent de vendre la marque. Gil Amelio, alors PDG, tente de sauver les meubles en rachetant NeXT — la startup fondée par Steve Jobs après son éviction d'Apple en 1985. Ce rachat semblait anodin. Il allait changer le monde.",
      "Jobs reprend les commandes avec une conviction absolue : Apple ne doit pas tout faire, mais ce qu'elle fait doit être parfait. Il taille dans les gammes de produits, rationalise, et signe en 1998 l'iMac — coloré, translucide, radicalement différent. L'iPod suit en 2001, iTunes en 2003. Apple ne vend plus seulement des ordinateurs : elle vend une façon de vivre. Puis, lors d'une keynote mémorable en janvier 2007, Jobs sort de sa poche un appareil qui allait redéfinir le XXIe siècle.",
      "L'iPhone n'était pas qu'un téléphone : c'était un ordinateur de poche, une carte bancaire, une console de jeux, un appareil photo professionnel — le tout dans un objet qu'on tient dans une main. En moins de vingt ans, Apple est passé de la quasi-faillite à $3 000 milliards de capitalisation boursière, devenant la première entreprise au monde à franchir ce seuil. Aujourd'hui, 1,3 milliard d'iPhones actifs circulent sur la planète. La pomme croquée est devenue le logo le plus reconnaissable au monde.",
    ],
    chiffres: [
      {
        ratio: "PER (P/E Ratio)",
        valeur: "31x",
        explication:
          "Tu paies 31 ans de bénéfices pour posséder une part. Comme acheter un appartement en versant 31 ans de loyer d'un coup — cher, mais justifié si la demande reste forte.",
      },
      {
        ratio: "Dividende annuel",
        valeur: "0,92 %",
        explication:
          "Apple te verse environ 0,92 % de ta mise chaque année. Sur 10 000 €, c'est 92 € dans ta poche — sans rien vendre, juste pour avoir investi.",
      },
      {
        ratio: "Marge nette",
        valeur: "26 %",
        explication:
          "Sur chaque tranche de 100 € de revenus, Apple conserve 26 € de bénéfice net. La plupart des entreprises stagnent sous les 10 % — Apple fait partie d'une élite rarissime.",
      },
      {
        ratio: "Croissance du CA",
        valeur: "+8 %/an",
        explication:
          "Le chiffre d'affaires progresse de 8 % par an en moyenne. À ce rythme, il double tous les 9 ans — sans que tu aies quoi que ce soit à faire.",
      },
      {
        ratio: "Capitalisation",
        valeur: "$3 300 Mds",
        explication:
          "Apple vaut plus que le PIB de la France entière. Ou autrement dit : si Apple était un pays, ce serait la 3e économie mondiale.",
      },
    ],
    tauxAnnuelSimu: 0.253,
    performanceLabel: "+847 % sur 10 ans (historique)",
    quiz: [
      {
        question: "En quelle année Apple a-t-il frôlé la faillite avant le retour de Steve Jobs ?",
        options: ["1993", "1997", "2001"],
        answer: 1,
        explication:
          "En 1997, Apple perdait des centaines de millions de dollars. Le rachat de NeXT par Apple a permis à Jobs de revenir aux commandes et de sauver l'entreprise.",
      },
      {
        question: "Quel produit Apple a révolutionné l'industrie du téléphone en 2007 ?",
        options: ["L'iPod Touch", "L'iPhone", "L'iPad"],
        answer: 1,
        explication:
          "L'iPhone, présenté par Steve Jobs en janvier 2007, a redéfini ce qu'est un téléphone en y intégrant internet, la musique et un clavier tactile.",
      },
      {
        question: "Apple a été la première entreprise à dépasser quelle capitalisation boursière ?",
        options: ["$1 000 milliards", "$3 000 milliards", "$5 000 milliards"],
        answer: 1,
        explication:
          "Apple a franchi le cap des $3 000 milliards de capitalisation boursière en janvier 2022 — une première dans l'histoire des marchés financiers.",
      },
    ],
  },

  {
    slug: "bitcoin",
    ticker: "BTC",
    name: "Bitcoin",
    type: "CRYPTO",
    typeBadgeClass: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    price: "67 240 $",
    change: "+3,21 %",
    changePositive: true,
    metrics: [
      { label: "Cap. marché", value: "$1 320 Mds" },
      { label: "Dominance", value: "52,3 %" },
      { label: "Offre max.", value: "21 M BTC" },
      { label: "Prochain halving", value: "2028" },
    ],
    description:
      "Première cryptomonnaie mondiale. Offre limitée à 21 millions d'unités, réseau décentralisé sans autorité centrale.",
    histoire: [
      "En octobre 2008, au cœur de la pire crise financière depuis 1929, un inconnu publiant sous le pseudonyme Satoshi Nakamoto met en ligne un document de 9 pages. Son titre : « Bitcoin: A Peer-to-Peer Electronic Cash System ». L'idée est radicale : créer une monnaie qui n'appartient à personne, infalsifiable, sans banque centrale, dont les règles sont gravées dans le code pour l'éternité. Le 3 janvier 2009, le premier bloc est miné avec ce message inscrit : « The Times 03/Jan/2009 Chancellor on brink of second bailout for banks ». Un pied de nez à l'establishment financier.",
      "Les premières années sont confidentielles — Bitcoin sert surtout aux passionnés de cryptographie. Le premier achat concret : 10 000 BTC échangés contre deux pizzas en mai 2010. Ces pièces vaudraient aujourd'hui plus de $670 millions. En 2013, Bitcoin dépasse 1 000 $ pour la première fois. En 2017, la fièvre spéculative fait exploser le cours à 20 000 $ avant un krach violent à 3 000 $. Le cycle est brutal, répété — mais à chaque fois, le bas du cycle se situe plus haut que le précédent.",
      "En janvier 2024, la SEC américaine approuve les premiers ETF Bitcoin au comptant — un tournant historique. BlackRock, Fidelity et Vanguard proposent désormais Bitcoin comme n'importe quelle action. Les institutions arrivent en masse. Seuls 21 millions de Bitcoin existeront jamais — et 19,6 millions sont déjà minés. Le prochain halving, en 2028, réduira de moitié la récompense des mineurs. La rareté est mathématiquement garantie, inscrite pour toujours dans le code.",
    ],
    chiffres: [
      {
        ratio: "Offre maximale",
        valeur: "21 millions",
        explication:
          "Comme un tableau de maître : il n'en existera jamais plus de 21 millions. La rareté est gravée dans le code source — aucun gouvernement ne peut en créer de nouveaux.",
      },
      {
        ratio: "BTC en circulation",
        valeur: "19,6 M",
        explication:
          "93 % des Bitcoin sont déjà minés. Les 7 % restants seront émis sur environ 120 ans, de plus en plus lentement. La vitesse de création ralentit à chaque halving.",
      },
      {
        ratio: "Dominance marché",
        valeur: "52,3 %",
        explication:
          "Bitcoin représente plus de la moitié de la valeur totale du marché crypto. C'est l'or de l'écosystème numérique — la référence autour de laquelle tout gravite.",
      },
      {
        ratio: "Volatilité",
        valeur: "Très haute",
        explication:
          "Bitcoin a chuté de -80 % à plusieurs reprises dans son histoire, avant de rebondir à chaque fois au-dessus de ses sommets précédents. À ne pas détenir sans estomac solide.",
      },
      {
        ratio: "Transactions/jour",
        valeur: "~350 000",
        explication:
          "350 000 transactions s'effectuent chaque jour sans qu'aucune banque ni aucun État puisse les bloquer ou les censurer. C'est la proposition de valeur fondamentale du réseau.",
      },
    ],
    tauxAnnuelSimu: 0.2,
    performanceLabel: "Taux conservateur 20 %/an (histo. bien supérieur)",
    quiz: [
      {
        question: "Qui a inventé Bitcoin en 2008 ?",
        options: ["Elon Musk", "Satoshi Nakamoto", "Vitalik Buterin"],
        answer: 1,
        explication:
          "Satoshi Nakamoto est un pseudonyme. La véritable identité de l'inventeur du Bitcoin reste inconnue à ce jour, malgré de nombreuses théories.",
      },
      {
        question: "Quel est le nombre maximum de Bitcoins qui pourront jamais exister ?",
        options: ["10 millions", "21 millions", "100 millions"],
        answer: 1,
        explication:
          "21 millions de Bitcoins — c'est inscrit dans le code source depuis l'origine. Une rareté mathématiquement garantie, contrairement aux monnaies traditionnelles.",
      },
      {
        question: "Qu'est-ce que le « halving » du Bitcoin ?",
        options: [
          "La division du Bitcoin en deux crypto-monnaies",
          "La réduction de moitié de la récompense des mineurs",
          "La moitié des frais de transaction",
        ],
        answer: 1,
        explication:
          "Tous les 4 ans environ, la récompense en BTC versée aux mineurs est divisée par deux. Cela réduit l'émission de nouveaux BTC et crée un choc d'offre historiquement haussier.",
      },
    ],
  },

  {
    slug: "msci-world",
    ticker: "MSCI W",
    name: "MSCI World (ETF)",
    type: "ETF",
    typeBadgeClass: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    price: "420,18 €",
    change: "+0,87 %",
    changePositive: true,
    metrics: [
      { label: "Frais (TER)", value: "0,12 %" },
      { label: "Perf. 10 ans", value: "+178 %" },
      { label: "Pays couverts", value: "23" },
      { label: "Entreprises", value: "~1 500" },
    ],
    description:
      "Indice couvrant les 1 500 plus grandes entreprises de 23 pays développés. Standard de l'investissement passif.",
    histoire: [
      "En 1969, Morgan Stanley Capital International lance un indice qui va révolutionner l'investissement : le MSCI World. L'idée est simple mais radicale — au lieu de parier sur une seule entreprise ou un seul pays, pourquoi ne pas détenir un morceau de toutes les grandes entreprises du monde développé en une seule opération ? Coca-Cola, Toyota, LVMH, Apple, Samsung — toutes dans un seul produit, accessible en quelques clics depuis n'importe quel compte-titres.",
      "Pendant des décennies, les gérants de fonds actifs prélevaient 1 à 2 % de frais annuels en promettant de « battre le marché ». John Bogle, fondateur de Vanguard, a démontré statistiquement que plus de 90 % des gérants sous-performent l'indice sur dix ans, frais déduits. Sa réponse : des fonds indiciels avec des frais de 0,1 %. La révolution des ETF était née. Aujourd'hui, pour le prix d'une baguette par an pour chaque tranche de 1 000 € investis, n'importe qui peut détenir les 1 500 plus grandes entreprises mondiales.",
      "Le MSCI World a traversé sans disparaître les crises pétrolières, le krach de 1987, la bulle internet, la crise des subprimes de 2008, le COVID-19. À chaque fois, il a chuté, puis rebondi plus haut. Sur vingt ans, la performance annualisée avoisine les 8 à 11 % selon les périodes. C'est la stratégie de prédilection des adeptes du mouvement FIRE (Financial Independence, Retire Early). Pas de génie requis — juste de la régularité, de la patience, et du temps.",
    ],
    chiffres: [
      {
        ratio: "Nombre d'entreprises",
        valeur: "~1 500",
        explication:
          "1 500 entreprises dans un seul produit. Si l'une fait faillite, elle représente moins de 0,1 % du portefeuille. La diversification rend le risque quasi-inexistant sur le long terme.",
      },
      {
        ratio: "Frais annuels (TER)",
        valeur: "0,12 %",
        explication:
          "Pour 10 000 € investis, tu paies 12 € de frais par an. Un fonds géré activement coûterait 120 à 200 € pour souvent moins de performance. La différence sur 30 ans est colossale.",
      },
      {
        ratio: "Performance 10 ans",
        valeur: "+178 %",
        explication:
          "10 000 € investis il y a 10 ans valent aujourd'hui environ 27 800 €. Sans expertise, sans timing, sans stress — juste en restant investi.",
      },
      {
        ratio: "Poids États-Unis",
        valeur: "~65 %",
        explication:
          "65 % de l'indice est américain — Apple, Microsoft, Amazon, Google y dominent. Une concentration sur la tech US à connaître avant d'investir.",
      },
      {
        ratio: "Dividende moyen",
        valeur: "~2 %/an",
        explication:
          "Le MSCI World verse environ 2 % de dividendes annuels. Sur 100 000 €, c'est 2 000 € de revenus passifs automatiquement réinvestis — l'effet des intérêts composés à l'œuvre.",
      },
    ],
    tauxAnnuelSimu: 0.108,
    performanceLabel: "+178 % sur 10 ans (≈ 10,8 %/an annualisé)",
    quiz: [
      {
        question: "Combien de pays le MSCI World couvre-t-il ?",
        options: ["10 pays développés", "23 pays développés", "50 pays du monde entier"],
        answer: 1,
        explication:
          "Le MSCI World couvre 23 pays développés : États-Unis, Europe occidentale, Japon, Australie, Canada… Les pays émergents ne sont pas inclus.",
      },
      {
        question: "Quel est l'avantage principal d'un ETF MSCI World face à un fonds géré activement ?",
        options: [
          "Il bat toujours le marché grâce à ses algorithmes",
          "Ses frais sont très faibles (0,1–0,2 % vs 1–2 %)",
          "Il est garanti sans risque de perte",
        ],
        answer: 1,
        explication:
          "La différence de frais semble minime mais sur 30 ans à 10 %/an, 0,12 % vs 1,5 % représente une différence de patrimoine final de plus de 50 %.",
      },
      {
        question: "Que signifie l'acronyme FIRE, mouvement souvent associé aux investisseurs en ETF ?",
        options: [
          "Fast Investment Returns Everywhere",
          "Financial Independence, Retire Early",
          "Fixed Income Rate Exchange",
        ],
        answer: 1,
        explication:
          "FIRE (Financial Independence, Retire Early) désigne un mouvement prônant l'épargne massive et l'investissement passif en ETF pour atteindre l'indépendance financière avant l'âge légal de retraite.",
      },
    ],
  },
];

export function getActifBySlug(slug: string): ActifData | undefined {
  return ACTIFS.find((a) => a.slug === slug);
}

export function getAllSlugs(): string[] {
  return ACTIFS.map((a) => a.slug);
}
