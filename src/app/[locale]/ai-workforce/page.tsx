import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AiWorkforceView } from "@/views/ai-workforce";
import { getDictionary } from "@/content";
import { pageMetadata } from "@/lib/metadata";
import { isLocale } from "@/lib/i18n";

// Slug iki dilde de aynı olduğu için tek dosya her iki dili de karşılar.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { hero } = getDictionary(locale).aiWorkforce;
  return pageMetadata({
    key: "aiWorkforce",
    locale,
    title: hero.title,
    description: hero.description,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <AiWorkforceView locale={locale} />;
}
