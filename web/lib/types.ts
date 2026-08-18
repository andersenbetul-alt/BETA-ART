import type { CategoryId } from './products';

/**
 * Tek dile indirgenmiş ürün görünümü.
 * Kaynak Shopify de olsa yerel katalog da olsa sayfalar hep bunu görür.
 */
export type ProductView = {
  slug: string;
  sku: string;
  category: CategoryId;
  /** Görüntülenecek fiyat, `currency` biriminde — sepete eklenen varyantın fiyatı. */
  price: number;
  /** ISO 4217 kodu; fiyat her zaman bu birimde biçimlendirilmeli. */
  currency: string;
  /** Satın alınabilir mi (stok takibi kapalı veya stoksuz satış açık olabilir). */
  available: boolean;
  /** Bilinen kalan adet; stok takibi yoksa `null` — üst sınır uygulanmaz. */
  stock: number | null;
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

/** İstemci ve sunucunun paylaştığı adet üst sınırı — satır başına. */
export const MAX_LINE_QTY = 99;
