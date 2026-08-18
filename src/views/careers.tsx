import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink, Arrow } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/card";
import { PageHero } from "./page-hero";
import { getDictionary } from "@/content";
import { jobIds } from "@/content/jobs";
import { path, type Locale } from "@/lib/i18n";

export function CareersView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const { hero, culture, process, openings, jobs, openApplication, labels } =
    dict.careers;

  const applyHref = `mailto:${labels.applyEmail}`;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
      />

      {/* Açık pozisyonlar — sayfaya gelen önce bunu arar */}
      <Section tone="light" id="acik-pozisyonlar" className="scroll-mt-24">
        <SectionHeading
          eyebrow={openings.eyebrow}
          title={openings.title}
          description={openings.description}
        />
        <ul className="mt-12 space-y-4">
          {jobIds.map((id) => {
            const job = jobs[id];
            return (
              <li key={id}>
                <Link
                  href={`${path("careers", locale)}/${id}`}
                  className="group flex flex-col gap-5 rounded-2xl border border-ink-900/10 bg-white p-7 transition-colors hover:border-accent-500/60 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-10"
                >
                  <div className="max-w-[46ch]">
                    <h3 className="font-display text-xl text-ink-900">
                      {job.title}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-[1.6] text-ink-800/75">
                      {job.summary}
                    </p>
                    <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs font-medium uppercase tracking-wider text-ink-800/70">
                      <span>{job.team}</span>
                      <span>{job.type}</span>
                      <span>{job.location}</span>
                      <span>{job.experience}</span>
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-ink-900">
                    {openings.viewJob}
                    <span className="transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1">
                      <Arrow />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Açık başvuru */}
        {/* Card kullanılmıyor: onun bg-white'ı koyu zemini eziyordu */}
        <div className="mt-8 rounded-2xl bg-ink-900 p-7">
          <h3 className="font-display text-xl text-white">
            {openApplication.title}
          </h3>
          <p className="mt-3 max-w-[46ch] leading-relaxed text-ink-100/85">
            {openApplication.description}
          </p>
          <a
            href={applyHref}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-300 underline-offset-4 hover:underline"
          >
            {openApplication.action}
            <Arrow />
          </a>
        </div>
      </Section>

      {/* Kültür */}
      <Section tone="sand">
        <SectionHeading title={culture.title} description={culture.description} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {culture.items.map((item) => (
            <FeatureCard
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </Section>

      {/* İşe alım süreci */}
      <Section tone="dark">
        <SectionHeading
          title={process.title}
          description={process.description}
          tone="dark"
        />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {process.steps.map((step) => (
            <li
              key={step.step}
              className="rounded-2xl border border-white/12 bg-white/[0.04] p-6"
            >
              <span className="font-display text-sm text-accent-300">
                {step.step}
              </span>
              <h3 className="mt-2 font-display text-lg text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-100/70">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-12">
          <ButtonLink href="#acik-pozisyonlar" variant="ghost">
            {openings.title}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
