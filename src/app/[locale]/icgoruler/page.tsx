import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InsightsView } from "@/views/insights";
import { getDictionary } from "@/content";
import { pageMetadata } from "@/lib/metadata";

const LOCALE = "tr" as const;

export function generateMetadata(): Metadata {
  const { hero } = getDictionary(LOCALE).insights;
  return pageMetadata({
    key: "insights",
    locale: LOCALE,
    title: hero.title,
    description: hero.description,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Bu slug yalnızca "tr" dilinde geçerlidir.
  const { locale } = await params;
  if (locale !== LOCALE) notFound();

  return <InsightsView locale={LOCALE} />;
}
