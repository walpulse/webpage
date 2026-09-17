"use client";

import { useState } from "react";

type Props = {
  value: unknown;
  copyLabel: string;
  copiedLabel: string;
  emptyLabel: string;
  defaultDepth?: number;
};

function typeClass(value: unknown): string {
  if (value === null) return "text-muted";
  if (typeof value === "string") return "text-emerald-300/90";
  if (typeof value === "number") return "text-sky-300/90";
  if (typeof value === "boolean") return "text-amber-300/90";
  return "text-pure";
}

function JsonNode({
  name,
  value,
  depth,
  defaultDepth,
}: {
  name?: string;
  value: unknown;
  depth: number;
  defaultDepth: number;
}) {
  const isObj =
    value !== null && typeof value === "object" && !Array.isArray(value);
  const isArr = Array.isArray(value);
  const isExpandable = isObj || isArr;
  const [open, setOpen] = useState(depth < defaultDepth);

  if (!isExpandable) {
    return (
      <div className="font-mono text-[11px] leading-5">
        {name != null ? (
          <span className="text-primary/90">{JSON.stringify(name)}: </span>
        ) : null}
        <span className={typeClass(value)}>
          {value === undefined ? "undefined" : JSON.stringify(value)}
        </span>
      </div>
    );
  }

  const entries = isArr
    ? (value as unknown[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, unknown>);

  const summary = isArr ? `Array(${entries.length})` : `Object(${entries.length})`;

  return (
    <div className="font-mono text-[11px] leading-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-left text-muted hover:text-pure"
      >
        <span className="mr-1 inline-block w-3">{open ? "▾" : "▸"}</span>
        {name != null ? (
          <span className="text-primary/90">{JSON.stringify(name)}: </span>
        ) : null}
        <span className="text-muted">{summary}</span>
      </button>
      {open ? (
        <div className="ml-3 border-l border-glass/40 pl-3">
          {entries.length === 0 ? (
            <span className="text-muted">{isArr ? "[]" : "{}"}</span>
          ) : (
            entries.map(([k, v]) => (
              <JsonNode
                key={k}
                name={k}
                value={v}
                depth={depth + 1}
                defaultDepth={defaultDepth}
              />
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

export function JsonTreeViewer({
  value,
  copyLabel,
  copiedLabel,
  emptyLabel,
  defaultDepth = 2,
}: Props) {
  const [copied, setCopied] = useState(false);

  if (value == null) {
    return <p className="text-sm text-muted">{emptyLabel}</p>;
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(value, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="rounded-md border border-glass/50 bg-void/80 p-3">
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={() => void onCopy()}
          className="text-xs text-muted hover:text-primary"
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <div className="max-h-[28rem] overflow-auto">
        <JsonNode value={value} depth={0} defaultDepth={defaultDepth} />
      </div>
    </div>
  );
}
