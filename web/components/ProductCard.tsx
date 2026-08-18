import Link from 'next/link';
import { formatPrice, t, type Locale } from '@/lib/i18n';
import type { ProductView } from '@/lib/types';

export default function ProductCard({ product, locale }: { product: ProductView; locale: Locale }) {
  const soldOut = !product.available;
  return (
    <Link href={`/${locale}/urunler/${product.slug}`} className="card">
      <div className="thumb" style={{ background: product.swatch }}>
        {product.imageUrl ? (
          // Shopify CDN görselleri; next/image yerine <img> — CDN zaten optimize ediyor.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.imageAlt ?? product.name} loading="lazy" />
        ) : (
          <span aria-hidden="true">CB</span>
        )}
        {soldOut && <em className="badge">{t(locale, 'product.outOfStock')}</em>}
      </div>
      <p className="card-title">{product.name}</p>
      <p className="price">{formatPrice(product.price, locale, product.currency)}</p>
    </Link>
  );
}
