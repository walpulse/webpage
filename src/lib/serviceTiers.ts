export const serviceTierIds = ["lite", "standard", "expert"] as const;
export type ServiceTierId = (typeof serviceTierIds)[number];

export type TierDeliverables = {
  mode: "sync" | "async";
  modeLabel: string;
  modeBlurb: string;
  package: string[];
};

export type ServiceTierCard = {
  id: ServiceTierId;
  name: string;
  paragraphs: string[];
  /** One bullet; use a string[] for multiple paragraphs inside the same bullet. */
  covers: Array<string | string[]>;
  deliverables: TierDeliverables;
};

export type CatalogCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  cardsTitle: string;
  cards: Record<ServiceTierId, ServiceTierCard>;
  deliverablesLabel: string;
  packageLabel: string;
  integrityLabel: string;
  integrity: string[];
  chainLabel: string;
  synthesisTitle: string;
  synthesisBody: string;
  ctaTitle: string;
};

const integrityEs = [
  "data_hash del análisis para anclar la integridad del resultado.",
  "Firma EIP-712 inmediata (0 gas).",
  "Attestation EAS asíncrona (attestation_uid cuando esté confirmada).",
  "Schema fijo: hash, wallet, tier, URI(s), issuedAt.",
  "POST /v1/verify — valida la firma EIP-712 y, si ya está, la attestation.",
];

const integrityEn = [
  "data_hash of the analysis to anchor result integrity.",
  "Immediate EIP-712 signature (0 gas).",
  "Async EAS attestation (attestation_uid once confirmed).",
  "Fixed schema: hash, wallet, tier, URI(s), issuedAt.",
  "POST /v1/verify — checks the EIP-712 signature and, when ready, the attestation.",
];

const integrityPt = [
  "data_hash da análise para ancorar a integridade do resultado.",
  "Assinatura EIP-712 imediata (0 gas).",
  "Attestation EAS assíncrona (attestation_uid quando confirmada).",
  "Schema fixo: hash, wallet, tier, URI(s), issuedAt.",
  "POST /v1/verify — valida a assinatura EIP-712 e, se já existir, a attestation.",
];

const packageLiteEs = [
  "JSON del análisis + CID",
  "JSON de evidencia + CID",
  "Manifiesto",
  "Firma EIP-712",
  "eas.status: pending | confirmed, con attestation_uid cuando exista",
];

const packageAsyncEs = [
  "JSON + CID",
  "PDF del análisis",
  "Evidencia + CID",
  "Manifiesto",
  "Firma EIP-712",
  "attestation_uid",
];

const packageLiteEn = [
  "Analysis JSON + CID",
  "Evidence JSON + CID",
  "Manifest",
  "EIP-712 signature",
  "eas.status: pending | confirmed, with attestation_uid when available",
];

const packageAsyncEn = [
  "JSON + CID",
  "Analysis PDF",
  "Evidence + CID",
  "Manifest",
  "EIP-712 signature",
  "attestation_uid",
];

const packageLitePt = [
  "JSON da análise + CID",
  "JSON de evidência + CID",
  "Manifesto",
  "Assinatura EIP-712",
  "eas.status: pending | confirmed, com attestation_uid quando existir",
];

const packageAsyncPt = [
  "JSON + CID",
  "PDF da análise",
  "Evidência + CID",
  "Manifesto",
  "Assinatura EIP-712",
  "attestation_uid",
];

/**
 * Commercial catalog (Básica / Estándar / Experta).
 * Inline locale maps — same pattern as `signalCerts` (avoid stale next-intl catalogs).
 * Source of truth: vault Catálogo de servicios (2026-08-20 + packaging 2026-08-21).
 */
