import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatPrice, isLocale, locales, t } from '@/lib/i18n';
import { getProduct } from '@/lib/catalog';
import { products } from '@/lib/products';
import AddToCart from '@/components/AddToCart';
import ProductJsonLd from '@/components/ProductJsonLd';

export function generateStaticParams() {
  return locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = await getProduct(locale, slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.summary,
    alternates: {
      canonical: `/${locale}/urunler/${slug}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/urunler/${slug}`])),
    },
    openGraph: {
      title: product.name,
      description: product.summary,
      type: 'website',
      images: product.imageUrl ? [product.imageUrl] : undefined,
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
  const product = await getProduct(locale, slug);
  if (!product) notFound();

  const soldOut = !product.available;

  return (
    <div className="wrap">
      <ProductJsonLd product={product} locale={locale} />

      <p style={{ paddingTop: '1.5rem' }}>
        <Link href={`/${locale}/urunler`} className="small muted">← {t(locale, 'product.back')}</Link>
      </p>

      <div className="pdp">
        <div className="thumb" style={{ background: product.swatch }}>
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.imageAlt ?? product.name} />
          ) : (
            <span aria-hidden="true">COBBAN</span>
          )}
        </div>

        <div>
          <h1>{product.name}</h1>
          <p className="price" style={{ fontSize: '1.5rem' }}>{formatPrice(product.price, locale, product.currency)}</p>
          <p className={soldOut ? 'stock-no' : 'stock-ok'}>
            {soldOut ? t(locale, 'product.outOfStock') : t(locale, 'product.inStock')}
          </p>

          <p>{product.summary}</p>
          {product.bullets.length > 0 && (
            <ul>
              {product.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}

          <AddToCart slug={product.slug} locale={locale} disabled={soldOut} />

          <table className="spec">
            <tbody>
              {product.material && (
                <tr><th>{t(locale, 'product.material')}</th><td>{product.material}</td></tr>
              )}
              {product.dimensions && (
                <tr><th>{t(locale, 'product.dimensions')}</th><td>{product.dimensions}</td></tr>
              )}
              {product.originCountry && (
                <tr>
                  <th>{t(locale, 'product.origin')}</th>
                  <td>{product.originCountry}{product.hsCode && ` · HS ${product.hsCode}`}</td>
                </tr>
              )}
              <tr><th>{t(locale, 'product.sku')}</th><td>{product.sku}</td></tr>
            </tbody>
          </table>

          <p className="small muted">{t(locale, 'usp.shipping')} · {t(locale, 'usp.returns')}</p>
        </div>
      </div>
    </div>
  );
}
