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
          "Análisis diseñado para ejecutar en volúmenes altos, sugerido para analizar wallets que ejecutan micropagos o con valores menores.",
          "También puede ser usado como pre-filtro para la detección de señales que ameriten, para ciertas billeteras, ejecutar un análisis más profundo.",
        ],
        covers: [
          "Señal de Presencia del Ecosistema en 15 redes (incluyendo: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, entre otras).",
          "Señal de Calidad del Portafolio en más de 38 redes (incluyendo: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, entre otras).",
          "Señal de Origen de Fondos en las dos redes con mayor transacciones de la billetera; se analizan las primeras 100 transacciones de ingreso de fondos de cada una.",
          "Señal de Actividad Reciente de los últimos 15 días en las dos redes con mayor transacciones de la billetera.",
          "Adicionalmente se analiza si la wallet se encuentra marcada como sancionada en las listas oficiales de la OFAC.",
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
          "Análisis completo de las señales asociadas a una billetera. Ofrece un análisis de un nivel sobre el origen de los fondos.",
          "Recomendado cuando se quiere ejecutar un filtro más detallado sobre la información de una billetera o cuando el monto a ejecutar es mayor.",
        ],
        covers: [
          "Señal de Presencia del Ecosistema en 100 redes (incluyendo: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, entre otras).",
          "Señal de Calidad del Portafolio en más de 38 redes (incluyendo: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, entre otras).",
          [
            "Señal de Origen de Fondos en las cinco redes con mayor transacciones de la billetera; se analizan las primeras 250 transacciones de ingreso de fondos de cada una.",
            "Un análisis de origen adicional sobre las dos billeteras que más fondos ingresaron a la billetera analizada dentro de esas transacciones.",
            "Un análisis adicional que evalúa si todas las billeteras que ingresaron fondos a la billetera analizada se encontraban sancionadas en las listas oficiales de la OFAC.",
          ],
          "Señal de Actividad Reciente de los últimos 45 días en las cinco redes con mayor transacciones de la billetera.",
          "Adicionalmente se analiza si la wallet se encuentra marcada como sancionada en las listas oficiales de la OFAC.",
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
          "Análisis a profundidad no solo en número de transacciones sino en cantidad de redes.",
          "Ofrece un análisis que cubre las contrapartes con mayor interacción y un nivel de análisis sobre el origen de los fondos de dos niveles.",
        ],
        covers: [
          "Señal de Presencia del Ecosistema en 100 redes (incluyendo: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, entre otras).",
          "Señal de Calidad del Portafolio en más de 38 redes (incluyendo: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, entre otras).",
          [
            "Señal de Origen de Fondos en las diez redes con mayor transacciones de la billetera; se analizan las primeras 500 transacciones de ingreso de fondos de cada una.",
            "Un análisis de origen adicional de dos niveles sobre las cinco billeteras que más fondos ingresaron a la billetera analizada dentro de esas transacciones.",
            "Un análisis adicional que evalúa si todas las billeteras que ingresaron fondos a la billetera analizada se encontraban sancionadas en las listas oficiales de la OFAC.",
          ],
          [
            "Señal de Actividad Reciente de los últimos 90 días en las diez redes con mayor transacciones de la billetera.",
            "Un análisis de fondo de origen básico sobre las cinco billeteras con las cuales mayor interacción tuvo durante ese periodo de tiempo.",
          ],
          "Adicionalmente se analiza si la wallet se encuentra marcada como sancionada en las listas oficiales de la OFAC.",
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
          "Analysis designed for high volumes, suggested for wallets that run micropayments or lower values.",
          "It can also be used as a pre-filter to detect signals that warrant a deeper analysis for certain wallets.",
        ],
        covers: [
          "Ecosystem Presence signal across 15 networks (including: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, among others).",
          "Portfolio Quality signal across more than 38 networks (including: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, among others).",
          "Origin of Funds signal on the two networks with the most wallet transactions; the first 100 inbound funding transactions are analyzed on each.",
          "Recent Activity signal for the last 15 days on the two networks with the most wallet transactions.",
          "Additionally, whether the wallet is flagged as sanctioned on official OFAC lists is analyzed.",
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
          "A complete analysis of the signals associated with a wallet. It offers a one-level analysis of the origin of funds.",
          "Recommended when you want a more detailed filter on a wallet’s information or when the amount involved is larger.",
        ],
        covers: [
          "Ecosystem Presence signal across 100 networks (including: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, among others).",
          "Portfolio Quality signal across more than 38 networks (including: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, among others).",
          [
            "Origin of Funds signal on the five networks with the most wallet transactions; the first 250 inbound funding transactions are analyzed on each.",
            "An additional origins analysis on the two wallets that sent the most funds into the analyzed wallet within those transactions.",
            "An additional analysis that evaluates whether all wallets that funded the analyzed wallet were sanctioned on official OFAC lists.",
          ],
          "Recent Activity signal for the last 45 days on the five networks with the most wallet transactions.",
          "Additionally, whether the wallet is flagged as sanctioned on official OFAC lists is analyzed.",
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
          "A deep analysis not only in number of transactions but also in number of networks.",
          "It offers an analysis that covers the counterparties with the most interaction and a two-level analysis of the origin of funds.",
        ],
        covers: [
          "Ecosystem Presence signal across 100 networks (including: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, among others).",
          "Portfolio Quality signal across more than 38 networks (including: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, among others).",
          [
            "Origin of Funds signal on the ten networks with the most wallet transactions; the first 500 inbound funding transactions are analyzed on each.",
            "An additional two-level origins analysis on the five wallets that sent the most funds into the analyzed wallet within those transactions.",
            "An additional analysis that evaluates whether all wallets that funded the analyzed wallet were sanctioned on official OFAC lists.",
          ],
          [
            "Recent Activity signal for the last 90 days on the ten networks with the most wallet transactions.",
            "A basic origin-of-funds analysis on the five wallets with the most interaction during that period.",
          ],
          "Additionally, whether the wallet is flagged as sanctioned on official OFAC lists is analyzed.",
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
          "Análise desenhada para executar em volumes altos, sugerida para analisar wallets que executam micropagamentos ou com valores menores.",
          "Também pode ser usada como pré-filtro para a detecção de sinais que justifiquem, para certas carteiras, executar uma análise mais profunda.",
        ],
        covers: [
          "Sinal de Presença do Ecossistema em 15 redes (incluindo: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, entre outras).",
          "Sinal de Qualidade do Portfólio em mais de 38 redes (incluindo: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, entre outras).",
          "Sinal de Origem dos Fundos nas duas redes com mais transações da carteira; analisam-se as primeiras 100 transações de ingresso de fundos de cada uma.",
          "Sinal de Atividade Recente dos últimos 15 dias nas duas redes com mais transações da carteira.",
          "Adicionalmente analisa-se se a wallet está marcada como sancionada nas listas oficiais da OFAC.",
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
          "Análise completa dos sinais associados a uma carteira. Oferece uma análise de um nível sobre a origem dos fundos.",
          "Recomendada quando se quer executar um filtro mais detalhado sobre a informação de uma carteira ou quando o montante envolvido é maior.",
        ],
        covers: [
          "Sinal de Presença do Ecossistema em 100 redes (incluindo: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, entre outras).",
          "Sinal de Qualidade do Portfólio em mais de 38 redes (incluindo: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, entre outras).",
          [
            "Sinal de Origem dos Fundos nas cinco redes com mais transações da carteira; analisam-se as primeiras 250 transações de ingresso de fundos de cada uma.",
            "Uma análise de origem adicional sobre as duas carteiras que mais fundos enviaram à carteira analisada dentro dessas transações.",
            "Uma análise adicional que avalia se todas as carteiras que enviaram fundos à carteira analisada estavam sancionadas nas listas oficiais da OFAC.",
          ],
          "Sinal de Atividade Recente dos últimos 45 dias nas cinco redes com mais transações da carteira.",
          "Adicionalmente analisa-se se a wallet está marcada como sancionada nas listas oficiais da OFAC.",
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
          "Análise em profundidade não só no número de transações mas também na quantidade de redes.",
          "Oferece uma análise que cobre as contrapartes com maior interação e um nível de análise sobre a origem dos fundos de dois níveis.",
        ],
        covers: [
          "Sinal de Presença do Ecossistema em 100 redes (incluindo: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, entre outras).",
          "Sinal de Qualidade do Portfólio em mais de 38 redes (incluindo: eth, polygon, bsc, avalanche, arbitrum, gnosis, base, optimism, entre outras).",
          [
            "Sinal de Origem dos Fundos nas dez redes com mais transações da carteira; analisam-se as primeiras 500 transações de ingresso de fundos de cada uma.",
            "Uma análise de origem adicional de dois níveis sobre as cinco carteiras que mais fundos enviaram à carteira analisada dentro dessas transações.",
            "Uma análise adicional que avalia se todas as carteiras que enviaram fundos à carteira analisada estavam sancionadas nas listas oficiais da OFAC.",
          ],
          [
            "Sinal de Atividade Recente dos últimos 90 dias nas dez redes com mais transações da carteira.",
            "Uma análise básica de origem de fundos sobre as cinco carteiras com as quais maior interação teve durante esse período.",
          ],
          "Adicionalmente analisa-se se a wallet está marcada como sancionada nas listas oficiais da OFAC.",
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
