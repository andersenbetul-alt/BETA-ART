import 'server-only';
import { currencyByLocale, type Locale } from './i18n';
import { products, type CategoryId, type Product } from './products';
import { fetchProduct, fetchProducts, isShopifyConfigured } from './shopify';
import type { ProductView } from './types';

/** Yerel katalogdaki çok dilli ürünü tek dile indirger. */
function localize(product: Product, locale: Locale): ProductView {
  return {
    slug: product.slug,
    sku: product.sku,
    category: product.category,
    price: product.price[locale],
    currency: currencyByLocale[locale].code,
    available: product.stock > 0,
    stock: product.stock,
    hsCode: product.hsCode,
    originCountry: product.originCountry,
    material: product.material[locale],
    dimensions: product.dimensions,
    name: product.name[locale],
    summary: product.summary[locale],
    bullets: product.bullets[locale],
    swatch: product.swatch,
  };
}

/**
 * Ürünleri Shopify'dan çeker; ortam değişkenleri yoksa veya API hata verirse
 * yerel katalogla devam eder — vitrin hiçbir koşulda boş kalmaz.
 */
export async function getProducts(locale: Locale, category?: CategoryId): Promise<ProductView[]> {
  let list: ProductView[];

  if (isShopifyConfigured()) {
    try {
      list = await fetchProducts(locale);
    } catch (error) {
      console.error('[catalog] Shopify erişilemedi, yerel kataloğa düşüldü:', error);
      list = products.map((p) => localize(p, locale));
    }
  } else {
    list = products.map((p) => localize(p, locale));
  }

  return category ? list.filter((p) => p.category === category) : list;
}

export async function getProduct(locale: Locale, slug: string): Promise<ProductView | null> {
  if (isShopifyConfigured()) {
    try {
      // Sorgu başarılıysa "bulunamadı" gerçekten 404 demektir — yerel demo
      // kataloğa düşersek silinmiş ürün satın alınamaz bir sayfa olarak yaşar.
      return await fetchProduct(locale, slug);
    } catch (error) {
      console.error('[catalog] Shopify erişilemedi, yerel kataloğa düşüldü:', error);
    }
  }
  const local = products.find((p) => p.slug === slug);
  return local ? localize(local, locale) : null;
}
