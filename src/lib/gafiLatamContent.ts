export type CountryIso =
  | "AR"
  | "BR"
  | "UY"
  | "CL"
  | "CO"
  | "PE"
  | "PY"
  | "EC"
  | "BO"
  | "VE"
  | "MX"
  | "SV"
  | "PA"
  | "GT"
  | "CR"
  | "HN"
  | "NI"
  | "DO";

/** Map fill tier: GAFI/GAFILAT membership × local VA/AML legislation. */
export type MapCountryTier =
  | "gafiGafilatLaw"
  | "gafiGafilatPending"
  | "gafilatLaw"
  | "gafilatPending"
  | "neutral";

export const MAP_LEGEND_TIERS: MapCountryTier[] = [
  "gafiGafilatLaw",
  "gafiGafilatPending",
  "gafilatLaw",
  "gafilatPending",
  "neutral",
];

/** Single source of truth for map colors (same across locales). */
export const COUNTRY_TIERS: Record<CountryIso, MapCountryTier> = {
  AR: "gafiGafilatLaw",
  BR: "gafiGafilatLaw",
  MX: "gafiGafilatLaw",
  UY: "gafilatLaw",
  CL: "gafilatLaw",
  SV: "gafilatLaw",
  GT: "gafilatLaw",
  CR: "gafilatLaw",
  CO: "gafilatPending",
  PE: "gafilatPending",
  PY: "gafilatPending",
  EC: "gafilatPending",
  BO: "gafilatPending",
  PA: "gafilatPending",
  HN: "gafilatPending",
  NI: "gafilatPending",
  DO: "gafilatPending",
  VE: "neutral",
};

export type CountryInfo = {
  name: string;
  adheres: string;
  regime: string;
  travelRule: string;
  notes: string;
  tier: MapCountryTier;
};

type CountryInfoBase = Omit<CountryInfo, "tier">;

function withTier(
  iso: CountryIso,
  info: CountryInfoBase,
): CountryInfo {
  return { ...info, tier: COUNTRY_TIERS[iso] };
}

function attachTiers(
  raw: Record<CountryIso, CountryInfoBase>,
): Record<CountryIso, CountryInfo> {
  const out = {} as Record<CountryIso, CountryInfo>;
  for (const iso of Object.keys(COUNTRY_TIERS) as CountryIso[]) {
    out[iso] = withTier(iso, raw[iso]);
  }
  return out;
}

export type GafiFitRow = {
  requirement: string;
  covers: string;
  support: string;
};

export type GafiRecRow = {
  code: string;
  title: string;
  crypto: string;
};

export type MapLegendItem = {
  tier: MapCountryTier;
  label: string;
};

export type GafiLatamCopy = {
  title: string;
  message: string;
  contextTitle: string;
  contextBody: string[];
  contextCloseLabel: string;
  contextClose: string;
  recsTitle: string;
  recsIntro: string;
  recHeaders: { code: string; title: string; crypto: string };
  recs: GafiRecRow[];
  fitTitle: string;
  fitIntro: string;
  fitHeaders: { requirement: string; covers: string; support: string };
  fitRows: GafiFitRow[];
  fitMessage: string;
  mapTitle: string;
  mapIntro: string;
  mapHeaders: {
    country: string;
    adheres: string;
    regime: string;
    travelRule: string;
    notes: string;
  };
  mapHint: string;
  mapSelectPrompt: string;
  mapClose: string;
  mapLegendTitle: string;
  mapLegend: MapLegendItem[];
  countries: Record<CountryIso, CountryInfo>;
  greyTitle: string;
  greyBody: string;
  ctaTitle: string;
  talkToTeam: string;
};

export const MAP_COUNTRY_ORDER: CountryIso[] = [
  "MX",
  "GT",
  "HN",
  "SV",
  "NI",
  "CR",
  "PA",
  "DO",
  "CO",
  "VE",
  "EC",
  "PE",
  "BO",
  "PY",
  "BR",
  "UY",
  "AR",
  "CL",
];

const mapHeadersEs = {
  country: "País",
  adheres: "¿Adhiere a las 40 R.?",
  regime: "Régimen cripto / AML 2026",
  travelRule: "Travel Rule",
  notes: "Notas",
} as const;

const mapHeadersEn = {
  country: "Country",
  adheres: "Adheres to the 40 R.?",
  regime: "Crypto / AML regime 2026",
  travelRule: "Travel Rule",
  notes: "Notes",
} as const;

const mapHeadersPt = {
  country: "País",
  adheres: "Adere às 40 R.?",
  regime: "Regime cripto / AML 2026",
  travelRule: "Travel Rule",
  notes: "Notas",
} as const;

