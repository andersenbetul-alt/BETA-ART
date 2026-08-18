import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';
import { getProducts } from '@/lib/catalog';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cobban.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ['', '/urunler', '/kurumsal'];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${SITE}/${locale}${path}`,
        changeFrequency: 'weekly',
        priority: path === '' ? 1 : 0.8,
      });
    }

    const products = await getProducts(locale);
    for (const product of products) {
      entries.push({
        url: `${SITE}/${locale}/urunler/${product.slug}`,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
