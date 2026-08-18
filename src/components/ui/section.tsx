import type { ReactNode } from "react";
import { Container } from "./container";

type Tone = "light" | "sand" | "dark";

const toneClass: Record<Tone, string> = {
  light: "bg-white text-ink-900",
  sand: "bg-sand-50 text-ink-900",
  dark: "bg-ink-900 text-sand-50",
};

export function Section({
  children,
  tone = "light",
  className = "",
  id,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`${toneClass[tone]} py-20 sm:py-28 ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "light",
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: Tone;
  align?: "left" | "center";
}) {
  const isDark = tone === "dark";
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "max-w-3xl"
      }
    >
      {eyebrow ? (
        <p className={`eyebrow ${isDark ? "text-accent-300" : ""}`}>{eyebrow}</p>
      ) : null}
      <h2
        className={`mt-5 font-display text-3xl leading-tight tracking-tight sm:text-4xl ${
          isDark ? "text-white" : "text-ink-900"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-5 text-lg leading-relaxed ${
            isDark ? "text-ink-100" : "text-ink-800/80"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
