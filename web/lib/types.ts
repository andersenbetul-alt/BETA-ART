import type { CategoryId } from './products';

/**
 * Tek dile indirgenmiş ürün görünümü.
 * Kaynak Shopify de olsa yerel katalog da olsa sayfalar hep bunu görür.
 */
export type ProductView = {
  slug: string;
  sku: string;
  category: CategoryId;
  /** Görüntülenecek fiyat, seçili pazarın para biriminde. */
  price: number;
  currency: string;
  stock: number;
  hsCode: string;
  originCountry: string;
  material: string;
  dimensions: string;
  name: string;
  summary: string;
  bullets: string[];
  /** Görsel yoksa kullanılan renk bloğu. */
  swatch: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Shopify varyant GID'i — checkout için gerekli, yerel katalogda yok. */
  variantId?: string;
};
