import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site.ts';

/**
 * Ülke seçimi sorgu parametresiyle taşınıyor (`?country=DE`). Bu adresler
 * gerçek içerik taşıyor ama arama motoru için birbirinin kopyası gibi
 * görünüyor — sekiz ekran × on üç ülke = yüz dört yakın kopya. Taramayı
 * temiz yollara yönlendiriyoruz; içerik yine canonical üzerinden tek adreste
 * toplanıyor.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/*?country=' },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
