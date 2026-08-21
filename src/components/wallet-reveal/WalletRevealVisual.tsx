"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import type { RevealLevel } from "@/lib/walletReveal";

type Props = {
  level: RevealLevel;
  reducedMotion?: boolean;
  onSelectLevel?: (level: RevealLevel) => void;
};

const LEVELS: RevealLevel[] = [0, 1, 2, 3, 4];

/**
 * Inline locale maps — next-intl can serve stale catalogs for newly added
 * visual keys under Turbopack (same pattern as `signalCerts`).
 */
const visualLabelsByLocale: Record<
  string,
  {
    analysis: string;
    origins: string;
    activity: string;
    presence: string;
    portfolio: string;
    window90d: string;
    inflowsLabel: string;
  }
> = {
  es: {
    analysis: "Análisis Walpulse",
    origins: "Origen",
    activity: "Actividad",
    presence: "Presencia",
    portfolio: "Portafolio",
    window90d: "90 DÍAS",
    inflowsLabel: "FONDOS → WALLET · 2 NIVELES",
  },
  en: {
    analysis: "Walpulse Analysis",
    origins: "Origin",
    activity: "Activity",
    presence: "Presence",
    portfolio: "Portfolio",
    window90d: "90 DAYS",
    inflowsLabel: "FUNDS → WALLET · 2 LEVELS",
  },
  pt: {
    analysis: "Análise Walpulse",
    origins: "Origem",
    activity: "Atividade",
    presence: "Presença",
    portfolio: "Portfólio",
    window90d: "90 DIAS",
    inflowsLabel: "FUNDOS → WALLET · 2 NÍVEIS",
  },
};

/** Right of center so copy breathes; keep margin so nodes don't clip. */
const CX = 408;
const CY = 250;

const CHAINS = [
  { src: "/brand/chains/ETH_logo.png", label: "ETH" },
  { src: "/brand/chains/Base_logo.png", label: "Base" },
  { src: "/brand/chains/celo_logo.png", label: "Celo" },
  { src: "/brand/chains/Arbitrum_logo.png", label: "ARB" },
  { src: "/brand/chains/Polygon_logo.png", label: "POL" },
  { src: "/brand/chains/BNB_logo.png", label: "BNB" },
] as const;

function PulseOpacity({
  enabled,
  values,
  dur,
  begin,
  keyTimes,
}: {
  enabled: boolean;
  values: string;
  dur: string;
  begin?: string;
  keyTimes?: string;
}) {
  if (!enabled) return null;
  return (
    <animate
      attributeName="opacity"
      values={values}
      keyTimes={keyTimes}
      dur={dur}
      begin={begin}
      repeatCount="indefinite"
    />
  );
}

function ChaseGlow({
  enabled,
  index,
  count,
}: {
  enabled: boolean;
  index: number;
  count: number;
}) {
  if (!enabled) return null;
  const step = 0.75;
  const dur = `${count * step}s`;
  const windowEnd = (1 / count).toFixed(3);
  const fadeEnd = Math.min(1, 1 / count + 0.06).toFixed(3);
  return (
    <animate
      attributeName="opacity"
      values="0.28;1;1;0.28;0.28"
      keyTimes={`0;0.02;${windowEnd};${fadeEnd};1`}
      dur={dur}
      begin={`${index * step}s`}
      repeatCount="indefinite"
    />
  );
}

function BarBreath({
  enabled,
  heightValues,
  yValues,
  dur,
}: {
  enabled: boolean;
  heightValues: string;
  yValues: string;
  dur: string;
}) {
  if (!enabled) return null;
  return (
    <>
      <animate
        attributeName="height"
        values={heightValues}
        dur={dur}
        repeatCount="indefinite"
      />
      <animate
        attributeName="y"
        values={yValues}
        dur={dur}
        repeatCount="indefinite"
      />
    </>
  );
}

