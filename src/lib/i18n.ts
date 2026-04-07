// ─── Types ────────────────────────────────────────────────────────────────────

export interface GlossaireTerm {
  mot: string;
  categorie: "Bourse" | "Épargne" | "Immobilier" | "Crypto" | "Fiscalité";
  definition: string;
  analogie: string;
  exemple: string;
}

export interface Translation {
  // ── Navbar ──
  nav: {
    simulateurs: string;
    fichesActifs: string;
    glossaire: string;
    commencer: string;
  };
  // ── Footer ──
  footer: {
    links: string[];
    copyright: string;
  };
  // ── Home: Hero ──
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  // ── Home: Stats ──
  stats: {
    apprenants: string;
    lecons: string;
    note: string;
    duree: string;
  };
  // ── Home: Simulateurs section ──
  simulateursSection: {
    label: string;
    heading1: string;
    heading2: string;
    items: {
      title: string;
      description: string;
      tags: string[];
      cta: string;
    }[];
  };
  // ── Home: FichesActifs section ──
  fichesActifsSection: {
    label: string;
    heading1: string;
    heading2: string;
    cta: string;
    actifs: {
      description: string;
    }[];
  };
  // ── Home: CTA ──
  cta: {
    label: string;
    heading1: string;
    heading2: string;
    subtitle: string;
    placeholder: string;
    submit: string;
    fine: string;
  };
  // ── Page Simulateurs ──
  simulateursPage: {
    label: string;
    title: string;
    subtitle: string;
    simuTitle: string;
    simuSubtitle: string;
    note: string;
  };
  // ── SimulateurInterets component ──
  simu: {
    capitalInitial: string;
    versementMensuel: string;
    tauxAnnuel: string;
    duree: string;
    autreAmout: string;
    capitalFinal: string;
    gainsSubtitle: (g: string) => string;
    totalVerse: string;
    effortSubtitle: string;
    interetsGeneres: string;
    sansTravailler: string;
    multiplicateur: string;
    miseMultipliee: string;
    comparerScenario: string;
    comparerSubtitle: string;
    ajouterScenario: string;
    masquerScenarioB: string;
    capitalInitialB: string;
    versementMensuelB: string;
    tauxAnnuelB: string;
    dureeB: string;
    evolutionSur: string;
    ans: string;
    cliquePourExplorer: string;
    capitalVerse: string;
    interets: string;
    total: string;
    totalB: string;
    annee: string;
    scenarioB: string;
    fermer: string;
    // insights
    insightDoubling: (taux: string, duree: number) => string;
    insightPct: (pct: number) => string;
    insightExtra: (gain: string) => string;
    insightNoReturn: string;
  };
  // ── Page Actifs list ──
  actifsPage: {
    label: string;
    title: string;
    heading: string;
    subtitle: string;
    voirFiche: string;
  };
  // ── FicheActif component (tabs) ──
  ficheActif: {
    tabs: {
      histoire: string;
      chiffres: string;
      simulateur: string;
      quiz: string;
    };
    simuMontant: string;
    simuDuree: string;
    simuAns: string;
    simuCapitalFinal: string;
    simuGain: string;
    simuMultiplicateur: string;
    simuProjection: string;
    simuDisclaimer: string;
    quizScores: string[];
    quizRestart: string;
    quizCorrect: string;
    quizWrong: string;
  };
  // ── Page Glossaire ──
  glossairePage: {
    label: string;
    title: string;
    heading: string;
    subtitle: string;
    searchPlaceholder: string;
    categories: string[];
    totalLabel: (n: number) => string;
    foundLabel: (n: number) => string;
    noResult: (q: string) => string;
    resetFilters: string;
    exempleLabel: string;
    terms: GlossaireTerm[];
  };
}

// ─── FR ───────────────────────────────────────────────────────────────────────

