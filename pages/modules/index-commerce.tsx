import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────
type CountryKey =
  | "france" | "espagne" | "allemagne" | "italie"
  | "usa" | "canada" | "royaume_uni"
  | "eau" | "arabie_saoudite"
  | "chine" | "inde" | "japon" | "mexique"
  | "egypte" | "senegal" | "cote_ivoire" | "tunisie" | "turquie";

type CategoryKey =
  | "systeme_douanier"
  | "circuit_dedouanement"
  | "importation_depuis_maroc"
  | "exportation_vers_maroc"
  | "documentation"
  | "regles_controle"
  | "regles_origine"
  | "accord_commercial"
  | "pieges"
  | "conseils";

interface CountryInfo { label: string; flag: string; region: string; }
interface CategoryInfo { num: string; label: string; }

// ─── Configuration ───────────────────────────────────────────────────────────
const COUNTRIES: Record<CountryKey, CountryInfo> = {
  france:          { label: "France",                  flag: "🇫🇷", region: "Union Européenne" },
  espagne:         { label: "Espagne",                 flag: "🇪🇸", region: "Union Européenne" },
  allemagne:       { label: "Allemagne",               flag: "🇩🇪", region: "Union Européenne" },
  italie:          { label: "Italie",                  flag: "🇮🇹", region: "Union Européenne" },
  usa:             { label: "États-Unis d'Amérique",   flag: "🇺🇸", region: "Amériques" },
  canada:          { label: "Canada",                  flag: "🇨🇦", region: "Amériques" },
  mexique:         { label: "Mexique",                 flag: "🇲🇽", region: "Amériques" },
  royaume_uni:     { label: "Grande-Bretagne",         flag: "🇬🇧", region: "Europe" },
  turquie:         { label: "Turquie",                 flag: "🇹🇷", region: "Europe / MENA" },
  eau:             { label: "Émirats Arabes Unis",     flag: "🇦🇪", region: "Moyen-Orient" },
  arabie_saoudite: { label: "Arabie Saoudite",         flag: "🇸🇦", region: "Moyen-Orient" },
  chine:           { label: "Chine",                   flag: "🇨🇳", region: "Asie-Pacifique" },
  inde:            { label: "Inde",                    flag: "🇮🇳", region: "Asie-Pacifique" },
  japon:           { label: "Japon",                   flag: "🇯🇵", region: "Asie-Pacifique" },
  egypte:          { label: "Égypte",                  flag: "🇪🇬", region: "Afrique / MENA" },
  tunisie:         { label: "Tunisie",                 flag: "🇹🇳", region: "Afrique du Nord" },
  senegal:         { label: "Sénégal",                 flag: "🇸🇳", region: "Afrique de l'Ouest" },
  cote_ivoire:     { label: "Côte d'Ivoire",           flag: "🇨🇮", region: "Afrique de l'Ouest" },
};

const CATEGORIES: Record<CategoryKey, CategoryInfo> = {
  systeme_douanier:         { num: "1", label: "Système douanier national" },
  circuit_dedouanement:     { num: "2", label: "Circuit de dédouanement local" },
  importation_depuis_maroc: { num: "3", label: "Procédures d'importation depuis le Maroc" },
  exportation_vers_maroc:   { num: "4", label: "Procédures d'exportation vers le Maroc" },
  documentation:            { num: "5", label: "Documentation exigible" },
  regles_controle:          { num: "6", label: "Règles de contrôle adoptées" },
  regles_origine:           { num: "7", label: "Règles d'origine et formulaires" },
  accord_commercial:        { num: "8", label: "Accord commercial avec le Maroc" },
  pieges:                   { num: "9", label: "Pièges et particularités locales" },
  conseils:                 { num: "10", label: "Conseils pratiques pour l'opérateur marocain" },
};

// ─── Base de données ─────────────────────────────────────────────────────────
type DB = Partial<Record<CountryKey, Partial<Record<CategoryKey, string>>>>;