const countriesEs = attachTiers({
  AR: {
    name: "Argentina",
    adheres: "Sí (GAFI + GAFILAT)",
    regime:
      "Ley 27.739 + registro de proveedores de servicios de activos virtuales en CNV (RG 1058/2025) + unidad de inteligencia financiera local",
    travelRule: "Vendors la dan por vigente; verificar umbral local",
    notes: "Mercado grande; R.15 PC (2024)",
  },
  BR: {
    name: "Brasil",
    adheres: "Sí (GAFI + GAFILAT)",
    regime:
      "Resoluciones BCB 519/520/521 vigentes 2 feb 2026; licencia de proveedores de servicios de activos virtuales",
    travelRule: "Programada 2 feb 2027 (no live)",
    notes: "Mercado más maduro de la región; R.15 PC (2023)",
  },
  UY: {
    name: "Uruguay",
    adheres: "Sí (GAFILAT)",
    regime: "Circular BCU 2507 (jul 2026); adaptación hasta jun 2027",
    travelRule: "No aparece como Travel Rule live en fuentes 2026 consultadas",
    notes: "R.15 MC (IEM 2020, antes de 2507)",
  },
  CL: {
    name: "Chile",
    adheres: "Sí (GAFILAT)",
    regime: "Ley Fintec 21.521; registro CMF; UAF aplica R.15",
    travelRule: "Vendors la listan en vigor",
    notes: "R.15 PC (2021); régimen parcial",
  },
  CO: {
    name: "Colombia",
    adheres: "Sí (GAFILAT)",
    regime:
      "AML vía unidad de inteligencia financiera / sujetos obligados; sin licencia habilitante clara de proveedores de activos virtuales a ago 2026",
    travelRule: "En desarrollo",
    notes:
      "Demanda de señales existe aunque el comprador no siempre se llame VASP",
  },
  PE: {
    name: "Perú",
    adheres: "Sí (GAFILAT)",
    regime: "Avances SBS / unidad de inteligencia financiera; nota R.15 C en IEM 2019",
    travelRule: "Vendors la listan en vigor",
    notes: "C de 2019 hay que leerla con cuidado",
  },
  PY: {
    name: "Paraguay",
    adheres: "Sí (GAFILAT)",
    regime: "R.15 MC (2022)",
    travelRule: "No confirmado como live",
    notes: "Plaza de servicios cripto; supervisión desigual",
  },
  EC: {
    name: "Ecuador",
    adheres: "Sí (GAFILAT)",
    regime: "R.15 PC (2023)",
    travelRule: "No confirmado",
    notes: "—",
  },
  BO: {
    name: "Bolivia",
    adheres: "Sí (GAFILAT)",
    regime: "Levantó prohibición en 2024; R.15 PC (2024)",
    travelRule: "No",
    notes: "Lista gris GAFI (jun 2026)",
  },
  VE: {
    name: "Venezuela",
    adheres: "CFATF (no GAFILAT)",
    regime: "Auto-reporte GAFI 2026: ley/registro sí",
    travelRule: "Vendors la listan; fila GAFI no marca TR",
    notes: "R.15 PC (2025); lista gris GAFI (jun 2026)",
  },
  MX: {
    name: "México",
    adheres: "Sí (GAFI + GAFILAT)",
    regime:
      "Ley Fintech + art. 17 fr. XVI LFPIORPI (activos virtuales como actividad vulnerable)",
    travelRule: "Auto-reporte GAFI: sí",
    notes: "R.15 LC (2021)",
  },
  SV: {
    name: "El Salvador",
    adheres: "Sí (GAFILAT)",
    regime: "CNAD + Ley de Emisión de Activos Digitales",
    travelRule: "Vendors la listan en vigor",
    notes: "R.15 PC (ago 2024)",
  },
  PA: {
    name: "Panamá",
    adheres: "Sí (GAFILAT)",
    regime: "R.15 C en IEM 2018 (pre-paquete VA)",
    travelRule: "No confirmado como live",
    notes: "GAFILAT lo cita como referente R.15; verificar régimen VASP actual",
  },
  GT: {
    name: "Guatemala",
    adheres: "Sí (GAFILAT)",
    regime:
      "Decreto 15-2026: exchanges, custodios y proveedores de servicios de activos virtuales como sujetos obligados ante IVE",
    travelRule: "En construcción vía ley AML 2026",
    notes: "Presión de evaluación GAFI/GAFILAT",
  },
  CR: {
    name: "Costa Rica",
    adheres: "Sí (GAFILAT)",
    regime:
      "Ley 10961 (Gaceta 19 jun 2026); registro SUGEF; vigencia prevista ~19 set 2026",
    travelRule: "Reglamento CONASSIF pendiente (set 2026)",
    notes: "R.15 NC (2023); salto normativo reciente",
  },
  HN: {
    name: "Honduras",
    adheres: "Sí (GAFILAT)",
    regime: "R.15 C en IEM 2017 (pre-paquete)",
    travelRule: "No confirmado",
    notes: "Sin régimen VASP comparable a SV/CR/GT en fuentes 2026",
  },
  NI: {
    name: "Nicaragua",
    adheres: "Sí (GAFILAT)",
    regime: "Informó medidas de licencia/registro (ESR GAFILAT 2025)",
    travelRule: "Vendors: en desarrollo",
    notes: "Verificar vigencia real",
  },
  DO: {
    name: "Rep. Dominicana",
    adheres: "Sí (GAFILAT; Caribe)",
    regime: "R.15 C IEM 2019; proyecto de política cripto 2026",
    travelRule: "No confirmado",
    notes: "Presión de evaluación, no régimen cerrado",
  },
});

