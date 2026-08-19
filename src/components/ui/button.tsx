import Link from "next/link";
import type { ReactNode } from "react";
import { TrackedLink } from "@/components/track";
import type { AnalyticsEvent, AnalyticsPayload } from "@/lib/analytics";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-accent-500 text-ink-950 hover:bg-accent-300",
  secondary:
    "border border-ink-900/20 bg-transparent text-ink-900 hover:border-ink-900/50 hover:bg-ink-900/5",
  ghost:
    "border border-white/30 bg-transparent text-white hover:border-white/70 hover:bg-white/10",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  event,
  payload,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** Verilirse tıklama ölçülür; verilmezse bağlantı sunucu bileşeni kalır. */
  event?: AnalyticsEvent;
  payload?: AnalyticsPayload;
}) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (event) {
    return (
      <TrackedLink href={href} event={event} payload={payload} className={classes}>
        {children}
        <Arrow />
      </TrackedLink>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
      <Arrow />
    </Link>
  );
}

export function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

export function buttonClass(variant: Variant = "primary") {
  return `${base} ${variants[variant]}`;
}
