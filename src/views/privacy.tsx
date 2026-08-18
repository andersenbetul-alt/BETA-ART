import { Section } from "@/components/ui/section";
import { PageHero } from "./page-hero";
import { getDictionary } from "@/content";
import type { Locale } from "@/lib/i18n";

export function PrivacyView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const { hero, updated, sections, disclaimer } = dict.privacy;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
      />

      <Section tone="light">
        <div className="max-w-[42rem]">
          <p className="text-sm text-ink-800/70">{updated}</p>

          <div className="mt-10 space-y-12">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-2xl leading-snug text-ink-900">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 leading-relaxed text-ink-800/80">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets ? (
                  <ul className="mt-5 space-y-3 text-[0.95rem] leading-relaxed text-ink-800/85">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-500"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <p className="mt-14 rounded-2xl border border-ink-900/10 bg-sand-100 p-6 text-sm leading-relaxed text-ink-800/75">
            {disclaimer}
          </p>
        </div>
      </Section>
    </>
  );
}
