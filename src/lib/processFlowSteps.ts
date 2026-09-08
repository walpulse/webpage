export type ProcessFlowStep = {
  title: string;
  body: string;
};

export type ProcessFlowCopy = {
  stepsTitle: string;
  steps: ProcessFlowStep[];
};

/**
 * Inline locale maps — next-intl can serve stale `comoFunciona.steps` under Turbopack.
 * Keep in sync with `src/messages/{es,en,pt}.json` → `comoFunciona.steps`.
 */
export const processFlowByLocale: Record<string, ProcessFlowCopy> = {
  es: {
    stepsTitle: "El proceso",
    steps: [
      {
        title: "Input",
        body: "Se recibe una dirección de wallet y el tier del análisis.",
      },
      {
        title: "Análisis on-chain",
        body: "Se calculan las señales incluidas en cada tier con la cobertura correspondiente.",
      },
      {
        title: "Señales + síntesis",
        body:
          "Salen las señales con breakdown auditable. El grade A–F compuesto es secundario y está atado al tier.",
      },
      {
        title: "Uso por el receptor",
        body:
          "Exchange, fondo, investigador u otro actor interpreta las señales y toma sus propias determinaciones.",
      },
    ],
  },
  en: {
    stepsTitle: "The process",
    steps: [
      {
        title: "Input",
        body: "A wallet address and the analysis tier are received.",
      },
      {
        title: "On-chain analysis",
        body: "The signals included in each tier are computed with the matching coverage.",
      },
      {
        title: "Signals + synthesis",
        body:
          "Signals come out with an auditable breakdown. The composite A–F grade is secondary and tied to the tier.",
      },
      {
        title: "Use by the recipient",
        body:
          "An exchange, fund, investigator, or other actor interprets the signals and makes their own determinations.",
      },
    ],
  },
  pt: {
    stepsTitle: "O processo",
    steps: [
      {
        title: "Input",
        body: "Recebe-se um endereço de wallet e o tier da análise.",
      },
      {
        title: "Análise on-chain",
        body: "Calculam-se os sinais incluídos em cada tier com a cobertura correspondente.",
      },
      {
        title: "Sinais + síntese",
        body:
          "Saem os sinais com breakdown auditável. O grade A–F composto é secundário e está atado ao tier.",
      },
      {
        title: "Uso pelo receptor",
        body:
          "Exchange, fundo, investigador ou outro ator interpreta os sinais e toma as próprias determinações.",
      },
    ],
  },
};

export function processFlowForLocale(locale: string): ProcessFlowCopy {
  return processFlowByLocale[locale] ?? processFlowByLocale.es;
}
