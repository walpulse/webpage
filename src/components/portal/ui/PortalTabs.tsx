export function PortalTabs<T extends string>({
  tabs,
  value,
  onChange,
  ariaLabel,
  className = "",
}: {
  tabs: readonly { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <div className={`portal-tabs ${className}`} role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === value}
          onClick={() => onChange(tab.id)}
          className={`portal-tab${tab.id === value ? " is-active" : ""}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
