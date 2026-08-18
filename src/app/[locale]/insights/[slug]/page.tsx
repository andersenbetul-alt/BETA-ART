import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/views/article";
import { getDictionary } from "@/content";
import { articleIds, articleMeta, type ArticleId } from "@/content/articles";
import { pageMetadata } from "@/lib/metadata";
import { path } from "@/lib/i18n";

const LOCALE = "en" as const;

/** Tanımsız bir yazı adresi 404 döner. */
export const dynamicParams = false;

/** İki segment de burada üretilir; karışık dil kombinasyonları 404 olur. */
export function generateStaticParams() {
  return articleIds.map((slug) => ({ locale: LOCALE, slug }));
}

function isArticleId(value: string): value is ArticleId {
  return (articleIds as readonly string[]).includes(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isArticleId(slug)) return {};

  const article = getDictionary(LOCALE).insights.articles[slug];
  const meta = pageMetadata({
    key: "insights",
    locale: LOCALE,
    title: article.title,
    description: article.excerpt,
  });

  return {
    ...meta,
    alternates: {
      canonical: `${path("insights", LOCALE)}/${slug}`,
      languages: {
        tr: `${path("insights", "tr")}/${slug}`,
        en: `${path("insights", "en")}/${slug}`,
        "x-default": `${path("insights", "tr")}/${slug}`,
      },
    },
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: articleMeta[slug].publishedAt,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (locale !== LOCALE || !isArticleId(slug)) notFound();

  return <ArticleView locale={LOCALE} articleId={slug} />;
}
