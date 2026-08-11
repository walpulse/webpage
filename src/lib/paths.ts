export const routes = {
  home: "/",
  senales: "/senales",
  criptoExchanges: "/cripto-exchanges",
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

/** Primary header — empty: logo + language only. */
export const headerNavItems: {
  href: AppRoute;
  labelKey: "home" | "nosotros" | "contacto";
}[] = [];

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
