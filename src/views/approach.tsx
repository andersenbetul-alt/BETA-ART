import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "./page-hero";
import { getDictionary } from "@/content";
import { path, type Locale } from "@/lib/i18n";

export function ApproachView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const { hero, phases, principles } = dict.approach;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
      />

      <Section tone="light">
        <ol className="space-y-6">
          {phases.map((phase) => (
            <li
              key={phase.step}
              className="grid gap-6 rounded-2xl border border-ink-900/10 bg-white p-7 sm:p-9 lg:grid-cols-[0.8fr_1.2fr]"
            >
              <div>
                <span className="font-display text-4xl text-accent-500">
                  {phase.step}
                </span>
                <h2 className="mt-3 font-display text-2xl text-ink-900">
                  {phase.title}
                </h2>
                <p className="mt-3 leading-relaxed text-ink-800/75">
                  {phase.description}
                </p>
              </div>
              <ul className="grid gap-3 self-center border-l border-ink-900/10 pl-6 text-[0.95rem] text-ink-800/85 sm:grid-cols-2 lg:border-l lg:pl-8">
                {phase.activities.map((activity) => (
                  <li key={activity} className="flex gap-3 leading-relaxed">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-500"
                    />
                    {activity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="sand">
        <SectionHeading title={principles.title} />
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {principles.items.map((item) => (
            <div key={item.title} className="border-t border-ink-900/10 pt-6">
              <h3 className="font-display text-xl text-ink-900">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-800/75">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-14">
          <ButtonLink href={path("contact", locale)}>
            {dict.actions.contact}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
