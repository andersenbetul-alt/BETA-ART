import type { ProductView } from './types';

/** İstemci ve sunucunun paylaştığı adet üst sınırı — satır başına. */
export const MAX_LINE_QTY = 99;

export type RawLine = { slug?: unknown; qty?: unknown };
export type CheckoutLine = { variantId: string; quantity: number };

export type CheckoutPlan =
  | { ok: true; lines: CheckoutLine[] }
  | { ok: false; unavailable: string[] };

/**
 * İstemciden gelen sepeti sunucudaki katalogla doğrular.
 *
 * Kural: istemciden yalnızca `slug` ve `qty` kabul edilir. Fiyat ve varyant
 * kimliği her zaman katalogdan okunur — aksi hâlde tarayıcıdan fiyat değiştirilebilir.
 *
 * Karşılanamayan satır sessizce atılmaz; müşteri eksik bir siparişle ödeme
 * sayfasına düşmesin diye tüm istek reddedilir.
 */
export function planCheckout(catalog: ProductView[], lines: RawLine[]): CheckoutPlan {
  const planned: CheckoutLine[] = [];
  const unavailable: string[] = [];

  for (const line of lines) {
    if (typeof line?.slug !== 'string' || line.slug === '') {
      unavailable.push('?');
      continue;
    }

    // Number() ile zorlama yapılmaz: "2" gibi bir değeri kabul etmek,
    // bozuk bir istemcinin sessizce çalışması demektir.
    const qty = line.qty;
    const product = catalog.find((p) => p.slug === line.slug);

    const valid =
      typeof qty === 'number' &&
      Number.isInteger(qty) &&
      qty >= 1 &&
      qty <= MAX_LINE_QTY &&
      Boolean(product?.variantId) &&
      product!.available &&
      (product!.stock === null || qty <= product!.stock);

    if (valid) {
      planned.push({ variantId: product!.variantId as string, quantity: qty });
    } else {
      unavailable.push(line.slug);
    }
  }

  if (unavailable.length > 0 || planned.length === 0) {
    return { ok: false, unavailable };
  }
  return { ok: true, lines: planned };
}
