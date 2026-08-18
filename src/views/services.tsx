import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink, Arrow } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHero } from "./page-hero";
import { getDictionary } from "@/content";
import { articleIds, articleMeta } from "@/content/articles";
import { path, type Locale } from "@/lib/i18n";

function Check() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="mt-1 size-4 shrink-0 text-accent-700"
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
  const { hero, practices, outcomesLabel, practiceCta, relatedArticles, engagement } =
    dict.services;

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

              {/* Okuyan kişi ikna olduğunda altı ekran kaydırmak zorunda kalmasın */}
              <Link
                href={path("contact", locale)}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-900 underline-offset-4 hover:underline"
              >
                {practiceCta}
                <Arrow />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {practice.offerings.map((offering) => (
                <Card key={offering.title} className="h-full">
                  <h3 className="font-display text-lg font-semibold leading-snug text-ink-900">
                    {offering.title}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-800/75">
                    {offering.description}
                  </p>
                </Card>
              ))}

              {/* Bu alana bağlı yazılar — articleMeta.practice eşlemesi zaten var */}
              {(() => {
                const linked = articleIds.filter(
                  (id) => articleMeta[id].practice === practice.id,
                );
                if (linked.length === 0) return null;
                return (
                  <div className="sm:col-span-2">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">
                      {relatedArticles}
                    </h3>
                    <ul className="mt-4 divide-y divide-ink-900/10 border-y border-ink-900/10">
                      {linked.map((id) => (
                        <li key={id}>
                          <Link
                            href={`${path("insights", locale)}/${id}`}
                            className="group flex items-center justify-between gap-6 py-4 text-ink-900"
                          >
                            <span className="font-display text-lg leading-snug">
                              {dict.insights.articles[id].title}
                            </span>
                            <span className="shrink-0 text-accent-700 transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1">
                              <Arrow />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}
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
