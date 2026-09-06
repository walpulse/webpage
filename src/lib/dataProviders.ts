export type DataProviderId =
  | "goldrush"
  | "alchemy"
  | "etherscan"
  | "blockscout"
  | "ankr"
  | "zerion"
  | "nsgoods"
  | "kleros"
  | "sourcify"
  | "coingecko"
  | "defillama"
  | "spellbook";

export type DataProviderRoleGroup =
  | "presence"
  | "transactions"
  | "portfolio"
  | "ofac"
  | "contracts"
  | "verified"
  | "catalogs";

type LocaleCopy = {
  es: string;
  en: string;
  pt: string;
};

export type DataProvider = {
  id: DataProviderId;
  name: string;
  href: string;
  logoSrc: string;
  /** Fondo del plate detrás del logo: light = logos oscuros; dark = logos claros / PNG blanco. */
  logoPlate?: "light" | "dark";
  roleGroup: DataProviderRoleGroup;
  role: LocaleCopy;
};

/** One entry per brand — roles aligned to PDF `DATA_PROVIDER_ROWS` / i18n. */
export const dataProviders: readonly DataProvider[] = [
  {
    id: "goldrush",
    name: "Goldrush",
    href: "https://goldrush.dev/",
    logoSrc: "/brand/providers/goldrush.svg",
    roleGroup: "presence",
    role: {
      es: "Consultar presencia on-chain de la wallet",
      en: "Query on-chain presence of the wallet",
      pt: "Consultar presença on-chain da wallet",
    },
  },
  {
    id: "alchemy",
    name: "Alchemy",
    href: "https://www.alchemy.com/",
    logoSrc: "/brand/providers/alchemy.svg",
    roleGroup: "transactions",
    role: {
      es: "Consultar transacciones on-chain de la wallet",
      en: "Query on-chain transactions of the wallet",
      pt: "Consultar transações on-chain da wallet",
    },
  },
  {
    id: "etherscan",
    name: "EtherScan",
    href: "https://etherscan.io/",
    logoSrc: "/brand/providers/etherscan.svg",
    roleGroup: "transactions",
    role: {
      es: "Consultar transacciones on-chain de la wallet",
      en: "Query on-chain transactions of the wallet",
      pt: "Consultar transações on-chain da wallet",
    },
  },
  {
    id: "blockscout",
    name: "BlockScout",
    href: "https://dev.blockscout.com/",
    logoSrc: "/brand/providers/blockscout.svg",
    roleGroup: "transactions",
    role: {
      es: "Consultar transacciones on-chain de la wallet",
      en: "Query on-chain transactions of the wallet",
      pt: "Consultar transações on-chain da wallet",
    },
  },
  {
    id: "ankr",
    name: "Ankr",
    href: "https://www.ankr.com/",
    logoSrc: "/brand/providers/ankr.svg",
    roleGroup: "transactions",
    role: {
      es: "Consultar transacciones on-chain de la wallet",
      en: "Query on-chain transactions of the wallet",
      pt: "Consultar transações on-chain da wallet",
    },
  },
  {
    id: "zerion",
    name: "Zerion",
    href: "https://zerion.io/api/",
    logoSrc: "/brand/providers/zerion.svg",
    roleGroup: "portfolio",
    role: {
      es: "Consultar portafolio de la wallet",
      en: "Query wallet portfolio",
      pt: "Consultar portfólio da wallet",
    },
  },
  {
    id: "nsgoods",
    name: "Nsgoods",
    href: "https://x402.nsgoods.org/proof/vendor-sanctions-screen.html",
    logoSrc: "/brand/providers/nsgoods.png",
    roleGroup: "ofac",
    role: {
      es: "Compliance screen OFAC (señal de exposición)",
      en: "OFAC compliance screen (exposure signal)",
      pt: "Compliance screen OFAC (sinal de exposição)",
    },
  },
  {
    id: "kleros",
    name: "Kleros",
    href: "https://scout-app.kleros.io/home",
    logoSrc: "/brand/providers/kleros.svg",
    roleGroup: "contracts",
    role: {
      es: "Contratos curados y confirmados",
      en: "Curated and confirmed contracts",
      pt: "Contratos curados e confirmados",
    },
  },
  {
    id: "sourcify",
    name: "Sourcify",
    href: "https://ethereum.org/developers/tools/sourcify/",
    logoSrc: "/brand/providers/sourcify.svg",
    roleGroup: "verified",
    role: {
      es: "Contratos con código fuente verificado",
      en: "Contracts with verified source code",
      pt: "Contratos com código-fonte verificado",
    },
  },
  {
    id: "coingecko",
    name: "CoinGecko",
    href: "https://www.coingecko.com/",
    logoSrc: "/brand/providers/coingecko.png",
    roleGroup: "catalogs",
    role: {
      es: "Catálogos CEX, Mixer, Airdrops, Bridges, Protocolos y Tokens",
      en: "CEX, Mixer, Airdrop, Bridge, Protocol and Token catalogs",
      pt: "Catálogos CEX, Mixer, Airdrops, Bridges, Protocolos e Tokens",
    },
  },
  {
    id: "defillama",
    name: "DefiLlama",
    href: "https://defillama.com/",
    logoSrc: "/brand/providers/defillama.svg",
    roleGroup: "catalogs",
    role: {
      es: "Catálogos CEX, Mixer, Airdrops, Bridges, Protocolos y Tokens",
      en: "CEX, Mixer, Airdrop, Bridge, Protocol and Token catalogs",
      pt: "Catálogos CEX, Mixer, Airdrops, Bridges, Protocolos e Tokens",
    },
  },
  {
    id: "spellbook",
    name: "Spellbook",
    href: "https://github.com/duneanalytics/spellbook",
    logoSrc: "/brand/providers/spellbook.png",
    logoPlate: "dark",
    roleGroup: "catalogs",
    role: {
      es: "Catálogos CEX, Mixer, Airdrops, Bridges, Protocolos y Tokens",
      en: "CEX, Mixer, Airdrop, Bridge, Protocol and Token catalogs",
      pt: "Catálogos CEX, Mixer, Airdrops, Bridges, Protocolos e Tokens",
    },
  },
] as const;

