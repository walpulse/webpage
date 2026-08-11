export type CoverageLevel =
  | "high"
  | "mediumHigh"
  | "medium"
  | "low"
  | "none"
  | "aligned";

export type MapRow = {
  aspect: string;
  contribution: string;
  cert: string;
  /** Solo comparación Uruguay vs Circular. */
  level?: string;
  coverage?: CoverageLevel;
};

export type RegionContent = {
  title: string;
  message: string;
  problemTitle: string;
  problemLeadLabel: string;
  problemBody: string;
  problemCloseLabel: string;
  problemClose: string;
  /** Si está, la sección contexto muestra diagrama ampliable. */
  diagramAlt?: string;
  mapTitle: string;
  mapIntro?: string;
  mapHeaders: {
    aspect: string;
    contribution: string;
    cert: string;
    /** Solo Uruguay (cobertura vs Circular). */
    level?: string;
  };
  map: MapRow[];
  doesTitle: string;
  does: string[];
  doesNotTitle: string;
  doesNot: string[];
  benefitsTitle: string;
  benefits: string[];
};

export type ExchangesPageCopy = {
  regionLabel: string;
  regionHint: string;
  uruguayLabel: string;
  worldLabel: string;
  principle: string;
  talkToTeam: string;
  seeSignals: string;
  expandDiagram: string;
  closeDiagram: string;
  uy: RegionContent;
  row: RegionContent;
};

const circularHeadersEs = {
  aspect: "Lo que pide la circular",
  contribution: "Lo que aporta Walpulse",
  cert: "Certificado clave",
  level: "Cobertura",
};

const circularHeadersEn = {
  aspect: "What the circular requires",
  contribution: "What Walpulse contributes",
  cert: "Key certificate",
  level: "Coverage",
};

const circularHeadersPt = {
  aspect: "O que a circular pede",
  contribution: "O que a Walpulse aporta",
  cert: "Certificado chave",
  level: "Cobertura",
};

const sharedMapHeadersEs = {
  aspect: "Aspecto",
  contribution: "Aporte de Walpulse",
  cert: "Certificado clave",
};

const sharedMapHeadersEn = {
  aspect: "Aspect",
  contribution: "Walpulse contribution",
  cert: "Key certificate",
};

const sharedMapHeadersPt = {
  aspect: "Aspecto",
  contribution: "Contribuição da Walpulse",
  cert: "Certificado chave",
};

/** Uruguay: 8 aspectos vault (Señales actuales + Gap vs PSAV). */
const mapUyEs: MapRow[] = [
  {
    aspect: "Identificación del cliente / beneficiario final",
    contribution: "No cubre — solo recibe wallet_address",
    cert: "—",
    level: "Nula",
    coverage: "none",
  },
  {
    aspect: "Travel Rule",
    contribution: "No cubre",
    cert: "—",
    level: "Nula",
    coverage: "none",
  },
  {
    aspect: "Origen de los fondos",
    contribution: "Fuerte (tipo, concentración, mixing, labels)",
    cert: "Origins",
    level: "Alta",
    coverage: "high",
  },
  {
    aspect: "Perfil de actividad",
    contribution: "Buena (flujos, contrapartes, velocity, patrones)",
    cert: "Activity + Multichain",
    level: "Media-Alta",
    coverage: "mediumHigh",
  },
  {
    aspect: "Monitoreo de operaciones inusuales",
    contribution: "Buena en señales (wash, circular, bot-like, mixing)",
    cert: "Activity + Origins",
    level: "Media-Alta",
    coverage: "mediumHigh",
  },
  {
    aspect: "Enfoque basado en riesgo",
    contribution: "Apoyo (grades A–F + breakdown explicable)",
    cert: "Los 4 certificados",
    level: "Media",
    coverage: "medium",
  },
  {
    aspect: "Screening de listas oficiales",
    contribution:
      "Verifica la wallet y sus funders principales contra OFAC (señal de exposición; sin congelamiento)",
    cert: "Origins + Activity",
    level: "Media-Alta",
    coverage: "mediumHigh",
  },
  {
    aspect: "No dificultar la trazabilidad",
    contribution: "Cumple y refuerza — clasifica, no ofusca",
    cert: "Todos",
    level: "Alineado",
    coverage: "aligned",
  },
];