const countriesEn = attachTiers({
  AR: {
    name: "Argentina",
    adheres: "Yes (FATF + GAFILAT)",
    regime:
      "Law 27.739 + CNV registry for virtual-asset service providers (RG 1058/2025) + local financial-intelligence unit",
    travelRule: "Vendors mark it live; verify local threshold",
    notes: "Large market; R.15 PC (2024)",
  },
  BR: {
    name: "Brazil",
    adheres: "Yes (FATF + GAFILAT)",
    regime:
      "BCB Resolutions 519/520/521 live since 2 Feb 2026; license for virtual-asset service providers",
    travelRule: "Scheduled 2 Feb 2027 (not live)",
    notes: "Most mature market in the region; R.15 PC (2023)",
  },
  UY: {
    name: "Uruguay",
    adheres: "Yes (GAFILAT)",
    regime: "BCU Circular 2507 (Jul 2026); adaptation window to Jun 2027",
    travelRule: "Not shown as live Travel Rule in 2026 sources reviewed",
    notes: "R.15 LC (MER 2020, before 2507)",
  },
  CL: {
    name: "Chile",
    adheres: "Yes (GAFILAT)",
    regime: "Fintech Law 21.521; CMF registry; FIU applies R.15",
    travelRule: "Vendors list it as in force",
    notes: "R.15 PC (2021); partial regime",
  },
  CO: {
    name: "Colombia",
    adheres: "Yes (GAFILAT)",
    regime:
      "AML via local financial-intelligence unit / obliged entities; no clear enabling VASP license as of Aug 2026",
    travelRule: "In development",
    notes: "Signal demand exists even if the buyer is not always labeled a VASP",
  },
  PE: {
    name: "Peru",
    adheres: "Yes (GAFILAT)",
    regime:
      "SBS / financial-intelligence unit progress; R.15 C note in 2019 MER",
    travelRule: "Vendors list it as in force",
    notes: "2019 C rating must be read carefully",
  },
  PY: {
    name: "Paraguay",
    adheres: "Yes (GAFILAT)",
    regime: "R.15 LC (2022)",
    travelRule: "Not confirmed as live",
    notes: "Crypto-services hub; uneven supervision",
  },
  EC: {
    name: "Ecuador",
    adheres: "Yes (GAFILAT)",
    regime: "R.15 PC (2023)",
    travelRule: "Not confirmed",
    notes: "—",
  },
  BO: {
    name: "Bolivia",
    adheres: "Yes (GAFILAT)",
    regime: "Lifted ban in 2024; R.15 PC (2024)",
    travelRule: "No",
    notes: "FATF grey list (Jun 2026)",
  },
  VE: {
    name: "Venezuela",
    adheres: "CFATF (not GAFILAT)",
    regime: "FATF 2026 self-report: law/registry yes",
    travelRule: "Vendors list it; FATF row does not mark TR",
    notes: "R.15 PC (2025); FATF grey list (Jun 2026)",
  },
  MX: {
    name: "Mexico",
    adheres: "Yes (FATF + GAFILAT)",
    regime:
      "Fintech Law + LFPIORPI art. 17 XVI (virtual assets as vulnerable activity)",
    travelRule: "FATF self-report: yes",
    notes: "R.15 LC (2021)",
  },
  SV: {
    name: "El Salvador",
    adheres: "Yes (GAFILAT)",
    regime: "CNAD + Digital Asset Issuance Law",
    travelRule: "Vendors list it as in force",
    notes: "R.15 PC (Aug 2024)",
  },
  PA: {
    name: "Panama",
    adheres: "Yes (GAFILAT)",
    regime: "R.15 C in 2018 MER (pre–VA package)",
    travelRule: "Not confirmed as live",
    notes: "Cited by GAFILAT as R.15 reference; verify current VASP regime",
  },
  GT: {
    name: "Guatemala",
    adheres: "Yes (GAFILAT)",
    regime:
      "Decree 15-2026: exchanges, custodians and virtual-asset service providers as obliged entities before IVE",
    travelRule: "Under construction via 2026 AML law",
    notes: "FATF/GAFILAT evaluation pressure",
  },
  CR: {
    name: "Costa Rica",
    adheres: "Yes (GAFILAT)",
    regime:
      "Law 10961 (Gazette 19 Jun 2026); SUGEF registry; expected ~19 Sep 2026",
    travelRule: "CONASSIF regulation pending (Sep 2026)",
    notes: "R.15 NC (2023); recent normative jump",
  },
  HN: {
    name: "Honduras",
    adheres: "Yes (GAFILAT)",
    regime: "R.15 C in 2017 MER (pre-package)",
    travelRule: "Not confirmed",
    notes: "No VASP regime comparable to SV/CR/GT in 2026 sources",
  },
  NI: {
    name: "Nicaragua",
    adheres: "Yes (GAFILAT)",
    regime: "Reported license/registry measures (GAFILAT ESR 2025)",
    travelRule: "Vendors: in development",
    notes: "Verify real-world status",
  },
  DO: {
    name: "Dominican Republic",
    adheres: "Yes (GAFILAT; Caribbean)",
    regime: "R.15 C 2019 MER; crypto policy project 2026",
    travelRule: "Not confirmed",
    notes: "Evaluation pressure, not a closed regime",
  },
});

