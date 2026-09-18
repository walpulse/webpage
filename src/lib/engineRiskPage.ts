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
 * Product status: configurator + per-analysis score live in dashboard.
 */
export const engineRiskByLocale: Record<string, EngineRiskPageCopy> = {
  es: {
    eyebrow: "Disponible en el dashboard",
    title: "Walpulse Motor de Riesgos",
    intro:
      "Matrices de riesgo versionadas que el cliente define sobre las señales on-chain de Walpulse: cada regla suma puntos en una escala 0–100 adaptada a los requerimientos internos de la organización.",
    principleTitle: "Qué es?",
    principleBody:
      "Walpulse pone a disposición de sus clientes las señales on-chain de reputación que calcula para que armen una puntuación de riesgo propia. Desde el dashboard configurás matrices, versiones y reglas. Esto no convierte a Walpulse en una herramienta de compliance: tanto la puntuación de riesgo como las decisiones asociadas siguen a cargo del cliente final.",
    whyTitle: "¿Por qué?",
    whyBody:
      "Entendemos que nuestros clientes, además de tener acceso a las señales on-chain de una wallet, también necesitan traducir esas señales en inteligencia dentro de sus matrices de riesgo internas. Queremos ofrecer más herramientas a nuestros clientes para que puedan cumplir con sus requerimientos internos o legales.",
    howTitle: "Cómo funciona",
    howSteps: [
      "El cliente elige qué señales del catálogo del análisis alimentan su matriz (Presencia del Ecosistema, Calidad del Portafolio, Origen de Fondos, Actividad Reciente y señales relacionadas).",
      "Para cada regla define una condición (operador y umbral) y cuántos puntos de riesgo suma cuando se cumple. El presupuesto de la versión es como máximo 100 puntos; se puede publicar aunque no sumen 100 exactos.",
      "Se publica una versión vigente y se despliega la matriz a sandbox o producción. En cada análisis Walpulse calcula automáticamente el puntaje de riesgo según la matriz desplegada.",
    ],
    howClarificationsTitle: "Clarificaciones",
    howClarifications: [
      "Hay un catálogo publicado de señales del análisis. El cliente diseña las reglas sobre ese catálogo: no hay un set cerrado de “únicas reglas Walpulse”.",
      "El Motor de Riesgos está disponible para clientes de Walpulse desde el dashboard. El puntaje sobre cada análisis está pensado para profundidades Estándar o Experta.",
      "Walpulse no decide, no aprueba, no reporta a ningún organismo público. El Motor de Riesgos mantiene nuestro principio rector: proveemos señales de información y es el cliente quien toma la decisión de interactuar o no con una wallet.",
      "Configurar la matriz y calcular el puntaje sobre cada análisis ya están disponibles en el dashboard.",
    ],
    examplesTitle: "Ejemplos ilustrativos",
    examplesIntro:
      "Solo ejemplos. No son puntos oficiales ni una lista exhaustiva de reglas. Los tres suman 100 para ilustrar un presupuesto completo.",
    examples: [
      {
        signal: "Exposición a mixer (Origen / Actividad)",
        rule: "Interacción con mixer = +50 puntos de riesgo",
      },
      {
        signal: "Antigüedad del primer fondeo (Origen)",
        rule: "Antigüedad menor a 1 año = +20 puntos de riesgo",
      },
      {
        signal: "Concentración de contrapartes (Actividad)",
        rule: "HHI por encima de umbral del Manual = +30 puntos",
      },
    ],
    accessTitle: "Acceso",
    accessBody:
      "Ya disponible para clientes en el dashboard. En cada análisis se calcula automáticamente el puntaje de riesgo según la matriz desplegada. Contactanos para más información.",
    seeAnalisis: "Ver profundidades de análisis",
    talkToTeam: "Contactanos",
  },
  en: {
    eyebrow: "Available in the dashboard",
    title: "Walpulse Risk Engine",
    intro:
      "Versioned risk matrices that the client defines on Walpulse on-chain signals: each rule adds points on a 0–100 scale tailored to the organization’s internal requirements.",
    principleTitle: "What is it?",
    principleBody:
      "Walpulse makes the on-chain reputation signals it computes available to clients so they can build their own risk score. From the dashboard you configure matrices, versions, and rules. That does not turn Walpulse into a compliance tool: both the risk score and the associated decisions remain with the end client.",
    whyTitle: "Why?",
    whyBody:
      "We understand that our clients, beyond access to a wallet’s on-chain signals, also need to turn those signals into intelligence inside their internal risk matrices. We want to offer more tools so clients can meet their internal or legal requirements.",
    howTitle: "How it works",
    howSteps: [
      "The client chooses which signals from the analysis catalog feed the matrix (Ecosystem Presence, Portfolio Quality, Source of Funds, Recent Activity, and related signals).",
      "For each rule they define a condition (operator and threshold) and how many risk points it adds when it matches. A version’s budget is at most 100 points; you can publish even if they do not sum to exactly 100.",
      "They publish a live version and deploy the matrix to sandbox or production. On each analysis Walpulse automatically calculates the risk score from the deployed matrix.",
    ],
    howClarificationsTitle: "Clarifications",
    howClarifications: [
      "There is a published catalog of analysis signals. The client designs rules on that catalog: there is no closed set of “only Walpulse rules.”",
      "The Risk Engine is available to Walpulse clients from the dashboard. The per-analysis score is intended for Standard or Expert depths.",
      "Walpulse does not decide, approve, or report to any public authority. The Risk Engine keeps our guiding principle: we provide information signals, and the client decides whether to interact with a wallet.",
      "Matrix configuration and per-analysis score calculation are already available in the dashboard.",
    ],
    examplesTitle: "Illustrative examples",
    examplesIntro:
      "Examples only. Not official points and not an exhaustive rule list. The three sum to 100 to illustrate a full budget.",
    examples: [
      {
        signal: "Mixer exposure (Origins / Activity)",
        rule: "Mixer interaction = +50 risk points",
      },
      {
        signal: "Age of first funding (Origins)",
        rule: "Age under 1 year = +20 risk points",
      },
      {
        signal: "Counterparty concentration (Activity)",
        rule: "HHI above the manual’s threshold = +30 points",
      },
    ],
    accessTitle: "Access",
    accessBody:
      "Already available to clients in the dashboard. On each analysis the risk score is calculated automatically from the deployed matrix. Contact us for more information.",
    seeAnalisis: "See analysis depths",
    talkToTeam: "Contact us",
  },
  pt: {
    eyebrow: "Disponível no dashboard",
    title: "Walpulse Motor de Riscos",
    intro:
      "Matrizes de risco versionadas que o cliente define sobre os sinais on-chain da Walpulse: cada regra soma pontos numa escala 0–100 adaptada aos requisitos internos da organização.",
    principleTitle: "O que é?",
    principleBody:
      "A Walpulse coloca à disposição dos clientes os sinais on-chain de reputação que calcula para que montem uma pontuação de risco própria. No dashboard configura matrizes, versões e regras. Isso não transforma a Walpulse numa ferramenta de compliance: tanto a pontuação de risco quanto as decisões associadas continuam a cargo do cliente final.",
    whyTitle: "Por quê?",
    whyBody:
      "Entendemos que os nossos clientes, além de terem acesso aos sinais on-chain de uma wallet, também precisam traduzir esses sinais em inteligência dentro das suas matrizes de risco internas. Queremos oferecer mais ferramentas para que possam cumprir os seus requisitos internos ou legais.",
    howTitle: "Como funciona",
    howSteps: [
      "O cliente escolhe quais sinais do catálogo da análise alimentam a matriz (Presença do Ecossistema, Qualidade do Portfólio, Origem dos Fundos, Atividade Recente e sinais relacionados).",
      "Para cada regra define uma condição (operador e limiar) e quantos pontos de risco soma quando se cumpre. O orçamento da versão é no máximo 100 pontos; pode publicar mesmo que não somem exatamente 100.",
      "Publica uma versão vigente e faz o deploy da matriz para sandbox ou produção. Em cada análise a Walpulse calcula automaticamente a pontuação de risco segundo a matriz implantada.",
    ],
    howClarificationsTitle: "Esclarecimentos",
    howClarifications: [
      "Há um catálogo publicado de sinais da análise. O cliente desenha as regras sobre esse catálogo: não há um conjunto fechado de “únicas regras Walpulse”.",
      "O Motor de Riscos está disponível para clientes Walpulse no dashboard. A pontuação por análise está pensada para as profundidades Standard ou Expert.",
      "A Walpulse não decide, não aprova e não reporta a nenhum organismo público. O Motor de Riscos mantém o nosso princípio: fornecemos sinais de informação e é o cliente quem decide interagir ou não com uma wallet.",
      "Configurar a matriz e calcular a pontuação em cada análise já estão disponíveis no dashboard.",
    ],
    examplesTitle: "Exemplos ilustrativos",
    examplesIntro:
      "Apenas exemplos. Não são pontos oficiais nem uma lista exaustiva de regras. Os três somam 100 para ilustrar um orçamento completo.",
    examples: [
      {
        signal: "Exposição a mixer (Origem / Atividade)",
        rule: "Interação com mixer = +50 pontos de risco",
      },
      {
        signal: "Idade do primeiro funding (Origem)",
        rule: "Idade menor que 1 ano = +20 pontos de risco",
      },
      {
        signal: "Concentração de contrapartes (Atividade)",
        rule: "HHI acima do limiar do Manual = +30 pontos",
      },
    ],
    accessTitle: "Acesso",
    accessBody:
      "Já disponível para clientes no dashboard. Em cada análise a pontuação de risco é calculada automaticamente segundo a matriz implantada. Contacte-nos para mais informação.",
    seeAnalisis: "Ver profundidades de análise",
    talkToTeam: "Contacte-nos",
  },
};

export function engineRiskForLocale(locale: string): EngineRiskPageCopy {
  return engineRiskByLocale[locale] ?? engineRiskByLocale.es;
}
