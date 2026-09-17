export function PortalAlert({
  variant = "error",
  className = "",
  children,
}: {
  variant?: "error" | "success" | "info";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`portal-alert portal-alert--${variant} ${className}`}
    >
      {children}
    </div>
  );
}
