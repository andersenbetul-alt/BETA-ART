import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { plates, verificationMethods, exhibitions, licenceTiers, faqItems, type PlateCategory } from "@/lib/data";
import { usePage } from "@/lib/router";
import { useLang } from "@/lib/langContext";

// Plain native <select> throughout this file — the Radix-based shadcn
// Select/Accordion/Checkbox/Sheet primitives failed to bundle under this
// skill's pinned Parcel version in an earlier build of this same site
// (see docs/beta-art/privat-icerik-analizi.md build notes); native form
// controls sidestep that instead of re-fighting it.
const selectCls =
  "h-9 w-full appearance-none rounded-none border border-border bg-background px-3 text-sm";

// Content note (docs/beta-art/tasarim-sistemi.md): the long-form English
// paragraphs below (hero copy, verification bodies, exhibition bodies,
// photographer bio, licence bullets, FAQ answers) are the verified source
// layer, pasted verbatim from beta-art.com. They stay in English for every
// UI language until a dedicated content-translation pass — only the
// chrome around them (labels, buttons, headings) is translated via t().

// New, user-directed addition (30.08.2026) — a BD-style credibility pass:
// pull the already-real numbers (84,000+ frames, 2012, 3 methods, 12
// plates — all sourced from Home.tsx/data.ts elsewhere on this page) into
// one scannable strip instead of leaving them buried in prose. No new
// numbers invented.
function StatStrip() {
  const { t } = useLang();
  const stats = [
    [t("statFrames"), t("statFramesLabel")],
    [t("statSince"), t("statSinceLabel")],
    [t("statMethods"), t("statMethodsLabel")],
    [t("statPlates"), t("statPlatesLabel")],
  ];
  return (
    <div className="border-b border-border bg-secondary">
      <div className="mx-auto grid w-[min(100%-3rem,1280px)] grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
        {stats.map(([value, label]) => (
          <div key={label} className="px-4 py-5 text-center">
            <p className="font-display text-2xl font-normal text-accent sm:text-3xl">{value}</p>
            <p className="mt-1 font-record text-[0.62rem] uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  const { go } = usePage();
  const { t } = useLang();
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid w-[min(100%-3rem,1280px)] grid-cols-1 items-center gap-12 py-[clamp(3rem,8vw,5.5rem)] lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="mb-5 font-record text-xs uppercase tracking-[0.22em] text-muted-foreground">
            {t("heroEyebrow")}
          </p>
          <h1 className="font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-light leading-[1.05]">
            Verified Human<br />Photography.
          </h1>
          <p className="mt-6 max-w-[58ch] text-[1.05rem] leading-relaxed text-foreground/80">
            Beta Art is an archive of original photographs made by people with physical cameras. The
            archive is designed around provenance: the connection between an image, its original capture,
            the photographer who made it and the licence granted to the customer.
          </p>
          <p className="mt-4 max-w-[58ch] text-[1.05rem] leading-relaxed text-foreground/80">
            For every photograph that receives verified status, the original RAW file is preserved and the
            available capture record is kept with the catalogue entry. Customers can ask to inspect
            provenance information before licensing an image.
          </p>
          <p className="mt-4 max-w-[58ch] text-[1.05rem] leading-relaxed text-foreground/80">
            Each plate in the archive carries a catalogue number, a capture record and a written licence
            signed by the photographer. There are no intermediaries, no anonymous uploads and no synthetic
            images in this collection.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button className="rounded-none font-record text-xs uppercase tracking-[0.16em]" onClick={() => go("home", "collection")}>
              {t("heroCtaCollection")}
            </Button>
            <Button variant="outline" className="rounded-none border-border font-record text-xs uppercase tracking-[0.16em]" onClick={() => go("home", "verification")}>
              {t("heroCtaVerification")}
            </Button>
          </div>
        </div>
        <div className="border border-border bg-secondary p-1">
          <div aria-hidden="true" className="aspect-[4/5] w-full bg-gradient-to-br from-slate-300 via-stone-300 to-neutral-700" />
          <p className="px-3 py-3 font-record text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">
            {t("platePrefix")} 01 · First Light — March 2026
          </p>
        </div>
      </div>
    </section>
  );
}

function Verification() {
  const { t } = useLang();
  return (
    <section id="verification" className="scroll-mt-20 border-b border-border">
      <div className="mx-auto w-[min(100%-3rem,1280px)] py-[clamp(3rem,7vw,4.5rem)]">
        <p className="font-record text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("verificationEyebrow")}</p>
        <h2 className="mt-3 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-light">{t("verificationTitle")}</h2>
        <div className="mt-10 grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-3">
          {verificationMethods.map((m) => (
            <div key={m.numeral} className="bg-background p-7">
              <p className="font-display text-sm italic text-accent">{t("method")} {m.numeral}</p>
              <h3 className="mt-3 font-display text-lg font-normal leading-snug">{m.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/75">{m.body}</p>
            </div>
          ))}
        </div>

        {/* New, user-directed addition (30.08.2026) — BD-style pass. */}
        <div className="mt-10 border border-border bg-secondary p-6">
          <p className="font-record text-[0.68rem] uppercase tracking-[0.12em] text-accent">{t("vsStockTitle")}</p>
          <p className="mt-2 max-w-[64ch] text-sm leading-relaxed text-foreground/75">{t("vsStockBody")}</p>
        </div>
      </div>
    </section>
  );
}

function Collection() {
  const [filter, setFilter] = useState<PlateCategory | "all">("all");
  const { t } = useLang();
  const { goToPlate } = usePage();
  const FILTERS: { label: string; value: PlateCategory | "all" }[] = [
    { label: t("filterAll"), value: "all" },
    { label: t("filterLandscape"), value: "landscape" },
    { label: t("filterCity"), value: "city" },
    { label: t("filterPortrait"), value: "portrait" },
  ];
  const visible = filter === "all" ? plates : plates.filter((p) => p.category === filter);

  return (
    <section id="collection" className="scroll-mt-20 border-b border-border">
      <div className="mx-auto w-[min(100%-3rem,1280px)] py-[clamp(3rem,7vw,4.5rem)]">
        <p className="font-record text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("collectionEyebrow")}</p>
        <h2 className="mt-3 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-light">{t("collectionTitle")}</h2>
        {/* New, user-directed addition (30.08.2026) — BD-style pass: explain
            why most plates read "awaiting" instead of just showing it. */}
        <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-foreground/70">{t("collectionReleaseNote")}</p>

        <div className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`border px-4 py-2 font-record text-[0.7rem] uppercase tracking-[0.12em] transition-colors ${
                filter === f.value ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:border-accent hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((plate) => (
            <button
              key={plate.id}
              onClick={() => goToPlate(plate.id)}
              className="flex flex-col bg-background text-start transition-colors hover:bg-secondary"
            >
              <div aria-hidden="true" className={`aspect-square w-full bg-gradient-to-br ${plate.swatch}`} />
              <div className="flex flex-1 flex-col p-5">
                <span
                  className={`font-record text-[0.62rem] uppercase tracking-[0.1em] ${
                    plate.status === "available" ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  {plate.status === "available" ? t("statusAvailable") : t("statusPending")}
                </span>
                <h3 className="mt-2 font-display text-lg font-normal">{plate.title}</h3>
                <p className="font-record text-[0.68rem] text-muted-foreground">{plate.accession}</p>
                <p className="mt-1 text-xs text-foreground/70">{plate.detail}</p>
                <p className="mt-1 font-record text-[0.66rem] uppercase tracking-[0.08em] text-muted-foreground">{t("byPrefix")} {plate.photographer}</p>
                <p className="mt-auto pt-4 font-record text-xs">{t("fromPrice")} kr 190</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Exhibitions() {
  const { go } = usePage();
  const { t } = useLang();
  return (
    <section id="events" className="scroll-mt-20 border-b border-border">
      <div className="mx-auto w-[min(100%-3rem,1280px)] py-[clamp(3rem,7vw,4.5rem)]">
        <p className="font-record text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("eventsEyebrow")}</p>
        <h2 className="mt-3 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-light">{t("eventsTitle")}</h2>
        <p className="mt-4 max-w-[62ch] text-[1.02rem] leading-relaxed text-foreground/80">{t("eventsIntro")}</p>
        <div className="mt-10 grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-3">
          {exhibitions.map((ex) => (
            <div key={ex.title} className="flex flex-col bg-background p-7">
              <span className="font-record text-[0.64rem] uppercase tracking-[0.12em] text-accent">{ex.tag}</span>
              <p className="mt-2 font-record text-[0.7rem] text-muted-foreground">{ex.when} · {ex.where}</p>
              <h3 className="mt-3 font-display text-lg font-normal leading-snug">{ex.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/75">{ex.body}</p>
              <button
                onClick={() => go("request-a-shoot")}
                className="mt-5 self-start font-record text-xs uppercase tracking-[0.12em] text-accent hover:underline"
              >
                {t("registerInterest")}
              </button>
            </div>
          ))}
        </div>

        {/* New, user-directed addition (30.08.2026) — see Sell.tsx header
            note for the request record. Not part of the verbatim
            beta-art.com card copy above; kept as a clearly separate note. */}
        <div className="mt-8 border border-border bg-secondary p-6">
          <p className="font-display text-base font-normal italic text-accent">{t("eventsRitualTitle")}</p>
          <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-foreground/75">{t("eventsRitualBody")}</p>
        </div>
      </div>
    </section>
  );
}

function Photographer() {
  const { t } = useLang();
  return (
    <section id="photographer" className="scroll-mt-20 border-b border-border bg-secondary">
      <div className="mx-auto grid w-[min(100%-3rem,1280px)] grid-cols-1 gap-12 py-[clamp(3rem,7vw,4.5rem)] lg:grid-cols-[0.8fr_1.2fr]">
        <div aria-hidden="true" className="aspect-[4/5] w-full max-w-sm border border-border bg-gradient-to-br from-stone-400 via-stone-200 to-neutral-500" />
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-record text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("photographerEyebrow")}</p>
            {/* New, user-directed addition (30.08.2026) — see Sell.tsx header note. */}
            <span className="border border-accent px-2 py-0.5 font-record text-[0.6rem] uppercase tracking-[0.1em] text-accent">
              ✓ {t("photographerVerifiedBadge")}
            </span>
          </div>
          <h2 className="mt-3 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-light leading-snug">
            I photograph<br />what actually exists.
          </h2>
          <p className="mt-5 max-w-[58ch] text-[1.02rem] leading-relaxed text-foreground/80">
            Fjords before sunrise, cities after rain, faces that agreed to be seen. Nothing on this site was
            generated, composited or hallucinated by a machine.
          </p>
          <p className="mt-4 max-w-[58ch] text-[1.02rem] leading-relaxed text-foreground/80">
            My archive holds more than 84,000 frames captured since 2012. When you license a plate, you deal
            with me directly — a written license, a proper invoice, and the full-resolution file delivered
            to your inbox within twenty-four hours.
          </p>
          <p className="mt-4 max-w-[58ch] text-[1.02rem] leading-relaxed text-foreground/80">
            If you want to see the RAW file behind any plate, ask. That's the point.
          </p>
        </div>
      </div>
    </section>
  );
}

function Licensing() {
  const { go } = usePage();
  const { t } = useLang();
  const steps = [
    ["01", t("step1Title"), t("step1Body")],
    ["02", t("step2Title"), t("step2Body")],
    ["03", t("step3Title"), t("step3Body")],
  ];
  return (
    <section id="licensing" className="scroll-mt-20 border-b border-border">
      <div className="mx-auto w-[min(100%-3rem,1280px)] py-[clamp(3rem,7vw,4.5rem)]">
        <p className="font-record text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("licensingEyebrow")}</p>
        <h2 className="mt-3 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-light">{t("licensingTitle")}</h2>
        <div className="mt-10 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {licenceTiers.map((tier) => (
            <div key={tier.name} className="flex flex-col bg-background p-7">
              <h3 className="font-display text-xl font-normal">{tier.name}</h3>
              <p className="mt-1 font-record text-sm text-accent">{tier.price}</p>
              <p className="mt-3 text-sm text-foreground/75">{tier.desc}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-foreground/70">
                {tier.bullets.map((b) => (
                  <li key={b} className="flex items-baseline gap-2">
                    <span className="text-accent">·</span>
                    {b}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => go("home", "request")}
                className="mt-6 self-start font-record text-xs uppercase tracking-[0.12em] text-accent hover:underline"
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map(([n, title, body]) => (
            <div key={n}>
              <p className="font-record text-2xl text-muted-foreground/50">{n}</p>
              <p className="mt-2 font-display text-base">{title}</p>
              <p className="mt-1 text-sm text-foreground/70">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RequestSection() {
  const [status, setStatus] = useState("");
  const { t } = useLang();
  return (
    <section id="request" className="scroll-mt-20 border-b border-border bg-secondary">
      <div className="mx-auto w-[min(100%-3rem,1280px)] py-[clamp(3rem,7vw,4.5rem)]">
        <p className="font-record text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("requestEyebrow")}</p>
        <h2 className="mt-3 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-light">{t("requestTitle")}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStatus(t("previewNotice"));
          }}
          className="mt-8 grid grid-cols-1 gap-5 border border-border bg-background p-[clamp(1.4rem,3vw,2rem)] md:grid-cols-2"
        >
          <div className="space-y-2">
            <Label className="font-record text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">{t("fieldPlate")}</Label>
            <select className={selectCls} defaultValue="">
              <option value="" disabled>{t("fieldPlatePlaceholder")}</option>
              {plates.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label className="font-record text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">{t("fieldLicence")}</Label>
            <select className={selectCls} defaultValue="">
              <option value="" disabled>{t("fieldLicencePlaceholder")}</option>
              <option value="personal">Personal</option>
              <option value="commercial">Commercial</option>
              <option value="extended">Extended</option>
              <option value="custom">Custom &amp; Exclusive</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="font-record text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">{t("fieldName")}</Label>
            <Input className="rounded-none border-border" required />
          </div>
          <div className="space-y-2">
            <Label className="font-record text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">{t("fieldEmail")}</Label>
            <Input type="email" className="rounded-none border-border" required />
          </div>
          <div className="space-y-2">
            <Label className="font-record text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">{t("fieldCompany")}</Label>
            <Input className="rounded-none border-border" />
          </div>
          <div className="space-y-2">
            <Label className="font-record text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">{t("fieldTerritory")}</Label>
            <Input className="rounded-none border-border" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="font-record text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">{t("fieldUse")}</Label>
            <Textarea rows={3} className="rounded-none border-border" />
          </div>
          <div className="space-y-2">
            <Label className="font-record text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">{t("fieldDuration")}</Label>
            <Input className="rounded-none border-border" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="font-record text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">{t("fieldNotes")}</Label>
            <Textarea rows={2} className="rounded-none border-border" />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" className="w-full rounded-none font-record text-xs uppercase tracking-[0.16em] md:w-auto">
              {t("submitRequest")}
            </Button>
            <p role="status" aria-live="polite" className="mt-3 min-h-[1.1em] font-record text-xs text-accent">{status}</p>
          </div>
        </form>
      </div>
    </section>
  );
}

function Faq() {
  const { t } = useLang();
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-[min(100%-3rem,1280px)] py-[clamp(3rem,7vw,4.5rem)]">
        <p className="font-record text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("faqIntro")}</p>
        <h2 className="mt-3 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-light">{t("faqIntro")}</h2>
        <div className="mt-8 divide-y divide-border border-t border-border">
          {faqItems.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base">
                {f.q}
                <span className="font-record text-muted-foreground group-open:hidden">+</span>
                <span className="hidden font-record text-muted-foreground group-open:inline">−</span>
              </summary>
              <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-foreground/75">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <StatStrip />
      <Verification />
      <Collection />
      <Exhibitions />
      <Photographer />
      <Licensing />
      <RequestSection />
      <Faq />
    </>
  );
}
