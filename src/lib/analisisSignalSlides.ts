import {
  serviceTierIds,
  type ServiceTierId,
} from "@/lib/serviceTiers";

export type AnalisisSignalRow = {
  /** Stable across locales; keys `analisisSignalRowTiers`. */
  id: string;
  name: string;
  meaning: string;
};

export type AnalisisSignalSlide = {
  id: "multichain" | "portfolio" | "origins" | "activity";
  title: string;
  lead: string;
  rows: AnalisisSignalRow[];
};

export type AnalisisSignalsCopy = {
  title: string;
  intro: string;
  prev: string;
  next: string;
  tabsLabel: string;
  nameCol: string;
  meaningCol: string;
  tierColLite: string;
  tierColStandard: string;
  tierColExpert: string;
  tierCoveredAria: string;
  tierNotCoveredAria: string;
  slides: AnalisisSignalSlide[];
};

/** Root-level custody signal (sibling of synthesis; not a fifth SKU). */
export type AnalisisCustodyCopy = {
  title: string;
  intro: string;
  nameCol: string;
  meaningCol: string;
  tierColLite: string;
  tierColStandard: string;
  tierColExpert: string;
  tierCoveredAria: string;
  tierNotCoveredAria: string;
  lead: string;
  rows: AnalisisSignalRow[];
};

const ALL_TIERS = serviceTierIds;
const STANDARD_EXPERT = ["standard", "expert"] as const satisfies readonly ServiceTierId[];

/**
 * Locale-agnostic tier coverage for internal-signal rows (catalog v1.0).
 * Keys match `AnalisisSignalRow.id`.
 */
export const analisisSignalRowTiers: Record<string, readonly ServiceTierId[]> = {
  // Multichain — footprint in all tiers; consistency + intensity Standard/Expert
  "multichain.network-count": ALL_TIERS,
  "multichain.activity-age": ALL_TIERS,
  "multichain.recently-active": ALL_TIERS,
  "multichain.dormant-share": ALL_TIERS,
  "multichain.consistency": STANDARD_EXPERT,
  "multichain.recency": ALL_TIERS,
  "multichain.core-ecosystems": ALL_TIERS,
  "multichain.footprint-concentration": ALL_TIERS,
  "multichain.longevity": ALL_TIERS,
  "multichain.intensity": STANDARD_EXPERT,
  // Portfolio — Standard/Expert only
  "portfolio.usable-credible": STANDARD_EXPERT,
  "portfolio.liquid-locked": STANDARD_EXPERT,
  "portfolio.holdings-concentration": STANDARD_EXPERT,
  "portfolio.effective-positions": STANDARD_EXPERT,
  "portfolio.asset-mix": STANDARD_EXPERT,
  "portfolio.defi-liquidity": STANDARD_EXPERT,
  "portfolio.dust-spam": STANDARD_EXPERT,
  "portfolio.protocols-touched": STANDARD_EXPERT,
  "portfolio.gas-buffer": STANDARD_EXPERT,
  "portfolio.locked-commitment": STANDARD_EXPERT,
  // Origins — core all tiers; inferred CEX + hops Standard/Expert
  "origins.composition": ALL_TIERS,
  "origins.unique-senders": ALL_TIERS,
  "origins.funding-concentration": ALL_TIERS,
  "origins.exchange-quality": ALL_TIERS,
  "origins.inferred-cex-deposits": STANDARD_EXPERT,
  "origins.temporal-pattern": ALL_TIERS,
  "origins.mixer-sanctions": ALL_TIERS,
  "origins.organic-synthetic": ALL_TIERS,
  "origins.first-funding-age": ALL_TIERS,
  "origins.pricing-coverage": ALL_TIERS,
  "origins.funder-hops": STANDARD_EXPERT,
  // Activity — core all tiers; Kleros rows Standard/Expert
  "activity.unique-counterparties": ALL_TIERS,
  "activity.counterparty-concentration": ALL_TIERS,
  "activity.exchange-interaction": ALL_TIERS,
  "activity.flow-reciprocity": ALL_TIERS,
  "activity.net-vs-gross": ALL_TIERS,
  "activity.velocity-bursts": ALL_TIERS,
  "activity.token-diversity": ALL_TIERS,
  "activity.wash-patterns": ALL_TIERS,
  "activity.nft-fungible-mix": ALL_TIERS,
  "activity.category-exposures": ALL_TIERS,
  "activity.sourcify": ALL_TIERS,
  "activity.labeled-counterparties": STANDARD_EXPERT,
  "activity.labeled-contracts": STANDARD_EXPERT,
  // Custody — present in all tiers (depth scales)
  "custody.class-probability": ALL_TIERS,
  "custody.depth-by-tier": ALL_TIERS,
  "custody.distinct-from-funders": ALL_TIERS,
};

export function tiersForSignalRow(rowId: string): readonly ServiceTierId[] {
  return analisisSignalRowTiers[rowId] ?? ALL_TIERS;
}

export function signalRowCoversTier(
  rowId: string,
  tier: ServiceTierId,
): boolean {
  return tiersForSignalRow(rowId).includes(tier);
}

/**
 * Internal signals as business copy (vault Catálogo + Señales v1.0).
 * No field names, providers, or formula jargon.
 */