export const catalogByLocale: Record<string, CatalogCopy> = {
  es: {
    eyebrow: "",
    title: "Análisis en tres profundidades",
    intro:
      "Ofrecemos un análisis de billeteras virtuales basado en la profundidad que requiera nuestro cliente: Básica, Estándar o Experta. Cada profundidad ofrece distintos niveles de las señales.",
    cardsTitle: "Diferentes necesidades - Diferentes profundidades",
    deliverablesLabel: "Entregables",
    packageLabel: "Paquete",
    integrityLabel: "Integridad y verificación",
    integrity: integrityEs,
    chainLabel: "Chain",
    cards: {
      lite: {
        id: "lite",
        name: "Básica",
        paragraphs: [
          "Análisis diseñado para ejecutar en volúmenes altos, sugerido para wallets de micropagos o montos menores.",
          "También sirve como pre-filtro: si aparecen señales que ameriten más profundidad, conviene pasar a Estándar o Experta.",
        ],
        covers: [
          "Señal de Presencia del Ecosistema en ~15 redes (incluyendo: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, entre otras).",
          "Señal de Origen de Fondos en las dos redes con mayor actividad de la billetera; hasta 100 ingresos por valor (no cronológico) en cada una. Sin hops adicionales.",
          "Señal de Actividad Reciente de los últimos 15 días en esas dos redes.",
          "Compliance screen OFAC de la wallet objetivo: señal de exposición on-chain a listas conocidas. No es screening oficial ni determinación de compliance.",
        ],
        deliverables: {
          mode: "sync",
          modeLabel: "Síncrono",
          modeBlurb:
            "La llamada responde al instante con el paquete completo listo para consumir en tu flujo.",
          package: packageLiteEs,
        },
      },
      standard: {
        id: "standard",
        name: "Estándar",
        paragraphs: [
          "Análisis completo de las cuatro partes de señal, con un hop de origen sobre los principales fondeadores.",
          "Recomendado para debida diligencia cotidiana, onboarding o montos mayores que un pre-filtro.",
        ],
        covers: [
          "Señal de Presencia del Ecosistema en ~100 redes (incluyendo: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, entre otras).",
          "Señal de Calidad del Portafolio en 30–50 redes (incluye Solana), vía Zerion.",
          [
            "Señal de Origen de Fondos en las cinco redes con mayor actividad; hasta 250 ingresos por valor en cada una.",
            "Hop de origen (nivel 1) sobre las dos billeteras que más fondos aportaron a la wallet analizada.",
          ],
          "Señal de Actividad Reciente de los últimos 45 días en esas cinco redes (sin re-análisis de contrapartes).",
          "Compliance screen OFAC de la wallet objetivo: señal de exposición on-chain a listas conocidas. No es screening oficial ni determinación de compliance.",
        ],
        deliverables: {
          mode: "async",
          modeLabel: "Asíncrono",
          modeBlurb:
            "Se solicita por API; al terminar el procesamiento se notifica por correo con el PDF del análisis, o se consulta el resultado desde el mismo dashboard.",
          package: packageAsyncEs,
        },
      },
      expert: {
        id: "expert",
        name: "Experta",
        paragraphs: [
          "Máxima profundidad publicada: más redes, más grafo de origen y Activity light sobre las contrapartes top.",
          "Pensada para investigación, alto valor o casos que requieren más contexto de hops y peers.",
        ],
        covers: [
          "Señal de Presencia del Ecosistema en ~100 redes (incluyendo: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, entre otras).",
          "Señal de Calidad del Portafolio en 30–50 redes (incluye Solana), vía Zerion.",
          [
            "Señal de Origen de Fondos en las diez redes con mayor actividad; hasta 500 ingresos por valor en cada una.",
            "Hops de origen a dos niveles sobre las cinco billeteras que más fondos aportaron a la wallet analizada.",
          ],
          [
            "Señal de Actividad Reciente de los últimos 90 días en esas diez redes.",
            "Activity light (análisis Básica embebido) sobre las cinco contrapartes con mayor interacción; sin Portfolio ni compliance screen de esas wallets.",
          ],
          "Compliance screen OFAC de la wallet objetivo: señal de exposición on-chain a listas conocidas. No es screening oficial ni determinación de compliance.",
        ],
        deliverables: {
          mode: "async",
          modeLabel: "Asíncrono",
          modeBlurb:
            "Se solicita por API; al terminar el procesamiento se notifica por correo con el PDF del análisis, o se consulta el resultado desde el mismo dashboard.",
          package: packageAsyncEs,
        },
      },
    },
    synthesisTitle: "El análisis no es una sentencia",
    synthesisBody:
      "El análisis enfatiza las señales, con un detalle auditable. El receptor debe tomar las señales proporcionadas y aplicar su propio modelo decisorio para definir si interactúa o no con la wallet. Aunque el análisis tenga algún tipo de calificación, esta se entrega de forma informativa; no se debe utilizar como una fuente de decisión.",
    ctaTitle:
      "¿Está listo para integrar un análisis de señales a su proceso de decisión?",
  },
  en: {
    eyebrow: "",
    title: "Analysis in three depths",
    intro:
      "We offer a virtual wallet analysis based on the depth our client needs: Basic, Standard, or Expert. Each depth delivers different levels of the signals.",
    cardsTitle: "Different needs - Different depths",
    deliverablesLabel: "Deliverables",
    packageLabel: "Package",
    integrityLabel: "Integrity and verification",
    integrity: integrityEn,
    chainLabel: "Chain",
    cards: {
      lite: {
        id: "lite",
        name: "Basic",
        paragraphs: [
          "Analysis designed for high volumes, suggested for micropayment wallets or lower amounts.",
          "It also works as a pre-filter: if signals warrant more depth, move to Standard or Expert.",
        ],
        covers: [
          "Ecosystem Presence signal across ~15 networks (including: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, among others).",
          "Origin of Funds signal on the two networks with the most wallet activity; up to 100 inbound transfers by value (not chronological) on each. No additional hops.",
          "Recent Activity signal for the last 15 days on those two networks.",
          "OFAC compliance screen of the target wallet: on-chain exposure signal to known lists. Not official screening or a compliance determination.",
        ],
        deliverables: {
          mode: "sync",
          modeLabel: "Synchronous",
          modeBlurb:
            "The call returns immediately with the full package ready to consume in your flow.",
          package: packageLiteEn,
        },
      },
      standard: {
        id: "standard",
        name: "Standard",
        paragraphs: [
          "A full analysis of all four signal parts, with one origin hop on the main funders.",
          "Recommended for everyday due diligence, onboarding, or amounts beyond a pre-filter.",
        ],
        covers: [
          "Ecosystem Presence signal across ~100 networks (including: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, among others).",
          "Portfolio Quality signal across 30–50 networks (including Solana), via Zerion.",
          [
            "Origin of Funds signal on the five networks with the most activity; up to 250 inbound transfers by value on each.",
            "Origin hop (level 1) on the two wallets that funded the analyzed wallet the most.",
          ],
          "Recent Activity signal for the last 45 days on those five networks (no counterparty re-analysis).",
          "OFAC compliance screen of the target wallet: on-chain exposure signal to known lists. Not official screening or a compliance determination.",
        ],
        deliverables: {
          mode: "async",
          modeLabel: "Asynchronous",
          modeBlurb:
            "Requested via API; when processing finishes you are notified by email with the analysis PDF, or you can view the result in the same dashboard.",
          package: packageAsyncEn,
        },
      },
      expert: {
        id: "expert",
        name: "Expert",
        paragraphs: [
          "Maximum published depth: more networks, deeper origin graph, and Activity light on top counterparties.",
          "Built for investigations, high-value cases, or when hop and peer context matters.",
        ],
        covers: [
          "Ecosystem Presence signal across ~100 networks (including: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, among others).",
          "Portfolio Quality signal across 30–50 networks (including Solana), via Zerion.",
          [
            "Origin of Funds signal on the ten networks with the most activity; up to 500 inbound transfers by value on each.",
            "Two-level origin hops on the five wallets that funded the analyzed wallet the most.",
          ],
          [
            "Recent Activity signal for the last 90 days on those ten networks.",
            "Activity light (embedded Basic analysis) on the five counterparties with the most interaction; no Portfolio or compliance screen for those wallets.",
          ],
          "OFAC compliance screen of the target wallet: on-chain exposure signal to known lists. Not official screening or a compliance determination.",
        ],
        deliverables: {
          mode: "async",
          modeLabel: "Asynchronous",
          modeBlurb:
            "Requested via API; when processing finishes you are notified by email with the analysis PDF, or you can view the result in the same dashboard.",
          package: packageAsyncEn,
        },
      },
    },
    synthesisTitle: "The analysis is not a verdict",
    synthesisBody:
      "The analysis emphasizes signals, with auditable detail. The recipient should take the signals provided and apply their own decision model to decide whether to interact with the wallet. Even if the analysis includes some form of score, it is delivered for information only and must not be used as a decision source.",
    ctaTitle:
      "Ready to integrate a signals analysis into your decision process?",
  },
  pt: {
    eyebrow: "",
    title: "Análise em três profundidades",
    intro:
      "Oferecemos uma análise de carteiras virtuais com base na profundidade que o nosso cliente precisa: Básica, Standard ou Expert. Cada profundidade oferece distintos níveis dos sinais.",
    cardsTitle: "Necessidades diferentes - Profundidades diferentes",
    deliverablesLabel: "Entregáveis",
    packageLabel: "Pacote",
    integrityLabel: "Integridade e verificação",
    integrity: integrityPt,
    chainLabel: "Chain",
    cards: {
      lite: {
        id: "lite",
        name: "Básica",
        paragraphs: [
          "Análise desenhada para volumes altos, sugerida para wallets de micropagamentos ou montantes menores.",
          "Também serve como pré-filtro: se surgirem sinais que justifiquem mais profundidade, avance para Standard ou Expert.",
        ],
        covers: [
          "Sinal de Presença do Ecossistema em ~15 redes (incluindo: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, entre outras).",
          "Sinal de Origem dos Fundos nas duas redes com maior atividade da carteira; até 100 ingressos por valor (não cronológico) em cada uma. Sem hops adicionais.",
          "Sinal de Atividade Recente dos últimos 15 dias nessas duas redes.",
          "Compliance screen OFAC da wallet objetivo: sinal de exposição on-chain a listas conhecidas. Não é screening oficial nem determinação de compliance.",
        ],
        deliverables: {
          mode: "sync",
          modeLabel: "Síncrono",
          modeBlurb:
            "A chamada responde na hora com o pacote completo pronto para consumir no seu fluxo.",
          package: packageLitePt,
        },
      },
      standard: {
        id: "standard",
        name: "Standard",
        paragraphs: [
          "Análise completa das quatro partes de sinal, com um hop de origem sobre os principais financiadores.",
          "Recomendada para due diligence cotidiana, onboarding ou montantes maiores que um pré-filtro.",
        ],
        covers: [
          "Sinal de Presença do Ecossistema em ~100 redes (incluindo: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, entre outras).",
          "Sinal de Qualidade do Portfólio em 30–50 redes (inclui Solana), via Zerion.",
          [
            "Sinal de Origem dos Fundos nas cinco redes com maior atividade; até 250 ingressos por valor em cada uma.",
            "Hop de origem (nível 1) sobre as duas carteiras que mais fundos enviaram à wallet analisada.",
          ],
          "Sinal de Atividade Recente dos últimos 45 dias nessas cinco redes (sem reanálise de contrapartes).",
          "Compliance screen OFAC da wallet objetivo: sinal de exposição on-chain a listas conhecidas. Não é screening oficial nem determinação de compliance.",
        ],
        deliverables: {
          mode: "async",
          modeLabel: "Assíncrono",
          modeBlurb:
            "Solicita-se via API; ao terminar o processamento, notifica-se por e-mail com o PDF da análise, ou o resultado pode ser visto no mesmo dashboard.",
          package: packageAsyncPt,
        },
      },
      expert: {
        id: "expert",
        name: "Expert",
        paragraphs: [
          "Máxima profundidade publicada: mais redes, mais grafo de origem e Activity light sobre as principais contrapartes.",
          "Pensada para investigação, alto valor ou casos que precisam de mais contexto de hops e peers.",
        ],
        covers: [
          "Sinal de Presença do Ecossistema em ~100 redes (incluindo: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, entre outras).",
          "Sinal de Qualidade do Portfólio em 30–50 redes (inclui Solana), via Zerion.",
          [
            "Sinal de Origem dos Fundos nas dez redes com maior atividade; até 500 ingressos por valor em cada uma.",
            "Hops de origem em dois níveis sobre as cinco carteiras que mais fundos enviaram à wallet analisada.",
          ],
          [
            "Sinal de Atividade Recente dos últimos 90 dias nessas dez redes.",
            "Activity light (análise Básica embutida) sobre as cinco contrapartes com maior interação; sem Portfólio nem compliance screen dessas wallets.",
          ],
          "Compliance screen OFAC da wallet objetivo: sinal de exposição on-chain a listas conhecidas. Não é screening oficial nem determinação de compliance.",
        ],
        deliverables: {
          mode: "async",
          modeLabel: "Assíncrono",
          modeBlurb:
            "Solicita-se via API; ao terminar o processamento, notifica-se por e-mail com o PDF da análise, ou o resultado pode ser visto no mesmo dashboard.",
          package: packageAsyncPt,
        },
      },
    },
    synthesisTitle: "A análise não é uma sentença",
    synthesisBody:
      "A análise enfatiza os sinais, com um detalhe auditável. O receptor deve tomar os sinais fornecidos e aplicar o seu próprio modelo decisório para definir se interage ou não com a wallet. Ainda que a análise tenha algum tipo de classificação, esta é entregue de forma informativa; não deve ser utilizada como fonte de decisão.",
    ctaTitle:
      "Pronto para integrar uma análise de sinais ao seu processo de decisão?",
  },
};

export function catalogForLocale(locale: string): CatalogCopy {
  return catalogByLocale[locale] ?? catalogByLocale.es;
}