const fr: Translation = {
  nav: {
    simulateurs: "Simulateurs",
    fichesActifs: "Fiches actifs",
    glossaire: "Glossaire",
    commencer: "Commencer",
  },
  footer: {
    links: ["Simulateurs", "Fiches actifs", "Glossaire", "À propos", "CGU", "Confidentialité"],
    copyright: "Tous droits réservés.",
  },
  hero: {
    badge: "Plateforme éducative finance personnelle",
    titleLine1: "COMPRENDS",
    titleLine2: "TON ARGENT.",
    subtitle:
      "Simulateurs interactifs, fiches actifs et leçons de 8 minutes pour apprendre à investir intelligemment — sans jargon, sans prise de tête.",
    ctaPrimary: "Commencer gratuitement",
    ctaSecondary: "Voir les simulateurs",
  },
  stats: {
    apprenants: "Apprenants actifs",
    lecons: "Leçons disponibles",
    note: "Note moyenne",
    duree: "Par leçon en moyenne",
  },
  simulateursSection: {
    label: "Simulateurs",
    heading1: "PRENDS DES DÉCISIONS",
    heading2: "ÉCLAIRÉES.",
    items: [
      {
        title: "Simulateur d'intérêts composés",
        description:
          "Visualise l'effet boule de neige de tes placements sur 5, 10, 20 ou 40 ans. Ajuste le capital de départ, l'apport mensuel et le taux de rendement.",
        tags: ["Épargne", "Long terme", "Interactif"],
        cta: "Lancer le simulateur",
      },
      {
        title: "Simulateur crédit immobilier",
        description:
          "Calcule tes mensualités, le coût total du crédit et le taux d'endettement. Compare plusieurs scénarios en temps réel.",
        tags: ["Immobilier", "Crédit", "Mensualités"],
        cta: "Bientôt disponible",
      },
    ],
  },
  fichesActifsSection: {
    label: "Fiches actifs",
    heading1: "COMPRENDS CE DANS QUOI",
    heading2: "TU INVESTIS.",
    cta: "Voir la fiche complète →",
    actifs: [
      { description: "Géant technologique américain. Produits phares : iPhone, Mac, services. Capitalisation >2 800 Mds $." },
      { description: "Première cryptomonnaie mondiale. Offre limitée à 21 millions d'unités. Réserve de valeur numérique." },
      { description: "Indice mondial couvrant 23 pays développés, ~1 500 entreprises. Standard de la diversification passive." },
    ],
  },
  cta: {
    label: "Accès gratuit",
    heading1: "PRÊT À PASSER",
    heading2: "À L'ACTION ?",
    subtitle: "Rejoins 42 000 apprenants qui maîtrisent leur argent avec Finactio. C'est gratuit, sans engagement.",
    placeholder: "ton@email.com",
    submit: "S'inscrire gratuitement",
    fine: "Aucune carte bancaire requise · Désabonnement en un clic",
  },
  simulateursPage: {
    label: "Outils gratuits",
    title: "SIMULATEURS",
    subtitle: "Visualise l'impact de tes décisions financières avant de les prendre. Modifie les paramètres et observe les résultats en temps réel.",
    simuTitle: "Intérêts composés",
    simuSubtitle: "Calcule la valeur finale de ton épargne en tenant compte du capital de départ, des versements réguliers et des intérêts qui se capitalisent sur la durée.",
    note: "Ce simulateur utilise la formule des intérêts composés avec capitalisation mensuelle. Les résultats sont donnés à titre indicatif et ne constituent pas un conseil en investissement. Les performances passées ne préjugent pas des performances futures.",
  },
  simu: {
    capitalInitial: "Capital initial",
    versementMensuel: "Versement mensuel",
    tauxAnnuel: "Taux annuel",
    duree: "Durée",
    autreAmout: "Autre montant…",
    capitalFinal: "Capital final",
    gainsSubtitle: (g: string) => `+${g} de gains`,
    totalVerse: "Total versé",
    effortSubtitle: "ton effort d'épargne",
    interetsGeneres: "Intérêts générés",
    sansTravailler: "gagné sans travailler",
    multiplicateur: "Multiplicateur",
    miseMultipliee: "ta mise multipliée",
    comparerScenario: "Comparer un scénario",
    comparerSubtitle: "Superpose une 2e configuration sur le même graphique",
    ajouterScenario: "+ Ajouter un scénario",
    masquerScenarioB: "✕ Masquer le scénario B",
    capitalInitialB: "Capital initial B",
    versementMensuelB: "Versement mensuel B",
    tauxAnnuelB: "Taux annuel B",
    dureeB: "Durée B",
    evolutionSur: "Évolution sur",
    ans: "ans",
    cliquePourExplorer: "Clique ou glisse pour explorer",
    capitalVerse: "Capital versé",
    interets: "Intérêts",
    total: "Total",
    totalB: "Total B",
    annee: "Année",
    scenarioB: "Scénario B",
    fermer: "✕ Fermer",
    insightDoubling: (taux, duree) =>
      `À ${taux} % annuel, ton capital double environ tous les ${duree} ans.`,
    insightPct: (pct) =>
      `Les intérêts représentent ${pct} % du capital final — c'est la magie des intérêts composés.`,
    insightExtra: (gain) =>
      `+100 €/mois supplémentaires te rapporteraient ${gain} de plus à terme.`,
    insightNoReturn:
      "Sans rendement, tu n'accumules que ce que tu verses. Augmente le taux pour voir la magie opérer.",
  },
  actifsPage: {
    label: "Éducation financière",
    title: "FICHES ACTIFS",
    heading: "COMPRENDS CE DANS QUOI TU INVESTIS.",
    subtitle: "Histoire, chiffres clés, simulateur et quiz — tout ce qu'il faut savoir avant d'investir dans un actif.",
    voirFiche: "Voir la fiche",
  },
  ficheActif: {
    tabs: {
      histoire: "Histoire",
      chiffres: "Chiffres",
      simulateur: "Simulateur",
      quiz: "Quiz",
    },
    simuMontant: "Montant investi",
    simuDuree: "Durée de placement",
    simuAns: "ans",
    simuCapitalFinal: "Capital final",
    simuGain: "Gain",
    simuMultiplicateur: "Multiplicateur",
    simuProjection: "Projection sur",
    simuDisclaimer: "Projection indicative basée sur les performances historiques. Les performances passées ne préjugent pas des performances futures.",
    quizScores: [
      "Pas grave, c'est pour ça que Finactio existe ! Relis la fiche et retente.",
      "Bonne base ! Tu as saisi l'essentiel — un peu plus de lecture et tu maîtrises.",
      "Bien joué ! Tu connais les fondamentaux de cet actif.",
      "Parfait ! Tu maîtrises cet actif mieux que beaucoup d'investisseurs.",
    ],
    quizRestart: "Recommencer le quiz",
    quizCorrect: "✓ Exact ! ",
    quizWrong: "✗ Pas tout à fait. ",
  },
  glossairePage: {
    label: "Finance personnelle",
    title: "GLOSSAIRE",
    heading: "MAÎTRISE LE VOCABULAIRE.",
    subtitle: "20 termes clés expliqués simplement — avec une analogie et un exemple chiffré pour chacun.",
    searchPlaceholder: "Rechercher un terme…",
    categories: ["Tous", "Bourse", "Épargne", "Immobilier", "Crypto", "Fiscalité"],
    totalLabel: (n) => `${n} terme${n > 1 ? "s" : ""} au total`,
    foundLabel: (n) => `${n} terme${n > 1 ? "s" : ""} trouvé${n > 1 ? "s" : ""}`,
    noResult: (q) => `Aucun terme trouvé pour « ${q} »`,
    resetFilters: "Réinitialiser les filtres",
    exempleLabel: "Exemple concret",
    terms: [
      {
        mot: "ETF",
        categorie: "Bourse",
        definition: "Fonds indiciel coté en Bourse qui réplique la performance d'un indice (ex. S&P 500, MSCI World) à moindre coût.",
        analogie: "Comme un panier d'épicerie prêt à l'emploi : au lieu d'acheter chaque produit séparément, tu achètes le panier entier en une seule fois.",
        exemple: "Un ETF MSCI World te permet de détenir 1 500 entreprises mondiales pour 0,12 % de frais annuels. Investir 200 €/mois pendant 20 ans à 8 %/an donne environ 117 000 €.",
      },
      {
        mot: "PER (Price-Earning Ratio)",
        categorie: "Bourse",
        definition: "Ratio qui compare le prix d'une action aux bénéfices de l'entreprise. Il indique combien d'années de bénéfices tu paies pour posséder une part.",
        analogie: "Comme acheter un appartement locatif : un PER de 20 signifie que tu paies 20 ans de loyers d'avance pour en devenir propriétaire.",
        exemple: "Apple a un PER de 31. Si tu achètes une action à 182 $ et qu'Apple gagne 5,87 $/action par an, tu récupéreras ta mise en 31 ans si les bénéfices restent stables.",
      },
      {
        mot: "Dividende",
        categorie: "Bourse",
        definition: "Part des bénéfices qu'une entreprise redistribue à ses actionnaires, généralement chaque trimestre ou chaque année.",
        analogie: "Comme les loyers d'un bien immobilier : tu possèdes une part de l'entreprise et elle te verse régulièrement une fraction de ce qu'elle gagne.",
        exemple: "Apple verse 0,92 % de dividende annuel. Sur 10 000 € investis, tu reçois 92 € par an sans rien vendre — soit 7,67 €/mois de revenus passifs.",
      },
      {
        mot: "Plus-value",
        categorie: "Fiscalité",
        definition: "Gain réalisé lors de la vente d'un actif (action, immobilier, crypto…) à un prix supérieur à son prix d'achat.",
        analogie: "Tu achètes un vélo d'occasion 100 €, tu le retapes et tu le revends 180 €. Tes 80 € de bénéfice, c'est ta plus-value.",
        exemple: "Tu achètes 100 actions LVMH à 700 € et tu les revends à 900 €. Ta plus-value est de 100 × 200 € = 20 000 €. En France, elle est imposée à 30 % (flat tax), soit 6 000 € d'impôts.",
      },
      {
        mot: "Intérêts composés",
        categorie: "Épargne",
        definition: "Mécanisme par lequel les intérêts générés s'ajoutent au capital et produisent à leur tour de nouveaux intérêts — créant un effet boule de neige.",
        analogie: "Comme une boule de neige qui dévale une pente : plus elle roule, plus elle grossit vite. Les intérêts des intérêts s'accumulent à une vitesse croissante.",
        exemple: "1 000 € à 7 %/an : après 10 ans → 1 967 €. Après 30 ans → 7 612 €. Après 40 ans → 14 974 €. Les 20 dernières années rapportent autant que les 20 premières multipliées par 4.",
      },
      {
        mot: "Inflation",
        categorie: "Épargne",
        definition: "Hausse générale des prix qui érode le pouvoir d'achat de la monnaie. 100 € aujourd'hui achèteront moins dans 10 ans.",
        analogie: "Comme un glaçon qui fond : l'argent gardé sous le matelas perd de sa valeur chaque année sans que tu le voies directement.",
        exemple: "Avec 2 % d'inflation par an, 10 000 € en cash perdent 1 648 € de pouvoir d'achat en 10 ans. Pour simplement préserver ta richesse, ton épargne doit rapporter au moins 2 %/an.",
      },
      {
        mot: "Diversification",
        categorie: "Bourse",
        definition: "Stratégie qui consiste à répartir son capital sur différents actifs, secteurs ou zones géographiques pour réduire le risque global.",
        analogie: "Ne pas mettre tous ses œufs dans le même panier : si un panier tombe, les autres sont sauvegardés.",
        exemple: "Un portefeuille 100 % actions tech a chuté de -40 % en 2022. Un portefeuille diversifié (actions mondiales + obligations + immo) a limité la baisse à -15 %. La diversification ne supprime pas le risque, elle le lisse.",
      },
      {
        mot: "Obligation",
        categorie: "Bourse",
        definition: "Titre de dette émis par un État ou une entreprise. En achetant une obligation, tu prêtes de l'argent contre un intérêt fixe et un remboursement à terme.",
        analogie: "Comme prêter de l'argent à un ami contre une reconnaissance de dette : il te rembourse à date fixe avec des intérêts.",
        exemple: "Une obligation d'État française à 10 ans à 3 %/an : tu prêtes 10 000 € à l'État, il te verse 300 €/an pendant 10 ans, puis te rembourse les 10 000 €. Gain total : 3 000 €.",
      },
      {
        mot: "CAC 40",
        categorie: "Bourse",
        definition: "Indice boursier regroupant les 40 plus grandes entreprises françaises cotées à la Bourse de Paris, pondérées par leur capitalisation.",
        analogie: "Comme le Top 40 de la musique française : il reflète la santé des meilleures entreprises du pays, pas de toute l'économie.",
        exemple: "Un ETF CAC 40 avec 100 €/mois pendant 20 ans à 7 %/an historique donne environ 52 000 €. Mais attention : le CAC 40 est concentré sur 40 entreprises — moins diversifié qu'un MSCI World.",
      },
      {
        mot: "Bitcoin",
        categorie: "Crypto",
        definition: "Première cryptomonnaie décentralisée au monde. Monnaie numérique fonctionnant sans banque centrale, dont l'offre est plafonnée à 21 millions d'unités.",
        analogie: "Comme de l'or numérique : rare par nature (offre limitée), difficile à produire (minage), inconfiscable et transportable en une seconde vers n'importe où dans le monde.",
        exemple: "1 Bitcoin valait 0,01 $ en 2009. À 67 000 $ en 2024, c'est une multiplication par 6,7 millions. 100 € investis en 2012 à 12 $/BTC valent aujourd'hui environ 558 000 €.",
      },
      {
        mot: "Blockchain",
        categorie: "Crypto",
        definition: "Registre numérique décentralisé et infalsifiable qui enregistre les transactions de manière permanente et transparente.",
        analogie: "Comme un cahier de comptes public photocopié chez des millions de personnes simultanément : pour falsifier une ligne, il faudrait modifier toutes les copies en même temps.",
        exemple: "Chaque transaction Bitcoin est enregistrée sur ~15 000 nœuds dans le monde. Pour falsifier une transaction de 2018, il faudrait contrôler plus de 51 % du réseau mondial — une attaque qui coûterait plusieurs milliards de dollars.",
      },
      {
        mot: "SCPI",
        categorie: "Immobilier",
        definition: "Société Civile de Placement Immobilier : fonds qui collecte l'argent de nombreux investisseurs pour acheter et gérer un parc immobilier, et redistribue les loyers.",
        analogie: "Comme une copropriété géante : tu possèdes une toute petite part d'un grand immeuble de bureaux à Paris, et tu touches ta part des loyers chaque trimestre.",
        exemple: "Avec 5 000 € en SCPI, tu touches environ 4 à 5 % de rendement annuel brut, soit 200 à 250 €/an. Sans gérer un seul locataire, sans crédit, sans notaire.",
      },
      {
        mot: "PEA",
        categorie: "Fiscalité",
        definition: "Plan d'Épargne en Actions : enveloppe fiscale française permettant d'investir en actions européennes avec une fiscalité avantageuse après 5 ans de détention.",
        analogie: "Comme une serre pour tes plantes : l'enveloppe protège ta croissance des impôts pendant que tes investissements se développent à l'intérieur.",
        exemple: "Sans PEA : 10 000 € → 20 000 € = 10 000 € de plus-value taxée à 30 % = 3 000 € d'impôts. Avec PEA (après 5 ans) : seuls 17,2 % de prélèvements sociaux s'appliquent = 1 720 €. Économie : 1 280 €.",
      },
      {
        mot: "Assurance-vie",
        categorie: "Fiscalité",
        definition: "Enveloppe d'épargne et de transmission avec avantages fiscaux. Permet d'investir dans des fonds euros (garantis) ou des unités de compte (actions, ETF).",
        analogie: "Comme un coffre-fort fiscal : les gains à l'intérieur ne sont pas imposés tant que tu n'effectues pas de retrait, et tu choisis qui hérite sans droits de succession.",
        exemple: "Après 8 ans, un abattement de 4 600 €/an (9 200 € pour un couple) s'applique sur les gains. Sur 200 000 € investis → 300 000 €, tu peux retirer les 100 000 € de gains en 10 ans sans aucun impôt (hors prélèvements sociaux).",
      },
      {
        mot: "Taux directeur",
        categorie: "Épargne",
        definition: "Taux d'intérêt fixé par une banque centrale (BCE, Fed) qui détermine le coût de l'argent dans l'économie et influence tous les autres taux.",
        analogie: "Comme le robinet d'eau de toute l'économie : quand la banque centrale l'ouvre (taux bas), l'argent coule facilement et pas cher. Quand elle le ferme (taux élevés), tout devient plus cher à financer.",
        exemple: "La BCE a relevé ses taux de 0 % à 4 % entre 2022 et 2023. Résultat : un crédit immo à 1 % est passé à 4 %. Pour un emprunt de 200 000 € sur 20 ans, la mensualité est passée de 920 € à 1 212 € — soit +292 €/mois.",
      },
      {
        mot: "Spread",
        categorie: "Bourse",
        definition: "Écart entre le prix d'achat (ask) et le prix de vente (bid) d'un actif. C'est la commission implicite des marchés financiers.",
        analogie: "Comme un bureau de change : tu échanges des euros contre des dollars à un taux, mais si tu veux racheter des euros immédiatement, le taux est légèrement moins favorable. Cet écart est le spread.",
        exemple: "Sur une action peu liquide, le spread peut être de 0,5 %. Sur un ETF très liquide comme un S&P 500, il est de 0,01 %. Pour un achat de 10 000 €, la différence est de 49 €. Sur des années de trading actif, les spreads s'accumulent significativement.",
      },
      {
        mot: "Short (vente à découvert)",
        categorie: "Bourse",
        definition: "Stratégie qui consiste à vendre un actif que l'on ne possède pas (en l'empruntant) en anticipant une baisse de son prix pour le racheter moins cher.",
        analogie: "Tu empruntes le vélo de ton voisin, tu le vends 200 €. Le vélo perd de la valeur et tu en rachètes un identique à 120 €. Tu rends le vélo à ton voisin et tu gardes 80 €. Si le vélo monte à 300 €, tu perds 100 €.",
        exemple: "En 2022, des hedge funds ont shorté des actions tech après la hausse des taux. Tesla a perdu -65 % en un an : 10 000 € de short auraient rapporté 6 500 € de gain. Mais si Tesla avait monté de 100 %, la perte aurait été illimitée.",
      },
      {
        mot: "Hedge Fund",
        categorie: "Bourse",
        definition: "Fonds d'investissement alternatif utilisant des stratégies complexes (effet de levier, short, dérivés) pour générer des rendements en toutes conditions de marché.",
        analogie: "Comme un chef étoilé de la finance : des techniques sophistiquées réservées aux grandes tables (investisseurs institutionnels et très fortunés), avec des résultats qui valent parfois… ou pas.",
        exemple: "Les hedge funds prélèvent en général 2 % de frais de gestion + 20 % des performances (modèle « 2 et 20 »). Sur 1 M€ avec 10 % de performance : 20 000 € de frais fixes + 20 000 € de performance = 40 000 € de frais. Il ne te reste que 60 000 € sur 100 000 € de gains.",
      },
      {
        mot: "IPO",
        categorie: "Bourse",
        definition: "Initial Public Offering (introduction en Bourse) : premier jour où les actions d'une entreprise privée sont proposées au grand public sur un marché boursier.",
        analogie: "Comme l'ouverture d'un restaurant qui n'avait jusqu'ici que des clients sélectionnés : soudain, n'importe qui peut réserver une table (acheter des actions) et participer à l'aventure.",
        exemple: "Airbnb s'est introduit en Bourse en décembre 2020 à 68 $/action. Le premier jour, l'action a clôturé à 144 $. Ceux qui ont pu souscrire à l'IPO ont doublé leur mise en 24 heures. Mais 70 % des IPO sous-performent l'indice sur 5 ans.",
      },
      {
        mot: "Rendement",
        categorie: "Épargne",
        definition: "Mesure du gain généré par un investissement, exprimé en pourcentage du capital investi sur une période donnée.",
        analogie: "Comme le taux horaire de ton argent : combien chaque euro placé rapporte-t-il par an ? Un rendement de 5 % signifie que chaque euro travaille et rapporte 5 centimes par an.",
        exemple: "Livret A : 3 % → 10 000 € rapportent 300 €/an. SCPI : 5 % → 10 000 € rapportent 500 €/an. ETF actions : 8 % historique → 10 000 € rapportent 800 €/an. Sur 20 ans, la différence entre 3 % et 8 % représente 23 000 € d'écart sur 10 000 € investis.",
      },
    ],
  },
};

