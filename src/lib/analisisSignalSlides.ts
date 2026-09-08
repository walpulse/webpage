export type AnalisisSignalRow = {
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
  slides: AnalisisSignalSlide[];
};

/** Root-level custody signal (sibling of synthesis; not a fifth SKU). */
export type AnalisisCustodyCopy = {
  title: string;
  intro: string;
  nameCol: string;
  meaningCol: string;
  lead: string;
  rows: AnalisisSignalRow[];
};

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
    slides: [
      {
        id: "multichain",
        title: "Presencia del ecosistema",
        lead: "Mapa de en qué redes aparece la billetera, con qué continuidad y —en Estándar/Experta— con cuánta intensidad opera entre cadenas. Entra en las tres profundidades.",
        rows: [
          {
            name: "Cantidad de redes con actividad",
            meaning:
              "Cuántas blockchains distintas muestran huella de la wallet. Más redes pueden indicar operación diversificada o mayor superficie a revisar.",
          },
          {
            name: "Antigüedad de la actividad multi-red",
            meaning:
              "Desde cuándo hay rastro on-chain en el conjunto de redes. Ayuda a distinguir wallets nuevas de trayectorias largas.",
          },
          {
            name: "Redes activas recientes",
            meaning:
              "En cuáles redes hubo movimiento en ventanas de 30 y 90 días. Separa presencia histórica de uso actual.",
          },
          {
            name: "Proporción de redes dormidas",
            meaning:
              "Cuánto del footprint está inactivo. Útil para no sobreinterpretar redes antiguas sin movimiento reciente.",
          },
          {
            name: "Consistencia entre redes",
            meaning:
              "Si el comportamiento se reparte de forma estable entre cadenas. En Básica no siempre está disponible (solo footprint de presencia).",
          },
          {
            name: "Recencia de la última actividad",
            meaning:
              "Qué tan reciente es el último rastro relevante. Informa si la wallet sigue operativa o parece abandonada.",
          },
          {
            name: "Presencia en ecosistemas centrales",
            meaning:
              "Si opera en redes de referencia del mercado. Aporta contexto de madurez y tipo de entorno.",
          },
          {
            name: "Concentración del footprint",
            meaning:
              "Si la historia multi-red está repartida o dominada por pocas cadenas. Alta concentración reduce la lectura “multi-ecosistema”.",
          },
          {
            name: "Longevidad por red",
            meaning:
              "Señales de permanencia en cadenas concretas: wallets “de paso” vs. presencia sostenida.",
          },
          {
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
            name: "Valor total usable y creíble",
            meaning:
              "Cuánto valor económico se observa, distinguiendo totales usables de lecturas “creíbles” que filtran valuaciones absurdas.",
          },
          {
            name: "Líquido vs. bloqueado",
            meaning:
              "Qué parte del patrimonio está disponible de inmediato y qué parte está comprometida o locked.",
          },
          {
            name: "Concentración de holdings",
            meaning:
              "Si el valor depende de pocos activos o está más diversificado. Alta concentración implica más sensibilidad a un solo token.",
          },
          {
            name: "Posiciones efectivas",
            meaning:
              "Cuántas posiciones realmente importan en la foto económica, más allá del ruido de micro-holdings.",
          },
          {
            name: "Mix stablecoins / bluechips / memecoins",
            meaning:
              "Perfil de riesgo del portafolio: más estable y bluechip vs. más especulativo.",
          },
          {
            name: "Exposición DeFi y liquidez proveída",
            meaning:
              "Participación en protocolos y posiciones de liquidez. Informa complejidad operativa y riesgos de smart contract.",
          },
          {
            name: "Polvo y spam",
            meaning:
              "Proporción de holdings irrelevantes o basura. Ayuda a no inflar la lectura con tokens sin valor útil.",
          },
          {
            name: "Protocolos tocados",
            meaning:
              "Con cuántos protocolos distintos interactúa el portafolio. Más superficie puede sumar sofisticación o riesgo.",
          },
          {
            name: "Buffer de gas nativo",
            meaning:
              "Si conserva saldo nativo suficiente para operar. Una wallet “rica” sin gas puede quedar operativa limitada.",
          },
          {
            name: "Compromiso en activos locked",
            meaning:
              "Qué tan comprometido está el capital en posiciones no líquidas a corto plazo.",
          },
        ],
      },
      {
        id: "origins",
        title: "Origen de los fondos",
        lead: "De dónde vinieron los fondos, con qué diversidad y con qué indicios de riesgo en la procedencia. La profundidad de hops (0 / 1 / 2) depende del tier.",
        rows: [
          {
            name: "Composición por tipo de origen",
            meaning:
              "Qué porcentaje llega desde exchanges, bridges, mixers, direcciones asociadas a sanciones conocidas, airdrops u origen orgánico. El informe también resume el mix por clase de entidad etiquetada (exchange etiquetado, DeFi, mixer, sanciones conocidas, bridge, airdrop, sin etiqueta) — etiquetado de catálogo, no «exchange regulado».",
          },
          {
            name: "Remitentes únicos",
            meaning:
              "Cuántas wallets distintas aportaron fondos. Pocos remitentes vs. muchos cambia la lectura de dependencia.",
          },
          {
            name: "Concentración del fondeo",
            meaning:
              "Si el valor entrante está repartido o dominado por pocas fuentes (HHI y peso del top-1 / top-3).",
          },
          {
            name: "Calidad de los exchanges de origen",
            meaning:
              "Cuando el fondeo pasa por CEX etiquetado, qué tan sólidos o conocidos son esos venues.",
          },
          {
            name: "Depósitos CEX inferidos (Estándar/Experta)",
            meaning:
              "Fondeadores que no están en el catálogo CEX pero consolidan hacia una hot wallet curada: se señalan aparte del CEX ya etiquetado. Habla de procedencia del fondeo, no de la wallet objetivo.",
          },
          {
            name: "Ritmo temporal del fondeo",
            meaning:
              "Si los fondos entraron de golpe, en oleadas o de forma gradual. Patrones abruptos pueden merecer más atención.",
          },
          {
            name: "Exposición a mixers y sanciones",
            meaning:
              "Indicios de contacto con mixers o direcciones asociadas a listas OFAC conocidas. Señal de exposición, no screening oficial.",
          },
          {
            name: "Orgánico vs. sintético",
            meaning:
              "Peso de actividad económica real frente a orígenes más sintéticos (airdrops, NFT, etc.).",
          },
          {
            name: "Antigüedad del primer fondeo",
            meaning:
              "Hace cuánto recibió los primeros fondos relevantes. Contextúa wallets recién fondeadas vs. trayectorias maduras.",
          },
          {
            name: "Cobertura de pricing",
            meaning:
              "Qué proporción del valor entrante pudo valuarse en USD. Baja cobertura hace más prudente la lectura de concentración.",
          },
          {
            name: "Hops / fondeadores analizados",
            meaning:
              "Según profundidad: Básica sin hops; Estándar hop-1 sobre top fondeadores; Experta hops a dos niveles. Contexto de procedencia, no veredicto.",
          },
        ],
      },
      {
        id: "activity",
        title: "Actividad reciente",
        lead: "Cómo se comporta la wallet en la ventana del tier (15 / 45 / 90 días): con quién opera, con qué ritmo y con qué calidad de interacción. En Experta se suma Activity light sobre top contrapartes.",
        rows: [
          {
            name: "Contrapartes únicas",
            meaning:
              "Con cuántas wallets distintas interactúa. Habla de red de contactos vs. operación cerrada.",
          },
          {
            name: "Concentración de contrapartes",
            meaning:
              "Si el flujo se reparte entre muchos peers o se concentra en pocos (HHI).",
          },
          {
            name: "Interacción con exchanges",
            meaning:
              "Qué proporción del valor y de las transacciones toca CEX. Informa on/off-ramp y uso de venues centralizados.",
          },
          {
            name: "Reciprocidad de flujos",
            meaning:
              "Cuánto del movimiento es ida-y-vuelta con las mismas contrapartes.",
          },
          {
            name: "Balance neto vs. volumen bruto",
            meaning:
              "Si hay mucho movimiento con poco cambio neto. Útil para detectar rotación intensa sin acumulación clara.",
          },
          {
            name: "Velocidad y ráfagas",
            meaning:
              "Ritmo diario de operaciones y si llegan en ráfagas concentradas (posible automatización o campañas).",
          },
          {
            name: "Diversidad de tokens",
            meaning:
              "Variedad de activos en los movimientos. Perfiles mono-token vs. operatorias más amplias.",
          },
          {
            name: "Patrones wash / circulares / bot-like",
            meaning:
              "Indicios de lavado de volumen, circuitos cerrados o automatización. Señales de alerta temprana, no prueba forense.",
          },
          {
            name: "Mix NFT vs. tokens fungibles",
            meaning:
              "Cuánto del flujo es NFT frente a fungibles. Cambia el contexto de uso.",
          },
          {
            name: "Exposiciones por categoría de contraparte",
            meaning:
              "Peso del valor hacia OFAC / mixer / bridge / airdrop / protocolo conocidos. Señal histórica de exposición, no screening oficial.",
          },
          {
            name: "Calidad de contratos (Sourcify)",
            meaning:
              "Qué proporción de contratos tocados está verificada en Sourcify vs. no verificados.",
          },
          {
            name: "Contrapartes etiquetadas (Kleros / Spellbook)",
            meaning:
              "Qué parte de las contrapartes (peers) lleva etiquetas de reputación on-chain conocidas. Solo Estándar y Experta para Kleros. Contexto informativo, no screening oficial.",
          },
          {
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
    slides: [
      {
        id: "multichain",
        title: "Ecosystem presence",
        lead: "A map of which networks the wallet appears on, how continuous that presence is, and —in Standard/Expert— how intensely it operates across chains. Included in all three depths.",
        rows: [
          {
            name: "Number of networks with activity",
            meaning:
              "How many distinct blockchains show a footprint. More networks can mean diversified operations or a wider surface to review.",
          },
          {
            name: "Multi-network activity age",
            meaning:
              "How long on-chain traces exist across networks. Helps separate brand-new wallets from longer trajectories.",
          },
          {
            name: "Recently active networks",
            meaning:
              "Which networks show movement in 30- and 90-day windows. Separates historical presence from current use.",
          },
          {
            name: "Share of dormant networks",
            meaning:
              "How much of the footprint is inactive. Avoids over-reading old networks with no recent activity.",
          },
          {
            name: "Consistency across networks",
            meaning:
              "Whether behavior is stably distributed across chains. In Basic it is not always available (presence footprint only).",
          },
          {
            name: "Recency of latest activity",
            meaning:
              "How recent the last relevant trace is. Indicates whether the wallet still looks active or abandoned.",
          },
          {
            name: "Presence in core ecosystems",
            meaning:
              "Whether it operates on market-reference networks. Adds maturity and environment context.",
          },
          {
            name: "Footprint concentration",
            meaning:
              "Whether multi-network history is spread out or dominated by a few chains.",
          },
          {
            name: "Longevity per network",
            meaning:
              "Signals of lasting presence on specific chains versus pass-through behavior.",
          },
          {
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
            name: "Total usable and credible value",
            meaning:
              "How much economic value is observed, separating usable totals from “credible” readings that filter absurd valuations.",
          },
          {
            name: "Liquid vs. locked",
            meaning:
              "How much of the holdings is immediately available versus committed or locked.",
          },
          {
            name: "Holdings concentration",
            meaning:
              "Whether value depends on a few assets or is more diversified.",
          },
          {
            name: "Effective positions",
            meaning:
              "How many positions truly matter in the economic picture beyond micro-holding noise.",
          },
          {
            name: "Stablecoin / bluechip / memecoin mix",
            meaning:
              "Portfolio risk profile: more stable and bluechip versus more speculative.",
          },
          {
            name: "DeFi and provided liquidity",
            meaning:
              "Participation in protocols and LP positions. Informs operational complexity and smart-contract risk.",
          },
          {
            name: "Dust and spam",
            meaning:
              "Share of irrelevant or junk holdings. Avoids inflating the reading with tokens of little use.",
          },
          {
            name: "Protocols touched",
            meaning:
              "How many distinct protocols the portfolio interacts with.",
          },
          {
            name: "Native gas buffer",
            meaning:
              "Whether it keeps enough native balance to operate. A “rich” wallet without gas can be operationally limited.",
          },
          {
            name: "Locked commitment",
            meaning:
              "How committed capital is in positions that are not liquid in the short term.",
          },
        ],
      },
      {
        id: "origins",
        title: "Origin of funds",
        lead: "Where funds came from, how diverse that provenance is, and what risk indicators appear. Hop depth (0 / 1 / 2) depends on the tier.",
        rows: [
          {
            name: "Composition by origin type",
            meaning:
              "What share arrives from exchanges, bridges, mixers, addresses tied to known sanctions, airdrops, or organic sources. The report also summarizes the mix by labeled entity class (labeled exchange, DeFi, mixer, known sanctions, bridge, airdrop, unlabeled) — catalog labels, not a “regulated exchange” claim.",
          },
          {
            name: "Unique senders",
            meaning:
              "How many distinct wallets contributed funds. Few versus many changes the dependency reading.",
          },
          {
            name: "Funding concentration",
            meaning:
              "Whether inbound value is spread out or dominated by a few sources (HHI and top-1 / top-3 weight).",
          },
          {
            name: "Origin exchange quality",
            meaning:
              "When funding flows through labeled CEX venues, how solid or well-known those venues look.",
          },
          {
            name: "Inferred CEX deposits (Standard/Expert)",
            meaning:
              "Funders not in the CEX catalog that consolidate toward a curated hot wallet: flagged separately from already-labeled CEX. About funding provenance, not the subject wallet.",
          },
          {
            name: "Temporal funding pattern",
            meaning:
              "Whether funds arrived in a burst, in waves, or gradually.",
          },
          {
            name: "Mixer and sanctions exposure",
            meaning:
              "Signs of contact with mixers or addresses tied to known OFAC lists. Exposure signal, not official screening.",
          },
          {
            name: "Organic vs. synthetic",
            meaning:
              "Weight of real economic activity versus more synthetic origins (airdrops, NFTs, etc.).",
          },
          {
            name: "Age of first funding",
            meaning:
              "How long ago the first relevant funds arrived. Context for newly funded wallets versus mature trajectories.",
          },
          {
            name: "Pricing coverage",
            meaning:
              "What share of inbound value could be priced in USD. Low coverage makes concentration readings more conservative.",
          },
          {
            name: "Hops / analyzed funders",
            meaning:
              "By depth: Basic has no hops; Standard hop-1 on top funders; Expert two-level hops. Provenance context, not a verdict.",
          },
        ],
      },
      {
        id: "activity",
        title: "Recent activity",
        lead: "How the wallet behaves in the tier window (15 / 45 / 90 days): who it deals with, at what pace, and with what interaction quality. Expert adds Activity light on top counterparties.",
        rows: [
          {
            name: "Unique counterparties",
            meaning:
              "How many distinct wallets it interacts with. Speaks to contact network versus closed operation.",
          },
          {
            name: "Counterparty concentration",
            meaning:
              "Whether flow is spread across many peers or concentrated in a few (HHI).",
          },
          {
            name: "Exchange interaction",
            meaning:
              "What share of value and transactions touches CEX venues.",
          },
          {
            name: "Flow reciprocity",
            meaning:
              "How much movement is round-trip with the same counterparties.",
          },
          {
            name: "Net vs. gross volume",
            meaning:
              "Whether there is heavy movement with little net change.",
          },
          {
            name: "Velocity and bursts",
            meaning:
              "Daily transaction pace and whether activity arrives in concentrated bursts.",
          },
          {
            name: "Token diversity",
            meaning:
              "Variety of assets in the movements.",
          },
          {
            name: "Wash / circular / bot-like patterns",
            meaning:
              "Signs of volume washing, closed circuits, or automation. Early-warning signals, not forensic proof.",
          },
          {
            name: "NFT vs. fungible mix",
            meaning:
              "How much of the flow is NFT versus fungible tokens.",
          },
          {
            name: "Counterparty category exposures",
            meaning:
              "Value weight toward known OFAC / mixer / bridge / airdrop / protocol labels. Historical exposure signal, not official screening.",
          },
          {
            name: "Contract quality (Sourcify)",
            meaning:
              "What share of touched contracts is verified on Sourcify versus unverified.",
          },
          {
            name: "Labeled counterparties (Kleros / Spellbook)",
            meaning:
              "What share of counterparties (peers) carries known on-chain reputation labels. Kleros only in Standard and Expert. Informational context, not official screening.",
          },
          {
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
    slides: [
      {
        id: "multichain",
        title: "Presença do ecossistema",
        lead: "Mapa de em quais redes a carteira aparece, com que continuidade e —em Standard/Expert— com quanta intensidade opera entre cadeias. Entra nas três profundidades.",
        rows: [
          {
            name: "Quantidade de redes com atividade",
            meaning:
              "Quantas blockchains distintas mostram pegada da wallet. Mais redes podem indicar operação diversificada ou maior superfície a revisar.",
          },
          {
            name: "Antiguidade da atividade multi-rede",
            meaning:
              "Desde quando há rastros on-chain no conjunto de redes. Ajuda a distinguir wallets novas de trajetórias longas.",
          },
          {
            name: "Redes ativas recentes",
            meaning:
              "Em quais redes houve movimento nas janelas de 30 e 90 dias. Separa presença histórica de uso atual.",
          },
          {
            name: "Proporção de redes dormentes",
            meaning:
              "Quanto do footprint está inativo. Evita sobreinterpretar redes antigas sem movimento recente.",
          },
          {
            name: "Consistência entre redes",
            meaning:
              "Se o comportamento se reparte de forma estável entre cadeias. Em Básica nem sempre está disponível (só footprint de presença).",
          },
          {
            name: "Recência da última atividade",
            meaning:
              "Quão recente é o último rastro relevante. Indica se a wallet ainda parece operativa ou abandonada.",
          },
          {
            name: "Presença em ecossistemas centrais",
            meaning:
              "Se opera em redes de referência do mercado. Aporta contexto de maturidade e tipo de ambiente.",
          },
          {
            name: "Concentração do footprint",
            meaning:
              "Se a história multi-rede está repartida ou dominada por poucas cadeias.",
          },
          {
            name: "Longevidade por rede",
            meaning:
              "Sinais de permanência em cadeias concretas: wallets “de passagem” vs. presença sustentada.",
          },
          {
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
            name: "Valor total utilizável e credível",
            meaning:
              "Quanto valor econômico se observa, distinguindo totais utilizáveis de leituras “credíveis” que filtram valorações absurdas.",
          },
          {
            name: "Líquido vs. bloqueado",
            meaning:
              "Que parte do patrimônio está disponível de imediato e que parte está comprometida ou locked.",
          },
          {
            name: "Concentração de holdings",
            meaning:
              "Se o valor depende de poucos ativos ou está mais diversificado.",
          },
          {
            name: "Posições efetivas",
            meaning:
              "Quantas posições realmente importam na foto econômica, além do ruído de micro-holdings.",
          },
          {
            name: "Mix stablecoins / bluechips / memecoins",
            meaning:
              "Perfil de risco do portfólio: mais estável e bluechip vs. mais especulativo.",
          },
          {
            name: "Exposição DeFi e liquidez provida",
            meaning:
              "Participação em protocolos e posições de liquidez. Informa complexidade operativa e risco de smart contract.",
          },
          {
            name: "Poeira e spam",
            meaning:
              "Proporção de holdings irrelevantes ou lixo. Evita inflar a leitura com tokens sem valor útil.",
          },
          {
            name: "Protocolos tocados",
            meaning:
              "Com quantos protocolos distintos o portfólio interage.",
          },
          {
            name: "Buffer de gas nativo",
            meaning:
              "Se mantém saldo nativo suficiente para operar.",
          },
          {
            name: "Compromisso em ativos locked",
            meaning:
              "Quão comprometido está o capital em posições pouco líquidas no curto prazo.",
          },
        ],
      },
      {
        id: "origins",
        title: "Origem dos fundos",
        lead: "De onde vieram os fundos, com que diversidade e com que indícios de risco na procedência. A profundidade de hops (0 / 1 / 2) depende do tier.",
        rows: [
          {
            name: "Composição por tipo de origem",
            meaning:
              "Que percentagem chega de exchanges, bridges, mixers, endereços associados a sanções conhecidas, airdrops ou origem orgânica. O relatório também resume o mix por classe de entidade etiquetada (exchange etiquetado, DeFi, mixer, sanções conhecidas, bridge, airdrop, sem etiqueta) — etiquetagem de catálogo, não «exchange regulado».",
          },
          {
            name: "Remetentes únicos",
            meaning:
              "Quantas wallets distintas aportaram fundos.",
          },
          {
            name: "Concentração do funding",
            meaning:
              "Se o valor entrante está repartido ou dominado por poucas fontes (HHI e peso do top-1 / top-3).",
          },
          {
            name: "Qualidade dos exchanges de origem",
            meaning:
              "Quando o funding passa por CEX etiquetado, quão sólidos ou conhecidos são esses venues.",
          },
          {
            name: "Depósitos CEX inferidos (Standard/Expert)",
            meaning:
              "Financiadores que não estão no catálogo CEX mas consolidam para uma hot wallet curada: sinalizados à parte do CEX já etiquetado. Fala da procedência do funding, não da wallet objetivo.",
          },
          {
            name: "Ritmo temporal do funding",
            meaning:
              "Se os fundos entraram de uma vez, em ondas ou de forma gradual.",
          },
          {
            name: "Exposição a mixers e sanções",
            meaning:
              "Indícios de contacto com mixers ou endereços associados a listas OFAC conhecidas. Sinal de exposição, não screening oficial.",
          },
          {
            name: "Orgânico vs. sintético",
            meaning:
              "Peso de atividade econômica real frente a origens mais sintéticas (airdrops, NFT, etc.).",
          },
          {
            name: "Antiguidade do primeiro funding",
            meaning:
              "Há quanto tempo recebeu os primeiros fundos relevantes.",
          },
          {
            name: "Cobertura de pricing",
            meaning:
              "Que proporção do valor entrante pôde ser valuada em USD. Baixa cobertura torna a leitura de concentração mais prudente.",
          },
          {
            name: "Hops / financiadores analisados",
            meaning:
              "Segundo a profundidade: Básica sem hops; Standard hop-1 sobre top financiadores; Expert hops em dois níveis. Contexto de procedência, não veredito.",
          },
        ],
      },
      {
        id: "activity",
        title: "Atividade recente",
        lead: "Como a wallet se comporta na janela do tier (15 / 45 / 90 dias): com quem opera, com que ritmo e com que qualidade de interação. Em Expert soma-se Activity light sobre top contrapartes.",
        rows: [
          {
            name: "Contrapartes únicas",
            meaning:
              "Com quantas wallets distintas interage.",
          },
          {
            name: "Concentração de contrapartes",
            meaning:
              "Se o fluxo se reparte entre muitos peers ou se concentra em poucos (HHI).",
          },
          {
            name: "Interação com exchanges",
            meaning:
              "Que proporção do valor e das transações toca CEX.",
          },
          {
            name: "Reciprocidade de fluxos",
            meaning:
              "Quanto do movimento é ida-e-volta com as mesmas contrapartes.",
          },
          {
            name: "Saldo líquido vs. volume bruto",
            meaning:
              "Se há muito movimento com pouca mudança líquida.",
          },
          {
            name: "Velocidade e rajadas",
            meaning:
              "Ritmo diário de operações e se chegam em rajadas concentradas.",
          },
          {
            name: "Diversidade de tokens",
            meaning:
              "Variedade de ativos nos movimentos.",
          },
          {
            name: "Padrões wash / circulares / bot-like",
            meaning:
              "Indícios de lavagem de volume, circuitos fechados ou automação. Sinais de alerta precoce, não prova forense.",
          },
          {
            name: "Mix NFT vs. fungíveis",
            meaning:
              "Quanto do fluxo é NFT frente a fungíveis.",
          },
          {
            name: "Exposições por categoria de contraparte",
            meaning:
              "Peso do valor para OFAC / mixer / bridge / airdrop / protocolo conhecidos. Sinal histórico de exposição, não screening oficial.",
          },
          {
            name: "Qualidade de contratos (Sourcify)",
            meaning:
              "Que proporção dos contratos tocados está verificada no Sourcify vs. não verificados.",
          },
          {
            name: "Contrapartes etiquetadas (Kleros / Spellbook)",
            meaning:
              "Que parte das contrapartes (peers) leva etiquetas de reputação on-chain conhecidas. Kleros só em Standard e Expert. Contexto informativo, não screening oficial.",
          },
          {
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
    lead: "Complementa el origen de los fondos con una lectura del tipo de wallet objetivo. El receptor interpreta; no es prueba de quién controla las claves.",
    rows: [
      {
        name: "Clase y probabilidad hosted / unhosted",
        meaning:
          "Clases como hosted conocido, depósito inferido, unhosted aparente o desconocido, con porcentajes de confianza. Señal explicable, no veredicto binario.",
      },
      {
        name: "Profundidad según el tier",
        meaning:
          "Básica: lookup del sujeto en el catálogo CEX. Estándar y Experta: más barrido hacia hot wallets CEX y score comportamental residual.",
      },
      {
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
    lead: "Complements fund origins with a read of the subject wallet type. The recipient interprets; it is not proof of who controls the keys.",
    rows: [
      {
        name: "Hosted / unhosted class and probability",
        meaning:
          "Classes such as known hosted, inferred deposit, likely unhosted, or unknown, with confidence percentages. An explainable signal, not a binary verdict.",
      },
      {
        name: "Depth by tier",
        meaning:
          "Basic: CEX-catalog lookup of the subject. Standard and Expert: plus sweep toward CEX hot wallets and a residual behavioral score.",
      },
      {
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
    lead: "Complementa a origem dos fundos com uma leitura do tipo de wallet objetivo. O receptor interpreta; não é prova de quem controla as chaves.",
    rows: [
      {
        name: "Classe e probabilidade hosted / unhosted",
        meaning:
          "Classes como hosted conhecido, depósito inferido, unhosted aparente ou desconhecido, com percentagens de confiança. Sinal explicável, não veredito binário.",
      },
      {
        name: "Profundidade conforme o tier",
        meaning:
          "Básica: lookup do sujeito no catálogo CEX. Standard e Expert: mais varredura para hot wallets CEX e score comportamental residual.",
      },
      {
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
