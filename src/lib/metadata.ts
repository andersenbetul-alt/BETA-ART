import type { Metadata } from "next";
import { getDictionary } from "@/content";
import { absoluteUrl, ogImage, path, type Locale, type RouteKey } from "./i18n";

/** Sayfa başına canonical + hreflang alternatiflerini üretir. */
export function pageMetadata({
  key,
  locale,
  title,
  description,
}: {
  key: RouteKey;
  locale: Locale;
  title: string;
  description: string;
}): Metadata {
  const dict = getDictionary(locale);

  return {
    title,
    description,
    alternates: {
      canonical: path(key, locale),
      languages: {
        tr: path(key, "tr"),
        en: path(key, "en"),
        "x-default": path(key, "tr"),
      },
    },
    openGraph: {
      type: "website",
      siteName: dict.meta.siteName,
      locale: locale === "tr" ? "tr_TR" : "en_US",
      title: `${title} | ${dict.meta.siteName}`,
      description,
      url: absoluteUrl(path(key, locale)),
      images: [ogImage(locale)],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${dict.meta.siteName}`,
      description,
      images: [ogImage(locale).url],
    },
  };
}