// ─── EN ───────────────────────────────────────────────────────────────────────

const en: Translation = {
  nav: {
    simulateurs: "Simulators",
    fichesActifs: "Asset Cards",
    glossaire: "Glossary",
    commencer: "Get started",
  },
  footer: {
    links: ["Simulators", "Asset Cards", "Glossary", "About", "Terms", "Privacy"],
    copyright: "All rights reserved.",
  },
  hero: {
    badge: "Personal finance education platform",
    titleLine1: "UNDERSTAND",
    titleLine2: "YOUR MONEY.",
    subtitle:
      "Interactive simulators, asset cards and 8-minute lessons to learn how to invest intelligently — no jargon, no headaches.",
    ctaPrimary: "Start for free",
    ctaSecondary: "See the simulators",
  },
  stats: {
    apprenants: "Active learners",
    lecons: "Lessons available",
    note: "Average rating",
    duree: "Per lesson on average",
  },
  simulateursSection: {
    label: "Simulators",
    heading1: "MAKE INFORMED",
    heading2: "DECISIONS.",
    items: [
      {
        title: "Compound interest simulator",
        description:
          "Visualize the snowball effect of your investments over 5, 10, 20 or 40 years. Adjust your starting capital, monthly contribution and rate of return.",
        tags: ["Savings", "Long-term", "Interactive"],
        cta: "Launch simulator",
      },
      {
        title: "Mortgage simulator",
        description:
          "Calculate your monthly payments, total loan cost and debt-to-income ratio. Compare multiple scenarios in real time.",
        tags: ["Real estate", "Mortgage", "Monthly payments"],
        cta: "Coming soon",
      },
    ],
  },
  fichesActifsSection: {
    label: "Asset cards",
    heading1: "UNDERSTAND WHAT",
    heading2: "YOU INVEST IN.",
    cta: "See full card →",
    actifs: [
      { description: "American tech giant. Flagship products: iPhone, Mac, services. Market cap >$2.8T." },
      { description: "World's first cryptocurrency. Supply capped at 21 million units. Digital store of value." },
      { description: "Global index covering 23 developed countries, ~1,500 companies. The standard for passive diversification." },
    ],
  },
  cta: {
    label: "Free access",
    heading1: "READY TO TAKE",
    heading2: "ACTION?",
    subtitle: "Join 42,000 learners mastering their finances with Finactio. It's free, no commitment.",
    placeholder: "your@email.com",
    submit: "Sign up for free",
    fine: "No credit card required · Unsubscribe in one click",
  },
  simulateursPage: {
    label: "Free tools",
    title: "SIMULATORS",
    subtitle: "Visualize the impact of your financial decisions before making them. Tweak the parameters and watch results update in real time.",
    simuTitle: "Compound interest",
    simuSubtitle: "Calculate the final value of your savings taking into account the starting capital, regular contributions, and interest that compounds over time.",
    note: "This simulator uses the compound interest formula with monthly compounding. Results are for illustrative purposes only and do not constitute investment advice. Past performance is not indicative of future results.",
  },
  simu: {
    capitalInitial: "Starting capital",
    versementMensuel: "Monthly contribution",
    tauxAnnuel: "Annual rate",
    duree: "Duration",
    autreAmout: "Custom amount…",
    capitalFinal: "Final capital",
    gainsSubtitle: (g: string) => `+${g} in gains`,
    totalVerse: "Total invested",
    effortSubtitle: "your savings effort",
    interetsGeneres: "Interest earned",
    sansTravailler: "earned without working",
    multiplicateur: "Multiplier",
    miseMultipliee: "your stake multiplied",
    comparerScenario: "Compare a scenario",
    comparerSubtitle: "Overlay a 2nd configuration on the same chart",
    ajouterScenario: "+ Add a scenario",
    masquerScenarioB: "✕ Hide scenario B",
    capitalInitialB: "Starting capital B",
    versementMensuelB: "Monthly contribution B",
    tauxAnnuelB: "Annual rate B",
    dureeB: "Duration B",
    evolutionSur: "Growth over",
    ans: "yrs",
    cliquePourExplorer: "Click or drag to explore",
    capitalVerse: "Invested capital",
    interets: "Interest",
    total: "Total",
    totalB: "Total B",
    annee: "Year",
    scenarioB: "Scenario B",
    fermer: "✕ Close",
    insightDoubling: (taux, duree) =>
      `At ${taux}% per year, your capital doubles roughly every ${duree} years.`,
    insightPct: (pct) =>
      `Interest accounts for ${pct}% of the final capital — that's the magic of compounding.`,
    insightExtra: (gain) =>
      `An extra +€100/month would earn you ${gain} more over the period.`,
    insightNoReturn:
      "With zero return, you only accumulate what you put in. Raise the rate to see the magic happen.",
  },
  actifsPage: {
    label: "Financial education",
    title: "ASSET CARDS",
    heading: "UNDERSTAND WHAT YOU INVEST IN.",
    subtitle: "History, key figures, simulator and quiz — everything you need to know before investing in an asset.",
    voirFiche: "See card",
  },
  ficheActif: {
    tabs: {
      histoire: "History",
      chiffres: "Figures",
      simulateur: "Simulator",
      quiz: "Quiz",
    },
    simuMontant: "Amount invested",
    simuDuree: "Investment period",
    simuAns: "yrs",
    simuCapitalFinal: "Final capital",
    simuGain: "Gain",
    simuMultiplicateur: "Multiplier",
    simuProjection: "Projection over",
    simuDisclaimer: "Indicative projection based on historical performance. Past performance is not indicative of future results.",
    quizScores: [
      "No worries — that's why Finactio exists! Re-read the card and try again.",
      "Good start! You've grasped the essentials — a bit more reading and you'll master it.",
      "Well done! You know the fundamentals of this asset.",
      "Perfect! You know this asset better than most investors.",
    ],
    quizRestart: "Restart quiz",
    quizCorrect: "✓ Correct! ",
    quizWrong: "✗ Not quite. ",
  },
  glossairePage: {
    label: "Personal finance",
    title: "GLOSSARY",
    heading: "MASTER THE VOCABULARY.",
    subtitle: "20 key terms explained simply — with an analogy and a real-world example for each.",
    searchPlaceholder: "Search a term…",
    categories: ["All", "Stocks", "Savings", "Real estate", "Crypto", "Tax"],
    totalLabel: (n) => `${n} term${n > 1 ? "s" : ""} in total`,
    foundLabel: (n) => `${n} term${n > 1 ? "s" : ""} found`,
    noResult: (q) => `No term found for "${q}"`,
    resetFilters: "Reset filters",
    exempleLabel: "Concrete example",
    terms: [
      {
        mot: "ETF",
        categorie: "Bourse",
        definition:
          "An index fund traded on the stock exchange that replicates the performance of an index (e.g. S&P 500, MSCI World) at low cost.",
        analogie:
          "Like a ready-made grocery basket: instead of buying each item separately, you buy the whole basket in one go.",
        exemple:
          "An MSCI World ETF lets you hold 1,500 global companies for 0.12% in annual fees. Investing €200/month for 20 years at 8%/year yields roughly €117,000.",
      },
      {
        mot: "P/E Ratio",
        categorie: "Bourse",
        definition:
          "Ratio comparing a stock's price to the company's earnings. It tells you how many years of profits you're paying to own a share.",
        analogie:
          "Like buying a rental property: a P/E of 20 means you're paying 20 years of rent upfront to become the owner.",
        exemple:
          "Apple has a P/E of 31. If you buy a share at $182 and Apple earns $5.87/share per year, you'll recoup your investment in 31 years if earnings stay flat.",
      },
      {
        mot: "Dividend",
        categorie: "Bourse",
        definition:
          "A portion of a company's profits distributed to shareholders, usually quarterly or annually.",
        analogie:
          "Like rent from a property: you own a share of the company and it regularly pays you a fraction of what it earns.",
        exemple:
          "Apple pays a 0.92% annual dividend. On €10,000 invested, you receive €92 per year without selling anything — that's €7.67/month in passive income.",
      },
      {
        mot: "Capital gain",
        categorie: "Fiscalité",
        definition:
          "Profit made when selling an asset (stock, real estate, crypto…) at a price higher than its purchase price.",
        analogie:
          "You buy a used bike for €100, fix it up, and sell it for €180. Your €80 profit is your capital gain.",
        exemple:
          "You buy 100 LVMH shares at €700 and sell at €900. Your capital gain is 100 × €200 = €20,000. In France, it's taxed at 30% (flat tax), meaning €6,000 in taxes.",
      },
      {
        mot: "Compound interest",
        categorie: "Épargne",
        definition:
          "A mechanism by which the interest earned is added to the principal, which then generates more interest — creating a snowball effect.",
        analogie:
          "Like a snowball rolling downhill: the bigger it gets, the faster it grows. Interest on interest accumulates at an increasing rate.",
        exemple:
          "€1,000 at 7%/year: after 10 years → €1,967. After 30 years → €7,612. After 40 years → €14,974. The last 20 years earn as much as the first 20 multiplied by 4.",
      },
      {
        mot: "Inflation",
        categorie: "Épargne",
        definition:
          "A general rise in prices that erodes the purchasing power of money. €100 today will buy less in 10 years.",
        analogie:
          "Like an ice cube melting: cash kept under the mattress loses value every year without you noticing.",
        exemple:
          "At 2% inflation per year, €10,000 in cash loses €1,648 in purchasing power over 10 years. To simply preserve your wealth, your savings must earn at least 2%/year.",
      },
      {
        mot: "Diversification",
        categorie: "Bourse",
        definition:
          "A strategy of spreading capital across different assets, sectors, or geographies to reduce overall risk.",
        analogie:
          "Don't put all your eggs in one basket: if one basket falls, the others are safe.",
        exemple:
          "A 100% tech-stock portfolio fell -40% in 2022. A diversified portfolio (global stocks + bonds + real estate) limited the drop to -15%. Diversification doesn't eliminate risk — it smooths it out.",
      },
      {
        mot: "Bond",
        categorie: "Bourse",
        definition:
          "A debt security issued by a government or company. By buying a bond, you lend money in exchange for fixed interest and repayment at maturity.",
        analogie:
          "Like lending money to a friend with an IOU: they repay you on a set date with interest.",
        exemple:
          "A 10-year French government bond at 3%/year: you lend €10,000 to the government, it pays you €300/year for 10 years, then returns the €10,000. Total gain: €3,000.",
      },
      {
        mot: "CAC 40",
        categorie: "Bourse",
        definition:
          "A stock index comprising the 40 largest French companies listed on the Paris Stock Exchange, weighted by market capitalisation.",
        analogie:
          "Like the French music Top 40: it reflects the health of the country's best companies, not the whole economy.",
        exemple:
          "A CAC 40 ETF with €100/month for 20 years at 7%/year (historical) gives roughly €52,000. But note: the CAC 40 holds only 40 companies — less diversified than an MSCI World.",
      },
      {
        mot: "Bitcoin",
        categorie: "Crypto",
        definition:
          "The world's first decentralised cryptocurrency. A digital currency that operates without a central bank, with supply capped at 21 million units.",
        analogie:
          "Like digital gold: scarce by design (fixed supply), hard to produce (mining), unseizable, and transferable anywhere in seconds.",
        exemple:
          "1 Bitcoin was worth $0.01 in 2009. At $67,000 in 2024, that's a 6.7 million-fold increase. €100 invested in 2012 at $12/BTC would be worth roughly €558,000 today.",
      },
      {
        mot: "Blockchain",
        categorie: "Crypto",
        definition:
          "A decentralised, tamper-proof digital ledger that records transactions permanently and transparently.",
        analogie:
          "Like a public ledger photocopied across millions of people simultaneously: to falsify one entry, you'd have to change all copies at the same time.",
        exemple:
          "Every Bitcoin transaction is recorded on ~15,000 nodes worldwide. To alter a 2018 transaction, you'd need to control over 51% of the global network — an attack costing billions of dollars.",
      },
      {
        mot: "REIT",
        categorie: "Immobilier",
        definition:
          "Real Estate Investment Trust: a fund that pools investor capital to buy and manage real estate, then distributes the rental income.",
        analogie:
          "Like a giant co-ownership: you own a tiny share of a large office building, and collect your portion of the rent each quarter.",
        exemple:
          "With €5,000 in a REIT, you earn roughly 4–5% gross annual yield, i.e. €200–€250/year — without managing a single tenant, no mortgage, no notary.",
      },
      {
        mot: "PEA (French Equity Savings Plan)",
        categorie: "Fiscalité",
        definition:
          "A French tax wrapper that lets you invest in European stocks with preferential taxation after 5 years of holding.",
        analogie:
          "Like a greenhouse for your plants: the wrapper shields your growth from taxes while your investments develop inside.",
        exemple:
          "Without PEA: €10,000 → €20,000 = €10,000 capital gain taxed at 30% = €3,000 in taxes. With PEA (after 5 years): only 17.2% social contributions apply = €1,720. Saving: €1,280.",
      },
      {
        mot: "Life insurance (French)",
        categorie: "Fiscalité",
        definition:
          "A French savings and wealth-transfer wrapper with tax advantages. Allows investment in euro funds (guaranteed) or unit-linked funds (stocks, ETFs).",
        analogie:
          "Like a tax safe: gains inside are not taxed until you withdraw, and you choose your beneficiaries with no inheritance tax.",
        exemple:
          "After 8 years, an allowance of €4,600/year (€9,200 for a couple) applies to gains. On €200,000 invested → €300,000, you can withdraw the €100,000 in gains over 10 years completely tax-free (excluding social contributions).",
      },
      {
        mot: "Key interest rate",
        categorie: "Épargne",
        definition:
          "An interest rate set by a central bank (ECB, Fed) that determines the cost of money in the economy and influences all other rates.",
        analogie:
          "Like the main water tap of the entire economy: when the central bank opens it (low rates), money flows easily and cheaply. When it closes it (high rates), everything becomes more expensive to finance.",
        exemple:
          "The ECB raised rates from 0% to 4% between 2022 and 2023. A mortgage that cost 1% rose to 4%. For a €200,000 loan over 20 years, the monthly payment jumped from €920 to €1,212 — an increase of €292/month.",
      },
      {
        mot: "Spread",
        categorie: "Bourse",
        definition:
          "The gap between the buy price (ask) and the sell price (bid) of an asset. It's the implicit commission of financial markets.",
        analogie:
          "Like a currency exchange booth: you swap euros for dollars at one rate, but if you immediately buy back euros, the rate is slightly less favourable. That gap is the spread.",
        exemple:
          "On an illiquid stock, the spread can be 0.5%. On a very liquid ETF like the S&P 500, it's 0.01%. On a €10,000 trade, the difference is €49. Over years of active trading, spreads accumulate significantly.",
      },
      {
        mot: "Short selling",
        categorie: "Bourse",
        definition:
          "A strategy of selling an asset you don't own (by borrowing it) in anticipation of a price drop, to buy it back cheaper.",
        analogie:
          "You borrow your neighbour's bike and sell it for €200. The bike loses value and you buy an identical one for €120. You return it and pocket €80. If the bike rises to €300, you lose €100.",
        exemple:
          "In 2022, hedge funds shorted tech stocks after rate hikes. Tesla fell -65% in one year: a €10,000 short would have yielded €6,500 in profit. But if Tesla had risen 100%, the loss would have been unlimited.",
      },
      {
        mot: "Hedge Fund",
        categorie: "Bourse",
        definition:
          "An alternative investment fund using complex strategies (leverage, short selling, derivatives) to generate returns in all market conditions.",
        analogie:
          "Like a Michelin-starred chef of finance: sophisticated techniques reserved for the top tables (institutional and high-net-worth investors), with results that sometimes… deliver.",
        exemple:
          "Hedge funds typically charge 2% management fee + 20% performance fee ('2 and 20' model). On €1M with 10% performance: €20,000 fixed + €20,000 performance = €40,000 in fees. You keep only €60,000 of the €100,000 in gains.",
      },
      {
        mot: "IPO",
        categorie: "Bourse",
        definition:
          "Initial Public Offering: the first day a private company's shares are offered to the general public on a stock exchange.",
        analogie:
          "Like the opening of a restaurant that previously only took selected guests: suddenly, anyone can book a table (buy shares) and be part of the adventure.",
        exemple:
          "Airbnb went public in December 2020 at $68/share. On day one, it closed at $144. Those who subscribed to the IPO doubled their money in 24 hours. But 70% of IPOs underperform the index over 5 years.",
      },
      {
        mot: "Return",
        categorie: "Épargne",
        definition:
          "A measure of the gain generated by an investment, expressed as a percentage of the invested capital over a given period.",
        analogie:
          "Like the hourly rate of your money: how much does each euro invested earn per year? A 5% return means every euro works and earns 5 cents per year.",
        exemple:
          "Livret A: 3% → €10,000 earns €300/year. REIT: 5% → €10,000 earns €500/year. Equity ETF: 8% historical → €10,000 earns €800/year. Over 20 years, the gap between 3% and 8% represents €23,000 on €10,000 invested.",
      },
    ],
  },
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const translations: Record<"fr" | "en", Translation> = { fr, en };
