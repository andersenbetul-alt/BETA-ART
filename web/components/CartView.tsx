'use client';

import Link from 'next/link';
import { useState } from 'react';
import { formatPrice, t, tf, type Locale } from '@/lib/i18n';
import type { ProductView } from '@/lib/types';
import { MAX_LINE_QTY } from '@/lib/checkout';
import { useCart } from './CartContext';

/** Satır başına izin verilen en yüksek adet — sunucudaki doğrulamayla aynı sınır. */
function maxQty(product: ProductView): number {
  return product.stock === null ? MAX_LINE_QTY : Math.min(product.stock, MAX_LINE_QTY);
}

export default function CartView({
  locale,
  catalog,
  shipping,
  checkoutEnabled,
}: {
  locale: Locale;
  /** Sunucudan gelen ürün listesi — fiyatlar istemcide hesaplanmaz, buradan okunur. */
  catalog: ProductView[];
  shipping: { fee: number; freeOver: number };
  checkoutEnabled: boolean;
}) {
  const { lines, setQty, remove, ready } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ready) return <p className="muted">…</p>;

  const rows = lines.flatMap((line) => {
    const product = catalog.find((p) => p.slug === line.slug);
    return product ? [{ line, product }] : [];
  });

  if (rows.length === 0) {
    return (
      <>
        <p className="muted">{t(locale, 'cart.empty')}</p>
        <p>
          <Link href={`/${locale}/urunler`} className="btn">{t(locale, 'cart.continue')}</Link>
        </p>
      </>
    );
  }

  const subtotal = rows.reduce((sum, r) => sum + r.product.price * r.line.qty, 0);
  const shippingCost = subtotal >= shipping.freeOver ? 0 : shipping.fee;
  // Katalog Shopify'dan geliyorsa fiyatlar mağazanın para biriminde olabilir;
  // pazarın varsayılanını varsaymak yerine ürünün kendi birimini kullan.
  const currency = rows[0].product.currency;

  async function checkout() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, lines }),
      });
      const data: { checkoutUrl?: string; error?: string; unavailable?: string[] } = await res.json();
      if (!res.ok || !data.checkoutUrl) {
        if (data.unavailable?.length) {
          const names = data.unavailable
            .map((slug) => catalog.find((p) => p.slug === slug)?.name ?? slug)
            .filter(Boolean)
            .join(', ');
          throw new Error(`${t(locale, 'cart.itemsUnavailable')} ${names}`);
        }
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      setBusy(false);
    }
  }

  const remaining = Math.max(0, shipping.freeOver - subtotal);
  const progress = Math.min(100, Math.round((subtotal / shipping.freeOver) * 100));

  return (
    <>
      <div className="freeship" role="status">
        <p className="small">
          {remaining > 0
            ? tf(locale, 'cart.freeShippingLeft', {
                amount: formatPrice(remaining, locale, rows[0].product.currency),
              })
            : t(locale, 'cart.freeShippingReached')}
        </p>
        <div className="freeship-track">
          <div className="freeship-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {rows.map(({ line, product }) => (
        <div className="cart-row" key={line.slug}>
          <div className="thumb" style={{ background: product.swatch }} />
          <div>
            <Link href={`/${locale}/urunler/${product.slug}`}>{product.name}</Link>
            <div className="small muted">
              {formatPrice(product.price, locale, product.currency)} {t(locale, 'cart.each')}
            </div>
            <div className="qty" style={{ marginTop: '.5rem' }}>
              <button onClick={() => setQty(line.slug, line.qty - 1)} aria-label="−">−</button>
              <span aria-live="polite">{line.qty}</span>
              <button
                onClick={() => setQty(line.slug, Math.min(line.qty + 1, maxQty(product)))}
                aria-label="+"
                disabled={!product.available || line.qty >= maxQty(product)}
              >
                +
              </button>
              <button
                onClick={() => remove(line.slug)}
                style={{ border: 0, background: 'none', textDecoration: 'underline', width: 'auto' }}
              >
                {t(locale, 'cart.remove')}
              </button>
            </div>
          </div>
          <div className="price">{formatPrice(product.price * line.qty, locale, product.currency)}</div>
        </div>
      ))}

      <div className="totals">
        <div>
          <span>{t(locale, 'cart.subtotal')}</span>
          <span className="price">{formatPrice(subtotal, locale, currency)}</span>
        </div>
        <div>
          <span>{t(locale, 'cart.shipping')}</span>
          <span className="price">
            {shippingCost === 0 ? t(locale, 'cart.freeShipping') : formatPrice(shippingCost, locale, currency)}
          </span>
        </div>
        <div className="grand">
          <span>{t(locale, 'cart.total')}</span>
          <span className="price">{formatPrice(subtotal + shippingCost, locale, currency)}</span>
        </div>
        <p className="small muted">
          {t(locale, 'cart.vatIncluded')} {t(locale, 'cart.shippingNote')}
        </p>

        <button className="btn" style={{ width: '100%' }} onClick={checkout} disabled={busy || !checkoutEnabled}>
          {busy ? '…' : t(locale, 'cart.checkout')}
        </button>

        {!checkoutEnabled && (
          <p className="small muted" style={{ marginTop: '.75rem' }}>
            {t(locale, 'cart.checkoutUnavailable')}
          </p>
        )}
        {error && (
          <p className="small" style={{ marginTop: '.75rem', color: 'var(--cb-clay-strong)' }} role="alert">
            {error}
          </p>
        )}
      </div>
    </>
  );
}
