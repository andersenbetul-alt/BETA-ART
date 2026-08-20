import type { MetadataRoute } from 'next';
import { helpTopics } from '@/lib/help-topics.ts';
import { kinds } from '@/lib/problems.ts';
import { siteUrl } from '@/lib/site.ts';

/**
 * Sitemap tek kaynaktan üretiliyor: yeni bir sorun türü veya yardım sayfası
 * eklendiğinde burayı güncellemek gerekmiyor. Elle tutulan liste, unutulan
 * listedir.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    ...kinds.map((kind) => ({
      url: `${siteUrl}/sorun/${kind}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...helpTopics.map((t) => ({
      url: `${siteUrl}/help/${t.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
