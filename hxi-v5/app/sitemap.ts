import type { MetadataRoute } from 'next';
import { localeCodes, siteUrl } from '@/content/locales';

export default function sitemap(): MetadataRoute.Sitemap {
  return localeCodes.flatMap((locale) => [
    { url: `${siteUrl}/${locale}/`, changeFrequency: 'weekly', priority: locale === 'en' ? 1 : 0.9 },
    { url: `${siteUrl}/${locale}/privacy/`, changeFrequency: 'yearly', priority: 0.2 }
  ]);
}
