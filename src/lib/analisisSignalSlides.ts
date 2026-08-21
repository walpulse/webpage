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

/**
 * Internal signals as business copy (vault Catálogo de servicios).
 * No field names, providers, or formula jargon.
 */
export const analisisSignalsByLocale: Record<string, AnalisisSignalsCopy> = {
  es: {
    title: "Qué miramos dentro de cada señal",
    intro:
      "Cada parte del análisis se construye con señales internas que el receptor puede leer y auditar. A continuación explicamos qué miden y qué información transmiten para que el receptor tome una decisión informada.",
    prev: "Señal anterior",
    next: "Señal siguiente",
    tabsLabel: "Partes del análisis",
    nameCol: "Señal interna",
    meaningCol: "Qué aporta a la decisión",
    slides: [
      {
        id: "multichain",
        title: "Presencia del ecosistema",
        lead: "Mapa de en qué redes aparece la billetera, con qué continuidad y con cuánta intensidad opera entre cadenas.",
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
              "En cuáles redes hubo movimiento en ventanas cortas (por ejemplo 30 o 90 días). Separa presencia histórica de uso actual.",
          },
          {
            name: "Proporción de redes dormidas",
            meaning:
              "Cuánto del footprint está inactivo. Útil para no sobreinterpretar redes antiguas sin movimiento reciente.",
          },
          {
            name: "Consistencia entre redes",
            meaning:
              "Si el comportamiento se reparte de forma estable o se concentra de manera irregular entre cadenas.",
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
              "En profundidades Estándar y Experta: volumen e intensidad de transacciones entre cadenas, red principal y peso relativo. En Básica el foco es el footprint de presencia.",
          },
        ],
      },
      {
        id: "portfolio",
        title: "Calidad del portafolio",
        lead: "Foto económica de lo que sostiene la wallet: valor, liquidez, composición y señales de riesgo asociadas a los holdings.",
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
              "Participación en protocolos y posiciones de liquidez. Informa complejidad operativa y riesgos de smart contract / IL.",
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
          {
            name: "Exposición a sanciones conocidas",
            meaning:
              "Si la wallet objetivo aparece asociada a labels/direcciones OFAC conocidos. Es señal de exposición, no screening oficial ni veredicto.",
          },
        ],
      },
      {
        id: "origins",
        title: "Origen de los fondos",
        lead: "De dónde vinieron los fondos, con qué diversidad y con qué indicios de riesgo en la procedencia.",
        rows: [
          {
            name: "Composición por tipo de origen",
            meaning:
              "Qué porcentaje llega desde exchanges, bridges, mixers, direcciones sancionadas, airdrops u origen orgánico. Define el “sabor” del fondeo.",
          },
          {
            name: "Remitentes únicos",
            meaning:
              "Cuántas wallets distintas aportaron fondos. Pocos remitentes vs. muchos cambia la lectura de dependencia.",
          },
          {
            name: "Concentración del fondeo",
            meaning:
              "Si el valor entrante está repartido o dominado por pocas fuentes. Concentración alta eleva el peso de cada fondeador.",
          },
          {
            name: "Peso de los principales fondeadores",
            meaning:
              "Cuánto aportan el mayor fondeador y el top de remitentes. Útil para ver si una sola fuente explica la wallet.",
          },
          {
            name: "Calidad de los exchanges de origen",
            meaning:
              "Cuando el fondeo pasa por CEX, qué tan sólidos o conocidos son esos venues. Aporta contexto de reputación del canal.",
          },
          {
            name: "Ritmo temporal del fondeo",
            meaning:
              "Si los fondos entraron de golpe, en oleadas o de forma gradual. Patrones abruptos pueden merecer más atención.",
          },
          {
            name: "Exposición a mixers y sanciones",
            meaning:
              "Indicios de contacto con mixers o direcciones asociadas a listas OFAC conocidas. Señal de exposición, no determinación.",
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
        ],
      },
      {
        id: "activity",
        title: "Actividad reciente",
        lead: "Cómo se comporta la wallet en el día a día: con quién opera, con qué ritmo y con qué patrones de riesgo operativo.",
        rows: [
          {
            name: "Contrapartes únicas",
            meaning:
              "Con cuántas wallets distintas interactúa. Habla de red de contactos vs. operación cerrada.",
          },
          {
            name: "Concentración de contrapartes",
            meaning:
              "Si el flujo se reparte entre muchos peers o se concentra en pocos. Concentración alta aumenta dependencia de esas relaciones.",
          },
          {
            name: "Interacción con exchanges",
            meaning:
              "Qué proporción del valor y de las transacciones toca CEX. Informa on/off-ramp y uso de venues centralizados.",
          },
          {
            name: "Reciprocidad de flujos",
            meaning:
              "Cuánto del movimiento es ida-y-vuelta con las mismas contrapartes. Puede sugerir relaciones estables o patrones circulares.",
          },
          {
            name: "Balance neto vs. volumen bruto",
            meaning:
              "Si hay mucho movimiento con poco cambio neto. Útil para detectar rotación intensa sin acumulación clara.",
          },
          {
            name: "Velocidad de transacciones",
            meaning:
              "Ritmo diario de operaciones. Ayuda a separar uso ocasional de actividad muy intensa.",
          },
          {
            name: "Ráfagas de actividad",
            meaning:
              "Si las transacciones llegan en ráfagas concentradas. Puede indicar automatización o campañas puntuales.",
          },
          {
            name: "Diversidad de tokens",
            meaning:
              "Variedad de activos en los movimientos. Perfiles mono-token vs. operatorias más amplias.",
          },
          {
            name: "Patrones wash / circulares",
            meaning:
              "Indicios de lavado de volumen o circuitos cerrados entre wallets. Señales de alerta temprana, no prueba forense.",
          },
          {
            name: "Comportamiento tipo bot",
            meaning:
              "Patrones que se parecen a automatización (ritmo, repetición, estructura). Informa riesgo operativo y autenticidad del uso.",
          },
          {
            name: "Mix NFT vs. tokens fungibles",
            meaning:
              "Cuánto del flujo es NFT frente a fungibles. Cambia el contexto de uso (coleccionismo, trading, tesorería, etc.).",
          },
        ],
      },
    ],
  },
  en: {
    title: "What we look at inside each signal",
    intro:
      "Each part of the analysis is built from internal signals the recipient can read and audit. Below we explain what they measure and what information they convey so the recipient can make an informed decision.",
    prev: "Previous signal",
    next: "Next signal",
    tabsLabel: "Analysis parts",
    nameCol: "Internal signal",
    meaningCol: "How it informs the decision",
    slides: [
      {
        id: "multichain",
        title: "Ecosystem presence",
        lead: "A map of which networks the wallet appears on, how continuous that presence is, and how intensely it operates across chains.",
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
              "Which networks show movement in short windows (e.g. 30 or 90 days). Separates historical presence from current use.",
          },
          {
            name: "Share of dormant networks",
            meaning:
              "How much of the footprint is inactive. Avoids over-reading old networks with no recent activity.",
          },
          {
            name: "Consistency across networks",
            meaning:
              "Whether behavior is stably distributed or unevenly concentrated across chains.",
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
              "In Standard and Expert: transaction intensity across chains, primary network, and relative weight. Basic focuses on presence footprint.",
          },
        ],
      },
      {
        id: "portfolio",
        title: "Portfolio quality",
        lead: "An economic snapshot of what the wallet holds: value, liquidity, composition, and risk signals tied to holdings.",
        rows: [
          {
            name: "Total usable and credible value",
            meaning:
              "Observed economic value, distinguishing usable totals from “credible” readings that filter absurd valuations.",
          },
          {
            name: "Liquid vs locked",
            meaning:
              "How much is immediately available versus committed or locked.",
          },
          {
            name: "Holdings concentration",
            meaning:
              "Whether value depends on a few assets or is more diversified.",
          },
          {
            name: "Effective positions",
            meaning:
              "How many positions truly matter in the economic picture, beyond micro-holding noise.",
          },
          {
            name: "Stablecoin / bluechip / memecoin mix",
            meaning:
              "Portfolio risk profile: more stable and bluechip versus more speculative.",
          },
          {
            name: "DeFi and LP exposure",
            meaning:
              "Participation in protocols and liquidity positions. Signals operational complexity and protocol risk.",
          },
          {
            name: "Dust and spam",
            meaning:
              "Share of irrelevant or junk holdings. Avoids inflating the reading with useless tokens.",
          },
          {
            name: "Protocols touched",
            meaning:
              "How many distinct protocols the portfolio interacts with.",
          },
          {
            name: "Native gas buffer",
            meaning:
              "Whether enough native balance remains to operate. A “rich” wallet without gas can be operationally stuck.",
          },
          {
            name: "Locked commitment",
            meaning:
              "How committed capital is in positions that are not short-term liquid.",
          },
          {
            name: "Known sanctions exposure",
            meaning:
              "Whether the target wallet is associated with known OFAC labels/addresses. Exposure signal, not official screening or a verdict.",
          },
        ],
      },
      {
        id: "origins",
        title: "Origin of funds",
        lead: "Where funds came from, how diverse that provenance is, and what risk hints appear in the funding path.",
        rows: [
          {
            name: "Origin mix by category",
            meaning:
              "Share arriving from exchanges, bridges, mixers, sanctioned addresses, airdrops, or organic sources.",
          },
          {
            name: "Unique senders",
            meaning:
              "How many distinct wallets contributed funds. Few versus many changes dependency reading.",
          },
          {
            name: "Funding concentration",
            meaning:
              "Whether inbound value is spread out or dominated by a few sources.",
          },
          {
            name: "Weight of top funders",
            meaning:
              "How much the top funder and top senders contribute. Shows if one source explains the wallet.",
          },
          {
            name: "CEX origin quality",
            meaning:
              "When funding flows through centralized exchanges, how solid or well-known those venues look.",
          },
          {
            name: "Funding timing pattern",
            meaning:
              "Whether funds arrived in a lump, in waves, or gradually. Abrupt patterns may deserve closer review.",
          },
          {
            name: "Mixer and sanctions exposure",
            meaning:
              "Hints of contact with mixers or addresses linked to known OFAC lists. Exposure signal, not a determination.",
          },
          {
            name: "Organic vs synthetic",
            meaning:
              "Weight of real economic activity versus more synthetic origins (airdrops, NFTs, etc.).",
          },
          {
            name: "Age of first funding",
            meaning:
              "How long ago the first relevant funds arrived. Context for freshly funded versus mature wallets.",
          },
        ],
      },
      {
        id: "activity",
        title: "Recent activity",
        lead: "How the wallet behaves day to day: who it transacts with, at what pace, and with which operational risk patterns.",
        rows: [
          {
            name: "Unique counterparties",
            meaning:
              "How many distinct wallets it interacts with. Broad network versus closed operation.",
          },
          {
            name: "Counterparty concentration",
            meaning:
              "Whether flow is spread across many peers or concentrated in a few.",
          },
          {
            name: "Exchange interaction",
            meaning:
              "Share of value and transactions touching CEXs. Speaks to on/off-ramp and centralized venue use.",
          },
          {
            name: "Flow reciprocity",
            meaning:
              "How much movement is back-and-forth with the same counterparties.",
          },
          {
            name: "Net vs gross flow",
            meaning:
              "Whether there is heavy movement with little net change. Helps spot intense rotation without clear accumulation.",
          },
          {
            name: "Transaction velocity",
            meaning:
              "Daily pace of operations. Separates occasional use from very intense activity.",
          },
          {
            name: "Activity bursts",
            meaning:
              "Whether transactions arrive in concentrated bursts. May indicate automation or short campaigns.",
          },
          {
            name: "Token diversity",
            meaning:
              "Variety of assets in movements. Mono-token profiles versus broader operations.",
          },
          {
            name: "Wash / circular patterns",
            meaning:
              "Hints of volume washing or closed circuits between wallets. Early-warning signals, not forensic proof.",
          },
          {
            name: "Bot-like behavior",
            meaning:
              "Patterns that look automated (pace, repetition, structure).",
          },
          {
            name: "NFT vs fungible mix",
            meaning:
              "How much flow is NFT versus fungible tokens. Changes the usage context.",
          },
        ],
      },
    ],
  },
  pt: {
    title: "O que olhamos dentro de cada sinal",
    intro:
      "Cada parte da análise é construída com sinais internos que o receptor pode ler e auditar. A seguir explicamos o que medem e que informação transmitem para que o receptor tome uma decisão informada.",
    prev: "Sinal anterior",
    next: "Sinal seguinte",
    tabsLabel: "Partes da análise",
    nameCol: "Sinal interno",
    meaningCol: "O que acrescenta à decisão",
    slides: [
      {
        id: "multichain",
        title: "Presença do ecossistema",
        lead: "Mapa de em quais redes a carteira aparece, com que continuidade e com quanta intensidade opera entre cadeias.",
        rows: [
          {
            name: "Quantidade de redes com atividade",
            meaning:
              "Quantas blockchains distintas mostram pegada da wallet. Mais redes podem indicar operação diversificada ou maior superfície a rever.",
          },
          {
            name: "Antiguidade da atividade multi-rede",
            meaning:
              "Há quanto tempo existe rasto on-chain no conjunto de redes. Ajuda a distinguir wallets novas de trajetórias longas.",
          },
          {
            name: "Redes ativas recentes",
            meaning:
              "Em quais redes houve movimento em janelas curtas (por exemplo 30 ou 90 dias). Separa presença histórica de uso atual.",
          },
          {
            name: "Proporção de redes dormentes",
            meaning:
              "Quanta parte do footprint está inativa. Evita sobreinterpretar redes antigas sem movimento recente.",
          },
          {
            name: "Consistência entre redes",
            meaning:
              "Se o comportamento se reparte de forma estável ou se concentra de maneira irregular entre cadeias.",
          },
          {
            name: "Recência da última atividade",
            meaning:
              "Quão recente é o último rasto relevante. Indica se a wallet continua operativa ou parece abandonada.",
          },
          {
            name: "Presença em ecossistemas centrais",
            meaning:
              "Se opera em redes de referência do mercado. Acrescenta contexto de maturidade e tipo de ambiente.",
          },
          {
            name: "Concentração do footprint",
            meaning:
              "Se a história multi-rede está repartida ou dominada por poucas cadeias.",
          },
          {
            name: "Longevidade por rede",
            meaning:
              "Sinais de permanência em cadeias concretas versus comportamento de passagem.",
          },
          {
            name: "Intensidade de uso entre redes",
            meaning:
              "Em Standard e Expert: volume e intensidade de transações entre cadeias, rede principal e peso relativo. Na Básica o foco é o footprint de presença.",
          },
        ],
      },
      {
        id: "portfolio",
        title: "Qualidade do portfólio",
        lead: "Foto econômica do que a wallet detém: valor, liquidez, composição e sinais de risco associados aos holdings.",
        rows: [
          {
            name: "Valor total usable e credível",
            meaning:
              "Quanto valor econômico se observa, distinguindo totais usáveis de leituras “credíveis” que filtram valuations absurdas.",
          },
          {
            name: "Líquido vs bloqueado",
            meaning:
              "Que parte do património está disponível de imediato e que parte está comprometida ou locked.",
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
              "Perfil de risco do portfólio: mais estável e bluechip versus mais especulativo.",
          },
          {
            name: "Exposição DeFi e liquidez fornecida",
            meaning:
              "Participação em protocolos e posições de liquidez. Informa complexidade operativa e risco de protocolo.",
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
              "Se mantém saldo nativo suficiente para operar. Uma wallet “rica” sem gas pode ficar limitada.",
          },
          {
            name: "Compromisso em ativos locked",
            meaning:
              "Quão comprometido está o capital em posições não líquidas no curto prazo.",
          },
          {
            name: "Exposição a sanções conhecidas",
            meaning:
              "Se a wallet alvo aparece associada a labels/endereços OFAC conhecidos. Sinal de exposição, não screening oficial nem veredito.",
          },
        ],
      },
      {
        id: "origins",
        title: "Origem dos fundos",
        lead: "De onde vieram os fundos, com que diversidade e com que indícios de risco na proveniência.",
        rows: [
          {
            name: "Composição por tipo de origem",
            meaning:
              "Que percentagem chega de exchanges, bridges, mixers, endereços sancionados, airdrops ou origem orgânica.",
          },
          {
            name: "Remetentes únicos",
            meaning:
              "Quantas wallets distintas aportaram fundos. Poucos versus muitos muda a leitura de dependência.",
          },
          {
            name: "Concentração do funding",
            meaning:
              "Se o valor entrante está repartido ou dominado por poucas fontes.",
          },
          {
            name: "Peso dos principais financiadores",
            meaning:
              "Quanto aportam o maior financiador e o top de remetentes.",
          },
          {
            name: "Qualidade dos exchanges de origem",
            meaning:
              "Quando o funding passa por CEX, quão sólidos ou conhecidos são esses venues.",
          },
          {
            name: "Ritmo temporal do funding",
            meaning:
              "Se os fundos entraram de uma vez, em ondas ou de forma gradual.",
          },
          {
            name: "Exposição a mixers e sanções",
            meaning:
              "Indícios de contacto com mixers ou endereços associados a listas OFAC conhecidas. Sinal de exposição, não determinação.",
          },
          {
            name: "Orgânico vs sintético",
            meaning:
              "Peso de atividade econômica real frente a origens mais sintéticas (airdrops, NFT, etc.).",
          },
          {
            name: "Antiguidade do primeiro funding",
            meaning:
              "Há quanto tempo recebeu os primeiros fundos relevantes.",
          },
        ],
      },
      {
        id: "activity",
        title: "Atividade recente",
        lead: "Como a wallet se comporta no dia a dia: com quem opera, com que ritmo e com que padrões de risco operativo.",
        rows: [
          {
            name: "Contrapartes únicas",
            meaning:
              "Com quantas wallets distintas interage. Rede ampla versus operação fechada.",
          },
          {
            name: "Concentração de contrapartes",
            meaning:
              "Se o fluxo se reparte entre muitos peers ou se concentra em poucos.",
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
            name: "Saldo líquido vs volume bruto",
            meaning:
              "Se há muito movimento com pouca mudança líquida.",
          },
          {
            name: "Velocidade de transações",
            meaning:
              "Ritmo diário de operações. Separa uso ocasional de atividade muito intensa.",
          },
          {
            name: "Rajadas de atividade",
            meaning:
              "Se as transações chegam em rajadas concentradas.",
          },
          {
            name: "Diversidade de tokens",
            meaning:
              "Variedade de ativos nos movimentos.",
          },
          {
            name: "Padrões wash / circulares",
            meaning:
              "Indícios de lavagem de volume ou circuitos fechados entre wallets. Sinais de alerta precoce, não prova forense.",
          },
          {
            name: "Comportamento tipo bot",
            meaning:
              "Padrões que se parecem com automação (ritmo, repetição, estrutura).",
          },
          {
            name: "Mix NFT vs fungíveis",
            meaning:
              "Quanto do fluxo é NFT frente a fungíveis.",
          },
        ],
      },
    ],
  },
};

export function analisisSignalsForLocale(locale: string): AnalisisSignalsCopy {
  return analisisSignalsByLocale[locale] ?? analisisSignalsByLocale.es;
}