/** Resto del mundo: solo aportes reales (sin filas nulas ni columna cobertura). */
const mapWorldEs: MapRow[] = [
  {
    aspect: "Origen de los fondos",
    contribution: "Fuerte (tipo de origen, concentración, mixing, labels)",
    cert: "Origins",
  },
  {
    aspect: "Perfil de actividad",
    contribution: "Buena (flujos, contrapartes, velocity, patrones)",
    cert: "Activity + Multichain",
  },
  {
    aspect: "Monitoreo de operaciones inusuales",
    contribution: "Buena en señales (wash, circular, bot-like, mixing)",
    cert: "Activity + Origins",
  },
  {
    aspect: "Enfoque basado en riesgo",
    contribution: "Apoyo (grades A–F + breakdown explicable)",
    cert: "Los 4 certificados",
  },
  {
    aspect: "Screening oficial + congelamiento",
    contribution:
      "Señal OFAC sobre wallet y funders principales (exposición); el congelamiento queda en el exchange",
    cert: "Origins + Activity",
  },
];

const mapUyEn: MapRow[] = [
  {
    aspect: "Customer / beneficial-owner identification",
    contribution: "Not covered — wallet_address only",
    cert: "—",
    level: "None",
    coverage: "none",
  },
  {
    aspect: "Travel Rule",
    contribution: "Not covered",
    cert: "—",
    level: "None",
    coverage: "none",
  },
  {
    aspect: "Source of funds",
    contribution: "Strong (type, concentration, mixing, labels)",
    cert: "Origins",
    level: "High",
    coverage: "high",
  },
  {
    aspect: "Activity profile",
    contribution: "Good (flows, counterparties, velocity, patterns)",
    cert: "Activity + Multichain",
    level: "Medium-High",
    coverage: "mediumHigh",
  },
  {
    aspect: "Unusual activity monitoring",
    contribution: "Good as signals (wash, circular, bot-like, mixing)",
    cert: "Activity + Origins",
    level: "Medium-High",
    coverage: "mediumHigh",
  },
  {
    aspect: "Risk-based approach",
    contribution: "Support (A–F grades + explainable breakdown)",
    cert: "All 4 certificates",
    level: "Medium",
    coverage: "medium",
  },
  {
    aspect: "Official list screening",
    contribution:
      "Checks the wallet and its main funders against OFAC (exposure signal; no freezing)",
    cert: "Origins + Activity",
    level: "Medium-High",
    coverage: "mediumHigh",
  },
  {
    aspect: "Not obstructing traceability",
    contribution: "Aligned and reinforced — classifies, does not obfuscate",
    cert: "All",
    level: "Aligned",
    coverage: "aligned",
  },
];

const mapCoreEn: MapRow[] = [
  {
    aspect: "Source of funds",
    contribution: "Strong (origin type, concentration, mixing, labels)",
    cert: "Origins",
  },
  {
    aspect: "Activity profile",
    contribution: "Good (flows, counterparties, velocity, patterns)",
    cert: "Activity + Multichain",
  },
  {
    aspect: "Unusual activity monitoring",
    contribution: "Good as signals (wash, circular, bot-like, mixing)",
    cert: "Activity + Origins",
  },
  {
    aspect: "Risk-based approach",
    contribution: "Support (A–F grades + explainable breakdown)",
    cert: "All 4 certificates",
  },
  {
    aspect: "Official screening + freezing",
    contribution:
      "OFAC signal on wallet and main funders (exposure); freezing stays with the exchange",
    cert: "Origins + Activity",
  },
];

