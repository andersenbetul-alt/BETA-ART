import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink, Arrow } from "@/components/ui/button";
import { Card, FeatureCard } from "@/components/ui/card";
import { getDictionary } from "@/content";
import { articleIds, articleMeta } from "@/content/articles";
import { formatDate } from "./insights";
import { path, type Locale } from "@/lib/i18n";

export function HomeView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const { hero, pillars, practices, approach, why, insights, cta } = dict.home;
  // Ana sayfada en yeni üç yazı gösterilir; sıra articleIds dizisinden gelir.
  const latestArticles = articleIds.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-40 size-[34rem] rounded-full bg-ink-700/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 -left-24 size-[26rem] rounded-full bg-accent-700/20 blur-3xl"
        />
        <Container className="relative">
          <div className="grid gap-14 py-24 sm:py-32 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="eyebrow text-accent-300">{hero.eyebrow}</p>
              <h1 className="mt-6 font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-display">
                {hero.title}{" "}
                <span className="text-accent-300">{hero.highlight}</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-100/85">
                {hero.description}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href={path("contact", locale)}>
                  {dict.actions.contact}
                </ButtonLink>
                <ButtonLink href={path("services", locale)} variant="ghost">
                  {dict.actions.services}
                </ButtonLink>
              </div>
            </div>

            {/* Uzmanlık alanlarının kısa özeti */}
            <div className="rounded-3xl border border-white/12 bg-white/[0.05] p-8 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-300">
                {practices.eyebrow}
              </p>
              <ul className="mt-6 space-y-5">
                {dict.services.practices.map((practice) => (
                  <li key={practice.id}>
                    <Link
                      href={`${path("services", locale)}#${practice.id}`}
                      className="group block rounded-xl border border-white/10 p-5 transition-colors hover:border-accent-300/60 hover:bg-white/[0.04]"
                    >
                      <span className="flex items-center justify-between gap-4 font-display text-lg text-white">
                        {practice.title}
                        <span className="text-accent-300 transition-transform group-hover:translate-x-1">
                          <Arrow />
                        </span>
                      </span>
                      <span className="mt-2 block text-sm leading-relaxed text-ink-100/70">
                        {practice.offerings
                          .slice(0, 2)
                          .map((offering) => offering.title)
                          .join(" · ")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Odak alanları */}
      <Section tone="light">
        <SectionHeading title={pillars.title} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.items.map((item, index) => (
            <FeatureCard
              key={item.title}
              index={String(index + 1).padStart(2, "0")}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </Section>

      {/* Uzmanlık alanları */}
      <Section tone="sand">
        <SectionHeading
          eyebrow={practices.eyebrow}
          title={practices.title}
          description={practices.description}
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {dict.services.practices.map((practice) => (
            <Card key={practice.id} className="flex h-full flex-col">
              <p className="eyebrow">{practice.eyebrow}</p>
              <h3 className="mt-4 font-display text-2xl text-ink-900">
                {practice.title}
              </h3>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-800/75">
                {practice.summary}
              </p>
              <ul className="mt-6 space-y-3 text-sm text-ink-800/85">
                {practice.offerings.map((offering) => (
                  <li key={offering.title} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-500"
                    />
                    {offering.title}
                  </li>
                ))}
              </ul>
              <Link
                href={`${path("services", locale)}#${practice.id}`}
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-ink-900 underline-offset-4 hover:underline"
              >
                {dict.actions.readMore}
                <Arrow />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      {/* Yaklaşım özeti */}
      <Section tone="dark">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading
            eyebrow={approach.eyebrow}
            title={approach.title}
            description={approach.description}
            tone="dark"
          />
          <ol className="grid gap-4 sm:grid-cols-2">
            {dict.approach.phases.map((phase) => (
              <li
                key={phase.step}
                className="rounded-2xl border border-white/12 bg-white/[0.04] p-6"
              >
                <span className="font-display text-sm text-accent-300">
                  {phase.step}
                </span>
                <h3 className="mt-2 font-display text-lg text-white">
                  {phase.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-100/70">
                  {phase.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-12">
          <ButtonLink href={path("approach", locale)} variant="ghost">
            {dict.actions.approach}
          </ButtonLink>
        </div>
      </Section>

      {/* Neden NAVIAR */}
      <Section tone="light">
        <SectionHeading eyebrow={why.eyebrow} title={why.title} />
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {why.items.map((item) => (
            <div
              key={item.title}
              className="border-t border-ink-900/10 pt-6"
            >
              <h3 className="font-display text-xl text-ink-900">
                {item.title}
              </h3>
              <p className="mt-3 leading-relaxed text-ink-800/75">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Son yazılar */}
      <Section tone="sand">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow={insights.eyebrow}
            title={insights.title}
            description={insights.description}
          />
          <Link
            href={path("insights", locale)}
            className="inline-flex items-center gap-2 pb-1 text-sm font-semibold text-ink-900 underline-offset-4 hover:underline"
          >
            {insights.all}
            <Arrow />
          </Link>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {latestArticles.map((id) => {
            const article = dict.insights.articles[id];
            const meta = articleMeta[id];
            return (
              <li key={id}>
                <Link
                  href={`${path("insights", locale)}/${id}`}
                  className="group flex h-full flex-col rounded-2xl border border-ink-900/10 bg-white p-6 transition-colors hover:border-accent-500/60"
                >
                  <time
                    dateTime={meta.publishedAt}
                    className="text-xs font-medium uppercase tracking-wider text-ink-800/70"
                  >
                    {formatDate(meta.publishedAt, locale)}
                  </time>
                  <h3 className="mt-3 font-display text-lg leading-snug text-ink-900">
                    {article.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[0.92rem] leading-relaxed text-ink-800/75">
                    {article.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink-900">
                    <span className="transition-transform group-hover:translate-x-1">
                      <Arrow />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Kapanış çağrısı */}
      <Section tone="light">
        <div className="rounded-3xl bg-ink-900 px-8 py-14 text-center sm:px-14">
          <h2 className="font-display text-3xl text-white sm:text-4xl">
            {cta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-ink-100/80">
            {cta.description}
          </p>
          <div className="mt-9 flex justify-center">
            <ButtonLink href={path("contact", locale)}>
              {dict.actions.contact}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
