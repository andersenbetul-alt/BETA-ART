/**
 * Sitenin kendi adresi.
 *
 * Canonical etiketi, sitemap ve paylaşım kartları mutlak adres istiyor.
 * Ortam değişkeni varsa o kullanılır (önizleme dağıtımları kendi adresini
 * bilsin diye); yoksa üretim adresi.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://cobban.eu';
