import { Link } from "@/i18n/navigation";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary";

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type ButtonAsLink = CommonProps & {
  href: ComponentProps<typeof Link>["href"];
};

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, "className" | "children" | "variant"> & {
    href?: undefined;
  };

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-void hover:bg-primary-soft shadow-[0_0_28px_color-mix(in_oklab,var(--primary)_18%,transparent)]",
  secondary:
    "border border-glass/50 bg-transparent text-muted hover:border-primary/40 hover:text-pure",
};

const base =
  "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-px";

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const variant = props.variant ?? "primary";
  const classes = `${base} ${variants[variant]} ${props.className ?? ""}`;

  if ("href" in props && props.href !== undefined) {
    return (
      <Link href={props.href} className={classes}>
        {props.children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button
      className={classes}
      type={buttonProps.type}
      disabled={buttonProps.disabled}
      form={buttonProps.form}
      name={buttonProps.name}
      value={buttonProps.value}
      onClick={buttonProps.onClick}
      onSubmit={buttonProps.onSubmit}
      aria-label={buttonProps["aria-label"]}
      aria-busy={buttonProps["aria-busy"]}
    >
      {props.children}
    </button>
  );
}