const mapUyPt: MapRow[] = [
  {
    aspect: "Identificação do cliente / beneficiário final",
    contribution: "Não cobre — apenas wallet_address",
    cert: "—",
    level: "Nula",
    coverage: "none",
  },
  {
    aspect: "Travel Rule",
    contribution: "Não cobre",
    cert: "—",
    level: "Nula",
    coverage: "none",
  },
  {
    aspect: "Origem dos fundos",
    contribution: "Forte (tipo, concentração, mixing, labels)",
    cert: "Origins",
    level: "Alta",
    coverage: "high",
  },
  {
    aspect: "Perfil de atividade",
    contribution: "Boa (fluxos, contrapartes, velocity, padrões)",
    cert: "Activity + Multichain",
    level: "Média-Alta",
    coverage: "mediumHigh",
  },
  {
    aspect: "Monitoramento de operações incomuns",
    contribution: "Boa em sinais (wash, circular, bot-like, mixing)",
    cert: "Activity + Origins",
    level: "Média-Alta",
    coverage: "mediumHigh",
  },
  {
    aspect: "Abordagem baseada em risco",
    contribution: "Apoio (grades A–F + breakdown explicável)",
    cert: "Os 4 certificados",
    level: "Média",
    coverage: "medium",
  },
  {
    aspect: "Screening de listas oficiais",
    contribution:
      "Verifica a wallet e seus funders principais contra OFAC (sinal de exposição; sem congelamento)",
    cert: "Origins + Activity",
    level: "Média-Alta",
    coverage: "mediumHigh",
  },
  {
    aspect: "Não dificultar a rastreabilidade",
    contribution: "Cumpre e reforça — classifica, não ofusca",
    cert: "Todos",
    level: "Alinhado",
    coverage: "aligned",
  },
];

const mapCorePt: MapRow[] = [
  {
    aspect: "Origem dos fundos",
    contribution: "Forte (tipo de origem, concentração, mixing, labels)",
    cert: "Origins",
  },
  {
    aspect: "Perfil de atividade",
    contribution: "Boa (fluxos, contrapartes, velocity, padrões)",
    cert: "Activity + Multichain",
  },
  {
    aspect: "Monitoramento de operações incomuns",
    contribution: "Boa em sinais (wash, circular, bot-like, mixing)",
    cert: "Activity + Origins",
  },
  {
    aspect: "Abordagem baseada em risco",
    contribution: "Apoio (grades A–F + breakdown explicável)",
    cert: "Os 4 certificados",
  },
  {
    aspect: "Screening oficial + congelamento",
    contribution:
      "Sinal OFAC sobre wallet e funders principais (exposição); o congelamento fica com o exchange",
    cert: "Origins + Activity",
  },
];

