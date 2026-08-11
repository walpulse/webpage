"use client";

export type TxLabelItem = {
  id: number;
  x: number;
  y: number;
  text: string;
  positive: boolean;
};

type Props = {
  labels: TxLabelItem[];
};

export function TxLabels({ labels }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden>
      {labels.map((label) => (
        <span
          key={label.id}
          className={`tx-label font-mono text-[11px] font-medium tracking-wide md:text-xs ${
            label.positive ? "text-grade-a" : "text-grade-f"
          }`}
          style={{ left: `${label.x}%`, top: `${label.y}%` }}
        >
          {label.text}
        </span>
      ))}
    </div>
  );
}