const DATA: DB = {
  france: {
    systeme_douanier: `La Direction Générale des Douanes et Droits Indirects (DGDDI), communément appelée Douanes françaises, est une direction générale du ministère de l'Économie et des Finances. Son activité est régie par le Code des douanes national, le Code des Douanes de l'Union européenne (CDU), ainsi que par des accords et traités internationaux — OMC et accords de libre-échange. La France applique la nomenclature du Système Harmonisé (SH) dans sa version 2022, commune à l'ensemble des États membres de l'UE. La DGDDI assure la surveillance des frontières terrestres, maritimes et numériques, le contrôle des flux de marchandises, et la lutte contre les trafics illicites. Elle est également présente dans les organisations de coopération douanière internationale, notamment l'OMD, Frontex et Europol. En tant qu'État membre de l'UE, la France n'a pas de politique douanière autonome vis-à-vis des pays tiers — c'est la politique commerciale commune de l'Union qui s'applique, y compris à l'égard du Maroc.`,
    circuit_dedouanement: `Le système douanier français est en pleine transformation numérique. Le nouveau téléservice DELTA I/E (Import/Export) remplace désormais les anciens applicatifs DELTA G et DELTA X, avec le volet import basculé depuis octobre 2025 et le volet export depuis décembre 2025. Ce système dématérialise totalement le dépôt et le traitement des déclarations en douane. Le circuit type comprend : la déclaration sommaire d'entrée (ENS) déposée dans le système ICS2 avant arrivée des marchandises, la notification de présentation via ANTES, le dépôt de la déclaration H1 (import) ou B1 (export) dans DELTA I/E, l'analyse des risques par la douane (circuit vert, orange ou rouge), le contrôle documentaire ou physique, la mainlevée, et enfin l'enlèvement des marchandises. Depuis le 1er avril 2025, les systèmes ICS2 et ANTES sont obligatoires pour les flux routiers, ferroviaires et remorques non accompagnées, avec une connexion technique EDI ou DTI obligatoire. Les délais varient de quelques heures pour un circuit vert dématérialisé à plusieurs jours en cas de contrôle approfondi.`,
    importation_depuis_maroc: `Les marchandises en provenance du Maroc entrent sur le territoire douanier de l'Union européenne (TDU) via la France principalement par voie maritime (ports de Barcelone, Algésiras, Marseille) ou routière (Ceuta/Melilla, puis transit espagnol). À l'arrivée sur le territoire français, l'opérateur dépose une déclaration H1 dans DELTA I/E précisant la valeur douanière, le code SH, le pays d'origine, l'Incoterm utilisé et les documents d'accompagnement. Les produits industriels originaires du Maroc sont admis dans l'UE en exemption totale des droits de douane et des taxes d'effet équivalent, en application de l'Accord d'Association. Pour les produits agricoles, des contingents tarifaires et des prix d'entrée s'appliquent selon les saisons et les catégories de produits. L'importateur doit disposer d'un numéro EORI (désormais basé sur le SIREN en France) et peut mandater un Représentant en Douane Enregistré (RDE) pour accomplir les formalités.`,
    exportation_vers_maroc: `L'exportateur français dépose une déclaration B1 dans DELTA I/E auprès du bureau de douane d'exportation. La déclaration doit mentionner le bureau de sortie du Territoire Douanier de l'Union (TDU), le code SH des marchandises, la valeur FOB et les références de l'importateur marocain. À l'exportation de l'UE vers le Maroc, tous les produits industriels sont libéralisés à l'exception de certains produits figurant sur des listes spécifiques. Les marchandises restent soumises aux conditions d'origine fixées par le protocole Pan-Euro-Méditerranéen. Pour les produits agricoles sensibles destinés au Maroc, l'exportateur français doit veiller au respect des contingents et des cahiers de prescriptions spéciales fixés par les autorités marocaines (notamment le MAPM pour les produits d'origine animale). Le suivi de la sortie effective du TDU est assuré par le système DELTA I/E via le MRN (Movement Reference Number), qui atteste de l'exportation pour la comptabilité TVA de l'exportateur.`,
    documentation: `Pour toute exportation de France vers le Maroc, le dossier documentaire minimal comprend : la facture commerciale en 3 exemplaires (avec prix unitaire, quantités, conditions de vente Incoterms), la liste de colisage, le document de transport (connaissement B/L, LTA ou CMR selon le mode), et le certificat d'origine. Le certificat de circulation EUR.1 est le document de référence dans le cadre des accords préférentiels UE-Maroc. C'est l'exportateur qui rédige le document, qui est ensuite visé par le bureau de douane de sortie du territoire communautaire au moment de l'accomplissement des formalités douanières export. Pour les envois de valeur inférieure à 6 000 euros, une déclaration sur facture établie par un exportateur agréé peut remplacer l'EUR.1. Des documents spécifiques s'ajoutent selon la nature des marchandises : certificat phytosanitaire, certificat sanitaire, certificat de conformité CE, certificat halal pour les viandes, certificat de vente libre pour les cosmétiques et médicaments.`,
    regles_controle: `La France applique le système d'analyse des risques harmonisé au niveau européen, géré par le système ICS2. Chaque ENS déposée est analysée par les autorités douanières françaises et européennes avant l'arrivée des marchandises. Trois niveaux de contrôle existent : le circuit vert (mainlevée automatique), le circuit orange (contrôle documentaire), et le circuit rouge (contrôle physique). Les produits d'origine animale, végétale et les denrées alimentaires en provenance du Maroc sont soumis aux contrôles aux frontières opérés par les Postes d'Inspection Frontaliers (PIF) selon les règlements sanitaires et phytosanitaires européens. La DGDDI dispose également de la DNRED (Direction Nationale du Renseignement et des Enquêtes Douanières) pour les opérations de lutte contre la fraude et la contrebande. Le service TRACFIN est chargé de la lutte contre le blanchiment d'argent et les financements clandestins. Le statut OEA (Opérateur Économique Agréé / AEO en anglais) permet d'accéder à des contrôles allégés et à des procédures simplifiées.`,
    regles_origine: `Le cadre d'origine applicable entre la France/UE et le Maroc est régi par la Convention Pan-Euro-Méditerranéenne (PEM). La convention PEM modernisée est entrée en vigueur le 1er janvier 2025. Une période transitoire d'un an a été mise en place, permettant l'application simultanée des règles de 2013 et des règles modernisées. À compter du 1er janvier 2026, seules les règles modernisées s'appliquent. Les formulaires d'origine utilisables dans le cadre Maroc-UE/France sont : l'EUR.1 (certificat de circulation, délivré par la douane d'exportation), l'EUR-MED (pour les cas impliquant le cumul diagonal avec d'autres pays PEM comme la Tunisie ou l'Algérie), et la déclaration sur facture pour les envois de faible valeur. Les produits intermédiaires originaires du Maroc, de la Turquie, des États de l'AELE ou de la CE ne sont pas soumis au paiement des droits dans le cadre du cumul diagonal prévu par le protocole Pan-Euro-Méditerranéen. L'exportateur marocain doit veiller à satisfaire aux règles de transformation substantielle pour que ses produits acquièrent le caractère originaire marocain.`,
    accord_commercial: `L'UE est le premier partenaire commercial du Maroc et le plus grand investisseur étranger au Maroc. L'accord euro-méditerranéen d'association UE-Maroc est entré en vigueur en 2000 et a créé une zone de libre-échange entre l'UE et le Maroc. En pratique pour la France : les produits industriels marocains (textile, câblage automobile, phosphates, engrais, conserves de poisson, agrumes) entrent en franchise totale de droits de douane sur le marché français. En retour, les produits industriels français entrent au Maroc également en franchise depuis 2012. Pour le secteur agricole, des contingents et calendriers d'entrée s'appliquent, notamment pour les tomates, les agrumes, les fraises et les légumes marocains, qui bénéficient de tarifs réduits mais dans des limites saisonnières et quantitatives. Des négociations pour une Zone de Libre-Échange Approfondi et Complet (ZLEAC) ont été suspendues depuis 2014 à la demande du Maroc — ce dossier reste politiquement sensible et mérite un suivi attentif.`,
    pieges: `Plusieurs écueils guettent l'opérateur marocain travaillant avec la France. Premièrement, la transition numérique DELTA I/E est en cours et crée des situations de double-système transitoire — il est impératif de s'assurer que le partenaire logistique français utilise le bon système selon la date de l'opération. Deuxièmement, la distinction entre bureau d'exportation et bureau de sortie du TDU est une source fréquente d'erreurs : lorsque la marchandise sort par l'Espagne après avoir été déclarée en France, une déclaration de transit T1 est obligatoire. Troisièmement, les règles d'origine PEM modernisées depuis janvier 2026 peuvent différer des règles antérieures — un produit qui était considéré originaire du Maroc sous l'ancien protocole peut ne plus l'être sous les règles révisées. Quatrièmement, pour les produits agroalimentaires marocains, les contrôles aux PIF sont stricts et tout manquement aux normes sanitaires de l'UE entraîne le refoulement ou la destruction de la marchandise. Cinquièmement, les contingents agricoles sont attribués sur une base annuelle — les dépasser expose l'exportateur marocain aux droits de douane plein tarif.`,
    conseils: `L'opérateur marocain qui exporte vers la France doit adopter une stratégie proactive en amont de chaque opération. Il est conseillé de vérifier systématiquement sur la base Access2Markets de la Commission européenne les droits applicables à son code SH, les contingents en vigueur et les règles d'origine spécifiques à son produit. S'assurer de disposer du statut d'Exportateur Agréé (EA) auprès de l'ADII permet d'établir soi-même les déclarations sur facture sans passer par un EUR.1 — un gain de temps et de coût significatif pour les flux réguliers. Pour les produits alimentaires, l'agrément préalable de l'établissement par les autorités vétérinaires de l'UE est une condition sine qua non — le vérifier avant toute première expédition évite des blocages coûteux. Nouer une relation de confiance avec un Représentant en Douane Enregistré (RDE) français, bien informé des nouvelles procédures DELTA I/E et ICS2, est indispensable. Enfin, le suivi des circulaires de la DGDDI (disponibles sur douane.gouv.fr) et de l'ADII (douane.gov.ma) en temps réel constitue un avantage compétitif réel dans un environnement réglementaire en mutation permanente.`,
  },
};

