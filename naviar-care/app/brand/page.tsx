import type { Metadata } from "next";
import { NaviarMark, type NaviarMarkVariant } from "@/components/naviar-mark";

export const metadata: Metadata = {
  title: "Merkevare · NAVIAR CARE",
  description:
    "Fire retninger for NAVIAR-merket, med palett, typografi og bruksregler.",
};

type Direction = {
  letter: string;
  variant: NaviarMarkVariant;
  name: string;
  idea: string;
  strength: string;
  risk: string;
  recommended?: boolean;
};

const DIRECTIONS: Direction[] = [
  {
    letter: "A",
    variant: "wayfinder",
    name: "Wayfinder",
    idea: "En kompassring, åpen nederst til høyre, med nålen pekende framover. Navnet bærer allerede «navigere» i seg.",
    strength: "Den eneste retningen som knytter seg direkte til navnet.",
    risk: "Kompasser er tett befolket territorium; nålen blir utydelig under 24 px.",
  },
  {
    letter: "B",
    variant: "cradle",
    name: "Cradle",
    idea: "To åpne buer som holder en figur — hendene, skuldrene, sengen. Ingenting lukker seg rundt figuren.",
    strength: "Sier mest om hvordan tjenesten oppfører seg: familien blir båret, ikke overtatt.",
    risk: "Buene begynner å smelte sammen under 20 px.",
    recommended: true,
  },
  {
    letter: "C",
    variant: "monogram",
    name: "Monogram",
    idea: "En N der diagonalen lener seg på begge stolpene. Støtte tegnet som konstruksjon.",
    strength: "Overlever lengst ned — appikon, favicon, brodering.",
    risk: "Sier ingenting om omsorg alene; trenger ordmerket ved siden av seg.",
  },
  {
    letter: "D",
    variant: "hearth",
    name: "Hearth",
    idea: "Et hus med et hjerte i. Ingen tolkning nødvendig.",
    strength: "Forstås umiddelbart av alle, også de som ikke leser design.",
    risk: "Den mest forventede formen i kategorien; vanskelig å eie.",
  },
];

const PALETTE = [
  { name: "Primary", value: "#014933", role: "Hovedfarge. Merket, tekst, alt som bærer struktur." },
  { name: "Ring", value: "#2b795c", role: "Sekundær. Understreker og grensesnitt-tilstander." },
  { name: "Accent warm", value: "#e9915e", role: "Kun former og flater — aldri tekst." },
  { name: "Accent warm ink", value: "#a84a18", role: "Varm tekst. Består AA på papirbakgrunnen." },
  { name: "Background", value: "#faf7ee", role: "Papirbakgrunn." },
];

function SizeProof({ variant }: { variant: NaviarMarkVariant }) {
  return (
    <div className="flex items-end gap-4 rounded-xl border border-border bg-card px-4 py-3">
      {[32, 20, 16].map((size) => (
        <figure key={size} className="flex flex-col items-center gap-1.5">
          <NaviarMark
            variant={variant}
            accent="var(--accent-warm)"
            className="text-primary"
            style={{ width: size, height: size }}
          />
          <figcaption className="font-mono text-[9px] text-muted-foreground">
            {size}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function BrandPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-24 pt-14 sm:px-8">
      <header className="border-b border-border pb-8">
        <p className="font-mono text-xs uppercase tracking-[.2em] text-accent-warm-ink">
          Merkevare · fire retninger
        </p>
        <h1 className="mt-4 font-serif text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-[1.02] tracking-[-.04em] text-balance">
          Ett merke for NAVIAR CARE
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground text-pretty">
          Fire retninger, tegnet som vektor og presset ned til faviconstørrelse.
          Alle bruker produktets egen palett og Fraunces, så det eneste du
          vurderer er selve merket.
        </p>
      </header>

      <section className="pt-14">
        <h2 className="font-serif text-3xl font-semibold tracking-tight">
          Retningene
        </h2>

        <div className="mt-8 flex flex-col gap-4">
          {DIRECTIONS.map((d) => (
            <article
              key={d.letter}
              className="grid gap-6 rounded-2xl border border-border bg-card p-6 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)]"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center rounded-xl bg-background py-8">
                  <NaviarMark
                    variant={d.variant}
                    accent="var(--accent-warm)"
                    className="size-24 text-primary"
                  />
                </div>
                <div className="flex items-center justify-center rounded-xl bg-primary py-6">
                  <NaviarMark
                    variant={d.variant}
                    accent="var(--accent-warm)"
                    className="size-16 text-primary-foreground"
                  />
                </div>
                <SizeProof variant={d.variant} />
              </div>

              <div>
                <div className="flex items-baseline gap-3">
                  <span className="rounded border border-accent-warm px-2 py-0.5 font-mono text-xs text-accent-warm-ink">
                    {d.letter}
                  </span>
                  <h3 className="font-serif text-2xl font-semibold tracking-tight">
                    {d.name}
                  </h3>
                </div>

                <p className="mt-3 max-w-prose leading-7 text-muted-foreground">
                  {d.idea}
                </p>

                <dl className="mt-5 border-t border-border">
                  <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-4 border-b border-border py-3">
                    <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[.13em] text-muted-foreground">
                      Styrke
                    </dt>
                    <dd className="text-sm leading-6">{d.strength}</dd>
                  </div>
                  <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-4 py-3">
                    <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[.13em] text-muted-foreground">
                      Risiko
                    </dt>
                    <dd className="text-sm leading-6">{d.risk}</dd>
                  </div>
                </dl>

                {d.recommended && (
                  <p className="mt-4 rounded-xl bg-accent-warm-soft px-4 py-3 text-sm leading-6 text-accent-warm-ink">
                    <strong className="font-semibold">Anbefalt.</strong> Dette er
                    merket en familie husker etter et besøk på døra.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pt-14">
        <h2 className="font-serif text-3xl font-semibold tracking-tight">Palett</h2>
        <p className="mt-2 max-w-prose text-muted-foreground">
          Produktets grønntoner bærer strukturen. Den varme aksenten holdes under
          en tiendedel av flaten — den peker på neste steg, ingenting annet.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PALETTE.map((c) => (
            <div
              key={c.value}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="h-16" style={{ background: c.value }} />
              <div className="p-4">
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{c.value}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {c.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-14">
        <h2 className="font-serif text-3xl font-semibold tracking-tight">
          Bruksregler
        </h2>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {[
            ["Frisone", "Hold fri plass tilsvarende merkets strektykkelse × 3 på alle fire sider."],
            ["Minste størrelse", "Merket 20 px / 7 mm. Under det: bruk monogrammet."],
            ["På foto", "Kun omvendt gjengivelse, over et mørkt parti eller grønn overlegg på 55 % eller mer."],
            ["Aldri", "Farg merket utenfor paletten, legg til skygge eller kontur, strekk det, eller sett ordmerket i en annen skrift."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