/** Section order for visual grouping by role. */
export const dataProviderRoleOrder: readonly DataProviderRoleGroup[] = [
  "presence",
  "transactions",
  "portfolio",
  "ofac",
  "contracts",
  "verified",
  "catalogs",
] as const;

type ProvidersPageCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  roleLabel: string;
  catalogsExtra: string;
  disclaimer: string;
  ctaTitle: string;
  ctaProvidersFromAnalisis: string;
  sectionTitles: Record<DataProviderRoleGroup, string>;
};

const providersPageByLocale: Record<string, ProvidersPageCopy> = {
  es: {
    eyebrow: "Data Providers",
    title: "Proveedores de datos",
    intro:
      "Walpulse consulta proveedores externos para construir señales on-chain verificables. No todos aplican en cada profundidad del análisis; el receptor interpreta y decide.",
    roleLabel: "Rol",
    catalogsExtra: "y otros proveedores públicos",
    disclaimer:
      "El compliance screen OFAC es una señal de exposición on-chain conocida, no un screening oficial ni una decisión de compliance.",
    ctaTitle: "¿Querés ver cómo se usan en un análisis?",
    ctaProvidersFromAnalisis: "Ver proveedores de datos",
    sectionTitles: {
      presence: "Presencia on-chain",
      transactions: "Transacciones on-chain",
      portfolio: "Portafolio",
      ofac: "Compliance screen OFAC",
      contracts: "Contratos curados",
      verified: "Código verificado",
      catalogs: "Catálogos y labels",
    },
  },
  en: {
    eyebrow: "Data Providers",
    title: "Data Providers",
    intro:
      "Walpulse queries external providers to build verifiable on-chain signals. Not every provider applies to every analysis depth; the recipient interprets and decides.",
    roleLabel: "Role",
    catalogsExtra: "and other public providers",
    disclaimer:
      "The OFAC compliance screen is a known on-chain exposure signal, not official screening or a compliance decision.",
    ctaTitle: "Want to see how they show up in an analysis?",
    ctaProvidersFromAnalisis: "View data providers",
    sectionTitles: {
      presence: "On-chain presence",
      transactions: "On-chain transactions",
      portfolio: "Portfolio",
      ofac: "OFAC compliance screen",
      contracts: "Curated contracts",
      verified: "Verified source code",
      catalogs: "Catalogs and labels",
    },
  },
  pt: {
    eyebrow: "Data Providers",
    title: "Provedores de dados",
    intro:
      "A Walpulse consulta provedores externos para construir sinais on-chain verificáveis. Nem todos se aplicam em cada profundidade da análise; o receptor interpreta e decide.",
    roleLabel: "Papel",
    catalogsExtra: "e outros provedores públicos",
    disclaimer:
      "O compliance screen OFAC é um sinal de exposição on-chain conhecida, não um screening oficial nem uma decisão de compliance.",
    ctaTitle: "Quer ver como aparecem numa análise?",
    ctaProvidersFromAnalisis: "Ver provedores de dados",
    sectionTitles: {
      presence: "Presença on-chain",
      transactions: "Transações on-chain",
      portfolio: "Portfólio",
      ofac: "Compliance screen OFAC",
      contracts: "Contratos curados",
      verified: "Código verificado",
      catalogs: "Catálogos e labels",
    },
  },
};

export function providersPageForLocale(locale: string): ProvidersPageCopy {
  return providersPageByLocale[locale] ?? providersPageByLocale.es;
}

export function roleForLocale(
  provider: DataProvider,
  locale: string,
): string {
  if (locale === "en") return provider.role.en;
  if (locale === "pt") return provider.role.pt;
  return provider.role.es;
}

export function providersByRoleGroup(): {
  group: DataProviderRoleGroup;
  providers: DataProvider[];
}[] {
  return dataProviderRoleOrder.map((group) => ({
    group,
    providers: dataProviders.filter((p) => p.roleGroup === group),
  }));
}