function FlowDot({
  enabled,
  x1,
  y1,
  x2,
  y2,
  dur,
  delay = "0s",
  color = "#7DD3FC",
}: {
  enabled: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dur: string;
  delay?: string;
  color?: string;
}) {
  if (!enabled) return null;
  return (
    <circle r={3.2} fill={color} opacity={0.9}>
      <animateMotion
        dur={dur}
        begin={delay}
        repeatCount="indefinite"
        path={`M ${x1} ${y1} L ${x2} ${y2}`}
      />
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        keyTimes="0;0.15;0.85;1"
        dur={dur}
        begin={delay}
        repeatCount="indefinite"
      />
    </circle>
  );
}

function WalletGlyph({
  x,
  y,
  scale = 1,
  highlight = false,
}: {
  x: number;
  y: number;
  scale?: number;
  highlight?: boolean;
}) {
  const w = 118 * scale;
  const h = 74 * scale;
  return (
    <g transform={`translate(${x - w / 2} ${y - h / 2})`}>
      <rect
        width={w}
        height={h}
        rx={12 * scale}
        fill="#0F172A"
        stroke={highlight ? "#7DD3FC" : "#38BDF8"}
        strokeWidth={highlight ? 2.2 : 1.6}
        opacity={0.98}
      />
      <rect
        x={8 * scale}
        y={8 * scale}
        width={w - 16 * scale}
        height={h - 16 * scale}
        rx={8 * scale}
        fill="#070B14"
        stroke="rgba(56,189,248,0.35)"
        strokeWidth={1}
      />
      <text
        x={16 * scale}
        y={24 * scale}
        fill="#7DD3FC"
        fontFamily="ui-monospace, monospace"
        fontSize={8 * scale}
        letterSpacing="0.18em"
      >
        WALLET
      </text>
      <text
        x={16 * scale}
        y={40 * scale}
        fill="#F8FAFC"
        fontFamily="ui-monospace, monospace"
        fontSize={10 * scale}
      >
        0xA4F1 · 9C2E
      </text>
      <circle cx={w - 22 * scale} cy={h - 18 * scale} r={3.2 * scale} fill="#38BDF8" />
      <circle
        cx={w - 34 * scale}
        cy={h - 18 * scale}
        r={3.2 * scale}
        fill="#7DD3FC"
        opacity={0.7}
      />
      <circle
        cx={w - 46 * scale}
        cy={h - 18 * scale}
        r={3.2 * scale}
        fill="#34D399"
        opacity={0.55}
      />
    </g>
  );
}

function MarkerArrow({ id }: { id: string }) {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX={9}
      refY={5}
      markerWidth={6}
      markerHeight={6}
      orient="auto-start-reverse"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#38BDF8" />
    </marker>
  );
}

/** Shorten a segment so arrowheads sit clear of node centers (Level0 pattern). */
function shortenLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  startPad: number,
  endPad: number,
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: x1 + ux * startPad,
    y1: y1 + uy * startPad,
    x2: x2 - ux * endPad,
    y2: y2 - uy * endPad,
  };
}

const WALLET_GLYPH_SCALE = 1.05;
const WALLET_ARROW_GAP = 14;

function walletHalfSize(scale: number) {
  return {
    halfW: (118 * scale) / 2,
    halfH: (74 * scale) / 2,
  };
}

/** Point just outside the wallet rectangle, on the line from (fromX, fromY) to center. */
function pointOutsideWalletRect(fromX: number, fromY: number, scale = WALLET_GLYPH_SCALE) {
  const { halfW, halfH } = walletHalfSize(scale);
  const sx = fromX - CX;
  const sy = fromY - CY;
  const len = Math.hypot(sx, sy) || 1;
  const ux = sx / len;
  const uy = sy / len;
  const distEdge = Math.min(
    halfW / Math.max(Math.abs(ux), 1e-6),
    halfH / Math.max(Math.abs(uy), 1e-6),
  );
  return {
    x: CX + ux * (distEdge + WALLET_ARROW_GAP),
    y: CY + uy * (distEdge + WALLET_ARROW_GAP),
  };
}