export const exchangesCopyByLocale: Record<string, ExchangesPageCopy> = {
  es: {
    regionLabel: "Elegí tu región",
    regionHint: "El contenido cambia según el marco regulatorio que te aplica.",
    uruguayLabel: "Uruguay",
    worldLabel: "Resto del mundo",
    principle: "Creamos y analizamos señales. El receptor decide.",
    talkToTeam: "Hablar con el equipo",
    seeSignals: "Ver detalle de señales",
    expandDiagram: "Ampliar diagrama",
    closeDiagram: "Cerrar",
    uy: {
      title: "Cripto Exchanges · Uruguay (PSAV)",
      message:
        "Entregamos señales on-chain verificables y explicables sobre origen de fondos, comportamiento y madurez de wallets, para que los PSAVs fortalezcan su evaluación de riesgo y su monitoreo, dentro de su propio marco de debida diligencia.",
      problemTitle: "El contexto",
      problemLeadLabel: "Marco normativo",
      problemBody:
        "La Circular N° 2507 incorpora el Título VII TER a la Recopilación de Normas del Mercado de Valores: es la primera regulación integral de servicios de activos virtuales en Uruguay, elaborada por la SSF y alineada a estándares GAFI/FATF. Alcance típico: intercambio, transferencia, custodia y servicios financieros vinculados a activos virtuales — con autorización previa, gobierno corporativo, PLA/FT/FP y protección al usuario.",
      problemCloseLabel: "Plazo y rol operativo",
      problemClose:
        "El régimen de autorización arranca el 1 de septiembre de 2026; quienes ya operan tienen ventana hasta el 31 de marzo de 2027 para solicitarla. En ese tránsito, la pregunta operativa no es solo “qué obliga la norma”, sino cómo el PSAV construye evidencia continua sobre wallets y flujos. La inteligencia on-chain aporta input verificable a esa debida diligencia; KYC, Travel Rule, screening oficial y reporting siguen siendo del PSAV.",
      diagramAlt: "Diagrama PSAV en Uruguay: cumplimiento y gestión de riesgo",
      mapTitle: "Walpulse vs Circular BCU N° 2507",
      mapIntro:
        "Comparación directa: qué exige el marco PSAV y qué aporta Walpulse como input on-chain. La identidad, el reporting formal y las decisiones de compliance quedan en el PSAV.",
      mapHeaders: circularHeadersEs,
      map: mapUyEs,
      doesTitle: "Qué hace Walpulse",
      does: [
        "Produce señales on-chain de reputación, madurez y riesgo de wallets (escala A–F).",
        "Entrega información verificable y explicable (el receptor puede auditar cómo se llegó a cada grade).",
        "Cubre especialmente: origen de fondos, comportamiento, presencia multi-cadena y calidad del portafolio.",
        "Sirve como input para que el PSAV enriquezca su propia evaluación de riesgo y su sistema de monitoreo.",
      ],
      doesNotTitle: "Qué no hace Walpulse",
      doesNot: [
        "No es un PSAV.",
        "No realiza KYC ni identifica a la persona detrás de la wallet.",
        "No ejecuta Travel Rule.",
        "No reporta a la UIAF.",
        "No ejecuta congelamiento ni screening normativo completo (p. ej. listas ONU + medidas formales).",
        "No toma decisiones de compliance ni clasifica clientes en categorías de riesgo regulatorio.",
        "No genera el informe formal ni el examen escrito que la norma exige al PSAV.",
      ],
      benefitsTitle: "Beneficios concretos",
      benefits: [
        "Evidencia on-chain estructurada sobre origen de fondos y comportamiento.",
        "Detección temprana de señales de riesgo (mixing, wash trading, bot-like, concentraciones anómalas).",
        "Enriquecimiento del perfil de actividad y del enfoque basado en riesgo con datos auditables.",
        "Trazabilidad: Walpulse no ofusca; clasifica y hace más visible el comportamiento.",
        "Integración como input del propio proceso de debida diligencia, sin transferir responsabilidad regulatoria.",
      ],
    },
    row: {
      title: "Para Cripto Exchanges",
      message:
        "Entregamos señales on-chain verificables y explicables sobre origen de fondos, comportamiento y madurez de wallets, para que exchanges fortalezcan evaluación de riesgo y monitoreo dentro de su propio marco.",
      problemTitle: "El contexto",
      problemLeadLabel: "El problema operativo",
      problemBody:
        "En un exchange, la wallet es la unidad observable, pero el riesgo atraviesa onboarding, depósitos, retiros y contrapartes. Sin una lectura estructurada del historial on-chain, las políticas internas suelen apoyarse en reglas genéricas o en revisiones puntuales que no escalan cuando el volumen y la complejidad cross-chain crecen.",
      problemCloseLabel: "Dónde entra Walpulse",
      problemClose:
        "El valor no está en externalizar la decisión: está en alimentar riesgo, monitoreo y due diligence con evidencia contextualizada que el equipo pueda auditar. Walpulse entrega ese input; el exchange conserva soberanía sobre umbrales, excepciones y el marco regulatorio que le aplica en su jurisdicción.",
      diagramAlt: "Diagrama: inteligencia on-chain para exchanges",
      mapTitle: "Cómo ayuda Walpulse",
      mapHeaders: sharedMapHeadersEs,
      map: mapWorldEs,
      doesTitle: "Qué hace Walpulse",
      does: [
        "Produce señales on-chain de reputación, madurez y riesgo de wallets (escala A–F).",
        "Entrega información verificable y explicable (el receptor puede auditar cómo se llegó a cada grade).",
        "Cubre especialmente: origen de fondos, comportamiento, presencia multi-cadena y calidad del portafolio.",
        "Sirve como input para que el exchange enriquezca su evaluación de riesgo y su monitoreo.",
      ],
      doesNotTitle: "Qué no hace Walpulse",
      doesNot: [
        "No es un exchange ni un proveedor de compliance regulado.",
        "No realiza KYC ni identifica a la persona detrás de la wallet.",
        "No ejecuta Travel Rule.",
        "No ejecuta congelamiento ni screening normativo completo (p. ej. listas ONU + medidas formales).",
        "No toma decisiones de compliance ni clasifica clientes en categorías regulatorias.",
        "No sustituye políticas, procedimientos ni determinaciones del receptor.",
      ],
      benefitsTitle: "Beneficios concretos",
      benefits: [
        "Evidencia on-chain estructurada sobre origen de fondos y comportamiento.",
        "Detección temprana de señales de riesgo (mixing, wash trading, bot-like, concentraciones anómalas).",
        "Enriquecimiento del perfil de actividad con grades A–F y breakdown explicable.",
        "Trazabilidad: Walpulse no ofusca; clasifica y hace más visible el comportamiento.",
        "Integración como input del proceso interno del exchange, sin transferir responsabilidad.",
      ],
    },
  },
  en: {
    regionLabel: "Choose your region",
    regionHint:
      "Content changes based on the regulatory frame that applies to you.",
    uruguayLabel: "Uruguay",
    worldLabel: "Rest of world",
    principle: "We create and analyze signals. The recipient decides.",
    talkToTeam: "Talk to the team",
    seeSignals: "See signal details",
    expandDiagram: "Expand diagram",
    closeDiagram: "Close",
    uy: {
      title: "Crypto Exchanges · Uruguay (VASP)",
      message:
        "We deliver verifiable, explainable on-chain signals on source of funds, behavior, and wallet maturity so VASPs can strengthen risk assessment and monitoring within their own due-diligence framework.",
      problemTitle: "The context",
      problemLeadLabel: "Regulatory frame",
      problemBody:
        "Circular No. 2507 adds Title VII TER to Uruguay’s securities-market rulebook: the first comprehensive virtual-asset services regime, drafted by the SSF and aligned with FATF standards. Typical scope includes exchange, transfer, custody, and related financial services — with prior authorization, governance, AML/CFT, and user protection.",
      problemCloseLabel: "Timeline and operating role",
      problemClose:
        "Authorization opens on 1 September 2026; operators already active have until 31 March 2027 to apply. In that transition, the operational question is not only what the rule requires, but how a VASP builds continuous evidence on wallets and flows. On-chain intelligence feeds that diligence with verifiable input; KYC, Travel Rule, official screening, and reporting remain the VASP’s responsibility.",
      diagramAlt: "PSAV in Uruguay diagram: compliance and risk management",
      mapTitle: "Walpulse vs BCU Circular No. 2507",
      mapIntro:
        "Direct comparison: what the VASP framework requires and what Walpulse contributes as on-chain input. Identity, formal reporting, and compliance decisions remain with the VASP.",
      mapHeaders: circularHeadersEn,
      map: mapUyEn,
      doesTitle: "What Walpulse does",
      does: [
        "Produces on-chain reputation, maturity, and risk signals for wallets (A–F scale).",
        "Delivers verifiable, explainable information (the recipient can audit how each grade was reached).",
        "Especially covers: source of funds, behavior, multi-chain presence, and portfolio quality.",
        "Serves as input so the VASP can enrich its own risk assessment and monitoring system.",
      ],
      doesNotTitle: "What Walpulse does not do",
      doesNot: [
        "It is not a VASP.",
        "It does not perform KYC or identify the person behind the wallet.",
        "It does not execute Travel Rule.",
        "It does not report to UIAF.",
        "It does not freeze assets or replace full regulatory screening (e.g. UN lists + formal measures).",
        "It does not make compliance decisions or classify customers into regulatory risk categories.",
        "It does not produce the formal report or written examination the regulation requires from the VASP.",
      ],
      benefitsTitle: "Concrete benefits",
      benefits: [
        "Structured on-chain evidence on source of funds and behavior.",
        "Early detection of risk signals (mixing, wash trading, bot-like activity, anomalous concentrations).",
        "Enrichment of the activity profile and risk-based approach with auditable data.",
        "Traceability: Walpulse does not obfuscate; it classifies and makes behavior more visible.",
        "Integration as input to the VASP’s own due-diligence process, without transferring regulatory responsibility.",
      ],
    },
    row: {
      title: "For Crypto Exchanges",
      message:
        "We deliver verifiable, explainable on-chain signals on source of funds, behavior, and wallet maturity so exchanges can strengthen risk assessment and monitoring within their own framework.",
      problemTitle: "The context",
      problemLeadLabel: "The operating problem",
      problemBody:
        "At an exchange, the wallet is the observable unit, but risk cuts across onboarding, deposits, withdrawals, and counterparties. Without a structured read of on-chain history, internal policies often lean on generic rules or one-off reviews that do not scale as volume and cross-chain complexity grow.",
      problemCloseLabel: "Where Walpulse fits",
      problemClose:
        "The value is not outsourcing the decision — it is feeding risk, monitoring, and due diligence with contextualized evidence teams can audit. Walpulse delivers that input; the exchange keeps sovereignty over thresholds, exceptions, and the regulatory frame that applies in its jurisdiction.",
      diagramAlt: "Diagram: on-chain intelligence for exchanges",
      mapTitle: "How Walpulse helps",
      mapHeaders: sharedMapHeadersEn,
      map: mapCoreEn,
      doesTitle: "What Walpulse does",
      does: [
        "Produces on-chain reputation, maturity, and risk signals for wallets (A–F scale).",
        "Delivers verifiable, explainable information (the recipient can audit how each grade was reached).",
        "Especially covers: source of funds, behavior, multi-chain presence, and portfolio quality.",
        "Serves as input so the exchange can enrich risk assessment and monitoring.",
      ],
      doesNotTitle: "What Walpulse does not do",
      doesNot: [
        "It is not an exchange or a regulated compliance provider.",
        "It does not perform KYC or identify the person behind the wallet.",
        "It does not execute Travel Rule.",
        "It does not freeze assets or replace full regulatory screening (e.g. UN lists + formal measures).",
        "It does not make compliance decisions or classify customers into regulatory categories.",
        "It does not replace the recipient’s policies, procedures, or determinations.",
      ],
      benefitsTitle: "Concrete benefits",
      benefits: [
        "Structured on-chain evidence on source of funds and behavior.",
        "Early detection of risk signals (mixing, wash trading, bot-like activity, anomalous concentrations).",
        "Enrichment of the activity profile with A–F grades and an explainable breakdown.",
        "Traceability: Walpulse does not obfuscate; it classifies and makes behavior more visible.",
        "Integration as input to the exchange’s internal process, without transferring responsibility.",
      ],
    },
  },
  pt: {
    regionLabel: "Escolha sua região",
    regionHint:
      "O conteúdo muda conforme o marco regulatório que se aplica a você.",
    uruguayLabel: "Uruguai",
    worldLabel: "Resto do mundo",
    principle: "Criamos e analisamos sinais. O receptor decide.",
    talkToTeam: "Falar com a equipe",
    seeSignals: "Ver detalhe dos sinais",
    expandDiagram: "Ampliar diagrama",
    closeDiagram: "Fechar",
    uy: {
      title: "Cripto Exchanges · Uruguai (PSAV)",
      message:
        "Entregamos sinais on-chain verificáveis e explicáveis sobre origem de fundos, comportamento e maturidade de wallets, para que os PSAVs fortaleçam sua avaliação de risco e monitoramento, dentro do seu próprio marco de due diligence.",
      problemTitle: "O contexto",
      problemLeadLabel: "Marco normativo",
      problemBody:
        "A Circular N° 2507 incorpora o Título VII TER à Recopilação de Normas do Mercado de Valores: é a primeira regulação integral de serviços de ativos virtuais no Uruguai, elaborada pela SSF e alinhada a padrões GAFI/FATF. Alcance típico: intercâmbio, transferência, custódia e serviços financeiros vinculados a ativos virtuais — com autorização prévia, governança, PLA/FT/FP e proteção ao usuário.",
      problemCloseLabel: "Prazo e papel operacional",
      problemClose:
        "O regime de autorização começa em 1º de setembro de 2026; quem já opera tem janela até 31 de março de 2027 para solicitar. Nessa transição, a pergunta operacional não é só “o que a norma obriga”, e sim como o PSAV constrói evidência contínua sobre wallets e fluxos. A inteligência on-chain aporta input verificável a essa due diligence; KYC, Travel Rule, screening oficial e reporting continuam sendo do PSAV.",
      diagramAlt: "Diagrama PSAV no Uruguai: conformidade e gestão de risco",
      mapTitle: "Walpulse vs Circular BCU N° 2507",
      mapIntro:
        "Comparação direta: o que o marco PSAV exige e o que a Walpulse aporta como input on-chain. Identidade, reporting formal e decisões de compliance ficam com o PSAV.",
      mapHeaders: circularHeadersPt,
      map: mapUyPt,
      doesTitle: "O que a Walpulse faz",
      does: [
        "Produz sinais on-chain de reputação, maturidade e risco de wallets (escala A–F).",
        "Entrega informação verificável e explicável (o receptor pode auditar como se chegou a cada grade).",
        "Cobre especialmente: origem de fundos, comportamento, presença multi-cadeia e qualidade do portfólio.",
        "Serve como input para o PSAV enriquecer sua avaliação de risco e seu sistema de monitoramento.",
      ],
      doesNotTitle: "O que a Walpulse não faz",
      doesNot: [
        "Não é um PSAV.",
        "Não realiza KYC nem identifica a pessoa por trás da wallet.",
        "Não executa Travel Rule.",
        "Não reporta à UIAF.",
        "Não executa congelamento nem screening normativo completo (p. ex. listas ONU + medidas formais).",
        "Não toma decisões de compliance nem classifica clientes em categorias regulatórias de risco.",
        "Não gera o relatório formal nem o exame escrito que a norma exige ao PSAV.",
      ],
      benefitsTitle: "Benefícios concretos",
      benefits: [
        "Evidência on-chain estruturada sobre origem de fundos e comportamento.",
        "Detecção precoce de sinais de risco (mixing, wash trading, bot-like, concentrações anômalas).",
        "Enriquecimento do perfil de atividade e da abordagem baseada em risco com dados auditáveis.",
        "Rastreabilidade: a Walpulse não ofusca; classifica e torna o comportamento mais visível.",
        "Integração como input do próprio processo de due diligence, sem transferir responsabilidade regulatória.",
      ],
    },
    row: {
      title: "Para Cripto Exchanges",
      message:
        "Entregamos sinais on-chain verificáveis e explicáveis sobre origem de fundos, comportamento e maturidade de wallets, para que exchanges fortaleçam avaliação de risco e monitoramento dentro do seu próprio marco.",
      problemTitle: "O contexto",
      problemLeadLabel: "O problema operacional",
      problemBody:
        "Num exchange, a wallet é a unidade observável, mas o risco atravessa onboarding, depósitos, saques e contrapartes. Sem uma leitura estruturada do histórico on-chain, as políticas internas costumam apoiar-se em regras genéricas ou revisões pontuais que não escalam quando o volume e a complexidade cross-chain crescem.",
      problemCloseLabel: "Onde a Walpulse entra",
      problemClose:
        "O valor não está em externalizar a decisão: está em alimentar risco, monitoramento e due diligence com evidência contextualizada que a equipe possa auditar. A Walpulse entrega esse input; o exchange mantém soberania sobre limiares, exceções e o marco regulatório que se aplica na sua jurisdição.",
      diagramAlt: "Diagrama: inteligência on-chain para exchanges",
      mapTitle: "Como a Walpulse ajuda",
      mapHeaders: sharedMapHeadersPt,
      map: mapCorePt,
      doesTitle: "O que a Walpulse faz",
      does: [
        "Produz sinais on-chain de reputação, maturidade e risco de wallets (escala A–F).",
        "Entrega informação verificável e explicável (o receptor pode auditar como se chegou a cada grade).",
        "Cobre especialmente: origem de fundos, comportamento, presença multi-cadeia e qualidade do portfólio.",
        "Serve como input para o exchange enriquecer avaliação de risco e monitoramento.",
      ],
      doesNotTitle: "O que a Walpulse não faz",
      doesNot: [
        "Não é um exchange nem um provedor de compliance regulado.",
        "Não realiza KYC nem identifica a pessoa por trás da wallet.",
        "Não executa Travel Rule.",
        "Não executa congelamento nem screening normativo completo (p. ex. listas ONU + medidas formais).",
        "Não toma decisões de compliance nem classifica clientes em categorias regulatórias.",
        "Não substitui políticas, procedimentos nem determinações do receptor.",
      ],
      benefitsTitle: "Benefícios concretos",
      benefits: [
        "Evidência on-chain estruturada sobre origem de fundos e comportamento.",
        "Detecção precoce de sinais de risco (mixing, wash trading, bot-like, concentrações anômalas).",
        "Enriquecimento do perfil de atividade com grades A–F e breakdown explicável.",
        "Rastreabilidade: a Walpulse não ofusca; classifica e torna o comportamento mais visível.",
        "Integração como input do processo interno do exchange, sem transferir responsabilidade.",
      ],
    },
  },
};
