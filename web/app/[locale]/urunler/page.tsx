import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, t } from '@/lib/i18n';
import { getProducts } from '@/lib/catalog';
import { categories, type CategoryId } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { kategori } = await searchParams;
  const active = categories.find((c) => c.id === kategori)?.id as CategoryId | undefined;
  const list = await getProducts(locale, active);

  return (
    <div className="wrap" style={{ padding: '2.5rem 0 4rem' }}>
      <h1>{active ? categories.find((c) => c.id === active)!.name[locale] : t(locale, 'products.title')}</h1>

      <div className="filters">
        <Link href={`/${locale}/urunler`} className="chip" aria-current={!active ? 'true' : undefined}>
          {t(locale, 'products.all')}
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/${locale}/urunler?kategori=${c.id}`}
            className="chip"
            aria-current={active === c.id ? 'true' : undefined}
          >
            {c.name[locale]}
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="muted">{t(locale, 'products.empty')}</p>
      ) : (
        <div className="grid">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
