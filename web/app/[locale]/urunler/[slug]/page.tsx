import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatPrice, isLocale, locales, t } from '@/lib/i18n';
import { getProduct, products } from '@/lib/products';
import AddToCart from '@/components/AddToCart';

export function generateStaticParams() {
  return locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product || !isLocale(locale)) return {};
  return {
    title: product.name[locale],
    description: product.summary[locale],
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/urunler/${slug}`])),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = getProduct(slug);
  if (!product) notFound();

  const soldOut = product.stock === 0;

  return (
    <div className="wrap">
      <p style={{ paddingTop: '1.5rem' }}>
        <Link href={`/${locale}/urunler`} className="small muted">← {t(locale, 'product.back')}</Link>
      </p>

      <div className="pdp">
        <div className="thumb" style={{ background: product.swatch }}>
          <span aria-hidden="true">COBBAN</span>
        </div>

        <div>
          <h1>{product.name[locale]}</h1>
          <p className="price" style={{ fontSize: '1.5rem' }}>
            {formatPrice(product.price[locale], locale)}
          </p>
          <p className={soldOut ? 'stock-no' : 'stock-ok'}>
            {soldOut ? t(locale, 'product.outOfStock') : t(locale, 'product.inStock')}
          </p>

          <p>{product.summary[locale]}</p>
          <ul>
            {product.bullets[locale].map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>

          <AddToCart slug={product.slug} locale={locale} disabled={soldOut} />

          <table className="spec">
            <tbody>
              <tr><th>{t(locale, 'product.material')}</th><td>{product.material[locale]}</td></tr>
              <tr><th>{t(locale, 'product.dimensions')}</th><td>{product.dimensions}</td></tr>
              <tr><th>{t(locale, 'product.origin')}</th><td>{product.originCountry} · HS {product.hsCode}</td></tr>
              <tr><th>{t(locale, 'product.sku')}</th><td>{product.sku}</td></tr>
            </tbody>
          </table>

          <p className="small muted">
            {t(locale, 'usp.shipping')} · {t(locale, 'usp.returns')}
          </p>
        </div>
      </div>
    </div>
  );
}
