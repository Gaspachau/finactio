"use client";

import { useState, useMemo } from "react";

// ─── Données ──────────────────────────────────────────────────────────────────

type Categorie = "Tous" | "Bourse" | "Épargne" | "Immobilier" | "Crypto" | "Fiscalité";

interface Terme {
  mot: string;
  categorie: Exclude<Categorie, "Tous">;
  definition: string;
  analogie: string;
  exemple: string;
}

const TERMES: Terme[] = [
  {
    mot: "ETF",
    categorie: "Bourse",
    definition:
      "Fonds indiciel coté en Bourse qui réplique la performance d'un indice (ex. S&P 500, MSCI World) à moindre coût.",
    analogie:
      "Comme un panier d'épicerie prêt à l'emploi : au lieu d'acheter chaque produit séparément, tu achètes le panier entier en une seule fois.",
    exemple:
      "Un ETF MSCI World te permet de détenir 1 500 entreprises mondiales pour 0,12 % de frais annuels. Investir 200 €/mois pendant 20 ans à 8 %/an donne environ 117 000 €.",
  },
  {
    mot: "PER (Price-Earning Ratio)",
    categorie: "Bourse",
    definition:
      "Ratio qui compare le prix d'une action aux bénéfices de l'entreprise. Il indique combien d'années de bénéfices tu paies pour posséder une part.",
    analogie:
      "Comme acheter un appartement locatif : un PER de 20 signifie que tu paies 20 ans de loyers d'avance pour en devenir propriétaire.",
    exemple:
      "Apple a un PER de 31. Si tu achètes une action à 182 $ et qu'Apple gagne 5,87 $/action par an, tu récupéreras ta mise en 31 ans si les bénéfices restent stables.",
  },
  {
    mot: "Dividende",
    categorie: "Bourse",
    definition:
      "Part des bénéfices qu'une entreprise redistribue à ses actionnaires, généralement chaque trimestre ou chaque année.",
    analogie:
      "Comme les loyers d'un bien immobilier : tu possèdes une part de l'entreprise et elle te verse régulièrement une fraction de ce qu'elle gagne.",
    exemple:
      "Apple verse 0,92 % de dividende annuel. Sur 10 000 € investis, tu reçois 92 € par an sans rien vendre — soit 7,67 €/mois de revenus passifs.",
  },
  {
    mot: "Plus-value",
    categorie: "Fiscalité",
    definition:
      "Gain réalisé lors de la vente d'un actif (action, immobilier, crypto…) à un prix supérieur à son prix d'achat.",
    analogie:
      "Tu achètes un vélo d'occasion 100 €, tu le retapes et tu le revends 180 €. Tes 80 € de bénéfice, c'est ta plus-value.",
    exemple:
      "Tu achètes 100 actions LVMH à 700 € et tu les revends à 900 €. Ta plus-value est de 100 × 200 € = 20 000 €. En France, elle est imposée à 30 % (flat tax), soit 6 000 € d'impôts.",
  },
  {
    mot: "Intérêts composés",
    categorie: "Épargne",
    definition:
      "Mécanisme par lequel les intérêts générés s'ajoutent au capital et produisent à leur tour de nouveaux intérêts — créant un effet boule de neige.",
    analogie:
      "Comme une boule de neige qui dévale une pente : plus elle roule, plus elle grossit vite. Les intérêts des intérêts s'accumulent à une vitesse croissante.",
    exemple:
      "1 000 € à 7 %/an : après 10 ans → 1 967 €. Après 30 ans → 7 612 €. Après 40 ans → 14 974 €. Les 20 dernières années rapportent autant que les 20 premières multipliées par 4.",
  },
  {
    mot: "Inflation",
    categorie: "Épargne",
    definition:
      "Hausse générale des prix qui érode le pouvoir d'achat de la monnaie. 100 € aujourd'hui achèteront moins dans 10 ans.",
    analogie:
      "Comme un glaçon qui fond : l'argent gardé sous le matelas perd de sa valeur chaque année sans que tu le voies directement.",
    exemple:
      "Avec 2 % d'inflation par an, 10 000 € en cash perdent 1 648 € de pouvoir d'achat en 10 ans. Pour simplement préserver ta richesse, ton épargne doit rapporter au moins 2 %/an.",
  },
  {
    mot: "Diversification",
    categorie: "Bourse",
    definition:
      "Stratégie qui consiste à répartir son capital sur différents actifs, secteurs ou zones géographiques pour réduire le risque global.",
    analogie:
      "Ne pas mettre tous ses œufs dans le même panier : si un panier tombe, les autres sont sauvegardés.",
    exemple:
      "Un portefeuille 100 % actions tech a chuté de -40 % en 2022. Un portefeuille diversifié (actions mondiales + obligations + immo) a limité la baisse à -15 %. La diversification ne supprime pas le risque, elle le lisse.",
  },
  {
    mot: "Obligation",
    categorie: "Bourse",
    definition:
      "Titre de dette émis par un État ou une entreprise. En achetant une obligation, tu prêtes de l'argent contre un intérêt fixe et un remboursement à terme.",
    analogie:
      "Comme prêter de l'argent à un ami contre une reconnaissance de dette : il te rembourse à date fixe avec des intérêts.",
    exemple:
      "Une obligation d'État française à 10 ans à 3 %/an : tu prêtes 10 000 € à l'État, il te verse 300 €/an pendant 10 ans, puis te rembourse les 10 000 €. Gain total : 3 000 €.",
  },
  {
    mot: "CAC 40",
    categorie: "Bourse",
    definition:
      "Indice boursier regroupant les 40 plus grandes entreprises françaises cotées à la Bourse de Paris, pondérées par leur capitalisation.",
    analogie:
      "Comme le Top 40 de la musique française : il reflète la santé des meilleures entreprises du pays, pas de toute l'économie.",
    exemple:
      "Un ETF CAC 40 avec 100 €/mois pendant 20 ans à 7 %/an historique donne environ 52 000 €. Mais attention : le CAC 40 est concentré sur 40 entreprises — moins diversifié qu'un MSCI World.",
  },
  {
    mot: "Bitcoin",
    categorie: "Crypto",
    definition:
      "Première cryptomonnaie décentralisée au monde. Monnaie numérique fonctionnant sans banque centrale, dont l'offre est plafonnée à 21 millions d'unités.",
    analogie:
      "Comme de l'or numérique : rare par nature (offre limitée), difficile à produire (minage), inconfiscable et transportable en une seconde vers n'importe où dans le monde.",
    exemple:
      "1 Bitcoin valait 0,01 $ en 2009. À 67 000 $ en 2024, c'est une multiplication par 6,7 millions. 100 € investis en 2012 à 12 $/BTC valent aujourd'hui environ 558 000 €.",
  },
  {
    mot: "Blockchain",
    categorie: "Crypto",
    definition:
      "Registre numérique décentralisé et infalsifiable qui enregistre les transactions de manière permanente et transparente.",
    analogie:
      "Comme un cahier de comptes public photocopié chez des millions de personnes simultanément : pour falsifier une ligne, il faudrait modifier toutes les copies en même temps.",
    exemple:
      "Chaque transaction Bitcoin est enregistrée sur ~15 000 nœuds dans le monde. Pour falsifier une transaction de 2018, il faudrait contrôler plus de 51 % du réseau mondial — une attaque qui coûterait plusieurs milliards de dollars.",
  },
  {
    mot: "SCPI",
    categorie: "Immobilier",
    definition:
      "Société Civile de Placement Immobilier : fonds qui collecte l'argent de nombreux investisseurs pour acheter et gérer un parc immobilier, et redistribue les loyers.",
    analogie:
      "Comme une copropriété géante : tu possèdes une toute petite part d'un grand immeuble de bureaux à Paris, et tu touches ta part des loyers chaque trimestre.",
    exemple:
      "Avec 5 000 € en SCPI, tu touches environ 4 à 5 % de rendement annuel brut, soit 200 à 250 €/an. Sans gérer un seul locataire, sans crédit, sans notaire.",
  },
  {
    mot: "PEA",
    categorie: "Fiscalité",
    definition:
      "Plan d'Épargne en Actions : enveloppe fiscale française permettant d'investir en actions européennes avec une fiscalité avantageuse après 5 ans de détention.",
    analogie:
      "Comme une serre pour tes plantes : l'enveloppe protège ta croissance des impôts pendant que tes investissements se développent à l'intérieur.",
    exemple:
      "Sans PEA : 10 000 € → 20 000 € = 10 000 € de plus-value taxée à 30 % = 3 000 € d'impôts. Avec PEA (après 5 ans) : seuls 17,2 % de prélèvements sociaux s'appliquent = 1 720 €. Économie : 1 280 €.",
  },
  {
    mot: "Assurance-vie",
    categorie: "Fiscalité",
    definition:
      "Enveloppe d'épargne et de transmission avec avantages fiscaux. Permet d'investir dans des fonds euros (garantis) ou des unités de compte (actions, ETF).",
    analogie:
      "Comme un coffre-fort fiscal : les gains à l'intérieur ne sont pas imposés tant que tu n'effectues pas de retrait, et tu choisis qui hérite sans droits de succession.",
    exemple:
      "Après 8 ans, un abattement de 4 600 €/an (9 200 € pour un couple) s'applique sur les gains. Sur 200 000 € investis → 300 000 €, tu peux retirer les 100 000 € de gains en 10 ans sans aucun impôt (hors prélèvements sociaux).",
  },
  {
    mot: "Taux directeur",
    categorie: "Épargne",
    definition:
      "Taux d'intérêt fixé par une banque centrale (BCE, Fed) qui détermine le coût de l'argent dans l'économie et influence tous les autres taux.",
    analogie:
      "Comme le robinet d'eau de toute l'économie : quand la banque centrale l'ouvre (taux bas), l'argent coule facilement et pas cher. Quand elle le ferme (taux élevés), tout devient plus cher à financer.",
    exemple:
      "La BCE a relevé ses taux de 0 % à 4 % entre 2022 et 2023. Résultat : un crédit immo à 1 % est passé à 4 %. Pour un emprunt de 200 000 € sur 20 ans, la mensualité est passée de 920 € à 1 212 € — soit +292 €/mois.",
  },
  {
    mot: "Spread",
    categorie: "Bourse",
    definition:
      "Écart entre le prix d'achat (ask) et le prix de vente (bid) d'un actif. C'est la commission implicite des marchés financiers.",
    analogie:
      "Comme un bureau de change : tu échanges des euros contre des dollars à un taux, mais si tu veux racheter des euros immédiatement, le taux est légèrement moins favorable. Cet écart est le spread.",
    exemple:
      "Sur une action peu liquide, le spread peut être de 0,5 %. Sur un ETF très liquide comme un S&P 500, il est de 0,01 %. Pour un achat de 10 000 €, la différence est de 49 €. Sur des années de trading actif, les spreads s'accumulent significativement.",
  },
  {
    mot: "Short (vente à découvert)",
    categorie: "Bourse",
    definition:
      "Stratégie qui consiste à vendre un actif que l'on ne possède pas (en l'empruntant) en anticipant une baisse de son prix pour le racheter moins cher.",
    analogie:
      "Tu empruntes le vélo de ton voisin, tu le vends 200 €. Le vélo perd de la valeur et tu en rachètes un identique à 120 €. Tu rends le vélo à ton voisin et tu gardes 80 €. Si le vélo monte à 300 €, tu perds 100 €.",
    exemple:
      "En 2022, des hedge funds ont shorté des actions tech après la hausse des taux. Tesla a perdu -65 % en un an : 10 000 € de short auraient rapporté 6 500 € de gain. Mais si Tesla avait monté de 100 %, la perte aurait été illimitée.",
  },
  {
    mot: "Hedge Fund",
    categorie: "Bourse",
    definition:
      "Fonds d'investissement alternatif utilisant des stratégies complexes (effet de levier, short, dérivés) pour générer des rendements en toutes conditions de marché.",
    analogie:
      "Comme un chef étoilé de la finance : des techniques sophistiquées réservées aux grandes tables (investisseurs institutionnels et très fortunés), avec des résultats qui valent parfois… ou pas.",
    exemple:
      "Les hedge funds prélèvent en général 2 % de frais de gestion + 20 % des performances (modèle « 2 et 20 »). Sur 1 M€ avec 10 % de performance : 20 000 € de frais fixes + 20 000 € de performance = 40 000 € de frais. Il ne te reste que 60 000 € sur 100 000 € de gains.",
  },
  {
    mot: "IPO",
    categorie: "Bourse",
    definition:
      "Initial Public Offering (introduction en Bourse) : premier jour où les actions d'une entreprise privée sont proposées au grand public sur un marché boursier.",
    analogie:
      "Comme l'ouverture d'un restaurant qui n'avait jusqu'ici que des clients sélectionnés : soudain, n'importe qui peut réserver une table (acheter des actions) et participer à l'aventure.",
    exemple:
      "Airbnb s'est introduit en Bourse en décembre 2020 à 68 $/action. Le premier jour, l'action a clôturé à 144 $. Ceux qui ont pu souscrire à l'IPO ont doublé leur mise en 24 heures. Mais 70 % des IPO sous-performent l'indice sur 5 ans.",
  },
  {
    mot: "Rendement",
    categorie: "Épargne",
    definition:
      "Mesure du gain généré par un investissement, exprimé en pourcentage du capital investi sur une période donnée.",
    analogie:
      "Comme le taux horaire de ton argent : combien chaque euro placé rapporte-t-il par an ? Un rendement de 5 % signifie que chaque euro travaille et rapporte 5 centimes par an.",
    exemple:
      "Livret A : 3 % → 10 000 € rapportent 300 €/an. SCPI : 5 % → 10 000 € rapportent 500 €/an. ETF actions : 8 % historique → 10 000 € rapportent 800 €/an. Sur 20 ans, la différence entre 3 % et 8 % représente 23 000 € d'écart sur 10 000 € investis.",
  },
];

