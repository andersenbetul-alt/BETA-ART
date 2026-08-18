export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <rect width="32" height="32" rx="8" fill="currentColor" />
      {/* Pusula ibresi — "yön" fikrini taşıyan sade işaret */}
      <path
        d="M16 6.5 21.5 25.5 16 21.2 10.5 25.5 16 6.5Z"
        fill="var(--color-accent-500)"
      />
    </svg>
  );
}

export function Logo({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark
        className={`size-8 ${tone === "dark" ? "text-ink-900" : "text-white"}`}
      />
      <span
        className={`font-display text-xl font-semibold tracking-[0.18em] ${
          tone === "dark" ? "text-ink-900" : "text-white"
        }`}
      >
        NAVIAR
      </span>
    </span>
  );
}
