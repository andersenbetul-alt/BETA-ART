import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Arrow, buttonClass } from "@/components/ui/button";
import { getDictionary } from "@/content";
import { jobMeta, type JobId } from "@/content/jobs";
import { absoluteUrl, path, type Locale } from "@/lib/i18n";
import { jsonLd } from "@/lib/json-ld";
import { TrackView, TrackedAnchor } from "@/components/track";

function List({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="font-display text-2xl text-ink-900">{title}</h2>
      <ul className="mt-5 space-y-3 leading-relaxed text-ink-800/85">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent-500"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function JobView({ locale, jobId }: { locale: Locale; jobId: JobId }) {
  const dict = getDictionary(locale);
  const { jobs, labels } = dict.careers;
  const job = jobs[jobId];
  const meta = jobMeta[jobId];

  const subject = encodeURIComponent(
    `${job.title} — ${labels.applySubjectSuffix}`,
  );
  const applyHref = `mailto:${labels.applyEmail}?subject=${subject}`;

  const facts = [
    { label: labels.team, value: job.team },
    { label: labels.type, value: job.type },
    { label: labels.location, value: job.location },
    { label: labels.experience, value: job.experience },
  ];

  // Google Jobs için yapılandırılmış veri
  const jobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: [
      `<p>${job.summary}</p>`,
      `<h3>${labels.responsibilities}</h3><ul>${job.responsibilities
        .map((item) => `<li>${item}</li>`)
        .join("")}</ul>`,
      `<h3>${labels.requirements}</h3><ul>${job.requirements
        .map((item) => `<li>${item}</li>`)
        .join("")}</ul>`,
    ].join(""),
    datePosted: meta.postedAt,
    validThrough: meta.validThrough,
    employmentType: meta.employmentType,
    inLanguage: locale,
    hiringOrganization: {
      "@type": "Organization",
      name: dict.meta.siteName,
      sameAs: absoluteUrl(path("home", locale)),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "İstanbul",
        addressCountry: "TR",
      },
    },
    applicantLocationRequirements: {
      "@type": "Country",
      name: "Türkiye",
    },
  };

  return (
    <>
      <TrackView event="job_opened" payload={{ where: "job", id: jobId, locale }} />
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 size-[26rem] rounded-full bg-ink-700/40 blur-3xl"
        />
        <Container className="relative">
          <div className="py-16 sm:py-20">
            <Link
              href={path("careers", locale)}
              className="inline-flex items-center gap-2 text-sm font-medium text-ink-100/70 transition-colors hover:text-white"
            >
              <span aria-hidden="true" className="rotate-180">
                <Arrow />
              </span>
              {labels.backToList}
            </Link>

            <h1 className="mt-8 max-w-3xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              {job.title}
            </h1>

            <dl className="mt-10 grid gap-6 border-t border-white/12 pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-300">
                    {fact.label}
                  </dt>
                  <dd className="mt-2 text-ink-100">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-12">
            <p className="text-lg leading-relaxed text-ink-800/85">
              {job.summary}
            </p>
            <List title={labels.responsibilities} items={job.responsibilities} />
            <List title={labels.requirements} items={job.requirements} />
            <List title={labels.bonus} items={job.bonus} />
          </div>

          <aside className="rounded-2xl border border-ink-900/10 bg-sand-100 p-7 lg:sticky lg:top-28">
            <h2 className="font-display text-xl text-ink-900">{labels.apply}</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-800/75">
              {labels.applyDescription}
            </p>
            <TrackedAnchor
              href={applyHref}
              className={`${buttonClass("primary")} mt-6 w-full`}
              event="job_apply_clicked"
              payload={{ where: "job", id: jobId, locale }}
            >
              {labels.apply}
              <Arrow />
            </TrackedAnchor>
            <p className="mt-3 text-center text-xs text-ink-800/70">
              {labels.applyEmail}
            </p>
            <Link
              href={path("careers", locale)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-ink-800/70 underline-offset-4 hover:text-ink-900 hover:underline"
            >
              {labels.backToList}
            </Link>

            {/* İlana Google'dan doğrudan inen aday firmayı da görebilsin */}
            <div className="mt-7 border-t border-ink-900/10 pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">
                {dict.careers.process.title}
              </h3>
              <ol className="mt-4 space-y-2 text-sm text-ink-800/80">
                {dict.careers.process.steps.map((step) => (
                  <li key={step.step} className="flex gap-3">
                    <span className="tabular-nums text-ink-800/70">{step.step}</span>
                    {step.title}
                  </li>
                ))}
              </ol>
              <Link
                href={path("careers", locale)}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink-900 underline-offset-4 hover:underline"
              >
                {dict.careers.culture.title}
                <Arrow />
              </Link>
            </div>
          </aside>
        </div>
      </Section>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLd(jobSchema) }}
      />
    </>
  );
}
