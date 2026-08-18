import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Arrow, ButtonLink } from "@/components/ui/button";
import { formatDate } from "./insights";
import { getDictionary } from "@/content";
import { articleIds, articleMeta, type ArticleId } from "@/content/articles";
import { absoluteUrl, path, type Locale } from "@/lib/i18n";
import { jsonLd } from "@/lib/json-ld";

export function ArticleView({
  locale,
  articleId,
}: {
  locale: Locale;
  articleId: ArticleId;
}) {
  const dict = getDictionary(locale);
  const { articles, labels } = dict.insights;
  const article = articles[articleId];
  const meta = articleMeta[articleId];
  const practice = dict.services.practices.find((p) => p.id === meta.practice);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: meta.publishedAt,
    inLanguage: locale,
    author: { "@type": "Organization", name: dict.meta.siteName },
    publisher: {
      "@type": "Organization",
      name: dict.meta.siteName,
      url: absoluteUrl(path("home", locale)),
    },
    mainEntityOfPage: absoluteUrl(`${path("insights", locale)}/${articleId}`),
  };

  return (
    <>
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 size-[26rem] rounded-full bg-ink-700/40 blur-3xl"
        />
        <Container className="relative">
          <div className="max-w-3xl py-16 sm:py-20">
            <Link
              href={path("insights", locale)}
              className="inline-flex items-center gap-2 text-sm font-medium text-ink-100/70 transition-colors hover:text-white"
            >
              <span aria-hidden="true" className="rotate-180">
                <Arrow />
              </span>
              {labels.backToList}
            </Link>

            <h1 className="mt-8 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              {article.title}
            </h1>

            <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/12 pt-6 text-sm text-ink-100/70">
              <time dateTime={meta.publishedAt}>
                {formatDate(meta.publishedAt, locale)}
              </time>
              <span aria-hidden="true">·</span>
              <span>
                {meta.readingMinutes} {labels.readingTime}
              </span>
              {practice ? (
                <>
                  <span aria-hidden="true">·</span>
                  <Link
                    href={`${path("services", locale)}#${practice.id}`}
                    className="text-accent-300 underline-offset-4 hover:underline"
                  >
                    {practice.title}
                  </Link>
                </>
              ) : null}
            </p>
          </div>
        </Container>
      </section>

      <Section tone="light">
        {/* Okuma genişliği bilinçli olarak dar tutuldu */}
        <article className="mx-auto max-w-[38rem]">
          <p className="text-[1.25rem] leading-relaxed text-ink-900">
            {article.excerpt}
          </p>

          <div className="mt-12 space-y-11">
            {article.sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-2xl leading-snug text-ink-900">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 text-[1.0625rem] leading-[1.75] text-ink-900/85">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets ? (
                  <ul className="mt-5 space-y-3 leading-relaxed text-ink-800/85">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent-500"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <p className="mt-12 border-l-2 border-accent-500 bg-sand-100 py-5 pl-6 pr-5 text-lg leading-relaxed text-ink-900">
            {article.takeaway}
          </p>
        </article>
      </Section>

      {/* Yazıyı bitiren okuyucunun tek çıkışı listeye dönmek olmasın */}
      <Section tone="sand" space="tight">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">
          {labels.readNext}
        </h2>
        <ul className="mt-6 divide-y divide-ink-900/10 border-y border-ink-900/10">
          {articleIds
            .filter((id) => id !== articleId)
            .map((id) => (
              <li key={id}>
                <Link
                  href={`${path("insights", locale)}/${id}`}
                  className="group flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
                >
                  <span className="font-display text-xl leading-snug text-ink-900">
                    {articles[id].title}
                  </span>
                  <span className="flex shrink-0 items-center gap-3 text-sm text-ink-800/70">
                    {articleMeta[id].readingMinutes} {labels.readingTime}
                    <span className="text-accent-700 transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1">
                      <Arrow />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      </Section>

      <Section tone="light">
        <div className="rounded-3xl bg-ink-900 px-8 py-12 sm:px-12">
          <h2 className="font-display text-2xl text-white sm:text-3xl">
            {labels.cta.title}
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-100/80">
            {labels.cta.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={path("contact", locale)}>
              {dict.actions.contact}
            </ButtonLink>
            <ButtonLink href={path("insights", locale)} variant="ghost">
              {labels.backToList}
            </ButtonLink>
          </div>
        </div>
      </Section>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema) }}
      />
    </>
  );
}
