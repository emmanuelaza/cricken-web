import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-5 py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-2xl text-center">
        {eyebrow && (
          <p className="text-sm font-black uppercase tracking-[0.25em] text-brand-light">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 font-display text-5xl tracking-wide text-white md:text-6xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 font-bold text-muted">{subtitle}</p>
        )}
      </div>
      <div className="mt-12">{children}</div>
    </section>
  );
}