export const analisisSignalsByLocale: Record<string, AnalisisSignalsCopy> = {
  es: {
    title: "Qué miramos dentro de cada señal",
    intro:
      "Cada parte del análisis se construye con señales internas que el receptor puede leer y auditar. La cobertura (redes, ventana, hops) escala con Básica, Estándar o Experta.",
    prev: "Señal anterior",
    next: "Señal siguiente",
    tabsLabel: "Partes del análisis",
    nameCol: "Señal interna",
    meaningCol: "Qué aporta a la decisión",
    tierColLite: "Básica",
    tierColStandard: "Estándar",
    tierColExpert: "Experta",
    tierCoveredAria: "Cubierta en {tier}",
    tierNotCoveredAria: "No cubierta en {tier}",
    slides: [
      {
        id: "multichain",
        title: "Presencia del ecosistema",
        lead: "Mapa de en qué redes aparece la billetera, con qué continuidad y —en Estándar/Experta— con cuánta intensidad opera entre cadenas. Entra en las tres profundidades.",
        rows: [
          {
            id: "multichain.network-count",
            name: "Cantidad de redes con actividad",
            meaning:
              "Cuántas blockchains distintas muestran huella de la wallet. Más redes pueden indicar operación diversificada o mayor superficie a revisar.",
          },
          {
            id: "multichain.activity-age",
            name: "Antigüedad de la actividad multi-red",
            meaning:
              "Desde cuándo hay rastro on-chain en el conjunto de redes. Ayuda a distinguir wallets nuevas de trayectorias largas.",
          },
          {
            id: "multichain.recently-active",
            name: "Redes activas recientes",
            meaning:
              "En cuáles redes hubo movimiento en ventanas de 30 y 90 días. Separa presencia histórica de uso actual.",
          },
          {
            id: "multichain.dormant-share",
            name: "Proporción de redes dormidas",
            meaning:
              "Cuánto del footprint está inactivo. Útil para no sobreinterpretar redes antiguas sin movimiento reciente.",
          },
          {
            id: "multichain.consistency",
            name: "Consistencia entre redes",
            meaning:
              "Si el comportamiento se reparte de forma estable entre cadenas. En Básica no siempre está disponible (solo footprint de presencia).",
          },
          {
            id: "multichain.recency",
            name: "Recencia de la última actividad",
            meaning:
              "Qué tan reciente es el último rastro relevante. Informa si la wallet sigue operativa o parece abandonada.",
          },
          {
            id: "multichain.core-ecosystems",
            name: "Presencia en ecosistemas centrales",
            meaning:
              "Si opera en redes de referencia del mercado. Aporta contexto de madurez y tipo de entorno.",
          },
          {
            id: "multichain.footprint-concentration",
            name: "Concentración del footprint",
            meaning:
              "Si la historia multi-red está repartida o dominada por pocas cadenas. Alta concentración reduce la lectura “multi-ecosistema”.",
          },
          {
            id: "multichain.longevity",
            name: "Longevidad por red",
            meaning:
              "Señales de permanencia en cadenas concretas: wallets “de paso” vs. presencia sostenida.",
          },
          {
            id: "multichain.intensity",
            name: "Intensidad de uso entre redes",
            meaning:
              "En Estándar y Experta: volumen e intensidad de transacciones entre cadenas y peso relativo. En Básica el foco es el footprint de presencia.",
          },
        ],
      },
      {
        id: "portfolio",
        title: "Calidad del portafolio",
        lead: "Foto económica de lo que sostiene la wallet: valor, liquidez y composición. Solo entra en Estándar y Experta (no en Básica).",
        rows: [
          {
            id: "portfolio.usable-credible",
            name: "Valor total usable y creíble",
            meaning:
              "Cuánto valor económico se observa, distinguiendo totales usables de lecturas “creíbles” que filtran valuaciones absurdas.",
          },
          {
            id: "portfolio.liquid-locked",
            name: "Líquido vs. bloqueado",
            meaning:
              "Qué parte del patrimonio está disponible de inmediato y qué parte está comprometida o locked.",
          },
          {
            id: "portfolio.holdings-concentration",
            name: "Concentración de holdings",
            meaning:
              "Si el valor depende de pocos activos o está más diversificado. Alta concentración implica más sensibilidad a un solo token.",
          },
          {
            id: "portfolio.effective-positions",
            name: "Posiciones efectivas",
            meaning:
              "Cuántas posiciones realmente importan en la foto económica, más allá del ruido de micro-holdings.",
          },
          {
            id: "portfolio.asset-mix",
            name: "Mix stablecoins / bluechips / memecoins",
            meaning:
              "Perfil de riesgo del portafolio: más estable y bluechip vs. más especulativo.",
          },
          {
            id: "portfolio.defi-liquidity",
            name: "Exposición DeFi y liquidez proveída",
            meaning:
              "Participación en protocolos y posiciones de liquidez. Informa complejidad operativa y riesgos de smart contract.",
          },
          {
            id: "portfolio.dust-spam",
            name: "Polvo y spam",
            meaning:
              "Proporción de holdings irrelevantes o basura. Ayuda a no inflar la lectura con tokens sin valor útil.",
          },
          {
            id: "portfolio.protocols-touched",
            name: "Protocolos tocados",
            meaning:
              "Con cuántos protocolos distintos interactúa el portafolio. Más superficie puede sumar sofisticación o riesgo.",
          },
          {
            id: "portfolio.gas-buffer",
            name: "Buffer de gas nativo",
            meaning:
              "Si conserva saldo nativo suficiente para operar. Una wallet “rica” sin gas puede quedar operativa limitada.",
          },
          {
            id: "portfolio.locked-commitment",
            name: "Compromiso en activos locked",
            meaning:
              "Qué tan comprometido está el capital en posiciones no líquidas a corto plazo.",
          },
        ],
      },
      {
        id: "origins",
        title: "Origen de los fondos",
        lead: "De dónde vinieron los fondos, con qué diversidad y con qué indicios de riesgo en la procedencia. En Estándar/Experta se suma un screening de riesgo de fondeadores (no un segundo Origins).",
        rows: [
          {
            id: "origins.composition",
            name: "Composición por tipo de origen",
            meaning:
              "Qué porcentaje llega desde exchanges, bridges, mixers, direcciones asociadas a sanciones conocidas, airdrops u origen orgánico. El informe también resume el mix por clase de entidad etiquetada (exchange etiquetado, DeFi, mixer, sanciones conocidas, bridge, airdrop, sin etiqueta) — etiquetado de catálogo, no «exchange regulado».",
          },
          {
            id: "origins.unique-senders",
            name: "Remitentes únicos",
            meaning:
              "Cuántas wallets distintas aportaron fondos. Pocos remitentes vs. muchos cambia la lectura de dependencia.",
          },
          {
            id: "origins.funding-concentration",
            name: "Concentración del fondeo",
            meaning:
              "Si el valor entrante está repartido o dominado por pocas fuentes (HHI y peso del top-1 / top-3).",
          },
          {
            id: "origins.exchange-quality",
            name: "Calidad de los exchanges de origen",
            meaning:
              "Cuando el fondeo pasa por CEX etiquetado, qué tan sólidos o conocidos son esos venues.",
          },
          {
            id: "origins.inferred-cex-deposits",
            name: "Depósitos CEX inferidos (Estándar/Experta)",
            meaning:
              "Fondeadores que no están en el catálogo CEX pero consolidan hacia una hot wallet curada: se señalan aparte del CEX ya etiquetado. Habla de procedencia del fondeo, no de la wallet objetivo.",
          },
          {
            id: "origins.temporal-pattern",
            name: "Ritmo temporal del fondeo",
            meaning:
              "Si los fondos entraron de golpe, en oleadas o de forma gradual. Patrones abruptos pueden merecer más atención.",
          },
          {
            id: "origins.mixer-sanctions",
            name: "Exposición a mixers y sanciones",
            meaning:
              "Indicios de contacto con mixers o direcciones asociadas a listas OFAC conocidas. Señal de exposición, no screening oficial.",
          },
          {
            id: "origins.organic-synthetic",
            name: "Orgánico vs. sintético",
            meaning:
              "Peso de actividad económica real frente a orígenes más sintéticos (airdrops, NFT, etc.).",
          },
          {
            id: "origins.first-funding-age",
            name: "Antigüedad del primer fondeo",
            meaning:
              "Hace cuánto recibió los primeros fondos relevantes. Contextúa wallets recién fondeadas vs. trayectorias maduras.",
          },
          {
            id: "origins.pricing-coverage",
            name: "Cobertura de pricing",
            meaning:
              "Qué proporción del valor entrante pudo valuarse en USD. Baja cobertura hace más prudente la lectura de concentración.",
          },
          {
            id: "origins.funder-hops",
            name: "Hops / screening de fondeadores",
            meaning:
              "Básica sin hops. Estándar: screen de riesgo hop-1 sobre top 2 fondeadores (1 red dominante). Experta: top 5; hop-2 solo si hop-1 es wallet normal (no CEX/bridge/mixer/OFAC). Contexto de quién fondeó, no Origins completo ni screening oficial.",
          },
        ],
      },
      {
        id: "activity",
        title: "Actividad reciente",
        lead: "Cómo se comporta la wallet en la ventana del tier (15 / 45 / 90 días): con quién opera, con qué ritmo y con qué calidad de interacción. En Experta se suma Activity light sobre top contrapartes.",
        rows: [
          {
            id: "activity.unique-counterparties",
            name: "Contrapartes únicas",
            meaning:
              "Con cuántas wallets distintas interactúa. Habla de red de contactos vs. operación cerrada.",
          },
          {
            id: "activity.counterparty-concentration",
            name: "Concentración de contrapartes",
            meaning:
              "Si el flujo se reparte entre muchos peers o se concentra en pocos (HHI).",
          },
          {
            id: "activity.exchange-interaction",
            name: "Interacción con exchanges",
            meaning:
              "Qué proporción del valor y de las transacciones toca CEX. Informa on/off-ramp y uso de venues centralizados.",
          },
          {
            id: "activity.flow-reciprocity",
            name: "Reciprocidad de flujos",
            meaning:
              "Cuánto del movimiento es ida-y-vuelta con las mismas contrapartes.",
          },
          {
            id: "activity.net-vs-gross",
            name: "Balance neto vs. volumen bruto",
            meaning:
              "Si hay mucho movimiento con poco cambio neto. Útil para detectar rotación intensa sin acumulación clara.",
          },
          {
            id: "activity.velocity-bursts",
            name: "Velocidad y ráfagas",
            meaning:
              "Ritmo diario de operaciones y si llegan en ráfagas concentradas (posible automatización o campañas).",
          },
          {
            id: "activity.token-diversity",
            name: "Diversidad de tokens",
            meaning:
              "Variedad de activos en los movimientos. Perfiles mono-token vs. operatorias más amplias.",
          },
          {
            id: "activity.wash-patterns",
            name: "Patrones wash / circulares / bot-like",
            meaning:
              "Indicios de lavado de volumen, circuitos cerrados o automatización. Señales de alerta temprana, no prueba forense.",
          },
          {
            id: "activity.nft-fungible-mix",
            name: "Mix NFT vs. tokens fungibles",
            meaning:
              "Cuánto del flujo es NFT frente a fungibles. Cambia el contexto de uso.",
          },
          {
            id: "activity.category-exposures",
            name: "Exposiciones por categoría de contraparte",
            meaning:
              "Peso del valor hacia OFAC / mixer / bridge / airdrop / protocolo conocidos. Señal histórica de exposición, no screening oficial.",
          },
          {
            id: "activity.sourcify",
            name: "Calidad de contratos (Sourcify)",
            meaning:
              "Qué proporción de contratos tocados está verificada en Sourcify vs. no verificados.",
          },
          {
            id: "activity.labeled-counterparties",
            name: "Contrapartes etiquetadas (Kleros / Spellbook)",
            meaning:
              "Qué parte de las contrapartes (peers) lleva etiquetas de reputación on-chain conocidas. Solo Estándar y Experta para Kleros. Contexto informativo, no screening oficial.",
          },
          {
            id: "activity.labeled-contracts",
            name: "Contratos tocados etiquetados (Kleros Scout)",
            meaning:
              "Qué proporción de contratos tocados (routers, tokens, protocolos) está etiquetada en Scout. Distinto de las contrapartes y de la verificación de código (Sourcify). Solo Estándar y Experta.",
          },
        ],
      },
    ],
  },
  en: {
    title: "What we look at inside each signal",
    intro:
      "Each part of the analysis is built from internal signals the recipient can read and audit. Coverage (networks, window, hops) scales with Basic, Standard, or Expert.",
    prev: "Previous signal",
    next: "Next signal",
    tabsLabel: "Analysis parts",
    nameCol: "Internal signal",
    meaningCol: "How it informs the decision",
    tierColLite: "Basic",
    tierColStandard: "Standard",
    tierColExpert: "Expert",
    tierCoveredAria: "Covered in {tier}",
    tierNotCoveredAria: "Not covered in {tier}",
    slides: [
      {
        id: "multichain",
        title: "Ecosystem presence",
        lead: "A map of which networks the wallet appears on, how continuous that presence is, and —in Standard/Expert— how intensely it operates across chains. Included in all three depths.",
        rows: [
          {
            id: "multichain.network-count",
            name: "Number of networks with activity",
            meaning:
              "How many distinct blockchains show a footprint. More networks can mean diversified operations or a wider surface to review.",
          },
          {
            id: "multichain.activity-age",
            name: "Multi-network activity age",
            meaning:
              "How long on-chain traces exist across networks. Helps separate brand-new wallets from longer trajectories.",
          },
          {
            id: "multichain.recently-active",
            name: "Recently active networks",
            meaning:
              "Which networks show movement in 30- and 90-day windows. Separates historical presence from current use.",
          },
          {
            id: "multichain.dormant-share",
            name: "Share of dormant networks",
            meaning:
              "How much of the footprint is inactive. Avoids over-reading old networks with no recent activity.",
          },
          {
            id: "multichain.consistency",
            name: "Consistency across networks",
            meaning:
              "Whether behavior is stably distributed across chains. In Basic it is not always available (presence footprint only).",
          },
          {
            id: "multichain.recency",
            name: "Recency of latest activity",
            meaning:
              "How recent the last relevant trace is. Indicates whether the wallet still looks active or abandoned.",
          },
          {
            id: "multichain.core-ecosystems",
            name: "Presence in core ecosystems",
            meaning:
              "Whether it operates on market-reference networks. Adds maturity and environment context.",
          },
          {
            id: "multichain.footprint-concentration",
            name: "Footprint concentration",
            meaning:
              "Whether multi-network history is spread out or dominated by a few chains.",
          },
          {
            id: "multichain.longevity",
            name: "Longevity per network",
            meaning:
              "Signals of lasting presence on specific chains versus pass-through behavior.",
          },
          {
            id: "multichain.intensity",
            name: "Cross-network intensity",
            meaning:
              "In Standard and Expert: transaction intensity across chains and relative weight. Basic focuses on presence footprint.",
          },
        ],
      },
      {
        id: "portfolio",
        title: "Portfolio quality",
        lead: "An economic snapshot of what the wallet holds: value, liquidity, and composition. Only in Standard and Expert (not Basic).",
        rows: [
          {
            id: "portfolio.usable-credible",
            name: "Total usable and credible value",
            meaning:
              "How much economic value is observed, separating usable totals from “credible” readings that filter absurd valuations.",
          },
          {
            id: "portfolio.liquid-locked",
            name: "Liquid vs. locked",
            meaning:
              "How much of the holdings is immediately available versus committed or locked.",
          },
          {
            id: "portfolio.holdings-concentration",
            name: "Holdings concentration",
            meaning:
              "Whether value depends on a few assets or is more diversified.",
          },
          {
            id: "portfolio.effective-positions",
            name: "Effective positions",
            meaning:
              "How many positions truly matter in the economic picture beyond micro-holding noise.",
          },
          {
            id: "portfolio.asset-mix",
            name: "Stablecoin / bluechip / memecoin mix",
            meaning:
              "Portfolio risk profile: more stable and bluechip versus more speculative.",
          },
          {
            id: "portfolio.defi-liquidity",
            name: "DeFi and provided liquidity",
            meaning:
              "Participation in protocols and LP positions. Informs operational complexity and smart-contract risk.",
          },
          {
            id: "portfolio.dust-spam",
            name: "Dust and spam",
            meaning:
              "Share of irrelevant or junk holdings. Avoids inflating the reading with tokens of little use.",
          },
          {
            id: "portfolio.protocols-touched",
            name: "Protocols touched",
            meaning:
              "How many distinct protocols the portfolio interacts with.",
          },
          {
            id: "portfolio.gas-buffer",
            name: "Native gas buffer",
            meaning:
              "Whether it keeps enough native balance to operate. A “rich” wallet without gas can be operationally limited.",
          },
          {
            id: "portfolio.locked-commitment",
            name: "Locked commitment",
            meaning:
              "How committed capital is in positions that are not liquid in the short term.",
          },
        ],
      },
      {
        id: "origins",
        title: "Origin of funds",
        lead: "Where funds came from, how diverse that provenance is, and what risk indicators appear. Standard/Expert add funder risk screening (not a second Origins run).",
        rows: [
          {
            id: "origins.composition",
            name: "Composition by origin type",
            meaning:
              "What share arrives from exchanges, bridges, mixers, addresses tied to known sanctions, airdrops, or organic sources. The report also summarizes the mix by labeled entity class (labeled exchange, DeFi, mixer, known sanctions, bridge, airdrop, unlabeled) — catalog labels, not a “regulated exchange” claim.",
          },
          {
            id: "origins.unique-senders",
            name: "Unique senders",
            meaning:
              "How many distinct wallets contributed funds. Few versus many changes the dependency reading.",
          },
          {
            id: "origins.funding-concentration",
            name: "Funding concentration",
            meaning:
              "Whether inbound value is spread out or dominated by a few sources (HHI and top-1 / top-3 weight).",
          },
          {
            id: "origins.exchange-quality",
            name: "Origin exchange quality",
            meaning:
              "When funding flows through labeled CEX venues, how solid or well-known those venues look.",
          },
          {
            id: "origins.inferred-cex-deposits",
            name: "Inferred CEX deposits (Standard/Expert)",
            meaning:
              "Funders not in the CEX catalog that consolidate toward a curated hot wallet: flagged separately from already-labeled CEX. About funding provenance, not the subject wallet.",
          },
          {
            id: "origins.temporal-pattern",
            name: "Temporal funding pattern",
            meaning:
              "Whether funds arrived in a burst, in waves, or gradually.",
          },
          {
            id: "origins.mixer-sanctions",
            name: "Mixer and sanctions exposure",
            meaning:
              "Signs of contact with mixers or addresses tied to known OFAC lists. Exposure signal, not official screening.",
          },
          {
            id: "origins.organic-synthetic",
            name: "Organic vs. synthetic",
            meaning:
              "Weight of real economic activity versus more synthetic origins (airdrops, NFTs, etc.).",
          },
          {
            id: "origins.first-funding-age",
            name: "Age of first funding",
            meaning:
              "How long ago the first relevant funds arrived. Context for newly funded wallets versus mature trajectories.",
          },
          {
            id: "origins.pricing-coverage",
            name: "Pricing coverage",
            meaning:
              "What share of inbound value could be priced in USD. Low coverage makes concentration readings more conservative.",
          },
          {
            id: "origins.funder-hops",
            name: "Hops / funder risk screening",
            meaning:
              "Basic has no hops. Standard: hop-1 risk screen on top 2 funders (one dominant chain). Expert: top 5; hop-2 only if hop-1 is a normal wallet (not CEX/bridge/mixer/OFAC). Who funded the subject — not a full Origins run or official screening.",
          },
        ],
      },
      {
        id: "activity",
        title: "Recent activity",
        lead: "How the wallet behaves in the tier window (15 / 45 / 90 days): who it deals with, at what pace, and with what interaction quality. Expert adds Activity light on top counterparties.",
        rows: [
          {
            id: "activity.unique-counterparties",
            name: "Unique counterparties",
            meaning:
              "How many distinct wallets it interacts with. Speaks to contact network versus closed operation.",
          },
          {
            id: "activity.counterparty-concentration",
            name: "Counterparty concentration",
            meaning:
              "Whether flow is spread across many peers or concentrated in a few (HHI).",
          },
          {
            id: "activity.exchange-interaction",
            name: "Exchange interaction",
            meaning:
              "What share of value and transactions touches CEX venues.",
          },
          {
            id: "activity.flow-reciprocity",
            name: "Flow reciprocity",
            meaning:
              "How much movement is round-trip with the same counterparties.",
          },
          {
            id: "activity.net-vs-gross",
            name: "Net vs. gross volume",
            meaning:
              "Whether there is heavy movement with little net change.",
          },
          {
            id: "activity.velocity-bursts",
            name: "Velocity and bursts",
            meaning:
              "Daily transaction pace and whether activity arrives in concentrated bursts.",
          },
          {
            id: "activity.token-diversity",
            name: "Token diversity",
            meaning:
              "Variety of assets in the movements.",
          },
          {
            id: "activity.wash-patterns",
            name: "Wash / circular / bot-like patterns",
            meaning:
              "Signs of volume washing, closed circuits, or automation. Early-warning signals, not forensic proof.",
          },
          {
            id: "activity.nft-fungible-mix",
            name: "NFT vs. fungible mix",
            meaning:
              "How much of the flow is NFT versus fungible tokens.",
          },
          {
            id: "activity.category-exposures",
            name: "Counterparty category exposures",
            meaning:
              "Value weight toward known OFAC / mixer / bridge / airdrop / protocol labels. Historical exposure signal, not official screening.",
          },
          {
            id: "activity.sourcify",
            name: "Contract quality (Sourcify)",
            meaning:
              "What share of touched contracts is verified on Sourcify versus unverified.",
          },
          {
            id: "activity.labeled-counterparties",
            name: "Labeled counterparties (Kleros / Spellbook)",
            meaning:
              "What share of counterparties (peers) carries known on-chain reputation labels. Kleros only in Standard and Expert. Informational context, not official screening.",
          },
          {
            id: "activity.labeled-contracts",
            name: "Labeled touched contracts (Kleros Scout)",
            meaning:
              "What share of touched contracts (routers, tokens, protocols) is labeled in Scout. Distinct from counterparties and from code verification (Sourcify). Standard and Expert only.",
          },
        ],
      },
    ],
  },
  pt: {
    title: "O que observamos dentro de cada sinal",
    intro:
      "Cada parte da análise é construída com sinais internos que o receptor pode ler e auditar. A cobertura (redes, janela, hops) escala com Básica, Standard ou Expert.",
    prev: "Sinal anterior",
    next: "Próximo sinal",
    tabsLabel: "Partes da análise",
    nameCol: "Sinal interno",
    meaningCol: "O que aporta à decisão",
    tierColLite: "Básica",
    tierColStandard: "Standard",
    tierColExpert: "Expert",
    tierCoveredAria: "Coberto em {tier}",
    tierNotCoveredAria: "Não coberto em {tier}",
    slides: [
      {
        id: "multichain",
        title: "Presença do ecossistema",
        lead: "Mapa de em quais redes a carteira aparece, com que continuidade e —em Standard/Expert— com quanta intensidade opera entre cadeias. Entra nas três profundidades.",
        rows: [
          {
            id: "multichain.network-count",
            name: "Quantidade de redes com atividade",
            meaning:
              "Quantas blockchains distintas mostram pegada da wallet. Mais redes podem indicar operação diversificada ou maior superfície a revisar.",
          },
          {
            id: "multichain.activity-age",
            name: "Antiguidade da atividade multi-rede",
            meaning:
              "Desde quando há rastros on-chain no conjunto de redes. Ajuda a distinguir wallets novas de trajetórias longas.",
          },
          {
            id: "multichain.recently-active",
            name: "Redes ativas recentes",
            meaning:
              "Em quais redes houve movimento nas janelas de 30 e 90 dias. Separa presença histórica de uso atual.",
          },
          {
            id: "multichain.dormant-share",
            name: "Proporção de redes dormentes",
            meaning:
              "Quanto do footprint está inativo. Evita sobreinterpretar redes antigas sem movimento recente.",
          },
          {
            id: "multichain.consistency",
            name: "Consistência entre redes",
            meaning:
              "Se o comportamento se reparte de forma estável entre cadeias. Em Básica nem sempre está disponível (só footprint de presença).",
          },
          {
            id: "multichain.recency",
            name: "Recência da última atividade",
            meaning:
              "Quão recente é o último rastro relevante. Indica se a wallet ainda parece operativa ou abandonada.",
          },
          {
            id: "multichain.core-ecosystems",
            name: "Presença em ecossistemas centrais",
            meaning:
              "Se opera em redes de referência do mercado. Aporta contexto de maturidade e tipo de ambiente.",
          },
          {
            id: "multichain.footprint-concentration",
            name: "Concentração do footprint",
            meaning:
              "Se a história multi-rede está repartida ou dominada por poucas cadeias.",
          },
          {
            id: "multichain.longevity",
            name: "Longevidade por rede",
            meaning:
              "Sinais de permanência em cadeias concretas: wallets “de passagem” vs. presença sustentada.",
          },
          {
            id: "multichain.intensity",
            name: "Intensidade de uso entre redes",
            meaning:
              "Em Standard e Expert: volume e intensidade de transações entre cadeias. Em Básica o foco é o footprint de presença.",
          },
        ],
      },
      {
        id: "portfolio",
        title: "Qualidade do portfólio",
        lead: "Foto econômica do que a wallet sustenta: valor, liquidez e composição. Só entra em Standard e Expert (não em Básica).",
        rows: [
          {
            id: "portfolio.usable-credible",
            name: "Valor total utilizável e credível",
            meaning:
              "Quanto valor econômico se observa, distinguindo totais utilizáveis de leituras “credíveis” que filtram valorações absurdas.",
          },
          {
            id: "portfolio.liquid-locked",
            name: "Líquido vs. bloqueado",
            meaning:
              "Que parte do patrimônio está disponível de imediato e que parte está comprometida ou locked.",
          },
          {
            id: "portfolio.holdings-concentration",
            name: "Concentração de holdings",
            meaning:
              "Se o valor depende de poucos ativos ou está mais diversificado.",
          },
          {
            id: "portfolio.effective-positions",
            name: "Posições efetivas",
            meaning:
              "Quantas posições realmente importam na foto econômica, além do ruído de micro-holdings.",
          },
          {
            id: "portfolio.asset-mix",
            name: "Mix stablecoins / bluechips / memecoins",
            meaning:
              "Perfil de risco do portfólio: mais estável e bluechip vs. mais especulativo.",
          },
          {
            id: "portfolio.defi-liquidity",
            name: "Exposição DeFi e liquidez provida",
            meaning:
              "Participação em protocolos e posições de liquidez. Informa complexidade operativa e risco de smart contract.",
          },
          {
            id: "portfolio.dust-spam",
            name: "Poeira e spam",
            meaning:
              "Proporção de holdings irrelevantes ou lixo. Evita inflar a leitura com tokens sem valor útil.",
          },
          {
            id: "portfolio.protocols-touched",
            name: "Protocolos tocados",
            meaning:
              "Com quantos protocolos distintos o portfólio interage.",
          },
          {
            id: "portfolio.gas-buffer",
            name: "Buffer de gas nativo",
            meaning:
              "Se mantém saldo nativo suficiente para operar.",
          },
          {
            id: "portfolio.locked-commitment",
            name: "Compromisso em ativos locked",
            meaning:
              "Quão comprometido está o capital em posições pouco líquidas no curto prazo.",
          },
        ],
      },
      {
        id: "origins",
        title: "Origem dos fundos",
        lead: "De onde vieram os fundos, com que diversidade e com que indícios de risco na procedência. Em Standard/Expert soma-se screening de risco de financiadores (não um segundo Origins).",
        rows: [
          {
            id: "origins.composition",
            name: "Composição por tipo de origem",
            meaning:
              "Que percentagem chega de exchanges, bridges, mixers, endereços associados a sanções conhecidas, airdrops ou origem orgânica. O relatório também resume o mix por classe de entidade etiquetada (exchange etiquetado, DeFi, mixer, sanções conhecidas, bridge, airdrop, sem etiqueta) — etiquetagem de catálogo, não «exchange regulado».",
          },
          {
            id: "origins.unique-senders",
            name: "Remetentes únicos",
            meaning:
              "Quantas wallets distintas aportaram fundos.",
          },
          {
            id: "origins.funding-concentration",
            name: "Concentração do funding",
            meaning:
              "Se o valor entrante está repartido ou dominado por poucas fontes (HHI e peso do top-1 / top-3).",
          },
          {
            id: "origins.exchange-quality",
            name: "Qualidade dos exchanges de origem",
            meaning:
              "Quando o funding passa por CEX etiquetado, quão sólidos ou conhecidos são esses venues.",
          },
          {
            id: "origins.inferred-cex-deposits",
            name: "Depósitos CEX inferidos (Standard/Expert)",
            meaning:
              "Financiadores que não estão no catálogo CEX mas consolidam para uma hot wallet curada: sinalizados à parte do CEX já etiquetado. Fala da procedência do funding, não da wallet objetivo.",
          },
          {
            id: "origins.temporal-pattern",
            name: "Ritmo temporal do funding",
            meaning:
              "Se os fundos entraram de uma vez, em ondas ou de forma gradual.",
          },
          {
            id: "origins.mixer-sanctions",
            name: "Exposição a mixers e sanções",
            meaning:
              "Indícios de contacto com mixers ou endereços associados a listas OFAC conhecidas. Sinal de exposição, não screening oficial.",
          },
          {
            id: "origins.organic-synthetic",
            name: "Orgânico vs. sintético",
            meaning:
              "Peso de atividade econômica real frente a origens mais sintéticas (airdrops, NFT, etc.).",
          },
          {
            id: "origins.first-funding-age",
            name: "Antiguidade do primeiro funding",
            meaning:
              "Há quanto tempo recebeu os primeiros fundos relevantes.",
          },
          {
            id: "origins.pricing-coverage",
            name: "Cobertura de pricing",
            meaning:
              "Que proporção do valor entrante pôde ser valuada em USD. Baixa cobertura torna a leitura de concentração mais prudente.",
          },
          {
            id: "origins.funder-hops",
            name: "Hops / screening de financiadores",
            meaning:
              "Básica sem hops. Standard: screen de risco hop-1 sobre top 2 financiadores (1 rede dominante). Expert: top 5; hop-2 só se hop-1 for wallet normal (não CEX/bridge/mixer/OFAC). Contexto de quem financiou — não Origins completo nem screening oficial.",
          },
        ],
      },
      {
        id: "activity",
        title: "Atividade recente",
        lead: "Como a wallet se comporta na janela do tier (15 / 45 / 90 dias): com quem opera, com que ritmo e com que qualidade de interação. Em Expert soma-se Activity light sobre top contrapartes.",
        rows: [
          {
            id: "activity.unique-counterparties",
            name: "Contrapartes únicas",
            meaning:
              "Com quantas wallets distintas interage.",
          },
          {
            id: "activity.counterparty-concentration",
            name: "Concentração de contrapartes",
            meaning:
              "Se o fluxo se reparte entre muitos peers ou se concentra em poucos (HHI).",
          },
          {
            id: "activity.exchange-interaction",
            name: "Interação com exchanges",
            meaning:
              "Que proporção do valor e das transações toca CEX.",
          },
          {
            id: "activity.flow-reciprocity",
            name: "Reciprocidade de fluxos",
            meaning:
              "Quanto do movimento é ida-e-volta com as mesmas contrapartes.",
          },
          {
            id: "activity.net-vs-gross",
            name: "Saldo líquido vs. volume bruto",
            meaning:
              "Se há muito movimento com pouca mudança líquida.",
          },
          {
            id: "activity.velocity-bursts",
            name: "Velocidade e rajadas",
            meaning:
              "Ritmo diário de operações e se chegam em rajadas concentradas.",
          },
          {
            id: "activity.token-diversity",
            name: "Diversidade de tokens",
            meaning:
              "Variedade de ativos nos movimentos.",
          },
          {
            id: "activity.wash-patterns",
            name: "Padrões wash / circulares / bot-like",
            meaning:
              "Indícios de lavagem de volume, circuitos fechados ou automação. Sinais de alerta precoce, não prova forense.",
          },
          {
            id: "activity.nft-fungible-mix",
            name: "Mix NFT vs. fungíveis",
            meaning:
              "Quanto do fluxo é NFT frente a fungíveis.",
          },
          {
            id: "activity.category-exposures",
            name: "Exposições por categoria de contraparte",
            meaning:
              "Peso do valor para OFAC / mixer / bridge / airdrop / protocolo conhecidos. Sinal histórico de exposição, não screening oficial.",
          },
          {
            id: "activity.sourcify",
            name: "Qualidade de contratos (Sourcify)",
            meaning:
              "Que proporção dos contratos tocados está verificada no Sourcify vs. não verificados.",
          },
          {
            id: "activity.labeled-counterparties",
            name: "Contrapartes etiquetadas (Kleros / Spellbook)",
            meaning:
              "Que parte das contrapartes (peers) leva etiquetas de reputação on-chain conhecidas. Kleros só em Standard e Expert. Contexto informativo, não screening oficial.",
          },
          {
            id: "activity.labeled-contracts",
            name: "Contratos tocados etiquetados (Kleros Scout)",
            meaning:
              "Que proporção dos contratos tocados (routers, tokens, protocolos) está etiquetada no Scout. Distinto das contrapartes e da verificação de código (Sourcify). Só Standard e Expert.",
          },
        ],
      },
    ],
  },
};

