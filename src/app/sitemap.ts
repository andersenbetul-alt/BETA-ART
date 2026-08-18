import type { MetadataRoute } from "next";
import { jobIds } from "@/content/jobs";
import { absoluteUrl, locales, path, routeKeys } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages = locales.flatMap((locale) =>
    routeKeys.map((key) => ({
      url: absoluteUrl(path(key, locale)),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: key === "home" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alt) => [alt, absoluteUrl(path(key, alt))]),
        ),
      },
    })),
  );

  // Açık pozisyonların detay sayfaları
  const jobPages = locales.flatMap((locale) =>
    jobIds.map((slug) => ({
      url: absoluteUrl(`${path("careers", locale)}/${slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alt) => [alt, absoluteUrl(`${path("careers", alt)}/${slug}`)]),
        ),
      },
    })),
  );

  return [...pages, ...jobPages];
}
