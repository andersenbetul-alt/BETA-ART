import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobView } from "@/views/job";
import { getDictionary } from "@/content";
import { jobIds, type JobId } from "@/content/jobs";
import { pageMetadata } from "@/lib/metadata";
import { path } from "@/lib/i18n";

const LOCALE = "en" as const;

/** Tanımsız bir ilan adresi 404 döner. */
export const dynamicParams = false;

/**
 * Her iki segment de burada üretilir (dokümandaki "aşağıdan yukarı" yaklaşımı).
 * Yalnızca kendi dilinin adresleri üretildiği için `/en/kariyer/...` gibi
 * karışık kombinasyonlar 404 döner.
 */
export function generateStaticParams() {
  return jobIds.map((slug) => ({ locale: LOCALE, slug }));
}

function isJobId(value: string): value is JobId {
  return (jobIds as readonly string[]).includes(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isJobId(slug)) return {};

  const dict = getDictionary(LOCALE);
  const job = dict.careers.jobs[slug];
  const meta = pageMetadata({
    key: "careers",
    locale: LOCALE,
    title: job.title,
    description: job.summary,
  });

  // Canonical ve hreflang'ler ilanın kendi adresini göstermeli.
  return {
    ...meta,
    alternates: {
      canonical: `${path("careers", LOCALE)}/${slug}`,
      languages: {
        tr: `${path("careers", "tr")}/${slug}`,
        en: `${path("careers", "en")}/${slug}`,
        "x-default": `${path("careers", "tr")}/${slug}`,
      },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (locale !== LOCALE || !isJobId(slug)) notFound();

  return <JobView locale={LOCALE} jobId={slug} />;
}
