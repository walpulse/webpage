import type { ReactNode } from "react";

type Props = {
  id?: string;
  children: ReactNode;
  className?: string;
  narrow?: boolean;
  wide?: boolean;
};

export function Section({ id, children, className = "", narrow, wide }: Props) {
  const widthClass = narrow
    ? "max-w-3xl"
    : wide
      ? "max-w-7xl"
      : "max-w-6xl";

  return (
    <section id={id} className={`px-6 py-16 md:py-24 ${className}`}>
      <div className={`mx-auto ${widthClass}`}>{children}</div>
    </section>
  );
}

export function SectionHeading({
  title,
  intro,
}: {
  title: string;
  intro?: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <h2 className="font-display text-3xl font-semibold tracking-tight text-pure md:text-4xl">
        {title}
      </h2>
      {intro ? <p className="mt-4 text-base leading-relaxed text-muted">{intro}</p> : null}
    </div>
  );
}