const countriesPt = attachTiers({
  AR: {
    name: "Argentina",
    adheres: "Sim (GAFI + GAFILAT)",
    regime:
      "Lei 27.739 + registro de provedores de serviços de ativos virtuais na CNV (RG 1058/2025) + unidade de inteligência financeira local",
    travelRule: "Vendors consideram vigente; verificar limiar local",
    notes: "Mercado grande; R.15 PC (2024)",
  },
  BR: {
    name: "Brasil",
    adheres: "Sim (GAFI + GAFILAT)",
    regime:
      "Resoluções BCB 519/520/521 vigentes em 2 fev 2026; licença de provedores de serviços de ativos virtuais",
    travelRule: "Prevista para 2 fev 2027 (não live)",
    notes: "Mercado mais maduro da região; R.15 PC (2023)",
  },
  UY: {
    name: "Uruguai",
    adheres: "Sim (GAFILAT)",
    regime: "Circular BCU 2507 (jul 2026); adaptação até jun 2027",
    travelRule: "Não aparece como Travel Rule live nas fontes 2026 consultadas",
    notes: "R.15 MC (IEM 2020, antes da 2507)",
  },
  CL: {
    name: "Chile",
    adheres: "Sim (GAFILAT)",
    regime: "Lei Fintec 21.521; registro CMF; UAF aplica R.15",
    travelRule: "Vendors listam em vigor",
    notes: "R.15 PC (2021); regime parcial",
  },
  CO: {
    name: "Colômbia",
    adheres: "Sim (GAFILAT)",
    regime:
      "AML via unidade de inteligência financeira / sujeitos obrigados; sem licença habilitante clara de provedores de ativos virtuais até ago 2026",
    travelRule: "Em desenvolvimento",
    notes:
      "Demanda de sinais existe mesmo se o comprador não se chama VASP",
  },
  PE: {
    name: "Peru",
    adheres: "Sim (GAFILAT)",
    regime:
      "Avanços SBS / unidade de inteligência financeira; nota R.15 C no IEM 2019",
    travelRule: "Vendors listam em vigor",
    notes: "C de 2019 deve ser lida com cuidado",
  },
  PY: {
    name: "Paraguai",
    adheres: "Sim (GAFILAT)",
    regime: "R.15 MC (2022)",
    travelRule: "Não confirmado como live",
    notes: "Praça de serviços cripto; supervisão desigual",
  },
  EC: {
    name: "Equador",
    adheres: "Sim (GAFILAT)",
    regime: "R.15 PC (2023)",
    travelRule: "Não confirmado",
    notes: "—",
  },
  BO: {
    name: "Bolívia",
    adheres: "Sim (GAFILAT)",
    regime: "Levantou proibição em 2024; R.15 PC (2024)",
    travelRule: "Não",
    notes: "Lista cinza GAFI (jun 2026)",
  },
  VE: {
    name: "Venezuela",
    adheres: "CFATF (não GAFILAT)",
    regime: "Autorrelato GAFI 2026: lei/registro sim",
    travelRule: "Vendors listam; linha GAFI não marca TR",
    notes: "R.15 PC (2025); lista cinza GAFI (jun 2026)",
  },
  MX: {
    name: "México",
    adheres: "Sim (GAFI + GAFILAT)",
    regime:
      "Lei Fintech + art. 17 fr. XVI LFPIORPI (ativos virtuais como atividade vulnerável)",
    travelRule: "Autorrelato GAFI: sim",
    notes: "R.15 LC (2021)",
  },
  SV: {
    name: "El Salvador",
    adheres: "Sim (GAFILAT)",
    regime: "CNAD + Lei de Emissão de Ativos Digitais",
    travelRule: "Vendors listam em vigor",
    notes: "R.15 PC (ago 2024)",
  },
  PA: {
    name: "Panamá",
    adheres: "Sim (GAFILAT)",
    regime: "R.15 C no IEM 2018 (pré-pacote VA)",
    travelRule: "Não confirmado como live",
    notes: "GAFILAT cita como referente R.15; verificar regime VASP atual",
  },
  GT: {
    name: "Guatemala",
    adheres: "Sim (GAFILAT)",
    regime:
      "Decreto 15-2026: exchanges, custódios e provedores de serviços de ativos virtuais como sujeitos obrigados perante IVE",
    travelRule: "Em construção via lei AML 2026",
    notes: "Pressão de avaliação GAFI/GAFILAT",
  },
  CR: {
    name: "Costa Rica",
    adheres: "Sim (GAFILAT)",
    regime:
      "Lei 10961 (Gazeta 19 jun 2026); registro SUGEF; vigência prevista ~19 set 2026",
    travelRule: "Regulamento CONASSIF pendente (set 2026)",
    notes: "R.15 NC (2023); salto normativo recente",
  },
  HN: {
    name: "Honduras",
    adheres: "Sim (GAFILAT)",
    regime: "R.15 C no IEM 2017 (pré-pacote)",
    travelRule: "Não confirmado",
    notes: "Sem regime VASP comparável a SV/CR/GT nas fontes 2026",
  },
  NI: {
    name: "Nicarágua",
    adheres: "Sim (GAFILAT)",
    regime: "Informou medidas de licença/registro (ESR GAFILAT 2025)",
    travelRule: "Vendors: em desenvolvimento",
    notes: "Verificar vigência real",
  },
  DO: {
    name: "Rep. Dominicana",
    adheres: "Sim (GAFILAT; Caribe)",
    regime: "R.15 C IEM 2019; projeto de política cripto 2026",
    travelRule: "Não confirmado",
    notes: "Pressão de avaliação, não regime fechado",
  },
});

