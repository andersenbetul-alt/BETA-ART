import type { MetadataRoute } from "next";
import { absoluteUrl, locales, path, routeKeys } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return locales.flatMap((locale) =>
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
}
