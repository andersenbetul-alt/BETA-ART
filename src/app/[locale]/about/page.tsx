import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutView } from "@/views/about";
import { getDictionary } from "@/content";
import { pageMetadata } from "@/lib/metadata";

const LOCALE = "en" as const;

export function generateMetadata(): Metadata {
  const { hero } = getDictionary(LOCALE).about;
  return pageMetadata({
    key: "about",
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
  // Bu slug yalnızca "en" dilinde geçerlidir.
  const { locale } = await params;
  if (locale !== LOCALE) notFound();

  return <AboutView locale={LOCALE} />;
}