function Level0Visual({
  motion,
  labels,
  onSelectLevel,
}: {
  motion: boolean;
  labels: {
    analysis: string;
    origins: string;
    activity: string;
    presence: string;
    portfolio: string;
  };
  onSelectLevel?: (level: RevealLevel) => void;
}) {
  /** Flow top → bottom: Wallet → Analysis → 4 signals in a row. */
  const walletX = CX;
  const walletY = 88;
  const analysisX = CX;
  const analysisY = 210;
  const signalY = 400;
  const signals = [
    { label: labels.presence, x: CX - 195, level: 1 as RevealLevel },
    { label: labels.portfolio, x: CX - 65, level: 2 as RevealLevel },
    { label: labels.origins, x: CX + 65, level: 3 as RevealLevel },
    { label: labels.activity, x: CX + 195, level: 4 as RevealLevel },
  ] as const;
  const analysisParts = labels.analysis.split(/\s+/);
  const analysisLine1 = analysisParts[0] ?? labels.analysis;
  const analysisLine2 = analysisParts.slice(1).join(" ");

  return (
    <g>
      <line
        x1={walletX}
        y1={walletY + 42}
        x2={analysisX}
        y2={analysisY - 40}
        stroke="rgba(56,189,248,0.55)"
        strokeWidth={1.8}
        markerEnd="url(#reveal-arrow)"
      />
      <FlowDot
        enabled={motion}
        x1={walletX}
        y1={walletY + 42}
        x2={analysisX}
        y2={analysisY - 40}
        dur="2.1s"
        color="#38BDF8"
      />

      {signals.map((s, i) => (
        <g
          key={`${s.label}-${i}`}
          className={
            onSelectLevel ? "reveal-visual__signal-hotspot" : undefined
          }
          onClick={
            onSelectLevel
              ? (e) => {
                  e.stopPropagation();
                  onSelectLevel(s.level);
                }
              : undefined
          }
        >
          <line
            x1={analysisX}
            y1={analysisY + 40}
            x2={s.x}
            y2={signalY - 38}
            stroke="rgba(125,211,252,0.4)"
            strokeWidth={1.5}
            markerEnd="url(#reveal-arrow-soft)"
          />
          <FlowDot
            enabled={motion}
            x1={analysisX}
            y1={analysisY + 40}
            x2={s.x}
            y2={signalY - 38}
            dur="2.4s"
            delay={`${0.25 + i * 0.28}s`}
            color="#7DD3FC"
          />
          <circle
            cx={s.x}
            cy={signalY}
            r={34}
            fill="#0F172A"
            stroke="#38BDF8"
            strokeWidth={1.7}
          >
            <PulseOpacity
              enabled={motion}
              values="0.55;1;0.55"
              dur="3.2s"
              begin={`${i * 0.45}s`}
            />
          </circle>
          <circle
            cx={s.x}
            cy={signalY}
            r={42}
            fill="none"
            stroke="rgba(125,211,252,0.28)"
            strokeWidth={1.1}
          >
            <PulseOpacity
              enabled={motion}
              values="0.2;0.7;0.2"
              dur="3.2s"
              begin={`${i * 0.45}s`}
            />
          </circle>
          <text
            x={s.x}
            y={signalY + 4}
            textAnchor="middle"
            fill="#F8FAFC"
            fontFamily="ui-monospace, monospace"
            fontSize={10}
            letterSpacing="0.02em"
          >
            {s.label}
          </text>
        </g>
      ))}

      <WalletGlyph x={walletX} y={walletY} scale={1.05} highlight />

      <g>
        <rect
          x={analysisX - 72}
          y={analysisY - 36}
          width={144}
          height={72}
          rx={14}
          fill="#0F172A"
          stroke="#7DD3FC"
          strokeWidth={2}
        >
          <PulseOpacity enabled={motion} values="0.7;1;0.7" dur="2.8s" />
        </rect>
        <rect
          x={analysisX - 64}
          y={analysisY - 28}
          width={128}
          height={56}
          rx={10}
          fill="#070B14"
          stroke="rgba(56,189,248,0.35)"
          strokeWidth={1}
        />
        <text
          x={analysisX}
          y={analysisLine2 ? analysisY - 2 : analysisY + 4}
          textAnchor="middle"
          fill="#F8FAFC"
          fontFamily="ui-monospace, monospace"
          fontSize={12}
        >
          {analysisLine1}
        </text>
        {analysisLine2 ? (
          <text
            x={analysisX}
            y={analysisY + 16}
            textAnchor="middle"
            fill="#7DD3FC"
            fontFamily="ui-monospace, monospace"
            fontSize={11}
          >
            {analysisLine2}
          </text>
        ) : null}
      </g>
    </g>
  );
}

