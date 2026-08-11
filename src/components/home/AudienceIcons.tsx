type IconProps = { className?: string };

function strokeProps(className = "") {
  return {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

export function IconExchanges({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps(className)}>
      <path d="M4 20h16" />
      <path d="M6 20V10h4v10" />
      <path d="M10 20V6h4v14" />
      <path d="M14 20v-7h4v7" />
    </svg>
  );
}

export function IconFunds({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps(className)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8" />
      <path d="M9.5 10.2c.6-1 1.7-1.5 2.8-1.5 1.6 0 2.7.9 2.7 2.1s-1.1 2-2.7 2.3c-1.5.3-2.6.9-2.6 2.2 0 1.3 1.2 2.2 2.9 2.2 1.2 0 2.2-.5 2.8-1.4" />
    </svg>
  );
}

export function IconInsurance({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps(className)}>
      <path d="M12 3l7 3v5.5c0 4.4-2.9 7.6-7 9.5-4.1-1.9-7-5.1-7-9.5V6l7-3z" />
      <path d="M9.5 12.2l1.8 1.8 3.5-3.8" />
    </svg>
  );
}

export function IconInvestigations({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps(className)}>
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="M15 15l5 5" />
      <path d="M8.5 10.5h4M10.5 8.5v4" />
    </svg>
  );
}
