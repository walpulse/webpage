import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "danger" | "link";

export function PortalButton({
  variant = "primary",
  size,
  pending = false,
  disabled,
  className = "",
  children,
  ...props
}: {
  variant?: Variant;
  size?: "sm";
  pending?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      className={`portal-btn portal-btn--${variant}${size === "sm" ? " portal-btn--sm" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
