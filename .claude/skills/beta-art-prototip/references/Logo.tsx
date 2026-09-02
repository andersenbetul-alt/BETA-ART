// Aperture mark geometry sourced verbatim from brand/beta-art/master/logo-mark.svg
// (branch claude/beta-art-logo-designs-vnxhwn, not yet merged) — the only
// confirmed real Beta Art logo found. Centre dot stays crimson in both
// variants per that file's own usage rule.
export function Logo({ tone = "ink", size = 32 }: { tone?: "ink" | "paper"; size?: number }) {
  const stroke = tone === "ink" ? "#111010" : "#FFFFFF";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" role="img" aria-label="Beta Art">
      <circle cx="50" cy="50" r="44" stroke={stroke} strokeWidth="3" />
      <line x1="26.8" y1="87.4" x2="87.4" y2="26.8" stroke={stroke} strokeWidth="2.2" />
      <line x1="12.6" y1="73.2" x2="73.2" y2="12.6" stroke={stroke} strokeWidth="2.2" />
      <line x1="12.6" y1="26.8" x2="73.2" y2="87.4" stroke={stroke} strokeWidth="2.2" />
      <line x1="26.8" y1="12.6" x2="87.4" y2="73.2" stroke={stroke} strokeWidth="2.2" />
      <circle cx="50" cy="50" r="5" fill="#8B1515" />
    </svg>
  );
}
