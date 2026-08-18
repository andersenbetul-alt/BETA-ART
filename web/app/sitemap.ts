import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';
import { getProducts } from '@/lib/catalog';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ['', '/urunler', '/kurumsal'];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        changeFrequency: 'weekly',
        priority: path === '' ? 1 : 0.8,
      });
    }

    const products = await getProducts(locale);
    for (const product of products) {
      entries.push({
        url: `${SITE_URL}/${locale}/urunler/${product.slug}`,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
