import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactView } from "@/views/contact";
import { getDictionary } from "@/content";
import { pageMetadata } from "@/lib/metadata";

const LOCALE = "en" as const;

export function generateMetadata(): Metadata {
  const { hero } = getDictionary(LOCALE).contact;
  return pageMetadata({
    key: "contact",
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

  return <ContactView locale={LOCALE} />;
}