const es: GafiLatamCopy = {
  title: "Regulación Latinoamericana",
  message:
    "GAFI/GAFILAT empuja a los países de Centroamérica y Sudamérica a regular a las instituciones que ofrecen servicios de activos virtuales. Si eres una de esas instituciones, Walpulse puede convertirse en un aliado importante para entregar señales verificables que te aporten inteligencia on-chain.",
  contextTitle: "El contexto GAFI",
  contextBody: [
    "El GAFI (Grupo de Acción Financiera Internacional; FATF en inglés) fija el estándar global antilavado. Publica 40 Recomendaciones que no se convierten en un tratado que un país «firma y queda cumplido». Cada país debe adherirse políticamente y transponer a ley y supervisión local. En esta región el vehículo principal es GAFILAT (18 miembros que adhieren a las 40 Recomendaciones).",
    "Dentro de esas 40 recomendaciones, existen 5 que se enfocan específicamente en activos virtuales y que varios países han adoptado en su legislación local para aplicarse sobre instituciones que ofrecen servicios asociados a esos activos.",
  ],
  contextCloseLabel: "Adhesión ≠ implementación",
  contextClose:
    "Casi toda Centroamérica y Sudamérica acepta las 40 Recomendaciones vía GAFILAT o CFATF. Eso no equivale a un régimen cripto operativo con licencia, supervisión y enforcement para quienes ofrecen servicios de activos virtuales.",
  recsTitle: "Recomendaciones que importan para cripto",
  recsIntro:
    "Las 40 cubren riesgo, prevención, transparencia y supervisión. Para activos virtuales el núcleo es este:",
  recHeaders: {
    code: "Rec.",
    title: "Título corto",
    crypto: "Qué exige en cripto",
  },
  recs: [
    {
      code: "R.1",
      title: "Enfoque basado en riesgo",
      crypto:
        "El país y los sujetos obligados identifican y mitigan riesgos de LA/FT de forma proporcional",
    },
    {
      code: "R.10",
      title: "Debida diligencia del cliente (CDD / KYC)",
      crypto:
        "Identificar cliente y beneficiario final; diligencia reforzada si el riesgo es alto",
    },
    {
      code: "R.15",
      title: "Nuevas tecnologías + activos virtuales",
      crypto:
        "Estándar específico de VA / VASP: licencia o registro, medidas preventivas, Travel Rule",
    },
    {
      code: "R.16",
      title: "Transferencias electrónicas",
      crypto:
        "Base de la Travel Rule: originador y beneficiario viajan con la transferencia entre VASP",
    },
    {
      code: "R.20",
      title: "Reporte de operaciones sospechosas",
      crypto:
        "La institución reporta a la unidad de inteligencia financiera local",
    },
  ],
  fitTitle: "Cómo se articula con Walpulse",
  fitIntro:
    "Walpulse ofrece análisis de wallet (Básica / Estándar / Experta) con señales on-chain verificables y un Motor de Riesgos parametrizable por el cliente. Para una institución bajo marco GAFI, eso aporta evidencia concreta al enfoque basado en riesgo, al análisis de origen de fondos y al monitoreo de actividad.",
  fitHeaders: {
    requirement: "Exigencia GAFI al país / institución",
    covers: "¿Walpulse la cumple?",
    support: "Cómo puede apoyar",
  },
  fitRows: [
    {
      requirement: "R.1 / R.15 enfoque basado en riesgo",
      covers: "Apoyo",
      support: "Grades A–F, breakdown, Motor 0–100 del cliente",
    },
    {
      requirement: "Origen de fondos",
      covers: "Fuerte",
      support:
        "Origins (categorías, concentración, mixer/OFAC como señal, hops según tier)",
    },
    {
      requirement: "Perfil de actividad / monitoreo continuo",
      covers: "Buena",
      support:
        "Activity + Multichain; wash / circular / bot-like / mixing como señal",
    },
  ],
  fitMessage:
    "Las señales de Walpulse refuerzan el enfoque basado en riesgo, el origen de fondos y el monitoreo continuo que GAFI / GAFILAT espera de tu marco. No ofrecemos servicios relacionados con licencia VASP, KYC o Travel Rule.",
  mapTitle: "Panorama regional (actualizado setiembre 2026)",
  mapIntro:
    "Pasá el cursor (o tocá en mobile) sobre un país para ver el régimen cripto / AML 2026.",
  mapHeaders: mapHeadersEs,
  mapHint: "Explorá el mapa",
  mapSelectPrompt: "Seleccioná un país para ver el detalle.",
  mapClose: "Cerrar",
  mapLegendTitle: "Clasificación",
  mapLegend: [
    {
      tier: "gafiGafilatLaw",
      label:
        "Adhieren a GAFI y GAFILAT (con legislación local vigente)",
    },
    {
      tier: "gafiGafilatPending",
      label:
        "Adhieren a GAFI y GAFILAT (sin legislación local vigente o en creación)",
    },
    {
      tier: "gafilatLaw",
      label:
        "Adhieren solo a GAFILAT (con legislación local vigente)",
    },
    {
      tier: "gafilatPending",
      label:
        "Adhieren solo a GAFILAT (sin legislación local vigente o en creación)",
    },
    {
      tier: "neutral",
      label: "Otra adhesión regional (p. ej. CFATF) — sin clasificar en este mapa",
    },
  ],
  countries: countriesEs,
  greyTitle: "Lista gris GAFI (19 junio 2026) en la región",
  greyBody:
    "En monitoreo intensificado, de esta geografía: Bolivia, Venezuela y Haití (Caribe). Lista gris ≠ «no acepta GAFI»: es lo contrario — el país se comprometió a un plan de acción porque el régimen (en general, no solo cripto) tiene fallas estratégicas.",
  ctaTitle:
    "¿Buscás como institución un aliado para señales de riesgo y monitoreo bajo marco GAFI?",
  talkToTeam: "Hablar con el equipo",
};