export function analisisSignalsForLocale(locale: string): AnalisisSignalsCopy {
  return analisisSignalsByLocale[locale] ?? analisisSignalsByLocale.es;
}

const analisisCustodyByLocale: Record<string, AnalisisCustodyCopy> = {
  es: {
    title: "Clasificación de custodia",
    intro:
      "Señal aparte de las cuatro partes del análisis: lectura probabilística de si la wallet analizada parece hosted (CEX / depósito inferido) o unhosted (autocustodia aparente). No es un quinto SKU ni parte de Portafolio.",
    nameCol: "Señal interna",
    meaningCol: "Qué aporta a la decisión",
    tierColLite: "Básica",
    tierColStandard: "Estándar",
    tierColExpert: "Experta",
    tierCoveredAria: "Cubierta en {tier}",
    tierNotCoveredAria: "No cubierta en {tier}",
    lead: "Complementa el origen de los fondos con una lectura del tipo de wallet objetivo. El receptor interpreta; no es prueba de quién controla las claves.",
    rows: [
      {
        id: "custody.class-probability",
        name: "Clase y probabilidad hosted / unhosted",
        meaning:
          "Clases como hosted conocido, depósito inferido, unhosted aparente o desconocido, con porcentajes de confianza. Señal explicable, no veredicto binario.",
      },
      {
        id: "custody.depth-by-tier",
        name: "Profundidad según el tier",
        meaning:
          "Básica: lookup del sujeto en el catálogo CEX. Estándar y Experta: más barrido hacia hot wallets CEX y score comportamental residual.",
      },
      {
        id: "custody.distinct-from-funders",
        name: "Distinto de depósitos CEX de fondeadores",
        meaning:
          "La custodia habla de la wallet analizada. Los depósitos CEX inferidos en Orígenes etiquetan a quienes la fondearon, no al sujeto.",
      },
    ],
  },
  en: {
    title: "Custody classification",
    intro:
      "A signal apart from the four analysis parts: a probabilistic read of whether the analyzed wallet looks hosted (CEX / inferred deposit) or unhosted (apparent self-custody). Not a fifth SKU and not part of Portfolio.",
    nameCol: "Internal signal",
    meaningCol: "How it informs the decision",
    tierColLite: "Basic",
    tierColStandard: "Standard",
    tierColExpert: "Expert",
    tierCoveredAria: "Covered in {tier}",
    tierNotCoveredAria: "Not covered in {tier}",
    lead: "Complements fund origins with a read of the subject wallet type. The recipient interprets; it is not proof of who controls the keys.",
    rows: [
      {
        id: "custody.class-probability",
        name: "Hosted / unhosted class and probability",
        meaning:
          "Classes such as known hosted, inferred deposit, likely unhosted, or unknown, with confidence percentages. An explainable signal, not a binary verdict.",
      },
      {
        id: "custody.depth-by-tier",
        name: "Depth by tier",
        meaning:
          "Basic: CEX-catalog lookup of the subject. Standard and Expert: plus sweep toward CEX hot wallets and a residual behavioral score.",
      },
      {
        id: "custody.distinct-from-funders",
        name: "Distinct from funders’ inferred CEX deposits",
        meaning:
          "Custody is about the analyzed wallet. Inferred CEX deposits in Origins label who funded it, not the subject.",
      },
    ],
  },
  pt: {
    title: "Classificação de custódia",
    intro:
      "Sinal à parte das quatro partes da análise: leitura probabilística de se a wallet analisada parece hosted (CEX / depósito inferido) ou unhosted (autocustódia aparente). Não é um quinto SKU nem parte de Portfólio.",
    nameCol: "Sinal interno",
    meaningCol: "O que aporta à decisão",
    tierColLite: "Básica",
    tierColStandard: "Standard",
    tierColExpert: "Expert",
    tierCoveredAria: "Coberto em {tier}",
    tierNotCoveredAria: "Não coberto em {tier}",
    lead: "Complementa a origem dos fundos com uma leitura do tipo de wallet objetivo. O receptor interpreta; não é prova de quem controla as chaves.",
    rows: [
      {
        id: "custody.class-probability",
        name: "Classe e probabilidade hosted / unhosted",
        meaning:
          "Classes como hosted conhecido, depósito inferido, unhosted aparente ou desconhecido, com percentagens de confiança. Sinal explicável, não veredito binário.",
      },
      {
        id: "custody.depth-by-tier",
        name: "Profundidade conforme o tier",
        meaning:
          "Básica: lookup do sujeito no catálogo CEX. Standard e Expert: mais varredura para hot wallets CEX e score comportamental residual.",
      },
      {
        id: "custody.distinct-from-funders",
        name: "Distinto de depósitos CEX de financiadores",
        meaning:
          "A custódia fala da wallet analisada. Os depósitos CEX inferidos em Origens etiquetam quem a financiou, não o sujeito.",
      },
    ],
  },
};

export function analisisCustodyForLocale(locale: string): AnalisisCustodyCopy {
  return analisisCustodyByLocale[locale] ?? analisisCustodyByLocale.es;
}
