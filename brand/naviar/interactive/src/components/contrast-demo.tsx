import { useMemo, useState } from "react";
import { contrastRatio, WCAG_AA_TEXT } from "@/lib/wcag";
import { NAVIAR_TOKENS } from "@/assets/naviar-svg";

const { NAVY, GOLD, OFFWHITE, GRAPHITE } = NAVIAR_TOKENS;

const GROUNDS = [
  { key: "off-white", label: "Off White", hex: OFFWHITE },
  { key: "navy", label: "Midnight Navy", hex: NAVY },
  { key: "graphite", label: "Graphite", hex: GRAPHITE },
] as const;

/**
 * Canlı kanıt: "gold beyazda 2,10:1, metinde kullanılamaz" iddiasını
 * README'den kopyalamak yerine gerçek WCAG formülüyle her zeminde
 * yeniden hesaplar. Zemin seçici — bu sayfanın kendi kuralı gereği —
 * tek cyan kullanım yeridir (yalnız UI kontrolü, marka yüzeyi değil).
 */
export function ContrastDemo() {
  const [groundKey, setGroundKey] = useState<(typeof GROUNDS)[number]["key"]>("off-white");
  const ground = GROUNDS.find((g) => g.key === groundKey)!;

  const ratio = useMemo(() => contrastRatio(GOLD, ground.hex), [ground.hex]);
  const passes = ratio >= WCAG_AA_TEXT;

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div
        className="flex min-h-[180px] items-center justify-center p-8 transition-colors"
        style={{ backgroundColor: ground.hex }}
      >
        <span className="text-3xl font-semibold" style={{ color: GOLD }}>
          NAVIAR CONSULTING
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-card px-4 py-3">
        <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Zemin rengi">
          {GROUNDS.map((g) => (
            <button
              key={g.key}
              role="radio"
              aria-checked={g.key === groundKey}
              onClick={() => setGroundKey(g.key)}
              className="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
              style={{
                borderColor: g.key === groundKey ? "hsl(var(--cyan))" : "hsl(var(--border))",
                color: g.key === groundKey ? "hsl(var(--cyan))" : "hsl(var(--muted-foreground))",
              }}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 font-data text-sm">
          <span className="text-muted-foreground">{ratio.toFixed(2)}:1</span>
          <span
            className="rounded-sm px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide"
            style={{
              backgroundColor: passes ? "hsl(var(--pass) / 0.15)" : "hsl(var(--fail) / 0.15)",
              color: passes ? "hsl(var(--pass))" : "hsl(var(--fail))",
            }}
          >
            {passes ? "AA geçti" : "AA geçemedi"}
          </span>
        </div>
      </div>
      <p className="border-t border-border px-4 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Zemin seçicideki cyan, bu sayfadaki <strong>tek</strong> cyan kullanımıdır — kural gereği
        yalnız veri/UI kontrolünde, marka yüzeyinde değil. Metin her zaman gold (
        <code className="font-data">#D4AF37</code>); yalnız zemin değişiyor. WCAG AA metin eşiği{" "}
        {WCAG_AA_TEXT}:1.
      </p>
    </div>
  );
}
