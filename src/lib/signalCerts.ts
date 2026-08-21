export const signalKeys = ["origins", "activity", "multichain", "portfolio"] as const;
export type SignalKey = (typeof signalKeys)[number];

export const signalIcons: Record<SignalKey, string> = {
  origins: "/Origenes_Fondos.jpg",
  activity: "/Actividad.jpg",
  multichain: "/Multichain.jpg",
  portfolio: "/Portafolio.jpg",
};

export type CertCopy = {
  name: string;
  summary: string;
  value: string;
  analyzes: string[];
};

export type LocaleCerts = {
  analyzesTitle: string;
  certs: Record<SignalKey, CertCopy>;
};

/**
 * Inline locale maps — next-intl `t.raw` has served stale `senales.certs`
 * catalogs in this project (Turbopack). This is the live website source.
 */
export const certsByLocale: Record<string, LocaleCerts> = {
  es: {
    analyzesTitle: "Qué analiza",
    certs: {
      origins: {
        name: "Orígenes",
        summary:
          "Origen de los fondos. La profundidad (0, 1 o 2 hops) depende del tier del análisis.",
        value:
          "Evidencia on-chain del origen de los fondos — directa y a través de las wallets que financiaron a la objetivo.",
        analyzes: [
          "% por categoría de origen (CEX, bridge, mixer, OFAC, airdrop, orgánico…)",
          "Remitentes únicos",
          "Concentración HHI y top-1 / top-3",
          "Calidad de CEX",
          "Patrón temporal de funding",
          "Exposición mixer / OFAC",
          "Orgánico vs sintético (NFT / airdrop)",
          "Antigüedad del primer funding",
          "Orígenes a 2 niveles (multi-hop)",
          "Origins de las top 5 contrapartes",
        ],
      },
      activity: {
        name: "Actividad",
        summary:
          "Comportamiento de flujos. Ventana de 15 o 90 días según el tier; exposición a sanciones como señal, no screening oficial.",
        value:
          "Perfil de comportamiento on-chain de mediano plazo y señal de exposición histórica a contrapartes sensibles.",
        analyzes: [
          "Contrapartes únicas y concentración (HHI)",
          "Interacción con CEX (% valor y txs)",
          "Reciprocity",
          "Net vs gross flow",
          "Velocity y burstiness",
          "Diversidad de tokens",
          "Señales de wash / circular / bot-like",
          "Mix NFT vs fungible",
          "Historial to/from de contrapartes",
          "Exposición histórica a OFAC / sanciones conocidas (señal, no screening oficial)",
        ],
      },
      multichain: {
        name: "Multichain",
        summary:
          "Presencia y madurez multi-red. Entra en Básica, Estándar y Experta; la profundidad (redes / intensidad) depende del tier.",
        value: "Madurez y presencia multi-cadena.",
        analyzes: [
          "Número de chains con actividad",
          "Span global de actividad",
          "Chains activas en 30 y 90 días",
          "Ratio de chains dormidas",
          "Consistencia y recencia",
          "Ecosistemas core",
          "Concentración del footprint (HHI)",
        ],
      },
      portfolio: {
        name: "Portafolio",
        summary:
          "Calidad y composición económica del portafolio. Entra en Básica, Estándar y Experta.",
        value: "Calidad y sustancia económica del portafolio.",
        analyzes: [
          "Valor total usable vs credible",
          "Liquid / locked y liquid ratio",
          "Concentración de holdings (HHI)",
          "Distribución stablecoin / bluechip / meme",
          "Dust y spam",
          "Exposición a protocolos",
        ],
      },
    },
  },
  en: {
    analyzesTitle: "What it analyzes",
    certs: {
      origins: {
        name: "Origins",
        summary:
          "Source of funds. Depth (0, 1, or 2 hops) depends on the analysis tier.",
        value:
          "On-chain evidence of funding origins — direct and through the wallets that financed the target.",
        analyzes: [
          "% by origin category (CEX, bridge, mixer, OFAC, airdrop, organic…)",
          "Unique senders",
          "HHI concentration and top-1 / top-3",
          "CEX quality",
          "Temporal funding pattern",
          "Mixer / OFAC exposure",
          "Organic vs synthetic (NFT / airdrop)",
          "Age of first funding",
          "2-level origins (multi-hop)",
          "Origins of the top 5 counterparties",
        ],
      },
      activity: {
        name: "Activity",
        summary:
          "Flow behavior. 15- or 90-day window depending on the tier; sanctions exposure as a signal, not official screening.",
        value:
          "Medium-term on-chain behavior profile and a historical exposure signal to sensitive counterparties.",
        analyzes: [
          "Unique counterparties and concentration (HHI)",
          "CEX interaction (% value and txs)",
          "Reciprocity",
          "Net vs gross flow",
          "Velocity and burstiness",
          "Token diversity",
          "Wash / circular / bot-like signals",
          "NFT vs fungible mix",
          "To/from counterparty history",
          "Historical exposure to OFAC / known sanctions (signal, not official screening)",
        ],
      },
      multichain: {
        name: "Multichain",
        summary:
          "Multi-network presence and maturity. Included in Basic, Standard, and Expert; depth (networks / intensity) depends on the tier.",
        value: "Multi-chain maturity and presence.",
        analyzes: [
          "Number of chains with activity",
          "Global activity span",
          "Chains active in 30 and 90 days",
          "Dormant-chain ratio",
          "Consistency and recency",
          "Core ecosystems",
          "Footprint concentration (HHI)",
        ],
      },
      portfolio: {
        name: "Portfolio",
        summary:
          "Economic quality and composition of the portfolio. Included in Basic, Standard, and Expert.",
        value: "Economic quality and substance of the portfolio.",
        analyzes: [
          "Total value usable vs credible",
          "Liquid / locked and liquid ratio",
          "Holdings concentration (HHI)",
          "Stablecoin / bluechip / meme distribution",
          "Dust and spam",
          "Protocol exposure",
        ],
      },
    },
  },
  pt: {
    analyzesTitle: "O que analisa",
    certs: {
      origins: {
        name: "Origens",
        summary:
          "Origem dos fundos. A profundidade (0, 1 ou 2 hops) depende do tier da análise.",
        value:
          "Evidência on-chain da origem dos fundos — direta e através das wallets que financiaram a alvo.",
        analyzes: [
          "% por categoria de origem (CEX, bridge, mixer, OFAC, airdrop, orgânico…)",
          "Remetentes únicos",
          "Concentração HHI e top-1 / top-3",
          "Qualidade de CEX",
          "Padrão temporal de funding",
          "Exposição mixer / OFAC",
          "Orgânico vs sintético (NFT / airdrop)",
          "Idade do primeiro funding",
          "Origens em 2 níveis (multi-hop)",
          "Origins das top 5 contrapartes",
        ],
      },
      activity: {
        name: "Atividade",
        summary:
          "Comportamento de fluxos. Janela de 15 ou 90 dias conforme o tier; exposição a sanções como sinal, não screening oficial.",
        value:
          "Perfil de comportamento on-chain de médio prazo e sinal de exposição histórica a contrapartes sensíveis.",
        analyzes: [
          "Contrapartes únicas e concentração (HHI)",
          "Interação com CEX (% valor e txs)",
          "Reciprocity",
          "Net vs gross flow",
          "Velocity e burstiness",
          "Diversidade de tokens",
          "Sinais de wash / circular / bot-like",
          "Mix NFT vs fungible",
          "Histórico to/from de contrapartes",
          "Exposição histórica a OFAC / sanções conhecidas (sinal, não screening oficial)",
        ],
      },
      multichain: {
        name: "Multichain",
        summary:
          "Presença e maturidade multi-rede. Entra em Básica, Standard e Expert; a profundidade (redes / intensidade) depende do tier.",
        value: "Maturidade e presença multi-cadeia.",
        analyzes: [
          "Número de chains com atividade",
          "Span global de atividade",
          "Chains ativas em 30 e 90 dias",
          "Ratio de chains dormentes",
          "Consistência e recência",
          "Ecossistemas core",
          "Concentração do footprint (HHI)",
        ],
      },
      portfolio: {
        name: "Portfólio",
        summary:
          "Qualidade e composição econômica do portfólio. Entra em Básica, Standard e Expert.",
        value: "Qualidade e substância econômica do portfólio.",
        analyzes: [
          "Valor total usable vs credible",
          "Liquid / locked e liquid ratio",
          "Concentração de holdings (HHI)",
          "Distribuição stablecoin / bluechip / meme",
          "Dust e spam",
          "Exposição a protocolos",
        ],
      },
    },
  },
};

export function certsForLocale(locale: string): LocaleCerts {
  return certsByLocale[locale] ?? certsByLocale.es;
}
