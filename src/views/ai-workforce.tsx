import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHero } from "./page-hero";
import { getDictionary } from "@/content";
import { agentIds, agentMeta } from "@/content/agents";
import { path, type Locale } from "@/lib/i18n";

function Check({ tone = "accent" }: { tone?: "accent" | "muted" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={`mt-1 size-4 shrink-0 ${
        tone === "accent" ? "text-accent-700" : "text-ink-800/50"
      }`}
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

function Cross() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="mt-1 size-4 shrink-0 text-ink-800/45"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

export function AiWorkforceView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const {
    hero,
    definition,
    process,
    agents,
    requirements,
    limits,
    dataProtection,
    engagement,
    cta,
  } = dict.aiWorkforce;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
      />

      {/* Ne olduğu / ne olmadığı — beklenti yönetimi baştan */}
      <Section tone="light">
        <SectionHeading title={definition.title} />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Card className="h-full border-accent-500/30 bg-accent-100/30">
            <ul className="space-y-4">
              {definition.is.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-ink-900/90">
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="h-full">
            <ul className="space-y-4">
              {definition.isNot.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-ink-800/80">
                  <Cross />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      {/* Kurulum süreci */}
      <Section tone="dark">
        <SectionHeading
          eyebrow={process.eyebrow}
          title={process.title}
          description={process.description}
          tone="dark"
        />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2">
          {process.steps.map((step) => (
            <li
              key={step.step}
              className="rounded-2xl border border-white/12 bg-white/[0.04] p-7"
            >
              <span className="font-display text-2xl tabular-nums text-accent-300">
                {step.step}
              </span>
              <h3 className="mt-3 font-display text-xl text-white">
                {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-ink-100/75">
                {step.description}
              </p>
              <ul className="mt-5 space-y-2 text-sm text-ink-100/65">
                {step.activities.map((activity) => (
                  <li key={activity} className="flex gap-3 leading-relaxed">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1 shrink-0 rounded-full bg-accent-300"
                    />
                    {activity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      {/* Ajan katalogu */}
      <Section tone="sand" id="ai-calisanlar" className="scroll-mt-24">
        <SectionHeading
          eyebrow={agents.eyebrow}
          title={agents.title}
          description={agents.description}
        />
        <ul className="mt-12 grid gap-6 lg:grid-cols-2">
          {agentIds.map((id) => {
            const agent = agents.items[id];
            const meta = agentMeta[id];
            return (
              <li key={id}>
                <Card className="flex h-full flex-col">
                  <h3 className="font-display text-xl text-ink-900">
                    {agent.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-ink-800/80">
                    {agent.summary}
                  </p>
                  <ul className="mt-5 space-y-2.5 text-[0.9375rem] text-ink-800/85">
                    {agent.does.map((task) => (
                      <li key={task} className="flex gap-3 leading-relaxed">
                        <Check />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 border-t border-ink-900/10 pt-5 text-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-700">
                      {agents.systemsLabel}
                    </p>
                    <p className="mt-2 text-ink-800/70">
                      {meta.systems.join(" · ")}
                    </p>
                  </div>
                  <div className="mt-4 rounded-xl bg-sand-100 p-4 text-sm leading-relaxed text-ink-800/85">
                    <span className="font-semibold text-ink-900">
                      {agents.humanLabel}:
                    </span>{" "}
                    {agent.humanReview}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Sizden gerekenler */}
      <Section tone="light">
        <SectionHeading
          title={requirements.title}
          description={requirements.description}
        />
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-3">
          {requirements.items.map((item) => (
            <div key={item.title} className="border-t border-ink-900/15 pt-6">
              <h3 className="font-display text-xl text-ink-900">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-800/75">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Nerede önermiyoruz — dürüstlük satış aracıdır */}
      <Section tone="sand">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading title={limits.title} description={limits.description} />
          <ul className="space-y-4">
            {limits.items.map((item) => (
              <li
                key={item}
                className="flex gap-3 border-b border-ink-900/10 pb-4 leading-relaxed text-ink-800/85"
              >
                <Cross />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Veri güvenliği */}
      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <h2 className="font-display text-3xl leading-tight text-ink-900">
            {dataProtection.title}
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-ink-800/80">
            {dataProtection.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      {/* Çalışma modeli */}
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
      </Section>

      <Section tone="sand">
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