/** Secondary wallet node — square (circle reserved for tx/flow). */
function WalletNodeSquare({
  x,
  y,
  size,
  fill,
  stroke,
  strokeWidth = 0,
  opacity = 1,
}: {
  x: number;
  y: number;
  size: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}) {
  return (
    <rect
      x={x - size / 2}
      y={y - size / 2}
      width={size}
      height={size}
      rx={1}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      opacity={opacity}
    />
  );
}

function diamondPoints(cx: number, cy: number, halfDiag: number): string {
  return `${cx},${cy - halfDiag} ${cx + halfDiag},${cy} ${cx},${cy + halfDiag} ${cx - halfDiag},${cy}`;
}

function Level1Visual({
  motion,
}: {
  motion: boolean;
}) {
  const hop1 = [
    { x: CX - 150, y: CY - 95 },
    { x: CX + 40, y: CY - 130 },
    { x: CX + 155, y: CY - 40 },
  ] as const;
  const hop2 = [
    { x: CX - 210, y: CY - 175, parent: 0 },
    { x: CX - 40, y: CY - 195, parent: 1 },
    { x: CX + 130, y: CY - 185, parent: 1 },
    { x: CX + 220, y: CY - 100, parent: 2 },
  ] as const;
  const hop1Size = 11;
  const hop2Size = 8;

  return (
    <g>
      {hop2.map((n, i) => {
        const parent = hop1[n.parent];
        const seg = shortenLine(n.x, n.y, parent.x, parent.y, hop2Size / 2 + 1, hop1Size / 2 + 2);
        return (
          <g key={`h2-${i}`}>
            <line
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke="rgba(125,211,252,0.35)"
              strokeWidth={1.2}
              strokeDasharray="3 4"
              markerEnd="url(#reveal-arrow-soft)"
            />
            <WalletNodeSquare
              x={n.x}
              y={n.y}
              size={hop2Size}
              fill="#7DD3FC"
              opacity={0.8}
            />
            <FlowDot
              enabled={motion}
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              dur="2.4s"
              delay={`${i * 0.35}s`}
              color="#7DD3FC"
            />
          </g>
        );
      })}
      {hop1.map((n, i) => {
        const end = pointOutsideWalletRect(n.x, n.y);
        const seg = shortenLine(n.x, n.y, end.x, end.y, hop1Size / 2 + 2, 0);
        return (
          <g key={`h1-${i}`}>
            <line
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke="rgba(56,189,248,0.65)"
              strokeWidth={1.8}
              markerEnd="url(#reveal-arrow)"
            />
            <WalletNodeSquare x={n.x} y={n.y} size={hop1Size} fill="#38BDF8" />
            <text
              x={n.x}
              y={n.y - 14}
              textAnchor="middle"
              fill="rgba(248,250,252,0.72)"
              fontFamily="ui-monospace, monospace"
              fontSize={8}
            >
              hop1
            </text>
            <FlowDot
              enabled={motion}
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              dur="1.9s"
              delay={`${0.2 + i * 0.4}s`}
              color="#38BDF8"
            />
          </g>
        );
      })}
      <WalletGlyph x={CX} y={CY} scale={WALLET_GLYPH_SCALE} highlight />
    </g>
  );
}

