import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Arrow } from "@/components/ui/button";
import { PageHero } from "./page-hero";
import { getDictionary } from "@/content";
import { articleIds, articleMeta } from "@/content/articles";
import { path, type Locale } from "@/lib/i18n";

/** Tarihi okuyucunun dilinde biçimlendirir. */
export function formatDate(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function InsightsView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const { hero, labels, articles } = dict.insights;
  const practices = dict.services.practices;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
      />

      <Section tone="light">
        <ul className="grid gap-6 lg:grid-cols-2">
          {articleIds.map((id) => {
            const article = articles[id];
            const meta = articleMeta[id];
            const practice = practices.find((p) => p.id === meta.practice);
            return (
              <li key={id}>
                <Link
                  href={`${path("insights", locale)}/${id}`}
                  className="group flex h-full flex-col rounded-2xl border border-ink-900/10 bg-white p-7 transition-colors hover:border-accent-500/60"
                >
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-wider text-ink-800/55">
                    <span className="text-accent-700">{practice?.title}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={meta.publishedAt}>
                      {formatDate(meta.publishedAt, locale)}
                    </time>
                  </p>
                  <h2 className="mt-4 font-display text-2xl leading-snug text-ink-900">
                    {article.title}
                  </h2>
                  <p className="mt-3 flex-1 leading-relaxed text-ink-800/75">
                    {article.excerpt}
                  </p>
                  <span className="mt-6 flex items-center justify-between gap-4 text-sm font-semibold text-ink-900">
                    <span className="font-normal text-ink-800/55">
                      {meta.readingMinutes} {labels.readingTime}
                    </span>
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
    </>
  );
}
