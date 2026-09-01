import { exhibitions, plates, verificationMethods } from "@/lib/data";
import { usePage } from "@/lib/router";
import { useLang } from "@/lib/langContext";
import { useCart } from "@/lib/cartContext";
import { Button } from "@/components/ui/button";

// New, user-directed feature (30.08.2026): "Collection — statik ızgara
// değil, her eserin sayfası bir 'provenance zaman çizelgesi' gösteriyor:
// kaynak → çekim bağlamı → doğrulama adımı → sergi." Every stage below is
// built only from data this session already has verified, nothing
// invented:
//  - Source / capture context: the plate's own accession, title, detail.
//  - Verification: reuses the real 3-method framework (Home.tsx
//    Verification section) — a plate marked "available" is shown as
//    having completed all three; a "pending" plate is shown at the first
//    (RAW not yet archived), since the real site never gives a more
//    granular per-plate verification state than that.
//  - Exhibition: the real "Volume I — Opening Exhibition" description
//    literally says "Twelve original prints" — so every one of the 12
//    plates genuinely belongs to that exhibition; this is sourced, not
//    assumed.
export function PlateDetail() {
  const { plateId, go } = usePage();
  const { t, lang } = useLang();
  const { items, add } = useCart();
  const plate = plates.find((p) => p.id === plateId);

  if (!plate) {
    return (
      <section className="border-b border-border">
        <div className="mx-auto w-[min(100%-3rem,900px)] py-24 text-center">
          <p className="text-sm text-muted-foreground">{t("plateNotFound")}</p>
          <button onClick={() => go("home", "collection")} className="mt-4 font-record text-xs uppercase tracking-[0.12em] text-accent hover:underline">
            {t("cartContinue")}
          </button>
        </div>
      </section>
    );
  }

  const verified = plate.status === "available";

  return (
    <section className="border-b border-border">
      <div className="mx-auto w-[min(100%-3rem,900px)] py-[clamp(3rem,7vw,4.5rem)]">
        <button
          onClick={() => go("home", "collection")}
          className="font-record text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-accent"
        >
          ← {t("collectionEyebrow")}
        </button>

        {plate.image ? (
          <img src={plate.image} alt={plate.title} className="mt-6 aspect-[16/9] w-full object-cover" />
        ) : (
          <div aria-hidden="true" className={`mt-6 aspect-[16/9] w-full bg-gradient-to-br ${plate.swatch}`} />
        )}

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-display text-[clamp(1.8rem,3.6vw,2.6rem)] font-light">{plate.title}</h1>
          <span className={`font-record text-[0.68rem] uppercase tracking-[0.1em] ${verified ? "text-accent" : "text-muted-foreground"}`}>
            {verified ? t("statusAvailable") : t("statusPending")}
          </span>
        </div>
        <p className="mt-1 font-record text-xs text-muted-foreground">{plate.accession} · {t("byPrefix")} {plate.photographer}</p>

        {/* New, user-directed addition — service-design pass: only
            "available" plates have a complete, ready-to-license original;
            only Personal has a real fixed price (kr 190), so cart only
            makes sense here. Commercial/Extended/Custom stay request-form
            only (#request), matching their real "Price on request" state. */}
        {verified && (
          <Button
            onClick={() => add({ plateId: plate.id, title: plate.title })}
            disabled={items.some((i) => i.plateId === plate.id)}
            className="mt-4 rounded-none font-record text-xs uppercase tracking-[0.14em]"
          >
            {items.some((i) => i.plateId === plate.id) ? `✓ ${t("inCart")}` : t("addToCart")}
          </Button>
        )}

        <p className="mt-8 font-record text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("provenance")}</p>
        <div className="mt-4 border-s-2 border-border ps-6">
          <TimelineNode title={t("tlSource")} done>
            <p>{plate.accession} — {plate.title}, {t(`filter${plate.category.charAt(0).toUpperCase()}${plate.category.slice(1)}`)}.</p>
            <p>{t("byPrefix")} {plate.photographer}.</p>
          </TimelineNode>

          <TimelineNode title={t("tlCaptureContext")} done>
            <p>{plate.detail[lang]}</p>
          </TimelineNode>

          <TimelineNode title={t("tlVerification")} done={verified}>
            {verified ? (
              verificationMethods.map((m) => (
                <p key={m.numeral}>
                  <span className="text-accent">✓</span> {t("method")} {m.numeral} — {m.title[lang]}
                </p>
              ))
            ) : (
              <p>{verificationMethods[0].title[lang]} — {t("statusPending")}.</p>
            )}
          </TimelineNode>

          <TimelineNode title={t("tlExhibition")} done last>
            <p>{exhibitions[0].title[lang]}, {exhibitions[0].when[lang]}, Oslo.</p>
          </TimelineNode>
        </div>
      </div>
    </section>
  );
}

function TimelineNode({
  title,
  done,
  last,
  children,
}: {
  title: string;
  done: boolean;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative ${last ? "" : "pb-8"}`}>
      <span
        className={`absolute -start-[calc(1.5rem+3px)] top-1 h-2.5 w-2.5 rounded-full ${
          done ? "bg-accent" : "border-2 border-muted-foreground bg-background"
        }`}
      />
      <p className="font-record text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">{title}</p>
      <div className="mt-1 text-sm leading-relaxed text-foreground/80">{children}</div>
    </div>
  );
}
