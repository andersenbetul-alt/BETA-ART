import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-ink-900/10 bg-white p-7 transition-shadow duration-200 hover:shadow-[0_8px_30px_-12px_rgba(10,31,51,0.25)] ${className}`}
    >
      {children}
    </div>
  );
}

export function FeatureCard({
  index,
  title,
  description,
}: {
  index?: string;
  title: string;
  description: string;
}) {
  return (
    <Card className="h-full">
      {index ? (
        <span className="font-display text-sm text-accent-600">{index}</span>
      ) : null}
      <h3 className="mt-2 font-display text-xl text-ink-900">{title}</h3>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-800/75">
        {description}
      </p>
    </Card>
  );
}
