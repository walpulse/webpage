export const routes = {
  home: "/",
  senales: "/senales",
  analisis: "/analisis",
  criptoExchanges: "/cripto-exchanges",
  criptoExchangesInternacional: "/cripto-exchanges/internacional",
  criptoExchangesUruguay: "/cripto-exchanges/uruguay",
  nosotros: "/nosotros",
  comoFunciona: "/como-funciona",
  contacto: "/contacto",
  ejemplo: "/ejemplo",
} as const;

/** Home section anchor for the 4 signals (replaces dedicated /senales page). */
export const homeSenales = {
  pathname: routes.home,
  hash: "senales",
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];

export type ExchangeRegion = "uy" | "row";

export function criptoExchangesPath(region: ExchangeRegion): string {
  return region === "uy"
    ? routes.criptoExchangesUruguay
    : routes.criptoExchangesInternacional;
}

export type HeaderNavLink = {
  type: "link";
  href: AppRoute;
  labelKey: "senales" | "analisis" | "nosotros" | "earlyAccess";
};

export type HeaderNavDropdown = {
  type: "dropdown";
  labelKey: "whoUses";
  children: {
    href: string;
    labelKey: "cryptoExchanges" | "cryptoExchangesPsav";
    region: ExchangeRegion;
  }[];
};

export type HeaderNavItem = HeaderNavLink | HeaderNavDropdown;

/** Primary header — Inicio, Análisis, Para quienes, Nosotros, Hablemos. */
export const headerNavItems: HeaderNavItem[] = [
  { type: "link", href: routes.home, labelKey: "senales" },
  { type: "link", href: routes.analisis, labelKey: "analisis" },
  {
    type: "dropdown",
    labelKey: "whoUses",
    children: [
      {
        href: routes.criptoExchangesUruguay,
        labelKey: "cryptoExchangesPsav",
        region: "uy",
      },
      {
        href: routes.criptoExchangesInternacional,
        labelKey: "cryptoExchanges",
        region: "row",
      },
    ],
  },
  { type: "link", href: routes.nosotros, labelKey: "nosotros" },
  { type: "link", href: routes.contacto, labelKey: "earlyAccess" },
];

export const CONTACT_EMAIL = "hello@walpulse.com";

export const CONTACT_CHANNELS = {
  telegramHandle: "@Global_Score_Agent",
  telegramUrl: "https://t.me/Global_Score_Agent",
  email: CONTACT_EMAIL,
  xHandle: "@ibzjairvalenz",
  xUrl: "https://x.com/ibzjairvalenz",
} as const;

export const ORIGIN_LINKS = {
  observador:
    "https://www.elobservador.com.uy/nacional/blockchain-summit-global-2026-bitcoin-el-boom-la-tokenizacion-y-la-tercera-edicion-la-hackathon-ethereum-uruguay-n6053398",
  dorahacks: "https://dorahacks.io/hackathon/urugwei-2026/report",
  linkedin: "https://www.linkedin.com/in/ibzanjairvalenzuelasuarez",
  x: CONTACT_CHANNELS.xUrl,
} as const;