const en: GafiLatamCopy = {
  title: "Latin American Regulation",
  message:
    "FATF/GAFILAT pushes Central and South American countries to regulate institutions that offer virtual-asset services. If you are one of those institutions, Walpulse can become an important ally — delivering verifiable signals that give you on-chain intelligence.",
  contextTitle: "The FATF context",
  contextBody: [
    "The FATF (Financial Action Task Force; GAFI in Spanish) sets the global AML standard. It publishes 40 Recommendations that do not become a treaty a country “signs and is done.” Each country must adhere politically and transpose them into local law and supervision. In this region the main vehicle is GAFILAT (18 members that adhere to the 40 Recommendations).",
    "Among those 40, five recommendations focus specifically on virtual assets, and several countries have adopted them in local legislation applying to institutions that offer services linked to those assets.",
  ],
  contextCloseLabel: "Adherence ≠ implementation",
  contextClose:
    "Almost all of Central and South America accepts the 40 Recommendations via GAFILAT or CFATF. That is not the same as an operating crypto regime with licensing, supervision, and enforcement for virtual-asset service providers.",
  recsTitle: "Recommendations that matter for crypto",
  recsIntro:
    "The 40 cover risk, prevention, transparency, and supervision. For virtual assets the core is:",
  recHeaders: {
    code: "Rec.",
    title: "Short title",
    crypto: "What it requires in crypto",
  },
  recs: [
    {
      code: "R.1",
      title: "Risk-based approach",
      crypto:
        "The country and obliged entities identify and mitigate ML/TF risks proportionally",
    },
    {
      code: "R.10",
      title: "Customer due diligence (CDD / KYC)",
      crypto:
        "Identify the customer and beneficial owner; enhanced diligence if risk is high",
    },
    {
      code: "R.15",
      title: "New technologies + virtual assets",
      crypto:
        "Specific VA / VASP standard: license or register, preventive measures, Travel Rule",
    },
    {
      code: "R.16",
      title: "Wire transfers",
      crypto:
        "Basis of the Travel Rule: originator and beneficiary travel with VASP-to-VASP transfers",
    },
    {
      code: "R.20",
      title: "Suspicious transaction reporting",
      crypto: "The institution reports to the local financial-intelligence unit",
    },
  ],
  fitTitle: "How this fits Walpulse",
  fitIntro:
    "Walpulse offers wallet analysis (Basic / Standard / Expert) with verifiable on-chain signals and a client-parametrizable Risk Engine. For an institution under a FATF framework, that supplies concrete evidence for the risk-based approach, source-of-funds analysis, and activity monitoring.",
  fitHeaders: {
    requirement: "FATF requirement on country / institution",
    covers: "Does Walpulse fulfill it?",
    support: "How it can help",
  },
  fitRows: [
    {
      requirement: "R.1 / R.15 risk-based approach",
      covers: "Support",
      support: "A–F grades, breakdown, client 0–100 Risk Engine",
    },
    {
      requirement: "Source of funds",
      covers: "Strong",
      support:
        "Origins (categories, concentration, mixer/OFAC as signal, hops by tier)",
    },
    {
      requirement: "Activity profile / ongoing monitoring",
      covers: "Good",
      support:
        "Activity + Multichain; wash / circular / bot-like / mixing as signal",
    },
  ],
  fitMessage:
    "Walpulse signals strengthen the risk-based approach, source of funds, and ongoing monitoring that FATF / GAFILAT expect in your framework. We do not offer services related to VASP licensing, KYC, or Travel Rule.",
  mapTitle: "Regional panorama (updated September 2026)",
  mapIntro:
    "Hover (or tap on mobile) a country to see the 2026 crypto / AML regime.",
  mapHeaders: mapHeadersEn,
  mapHint: "Explore the map",
  mapSelectPrompt: "Select a country to see the detail.",
  mapClose: "Close",
  mapLegendTitle: "Classification",
  mapLegend: [
    {
      tier: "gafiGafilatLaw",
      label:
        "Adhere to FATF and GAFILAT (with local legislation in force)",
    },
    {
      tier: "gafiGafilatPending",
      label:
        "Adhere to FATF and GAFILAT (no local legislation in force, or still being created)",
    },
    {
      tier: "gafilatLaw",
      label:
        "Adhere to GAFILAT only (with local legislation in force)",
    },
    {
      tier: "gafilatPending",
      label:
        "Adhere to GAFILAT only (no local legislation in force, or still being created)",
    },
    {
      tier: "neutral",
      label:
        "Other regional adherence (e.g. CFATF) — not classified on this map",
    },
  ],
  countries: countriesEn,
  greyTitle: "FATF grey list (19 June 2026) in the region",
  greyBody:
    "Under increased monitoring in this geography: Bolivia, Venezuela, and Haiti (Caribbean). Grey list ≠ “does not accept FATF”: it is the opposite — the country committed to an action plan because the regime (in general, not only crypto) has strategic deficiencies.",
  ctaTitle:
    "Looking for an institutional ally for risk signals and monitoring under a FATF framework?",
  talkToTeam: "Talk to the team",
};

