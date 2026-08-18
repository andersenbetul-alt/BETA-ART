import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, t } from '@/lib/i18n';
import { getProducts } from '@/lib/catalog';
import { categories } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const all = await getProducts(locale);
  const featured = all.filter((p) => p.available).slice(0, 4);

  return (
    <div className="wrap">
      <section className="hero">
        <h1>{t(locale, 'hero.title')}</h1>
        <p>{t(locale, 'hero.body')}</p>
        <p style={{ marginTop: '1.75rem' }}>
          <Link href={`/${locale}/urunler`} className="btn">{t(locale, 'hero.cta')}</Link>
        </p>
      </section>

      <section className="usps">
        <div>✓ {t(locale, 'usp.shipping')}</div>
        <div>✓ {t(locale, 'usp.returns')}</div>
        <div>✓ {t(locale, 'usp.support')}</div>
        <div>✓ {t(locale, 'usp.vipps')}</div>
      </section>

      <section style={{ padding: '3rem 0' }}>
        <div className="filters">
          {categories.map((c) => (
            <Link key={c.id} href={`/${locale}/urunler?kategori=${c.id}`} className="chip">
              {c.name[locale]}
            </Link>
          ))}
        </div>
        <div className="grid">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
