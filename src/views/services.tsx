import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHero } from "./page-hero";
import { getDictionary } from "@/content";
import { path, type Locale } from "@/lib/i18n";

function Check() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="mt-1 size-4 shrink-0 text-accent-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 8.5 3.2 3.2L13 5" />
    </svg>
  );
}

export function ServicesView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const { hero, practices, outcomesLabel, engagement } = dict.services;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
      />

      {practices.map((practice, index) => (
        <Section
          key={practice.id}
          id={practice.id}
          tone={index % 2 === 0 ? "light" : "sand"}
          className="scroll-mt-24"
        >
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">{practice.eyebrow}</p>
              <h2 className="mt-5 font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
                {practice.title}
              </h2>
              <p className="mt-5 leading-relaxed text-ink-800/80">
                {practice.summary}
              </p>

              <div className="mt-8 rounded-2xl border border-accent-500/30 bg-accent-100/40 p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">
                  {outcomesLabel}
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-900/85">
                  {practice.outcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-3">
                      <Check />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {practice.offerings.map((offering) => (
                <Card key={offering.title} className="h-full">
                  <h3 className="font-display text-lg leading-snug text-ink-900">
                    {offering.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-800/75">
                    {offering.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      ))}

      <Section tone="dark">
        <SectionHeading
          title={engagement.title}
          description={engagement.description}
          tone="dark"
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {engagement.models.map((model) => (
            <div
              key={model.title}
              className="rounded-2xl border border-white/12 bg-white/[0.04] p-6"
            >
              <h3 className="font-display text-lg text-white">{model.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-100/70">
                {model.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <ButtonLink href={path("contact", locale)}>
            {dict.actions.contact}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
