'use client';

import Link from 'next/link';
import { formatPrice, t, type Locale } from '@/lib/i18n';
import { getProduct, shipping } from '@/lib/products';
import { useCart } from './CartContext';

export default function CartView({ locale }: { locale: Locale }) {
  const { lines, setQty, remove, ready } = useCart();

  if (!ready) return <p className="muted">…</p>;

  const rows = lines
    .map((line) => ({ line, product: getProduct(line.slug) }))
    .filter((r): r is { line: typeof r.line; product: NonNullable<typeof r.product> } => Boolean(r.product));

  if (rows.length === 0) {
    return (
      <>
        <p className="muted">{t(locale, 'cart.empty')}</p>
        <p><Link href={`/${locale}/urunler`} className="btn">{t(locale, 'cart.continue')}</Link></p>
      </>
    );
  }

  const subtotal = rows.reduce((sum, r) => sum + r.product.price[locale] * r.line.qty, 0);
  const { fee, freeOver } = shipping[locale];
  const shippingCost = subtotal >= freeOver ? 0 : fee;

  return (
    <>
      {rows.map(({ line, product }) => (
        <div className="cart-row" key={line.slug}>
          <div className="thumb" style={{ background: product.swatch }} />
          <div>
            <Link href={`/${locale}/urunler/${product.slug}`}>{product.name[locale]}</Link>
            <div className="small muted">{product.sku}</div>
            <div className="qty" style={{ marginTop: '.5rem' }}>
              <button onClick={() => setQty(line.slug, line.qty - 1)} aria-label="−">−</button>
              <span aria-live="polite">{line.qty}</span>
              <button
                onClick={() => setQty(line.slug, Math.min(line.qty + 1, product.stock))}
                aria-label="+"
                disabled={line.qty >= product.stock}
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
          <div className="price">{formatPrice(product.price[locale] * line.qty, locale)}</div>
        </div>
      ))}

      <div className="totals">
        <div>
          <span>{t(locale, 'cart.subtotal')}</span>
          <span className="price">{formatPrice(subtotal, locale)}</span>
        </div>
        <div>
          <span>{t(locale, 'cart.shipping')}</span>
          <span className="price">
            {shippingCost === 0 ? t(locale, 'cart.freeShipping') : formatPrice(shippingCost, locale)}
          </span>
        </div>
        <div className="grand">
          <span>{t(locale, 'cart.total')}</span>
          <span className="price">{formatPrice(subtotal + shippingCost, locale)}</span>
        </div>
        <p className="small muted">{t(locale, 'cart.vatIncluded')}</p>
        <button className="btn" style={{ width: '100%' }} disabled>
          {t(locale, 'cart.checkout')}
        </button>
        <p className="small muted" style={{ marginTop: '.75rem' }}>
          Checkout, Shopify Storefront API'ye bağlandığında etkinleşir — bkz. <code>web/README.md</code>.
        </p>
      </div>
    </>
  );
}