// Placeholder pour pays sans contenu encore
const PLACEHOLDER = (country: string, category: string) =>
  `La fiche ${country} — ${category} est en cours de préparation. Elle sera intégrée lors du prochain chargement de données RAG. Revenez prochainement ou contactez l'équipe Douane.ia.`;

// ─── Composant principal ──────────────────────────────────────────────────────
export default function IndexCommerceInternational() {
  const [country, setCountry]   = useState<CountryKey | "">("");
  const [category, setCategory] = useState<CategoryKey | "">("");

  const countryInfo  = country  ? COUNTRIES[country]  : null;
  const categoryInfo = category ? CATEGORIES[category] : null;

  const content =
    country && category
      ? (DATA[country]?.[category] ?? PLACEHOLDER(COUNTRIES[country].label, CATEGORIES[category].label))
      : null;

  const hasData = country && category && DATA[country]?.[category];

  // ─── Groupes de pays pour les optgroups ────────────────────────────────────
  const regions: Record<string, CountryKey[]> = {};
  (Object.entries(COUNTRIES) as [CountryKey, CountryInfo][]).forEach(([k, v]) => {
    if (!regions[v.region]) regions[v.region] = [];
    regions[v.region].push(k);
  });

  return (
    <>
      <Head>
        <title>Index du Commerce International — Douane.ia</title>
      </Head>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        :root{--gold:#C9A84C;--g2:#E8C97A;--g3:#F5E4B0;--g4:#FBF5E6;--ink:#0A0A0A;--ink2:#3A3530;--ink3:#8A8078;--white:#FDFCF8;--bd:#E8DFC8;--bd2:#D4C8A8;--up:#4CAF7C}
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;background:var(--g4);color:var(--ink);min-height:100vh}
        select{border:1px solid var(--bd2);padding:10px 14px;font-size:13px;font-family:inherit;outline:none;background:var(--white);color:var(--ink);cursor:pointer;width:100%;transition:border-color .15s;appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238A8078' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px}
        select:focus{border-color:var(--gold)}
        select option{font-size:13px}
        .nav-btn{font-size:10px;color:var(--ink3);padding:4px 10px;border:1px solid var(--bd2);background:var(--white);cursor:pointer;text-decoration:none;letter-spacing:.06em;transition:all .15s}
        .nav-btn:hover{background:var(--g4);border-color:var(--gold);color:var(--gold)}
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* ── Header ── */}
        <div style={{ background: "var(--ink)", borderBottom: "2px solid var(--gold)", padding: ".75rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: ".16em", color: "var(--gold)", marginBottom: 3 }}>DOUANE.IA — INTELLIGENCE RÉGLEMENTAIRE</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "var(--g2)", letterSpacing: "-.01em" }}>
              Index du Commerce International
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link href="/" className="nav-btn">← Accueil</Link>
            <div style={{ fontSize: 9, color: "var(--ink3)", textAlign: "right", letterSpacing: ".05em" }}>
              18 pays · 10 rubriques<br />Base CDII · Sources officielles
            </div>
          </div>
        </div>

        {/* ── Sous-titre ── */}
        <div style={{ background: "var(--g4)", borderBottom: "1px solid var(--bd)", padding: ".65rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 11, color: "var(--ink3)", lineHeight: 1.5 }}>
            Législations douanières, procédures d'import/export et accords commerciaux — comparatif par pays, du point de vue de l'opérateur marocain.
          </div>
          <div style={{ fontSize: 9, color: "var(--ink3)", whiteSpace: "nowrap", marginLeft: 16 }}>
            Mis à jour 2025–2026
          </div>
        </div>

        {/* ── Sélecteurs ── */}
        <div style={{ background: "var(--white)", borderBottom: "1px solid var(--bd)", padding: "1.25rem 1.5rem" }}>
          <div style={{ fontSize: 9, letterSpacing: ".14em", color: "var(--gold)", marginBottom: ".875rem" }}>SÉLECTIONNEZ LE PAYS ET LA RUBRIQUE</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

            {/* ── Sélecteur pays ── */}
            <div>
              <div style={{ fontSize: 9, letterSpacing: ".1em", color: "var(--ink3)", marginBottom: 6 }}>
                01 — PAYS
              </div>
              <div style={{ position: "relative" }}>
                <select
                  value={country}
                  onChange={e => { setCountry(e.target.value as CountryKey); setCategory(""); }}
                >
                  <option value="">— Sélectionner un pays —</option>
                  {Object.entries(regions).map(([region, keys]) => (
                    <optgroup key={region} label={`── ${region}`}>
                      {keys.map(k => (
                        <option key={k} value={k}>
                          {COUNTRIES[k].flag}  {COUNTRIES[k].label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Sélecteur catégorie ── */}
            <div>
              <div style={{ fontSize: 9, letterSpacing: ".1em", color: "var(--ink3)", marginBottom: 6 }}>
                02 — RUBRIQUE
              </div>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CategoryKey)}
                disabled={!country}
                style={{ opacity: country ? 1 : .45 }}
              >
                <option value="">— Sélectionner une rubrique —</option>
                {(Object.entries(CATEGORIES) as [CategoryKey, CategoryInfo][]).map(([k, v]) => (
                  <option key={k} value={k}>{v.num}. {v.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Indicateur de disponibilité */}
          {country && (
            <div style={{ marginTop: ".75rem", fontSize: 10, color: "var(--ink3)", display: "flex", alignItems: "center", gap: 8 }}>
              <span>{countryInfo?.flag}</span>
              <span>
                {DATA[country as CountryKey]
                  ? <><span style={{ color: "var(--up)" }}>●</span> Fiche {countryInfo?.label} disponible — contenu complet (10 rubriques)</>
                  : <><span style={{ color: "var(--gold)" }}>◌</span> Fiche {countryInfo?.label} en cours d'intégration — contenu RAG à charger</>
                }
              </span>
            </div>
          )}
        </div>

        {/* ── Zone d'affichage principale ── */}
        <div style={{ flex: 1, padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* État initial */}
          {!country && !category && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "3rem", background: "var(--white)", border: "1px solid var(--bd)" }}>
              <div style={{ fontSize: 32, marginBottom: "1rem" }}>🌍</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "var(--ink2)", marginBottom: ".5rem" }}>
                Législations douanières de 18 pays
              </div>
              <div style={{ fontSize: 12, color: "var(--ink3)", maxWidth: 480, lineHeight: 1.7 }}>
                Sélectionnez un pays dans la liste déroulante, puis choisissez une rubrique pour afficher les informations réglementaires correspondantes.
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: "1.5rem", maxWidth: 560 }}>
                {(Object.values(COUNTRIES) as CountryInfo[]).map((c, i) => (
                  <span key={i} style={{ fontSize: 11, padding: "3px 10px", background: "var(--g4)", border: "1px solid var(--bd)", color: "var(--ink3)" }}>
                    {c.flag} {c.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pays sélectionné, pas de catégorie */}
          {country && !category && (
            <div style={{ background: "var(--white)", border: "1px solid var(--bd)", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                <div style={{ fontSize: 48 }}>{countryInfo?.flag}</div>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{countryInfo?.label}</div>
                  <div style={{ fontSize: 10, color: "var(--ink3)", letterSpacing: ".08em" }}>{countryInfo?.region} · {DATA[country as CountryKey] ? "Fiche complète disponible" : "En cours d'intégration"}</div>
                </div>
              </div>
              <div style={{ fontSize: 9, letterSpacing: ".12em", color: "var(--gold)", marginBottom: ".75rem" }}>10 RUBRIQUES DISPONIBLES — CHOISISSEZ-EN UNE</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
                {(Object.entries(CATEGORIES) as [CategoryKey, CategoryInfo][]).map(([k, v]) => {
                  const has = !!DATA[country as CountryKey]?.[k];
                  return (
                    <button
                      key={k}
                      onClick={() => setCategory(k)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: ".65rem .875rem", background: "var(--g4)", border: "1px solid var(--bd)", cursor: "pointer", textAlign: "left", transition: "all .12s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; (e.currentTarget as HTMLElement).style.background = "var(--white)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--bd)"; (e.currentTarget as HTMLElement).style.background = "var(--g4)"; }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 500, color: "var(--gold)", minWidth: 22 }}>{v.num}.</span>
                      <span style={{ fontSize: 12, color: "var(--ink2)" }}>{v.label}</span>
                      <span style={{ marginLeft: "auto", fontSize: 9, color: has ? "var(--up)" : "var(--bd2)" }}>{has ? "●" : "◌"}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contenu principal */}
          {country && category && (
            <>
              {/* Breadcrumb */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: "var(--ink3)" }}>
                <button onClick={() => { setCountry(""); setCategory(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gold)", fontSize: 10 }}>Index</button>
                <span>›</span>
                <button onClick={() => setCategory("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gold)", fontSize: 10 }}>{countryInfo?.flag} {countryInfo?.label}</button>
                <span>›</span>
                <span style={{ color: "var(--ink2)" }}>{categoryInfo?.label}</span>
              </div>

              {/* Carte contenu */}
              <div style={{ background: "var(--white)", border: "1px solid var(--bd)", flex: 1, display: "flex", flexDirection: "column" }}>

                {/* En-tête fiche */}
                <div style={{ background: "var(--ink)", padding: ".875rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ fontSize: 32 }}>{countryInfo?.flag}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, letterSpacing: ".14em", color: "var(--gold)", marginBottom: 3 }}>
                      FICHE PAYS — {countryInfo?.label?.toUpperCase()} · RUBRIQUE {categoryInfo?.num}/10
                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--g2)" }}>
                      {categoryInfo?.label}
                    </div>
                  </div>
                  {hasData && (
                    <div style={{ fontSize: 9, padding: "3px 10px", background: "rgba(76,175,124,.15)", border: "1px solid rgba(76,175,124,.3)", color: "#4CAF7C", letterSpacing: ".06em" }}>
                      CONTENU VALIDÉ
                    </div>
                  )}
                </div>

                {/* Numéros de navigation rapide catégories */}
                <div style={{ borderBottom: "1px solid var(--bd)", padding: ".5rem 1.5rem", display: "flex", gap: 4, overflowX: "auto", background: "var(--g4)" }}>
                  {(Object.entries(CATEGORIES) as [CategoryKey, CategoryInfo][]).map(([k, v]) => {
                    const isActive = k === category;
                    const has = !!DATA[country as CountryKey]?.[k];
                    return (
                      <button
                        key={k}
                        onClick={() => setCategory(k)}
                        title={v.label}
                        style={{
                          padding: "4px 10px", fontSize: 10, cursor: "pointer", border: "1px solid",
                          borderColor: isActive ? "var(--gold)" : "var(--bd)",
                          background: isActive ? "var(--ink)" : "var(--white)",
                          color: isActive ? "var(--gold)" : has ? "var(--ink2)" : "var(--ink3)",
                          fontWeight: isActive ? 500 : 400, whiteSpace: "nowrap",
                          letterSpacing: ".04em",
                        }}
                      >
                        {v.num}.
                      </button>
                    );
                  })}
                  <span style={{ fontSize: 9, color: "var(--ink3)", alignSelf: "center", marginLeft: 4, whiteSpace: "nowrap" }}>
                    — {categoryInfo?.label}
                  </span>
                </div>

                {/* Texte principal */}
                <div style={{ padding: "2rem 1.75rem", flex: 1 }}>
                  {hasData ? (
                    <>
                      {/* Citation / highlight */}
                      <div style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "1rem", marginBottom: "1.5rem", background: "var(--g4)", padding: ".875rem 1rem .875rem 1.25rem" }}>
                        <div style={{ fontSize: 9, letterSpacing: ".12em", color: "var(--gold)", marginBottom: 4 }}>
                          {countryInfo?.flag} {countryInfo?.label?.toUpperCase()} · {categoryInfo?.label?.toUpperCase()}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--ink3)" }}>
                          Vue de l'opérateur marocain · Sources : textes législatifs officiels, rapports OMC/Banque Mondiale, guides praticiens
                        </div>
                      </div>

                      {/* Corps du texte */}
                      <div style={{ fontSize: 14, lineHeight: 1.85, color: "var(--ink2)", textAlign: "justify" }}>
                        {content}
                      </div>
                    </>
                  ) : (
                    /* Placeholder */
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem", textAlign: "center", minHeight: 300 }}>
                      <div style={{ fontSize: 40, marginBottom: "1rem" }}>{countryInfo?.flag}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "var(--ink2)", marginBottom: ".75rem" }}>
                        Fiche en cours d'intégration
                      </div>
                      <div style={{ fontSize: 12, color: "var(--ink3)", maxWidth: 440, lineHeight: 1.7, marginBottom: "1.5rem" }}>
                        La fiche <strong style={{ color: "var(--ink2)" }}>{countryInfo?.label}</strong> — rubrique <strong style={{ color: "var(--ink2)" }}>{categoryInfo?.label}</strong> sera disponible lors du prochain chargement de données RAG.
                      </div>
                      <div style={{ fontSize: 10, padding: "6px 16px", background: "var(--g4)", border: "1px solid var(--g3)", color: "var(--ink3)" }}>
                        Priorité : {countryInfo?.region} · Contenu rédigé à partir de sources officielles
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation inférieure */}
                <div style={{ borderTop: "1px solid var(--bd)", padding: ".75rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--g4)" }}>
                  {/* Précédent */}
                  {(() => {
                    const keys = Object.keys(CATEGORIES) as CategoryKey[];
                    const idx = keys.indexOf(category as CategoryKey);
                    const prev = idx > 0 ? keys[idx - 1] : null;
                    return prev ? (
                      <button onClick={() => setCategory(prev)} style={{ fontSize: 10, color: "var(--ink3)", background: "none", border: "none", cursor: "pointer", display: "flex", gap: 5 }}>
                        ← {CATEGORIES[prev].num}. {CATEGORIES[prev].label}
                      </button>
                    ) : <div />;
                  })()}

                  <div style={{ fontSize: 9, color: "var(--ink3)" }}>
                    {categoryInfo?.num} / 10
                  </div>

                  {/* Suivant */}
                  {(() => {
                    const keys = Object.keys(CATEGORIES) as CategoryKey[];
                    const idx = keys.indexOf(category as CategoryKey);
                    const next = idx < keys.length - 1 ? keys[idx + 1] : null;
                    return next ? (
                      <button onClick={() => setCategory(next)} style={{ fontSize: 10, color: "var(--gold)", background: "none", border: "none", cursor: "pointer", display: "flex", gap: 5 }}>
                        {CATEGORIES[next].num}. {CATEGORIES[next].label} →
                      </button>
                    ) : <div />;
                  })()}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{ background: "var(--ink)", borderTop: "1px solid #222", padding: ".6rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 9, color: "var(--ink3)", letterSpacing: ".05em" }}>
            Douane.ia · Index du Commerce International · 18 pays · 2025–2026 · Sources officielles
          </div>
          <div style={{ fontSize: 9, color: "var(--ink3)" }}>
            Informatif — consultez un transitaire agréé pour toute opération réelle
          </div>
        </div>

      </div>
    </>
  );
}