const pt: GafiLatamCopy = {
  title: "Regulação Latino-americana",
  message:
    "GAFI/GAFILAT empurra os países da América Central e do Sul a regular as instituições que oferecem serviços de ativos virtuais. Se você é uma dessas instituições, a Walpulse pode tornar-se um aliado importante para entregar sinais verificáveis que tragam inteligência on-chain.",
  contextTitle: "O contexto GAFI",
  contextBody: [
    "O GAFI (Grupo de Ação Financeira Internacional; FATF em inglês) fixa o padrão global antilavagem. Publica 40 Recomendações que não se convertem em um tratado que um país «assina e está cumprido». Cada país deve aderir politicamente e transpor para lei e supervisão local. Nesta região o veículo principal é o GAFILAT (18 membros que aderem às 40 Recomendações).",
    "Dentro dessas 40 recomendações, existem 5 que se focam especificamente em ativos virtuais e que vários países adotaram na legislação local para aplicar-se a instituições que oferecem serviços associados a esses ativos.",
  ],
  contextCloseLabel: "Adesão ≠ implementação",
  contextClose:
    "Quase toda a América Central e do Sul aceita as 40 Recomendações via GAFILAT ou CFATF. Isso não equivale a um regime cripto operacional com licença, supervisão e enforcement para quem oferece serviços de ativos virtuais.",
  recsTitle: "Recomendações que importam para cripto",
  recsIntro:
    "As 40 cobrem risco, prevenção, transparência e supervisão. Para ativos virtuais o núcleo é este:",
  recHeaders: {
    code: "Rec.",
    title: "Título curto",
    crypto: "O que exige em cripto",
  },
  recs: [
    {
      code: "R.1",
      title: "Abordagem baseada em risco",
      crypto:
        "O país e os sujeitos obrigados identificam e mitigam riscos de LA/FT de forma proporcional",
    },
    {
      code: "R.10",
      title: "Devida diligência do cliente (CDD / KYC)",
      crypto:
        "Identificar cliente e beneficiário final; diligência reforçada se o risco for alto",
    },
    {
      code: "R.15",
      title: "Novas tecnologias + ativos virtuais",
      crypto:
        "Padrão específico de VA / VASP: licença ou registro, medidas preventivas, Travel Rule",
    },
    {
      code: "R.16",
      title: "Transferências eletrônicas",
      crypto:
        "Base da Travel Rule: originador e beneficiário viajam com a transferência entre VASP",
    },
    {
      code: "R.20",
      title: "Comunicação de operações suspeitas",
      crypto:
        "A instituição reporta à unidade de inteligência financeira local",
    },
  ],
  fitTitle: "Como se articula com a Walpulse",
  fitIntro:
    "A Walpulse oferece análise de wallet (Básica / Standard / Expert) com sinais on-chain verificáveis e um Motor de Riscos parametrizável pelo cliente. Para uma instituição sob marco GAFI, isso fornece evidência concreta para a abordagem baseada em risco, a análise de origem dos fundos e o monitoramento de atividade.",
  fitHeaders: {
    requirement: "Exigência GAFI ao país / instituição",
    covers: "A Walpulse cumpre?",
    support: "Como pode apoiar",
  },
  fitRows: [
    {
      requirement: "R.1 / R.15 abordagem baseada em risco",
      covers: "Apoio",
      support: "Grades A–F, breakdown, Motor 0–100 do cliente",
    },
    {
      requirement: "Origem dos fundos",
      covers: "Forte",
      support:
        "Origins (categorias, concentração, mixer/OFAC como sinal, hops por tier)",
    },
    {
      requirement: "Perfil de atividade / monitoramento contínuo",
      covers: "Boa",
      support:
        "Activity + Multichain; wash / circular / bot-like / mixing como sinal",
    },
  ],
  fitMessage:
    "Os sinais da Walpulse reforçam a abordagem baseada em risco, a origem dos fundos e o monitoramento contínuo que GAFI / GAFILAT esperam no seu marco. Não oferecemos serviços relacionados a licença VASP, KYC ou Travel Rule.",
  mapTitle: "Panorama regional (atualizado setembro 2026)",
  mapIntro:
    "Passe o cursor (ou toque no mobile) sobre um país para ver o regime cripto / AML 2026.",
  mapHeaders: mapHeadersPt,
  mapHint: "Explore o mapa",
  mapSelectPrompt: "Selecione um país para ver o detalhe.",
  mapClose: "Fechar",
  mapLegendTitle: "Classificação",
  mapLegend: [
    {
      tier: "gafiGafilatLaw",
      label:
        "Aderem a GAFI e GAFILAT (com legislação local vigente)",
    },
    {
      tier: "gafiGafilatPending",
      label:
        "Aderem a GAFI e GAFILAT (sem legislação local vigente ou em criação)",
    },
    {
      tier: "gafilatLaw",
      label:
        "Aderem só a GAFILAT (com legislação local vigente)",
    },
    {
      tier: "gafilatPending",
      label:
        "Aderem só a GAFILAT (sem legislação local vigente ou em criação)",
    },
    {
      tier: "neutral",
      label:
        "Outra adesão regional (p. ex. CFATF) — sem classificar neste mapa",
    },
  ],
  countries: countriesPt,
  greyTitle: "Lista cinza GAFI (19 junho 2026) na região",
  greyBody:
    "Em monitoramento intensificado nesta geografia: Bolívia, Venezuela e Haiti (Caribe). Lista cinza ≠ «não aceita GAFI»: é o contrário — o país comprometeu-se a um plano de ação porque o regime (em geral, não só cripto) tem falhas estratégicas.",
  ctaTitle:
    "Busca como instituição um aliado para sinais de risco e monitoramento sob marco GAFI?",
  talkToTeam: "Falar com a equipe",
};

export const gafiLatamByLocale: Record<string, GafiLatamCopy> = { es, en, pt };

export function getGafiLatamCopy(locale: string): GafiLatamCopy {
  return gafiLatamByLocale[locale] ?? gafiLatamByLocale.es;
}