function Level2Visual({
  motion,
}: {
  motion: boolean;
}) {
  const peers = [
    { x: CX - 160, y: CY - 90, dir: "in" as const },
    { x: CX + 150, y: CY - 100, dir: "out" as const },
    { x: CX + 165, y: CY + 85, dir: "in" as const },
    { x: CX - 155, y: CY + 100, dir: "out" as const },
    { x: CX + 20, y: CY - 145, dir: "in" as const },
  ];
  const peerSize = 14;

  return (
    <g>
      {peers.map((p, i) => {
        const toWallet = p.dir === "in";
        const walletEdge = pointOutsideWalletRect(p.x, p.y, 1);
        const half = peerSize / 2 + 2;
        const seg = toWallet
          ? shortenLine(p.x, p.y, walletEdge.x, walletEdge.y, half, 0)
          : shortenLine(walletEdge.x, walletEdge.y, p.x, p.y, 0, half + 4);
        return (
          <g key={`peer-${i}`}>
            <line
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke={
                toWallet
                  ? "rgba(56,189,248,0.5)"
                  : "rgba(125,211,252,0.35)"
              }
              strokeWidth={1.5}
              markerEnd={toWallet ? "url(#reveal-arrow)" : "url(#reveal-arrow-soft)"}
            />
            <WalletNodeSquare
              x={p.x}
              y={p.y}
              size={peerSize}
              fill="#0F172A"
              stroke="#38BDF8"
              strokeWidth={1.4}
            />
            <FlowDot
              enabled={motion}
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              dur={`${2.1 + (i % 3) * 0.35}s`}
              delay={`${i * 0.28}s`}
              color={toWallet ? "#38BDF8" : "#7DD3FC"}
            />
          </g>
        );
      })}
      <WalletGlyph x={CX} y={CY} scale={1} highlight />
    </g>
  );
}

function Level3Visual({ motion }: { motion: boolean }) {
  const r = 132;
  const n = CHAINS.length;
  return (
    <g>
      {CHAINS.map((chain, i) => {
        const angle = -90 + (i * 360) / n;
        const rad = (angle * Math.PI) / 180;
        const x = CX + Math.cos(rad) * r;
        const y = CY + Math.sin(rad) * r;
        const size = 36;
        const clipId = `reveal-chain-clip-${i}`;
        const haloHalf = size / 2 + 10;
        const fillHalf = size / 2 + 4;
        const clipHalf = size / 2;
        return (
          <g key={chain.label}>
            <line
              x1={CX}
              y1={CY}
              x2={x}
              y2={y}
              stroke="rgba(56,189,248,0.28)"
              strokeWidth={1.3}
              opacity={0.55}
            >
              <ChaseGlow enabled={motion} index={i} count={n} />
            </line>
            <polygon
              points={diamondPoints(x, y, haloHalf)}
              fill="none"
              stroke="#7DD3FC"
              strokeWidth={1.4}
              opacity={motion ? 0.28 : 0.35}
            >
              <ChaseGlow enabled={motion} index={i} count={n} />
            </polygon>
            <g opacity={motion ? 0.45 : 1}>
              <ChaseGlow enabled={motion} index={i} count={n} />
              <polygon
                points={diamondPoints(x, y, fillHalf)}
                fill="#0F172A"
                stroke="#38BDF8"
                strokeWidth={1.6}
              />
              <defs>
                <clipPath id={clipId}>
                  <polygon points={diamondPoints(x, y, clipHalf)} />
                </clipPath>
              </defs>
              <image
                href={chain.src}
                x={x - size / 2}
                y={y - size / 2}
                width={size}
                height={size}
                preserveAspectRatio="xMidYMid meet"
                clipPath={`url(#${clipId})`}
              />
            </g>
          </g>
        );
      })}
      <WalletGlyph x={CX} y={CY} scale={1} highlight />
    </g>
  );
}

