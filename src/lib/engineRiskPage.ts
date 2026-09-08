export type EngineRiskExample = {
  signal: string;
  rule: string;
};

export type EngineRiskPageCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  principleTitle: string;
  principleBody: string;
  whyTitle: string;
  whyBody: string;
  howTitle: string;
  howSteps: string[];
  howClarificationsTitle: string;
  howClarifications: string[];
  examplesTitle: string;
  examplesIntro: string;
  examples: EngineRiskExample[];
  accessTitle: string;
  accessBody: string;
  seeAnalisis: string;
  talkToTeam: string;
};

/**
 * Marketing copy for Walpulse Motor de Riesgos (parametrizable client risk score).
 * Product status: design / upcoming — not live dashboard GA.
 */
export const engineRiskByLocale: Record<string, EngineRiskPageCopy> = {
  es: {
    eyebrow: "Próximamente",
    title: "Walpulse Motor de Riesgos",
    intro:
      "Una puntuación de riesgo totalmente parametrizable por el cliente: cada oficial o departamento de cumplimiento define las reglas basadas en las señales on-chain que Walpulse proporciona.",
    principleTitle: "Qué es?",
    principleBody:
      "Walpulse pone a disposición de sus clientes las señales on-chain de reputación que calcula para que puedan usarse al crear una puntuación de riesgo adaptada a los requerimientos internos de cada organización. Esto no convierte a Walpulse en una herramienta de compliance: tanto la puntuación de riesgo como las decisiones asociadas siguen a cargo del cliente final.",
    whyTitle: "¿Por qué?",
    whyBody:
      "Entendemos que nuestros clientes, además de tener acceso a las señales on-chain de una wallet, también necesitan traducir esas señales en inteligencia dentro de sus matrices de riesgo internas. Queremos ofrecer más herramientas a nuestros clientes para que puedan cumplir con sus requerimientos internos o legales.",
    howTitle: "Cómo funciona",
    howSteps: [
      "El cliente elige qué señales internas del análisis alimentan su matriz (puede elegir cualquier señal interna de los cuatro análisis: Presencia del Ecosistema, Calidad del Portafolio, Origen de Fondos, Actividad Reciente).",
      "El cliente define parámetros, umbrales y pesos según el Puntaje de Riesgo que su manual requiera.",
      "En cada petición de análisis, Walpulse aplica la matemática sobre los datos on-chain ya calculados y entrega un reporte adicional del Puntaje de Riesgo que evidencia el análisis bajo el marco del cliente, con trazabilidad auditable.",
    ],
    howClarificationsTitle: "Clarificaciones",
    howClarifications: [
      "No hay un catálogo cerrado de “únicas reglas Walpulse”. El cliente puede basar condiciones en cualquier señal interna publicada en el análisis y diseñar el score que necesite: pesos, bonificaciones, penalizaciones y umbrales propios.",
      "El Motor de Riesgos solo está disponible para clientes de Walpulse desde el dashboard y para análisis Estándar o Experta.",
      "Walpulse no decide, no aprueba, no reporta a ningún organismo público. El Motor de Riesgos mantiene nuestro principio rector: proveemos señales de información y es el cliente quien toma la decisión de interactuar o no con una wallet.",
    ],
    examplesTitle: "Ejemplos ilustrativos",
    examplesIntro:
      "Solo ejemplos. No son pesos oficiales ni una lista exhaustiva de reglas.",
    examples: [
      {
        signal: "Exposición a mixer (Origen / Actividad)",
        rule: "Interacción con mixer = +50 puntos de riesgo",
      },
      {
        signal: "Antigüedad del primer fondeo (Origen)",
        rule: "Antigüedad > 1 año = −10 puntos de riesgo",
      },
      {
        signal: "Concentración de contrapartes (Actividad)",
        rule: "HHI por encima de umbral del Manual = +N puntos",
      },
    ],
    accessTitle: "Fecha de acceso",
    accessBody:
      "Próximamente. Contactanos para más información sobre disponibilidad y early access.",
    seeAnalisis: "Ver profundidades de análisis",
    talkToTeam: "Contactanos",
  },
  en: {
    eyebrow: "Coming soon",
    title: "Walpulse Risk Engine",
    intro:
      "A fully client-parametrizable risk score: each compliance officer or department defines the rules based on the on-chain signals Walpulse provides.",
    principleTitle: "What is it?",
    principleBody:
      "Walpulse makes the on-chain reputation signals it computes available to clients so they can build a risk score tailored to each organization’s internal requirements. That does not turn Walpulse into a compliance tool: both the risk score and the associated decisions remain with the end client.",
    whyTitle: "Why?",
    whyBody:
      "We understand that our clients, beyond access to a wallet’s on-chain signals, also need to turn those signals into intelligence inside their internal risk matrices. We want to offer more tools so clients can meet their internal or legal requirements.",
    howTitle: "How it works",
    howSteps: [
      "The client chooses which internal analysis signals feed the matrix (any internal signal from the four analyses: Ecosystem Presence, Portfolio Quality, Source of Funds, Recent Activity).",
      "The client defines parameters, thresholds, and weights for the Risk Score their manual requires.",
      "On every analysis request, Walpulse applies the math to the already-computed on-chain data and delivers an additional Risk Score report that evidences the analysis under the client’s framework, with auditable traceability.",
    ],
    howClarificationsTitle: "Clarifications",
    howClarifications: [
      "There is no closed catalog of “only Walpulse rules.” The client can base conditions on any internal signal published in the analysis and design the score they need: weights, bonuses, penalties, and their own thresholds.",
      "The Risk Engine is available only to Walpulse clients from the dashboard, and only for Standard or Expert analyses.",
      "Walpulse does not decide, approve, or report to any public authority. The Risk Engine keeps our guiding principle: we provide information signals, and the client decides whether to interact with a wallet.",
    ],
    examplesTitle: "Illustrative examples",
    examplesIntro:
      "Examples only. Not official weights and not an exhaustive rule list.",
    examples: [
      {
        signal: "Mixer exposure (Origins / Activity)",
        rule: "Mixer interaction = +50 risk points",
      },
      {
        signal: "Age of first funding (Origins)",
        rule: "Age > 1 year = −10 risk points",
      },
      {
        signal: "Counterparty concentration (Activity)",
        rule: "HHI above the manual’s threshold = +N points",
      },
    ],
    accessTitle: "Access date",
    accessBody:
      "Coming soon. Contact us for more information on availability and early access.",
    seeAnalisis: "See analysis depths",
    talkToTeam: "Contact us",
  },
  pt: {
    eyebrow: "Em breve",
    title: "Walpulse Motor de Riscos",
    intro:
      "Uma pontuação de risco totalmente parametrizável pelo cliente: cada oficial ou departamento de compliance define as regras com base nos sinais on-chain que a Walpulse fornece.",
    principleTitle: "O que é?",
    principleBody:
      "A Walpulse coloca à disposição dos clientes os sinais on-chain de reputação que calcula para que possam ser usados na criação de uma pontuação de risco adaptada aos requisitos internos de cada organização. Isso não transforma a Walpulse numa ferramenta de compliance: tanto a pontuação de risco quanto as decisões associadas continuam a cargo do cliente final.",
    whyTitle: "Por quê?",
    whyBody:
      "Entendemos que os nossos clientes, além de terem acesso aos sinais on-chain de uma wallet, também precisam traduzir esses sinais em inteligência dentro das suas matrizes de risco internas. Queremos oferecer mais ferramentas para que possam cumprir os seus requisitos internos ou legais.",
    howTitle: "Como funciona",
    howSteps: [
      "O cliente escolhe quais sinais internos da análise alimentam a matriz (pode escolher qualquer sinal interno das quatro análises: Presença do Ecossistema, Qualidade do Portfólio, Origem dos Fundos, Atividade Recente).",
      "O cliente define parâmetros, limiares e pesos conforme a Pontuação de Risco que o manual exigir.",
      "Em cada pedido de análise, a Walpulse aplica a matemática sobre os dados on-chain já calculados e entrega um relatório adicional da Pontuação de Risco que evidencia a análise sob o marco do cliente, com rastreabilidade auditável.",
    ],
    howClarificationsTitle: "Esclarecimentos",
    howClarifications: [
      "Não há um catálogo fechado de “únicas regras Walpulse”. O cliente pode basear condições em qualquer sinal interno publicado na análise e desenhar o score de que precisa: pesos, bônus, penalizações e limiares próprios.",
      "O Motor de Riscos está disponível apenas para clientes Walpulse no dashboard e para análises Standard ou Expert.",
      "A Walpulse não decide, não aprova e não reporta a nenhum organismo público. O Motor de Riscos mantém o nosso princípio: fornecemos sinais de informação e é o cliente quem decide interagir ou não com uma wallet.",
    ],
    examplesTitle: "Exemplos ilustrativos",
    examplesIntro:
      "Apenas exemplos. Não são pesos oficiais nem uma lista exaustiva de regras.",
    examples: [
      {
        signal: "Exposição a mixer (Origem / Atividade)",
        rule: "Interação com mixer = +50 pontos de risco",
      },
      {
        signal: "Idade do primeiro funding (Origem)",
        rule: "Idade > 1 ano = −10 pontos de risco",
      },
      {
        signal: "Concentração de contrapartes (Atividade)",
        rule: "HHI acima do limiar do Manual = +N pontos",
      },
    ],
    accessTitle: "Data de acesso",
    accessBody:
      "Em breve. Contacte-nos para mais informação sobre disponibilidade e early access.",
    seeAnalisis: "Ver profundidades de análise",
    talkToTeam: "Contacte-nos",
  },
};

export function engineRiskForLocale(locale: string): EngineRiskPageCopy {
  return engineRiskByLocale[locale] ?? engineRiskByLocale.es;
}
