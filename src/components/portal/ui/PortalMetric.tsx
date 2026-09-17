export function PortalMetric({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="portal-metric">
      <p className="portal-metric__label">{label}</p>
      <p
        className={`portal-metric__value${mono ? " font-mono text-[0.85rem]" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

export function PortalSkeleton({ className = "" }: { className?: string }) {
  return <span className={`portal-skeleton block ${className}`} aria-hidden />;
}