function Level4Visual({ motion }: { motion: boolean }) {
  const bars = [
    { h: 88, label: "Stable", color: "#38BDF8" },
    { h: 62, label: "Blue", color: "#7DD3FC" },
    { h: 44, label: "Other", color: "#64748B" },
    { h: 28, label: "Dust", color: "#94A3B8" },
  ];
  return (
    <g>
      <WalletGlyph x={CX - 110} y={CY - 20} scale={0.95} highlight />
      <g transform={`translate(${CX + 10} ${CY - 90})`}>
        {bars.map((bar, i) => (
          <g key={bar.label} transform={`translate(${i * 42} 0)`}>
            <rect
              x={0}
              y={100 - bar.h}
              width={28}
              height={bar.h}
              rx={6}
              fill={bar.color}
              opacity={0.85}
            >
              <BarBreath
                enabled={motion}
                heightValues={`${bar.h * 0.7};${bar.h};${bar.h * 0.7}`}
                yValues={`${100 - bar.h * 0.7};${100 - bar.h};${100 - bar.h * 0.7}`}
                dur={`${2.6 + i * 0.25}s`}
              />
            </rect>
            <text
              x={14}
              y={118}
              textAnchor="middle"
              fill="rgba(148,163,184,0.9)"
              fontFamily="ui-monospace, monospace"
              fontSize={8}
            >
              {bar.label}
            </text>
          </g>
        ))}
      </g>
      <text
        x={CX + 90}
        y={CY + 70}
        textAnchor="middle"
        fill="#34D399"
        fontFamily="ui-monospace, monospace"
        fontSize={18}
        fontWeight={700}
      >
        B
      </text>
    </g>
  );
}

function SceneForLevel({
  level,
  motion,
  labels,
  onSelectLevel,
}: {
  level: RevealLevel;
  motion: boolean;
  labels: {
    analysis: string;
    origins: string;
    activity: string;
    presence: string;
    portfolio: string;
    window90d: string;
    inflowsLabel: string;
  };
  onSelectLevel?: (level: RevealLevel) => void;
}): ReactNode {
  switch (level) {
    case 0:
      return (
        <Level0Visual
          motion={motion}
          labels={labels}
          onSelectLevel={onSelectLevel}
        />
      );
    case 1:
      return <Level3Visual motion={motion} />;
    case 2:
      return <Level4Visual motion={motion} />;
    case 3:
      return <Level1Visual motion={motion} />;
    case 4:
      return <Level2Visual motion={motion} />;
  }
}

export function WalletRevealVisual({
  level,
  reducedMotion = false,
  onSelectLevel,
}: Props) {
  const motion = !reducedMotion;
  const locale = useLocale();
  const labels = visualLabelsByLocale[locale] ?? visualLabelsByLocale.es;

  return (
    <div className="reveal-visual" aria-hidden>
      <div className="reveal-visual__glow" />
      <svg
        className="reveal-visual__svg"
        viewBox="0 0 640 520"
        role="presentation"
      >
        <defs>
          <radialGradient id="reveal-visual-fade" cx="62%" cy="48%" r="58%">
            <stop offset="0%" stopColor="#0F172A" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#070B14" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#070B14" stopOpacity="0" />
          </radialGradient>
          <MarkerArrow id="reveal-arrow" />
          <marker
            id="reveal-arrow-soft"
            viewBox="0 0 10 10"
            refX={9}
            refY={5}
            markerWidth={5}
            markerHeight={5}
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#7DD3FC" opacity={0.85} />
          </marker>
        </defs>
        <rect width="640" height="520" fill="url(#reveal-visual-fade)" />
        {LEVELS.map((id) => (
          <g
            key={id}
            className={`reveal-visual__layer${id === level ? " is-active" : ""}`}
          >
            <SceneForLevel
              level={id}
              motion={motion}
              labels={labels}
              onSelectLevel={id === 0 ? onSelectLevel : undefined}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
