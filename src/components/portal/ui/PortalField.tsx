import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

type FieldShell = {
  label: string;
  hint?: string;
  fieldClassName?: string;
};

function Hint({ hint }: { hint?: string }) {
  if (!hint) return null;
  return <span className="text-[11px] leading-snug text-muted/80">{hint}</span>;
}

export function PortalInput({
  label,
  hint,
  fieldClassName = "",
  ...props
}: FieldShell & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="portal-label">
      <span className="portal-label__text">{label}</span>
      <input {...props} className={`portal-field ${fieldClassName}`} />
      <Hint hint={hint} />
    </label>
  );
}

export function PortalSelect({
  label,
  hint,
  fieldClassName = "",
  children,
  ...props
}: FieldShell & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="portal-label">
      <span className="portal-label__text">{label}</span>
      <select {...props} className={`portal-field ${fieldClassName}`}>
        {children}
      </select>
      <Hint hint={hint} />
    </label>
  );
}

export function PortalCheckbox({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-muted">
      <input
        {...props}
        type="checkbox"
        className="h-4 w-4 rounded border-glass accent-primary"
      />
      {label}
    </label>
  );
}
