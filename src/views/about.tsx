import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHero } from "./page-hero";
import { getDictionary } from "@/content";
import { path, type Locale } from "@/lib/i18n";

export function AboutView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const { hero, story, mission, vision, values, team } = dict.about;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
      />

      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <h2 className="font-display text-3xl leading-tight text-ink-900">
            {story.title}
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-ink-800/80">
            {story.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="sand">
        <div className="grid gap-6 lg:grid-cols-2">
          {[mission, vision].map((item) => (
            <Card key={item.title} className="h-full p-9">
              <h2 className="font-display text-2xl text-ink-900">
                {item.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-800/80">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="light">
        <SectionHeading title={values.title} />
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {values.items.map((item) => (
            <div key={item.title} className="border-t border-ink-900/10 pt-6">
              <h3 className="font-display text-xl text-ink-900">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-800/75">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <SectionHeading
          title={team.title}
          description={team.description}
          tone="dark"
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.roles.map((role) => (
            <div
              key={role.title}
              className="rounded-2xl border border-white/12 bg-white/[0.04] p-6"
            >
              <h3 className="font-display text-lg text-white">{role.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-100/70">
                {role.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <ButtonLink href={path("contact", locale)} variant="ghost">
            {dict.actions.contact}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
