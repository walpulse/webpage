type Variant = "default" | "flush" | "inset" | "accent";

const variantClass: Record<Variant, string> = {
  default: "portal-panel",
  flush: "portal-panel portal-panel--flush",
  inset: "portal-panel portal-panel--inset",
  accent: "portal-panel portal-panel--accent",
};

export function PortalPanel({
  variant = "default",
  hairline = false,
  padded = true,
  eyebrow,
  title,
  actions,
  className = "",
  children,
  ...rest
}: {
  variant?: Variant;
  hairline?: boolean;
  padded?: boolean;
  eyebrow?: string;
  title?: string;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const hasHeader = Boolean(eyebrow || title || actions);

  return (
    <section
      {...rest}
      className={`${variantClass[variant]} ${padded ? "p-4 md:p-5" : ""} ${className}`}
    >
      {hairline ? <span className="portal-panel__hairline" aria-hidden /> : null}

      {hasHeader ? (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {eyebrow ? <p className="portal-eyebrow">{eyebrow}</p> : null}
            {title ? (
              <h2 className={`portal-section-title${eyebrow ? " mt-1" : ""}`}>
                {title}
              </h2>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}

      {children}
    </section>
  );
}
