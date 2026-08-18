import Link from 'next/link';
import { formatPrice, t, type Locale } from '@/lib/i18n';
import type { Product } from '@/lib/products';

export default function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const soldOut = product.stock === 0;
  return (
    <Link href={`/${locale}/urunler/${product.slug}`} className="card">
      <div className="thumb" style={{ background: product.swatch }}>
        <span aria-hidden="true">CB</span>
        {soldOut && <em className="badge">{t(locale, 'product.outOfStock')}</em>}
      </div>
      <p className="card-title">{product.name[locale]}</p>
      <p className="price">{formatPrice(product.price[locale], locale)}</p>
    </Link>
  );
}
