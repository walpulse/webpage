import Image from "next/image";
import { getLocale } from "next-intl/server";

const signalKeys = ["origins", "activity", "multichain", "portfolio"] as const;
type SignalKey = (typeof signalKeys)[number];

const icons: Record<SignalKey, string> = {
  origins: "/Origenes_Fondos.jpg",
  activity: "/Actividad.jpg",
  multichain: "/Multichain.jpg",
  portfolio: "/Portafolio.jpg",
};

const mediaIconKeys = new Set<SignalKey>([
  "origins",
  "activity",
  "multichain",
  "portfolio",
]);

const ANALYZES_PREVIEW = 6;

type CertCopy = {
  name: string;
  summary: string;
  value: string;
  analyzes: string[];
};

type LocaleCerts = {
  analyzesTitle: string;
  certs: Record<SignalKey, CertCopy>;
};

/**
 * Inline locale maps — next-intl `t.raw` / getTranslations has served
 * stale `senales.certs` catalogs in this project (Turbopack).
 */
const certsByLocale: Record<string, LocaleCerts> = {
  es: {
    analyzesTitle: "Qué analiza",
    certs: {
      origins: {
        name: "Orígenes",
        summary:
          "Origen de los fondos, con profundidad a 2 niveles y orígenes de top contrapartes",
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
          "Comportamiento de flujos en ventana de 90 días, con historial de contrapartes y exposición a sanciones",
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
        summary: "Presencia y madurez multi-red",
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
        summary: "Calidad y composición económica del portafolio",
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
          "Source of funds, with 2-level depth and origins of top counterparties",
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
          "Flow behavior over a 90-day window, with counterparty history and sanctions exposure",
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
        summary: "Multi-network presence and maturity",
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
        summary: "Economic quality and composition of the portfolio",
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
          "Origem dos fundos, com profundidade em 2 níveis e origens das top contrapartes",
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
          "Comportamento de fluxos em janela de 90 dias, com histórico de contrapartes e exposição a sanções",
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
        summary: "Presença e maturidade multi-rede",
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
        summary: "Qualidade e composição econômica do portfólio",
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

export async function SignalFeatureCards() {
  const locale = await getLocale();
  const copy = certsByLocale[locale] ?? certsByLocale.es;

  return (
    <div className="grid gap-5 md:grid-cols-2 md:gap-6">
      {signalKeys.map((key, index) => {
        const cert = copy.certs[key];
        const analyzes = cert.analyzes.slice(0, ANALYZES_PREVIEW);
        const n = String(index + 1).padStart(2, "0");
        const isMediaIcon = mediaIconKeys.has(key);

        return (
          <article key={key} className="signal-feature-card group">
            <div className="signal-feature-card__glow" aria-hidden="true" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`signal-feature-card__icon${
                    isMediaIcon ? " signal-feature-card__icon--media" : ""
                  }`}
                >
                  <Image
                    src={icons[key]}
                    alt=""
                    width={isMediaIcon ? 104 : 36}
                    height={isMediaIcon ? 104 : 36}
                    className={
                      isMediaIcon
                        ? "h-full w-full object-cover"
                        : "h-9 w-9 opacity-95"
                    }
                  />
                </div>
                <div className="min-w-0 pt-0.5">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-pure md:text-[1.65rem]">
                    {cert.name}
                  </h3>
                  <p className="mt-2.5 max-w-md text-[0.95rem] leading-[1.65] text-muted">
                    {cert.summary}
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs tracking-[0.18em] text-primary/70">
                {n}
              </span>
            </div>

            <p className="relative mt-8 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary/85">
              {copy.analyzesTitle}
            </p>
            <ul className="relative mt-3.5 space-y-2.5 text-sm leading-relaxed text-muted">
              {analyzes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[0.7rem] h-px w-3.5 shrink-0 bg-primary/55" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="relative mt-7 border-t border-glass/35 pt-5 text-sm leading-relaxed text-pure/80">
              {cert.value}
            </p>
          </article>
        );
      })}
    </div>
  );
}