// ─── Config catégories ────────────────────────────────────────────────────────

const CATEGORIES: Categorie[] = [
  "Tous",
  "Bourse",
  "Épargne",
  "Immobilier",
  "Crypto",
  "Fiscalité",
];

const CAT_COLORS: Record<Exclude<Categorie, "Tous">, string> = {
  Bourse: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Épargne: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Immobilier: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  Crypto: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Fiscalité: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

// ─── Composant terme ──────────────────────────────────────────────────────────

function TermeCard({ terme }: { terme: Terme }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen((v) => !v)}
      className="w-full text-left bg-[#1F2937] rounded-2xl p-5 sm:p-6 card-hover transition-all"
      aria-expanded={open}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Mot + badge */}
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h2
              className="text-2xl font-bold text-[#F9F9F9] uppercase leading-none"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              {terme.mot}
            </h2>
            <span
              className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${CAT_COLORS[terme.categorie]}`}
            >
              {terme.categorie}
            </span>
          </div>

          {/* Définition */}
          <p className="text-[#9CA3AF] text-sm leading-relaxed">{terme.definition}</p>

          {/* Analogie */}
          <p className="text-[#6B7280] text-sm italic mt-2 leading-relaxed">
            {terme.analogie}
          </p>
        </div>

        {/* Chevron */}
        <div
          className={`shrink-0 text-[#059669] transition-transform duration-300 mt-1 ${open ? "rotate-180" : ""}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Exemple chiffré (expand) */}
      {open && (
        <div className="mt-4 pt-4 border-t border-[#374151]">
          <p className="text-xs text-[#059669] font-semibold uppercase tracking-widest mb-2">
            Exemple concret
          </p>
          <p className="text-[#9CA3AF] text-sm leading-relaxed">{terme.exemple}</p>
        </div>
      )}
    </button>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function GlossaireClient() {
  const [search, setSearch] = useState("");
  const [activeCategorie, setActiveCategorie] = useState<Categorie>("Tous");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TERMES.filter((t) => {
      const matchCat =
        activeCategorie === "Tous" || t.categorie === activeCategorie;
      const matchSearch =
        !q ||
        t.mot.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCategorie]);

  return (
    <section className="px-4 sm:px-6 pb-24 max-w-4xl mx-auto space-y-6">
      {/* Barre de recherche */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un terme…"
          className="w-full bg-[#1F2937] border border-[#374151] text-[#F9F9F9] placeholder-[#6B7280] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#059669] transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#F9F9F9] transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filtres catégorie */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategorie(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
              activeCategorie === cat
                ? "bg-[#059669] border-[#059669] text-white"
                : "border-[#374151] text-[#6B7280] hover:border-[#6B7280] hover:text-[#F9F9F9]"
            }`}
          >
            {cat}
            {cat !== "Tous" && (
              <span className="ml-1.5 text-xs opacity-60">
                {TERMES.filter((t) => t.categorie === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Compteur résultats */}
      <p className="text-[#6B7280] text-sm">
        {filtered.length} terme{filtered.length > 1 ? "s" : ""}
        {search || activeCategorie !== "Tous" ? " trouvé" + (filtered.length > 1 ? "s" : "") : " au total"}
      </p>

      {/* Liste */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((terme) => (
            <TermeCard key={terme.mot} terme={terme} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[#6B7280] text-lg">Aucun terme trouvé pour « {search} »</p>
          <button
            onClick={() => { setSearch(""); setActiveCategorie("Tous"); }}
            className="mt-4 text-[#059669] text-sm hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </section>
  );
}
