import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, t, type Locale } from '@/lib/i18n';
import { getProducts } from '@/lib/catalog';
import { categories, type CategoryId } from '@/lib/products';
import type { ProductView } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';

type Sort = 'featured' | 'fiyat-artan' | 'fiyat-azalan' | 'isim';
const SORTS: Sort[] = ['featured', 'fiyat-artan', 'fiyat-azalan', 'isim'];

function search(list: ProductView[], query: string, locale: Locale): ProductView[] {
  const needle = query.trim().toLocaleLowerCase(locale);
  if (!needle) return list;
  return list.filter((p) =>
    [p.name, p.summary, p.sku, p.material, ...p.bullets]
      .join(' ')
      .toLocaleLowerCase(locale)
      .includes(needle),
  );
}

function sortProducts(list: ProductView[], sort: Sort, locale: Locale): ProductView[] {
  const sorted = [...list];
  switch (sort) {
    case 'fiyat-artan':
      return sorted.sort((a, b) => a.price - b.price);
    case 'fiyat-azalan':
      return sorted.sort((a, b) => b.price - a.price);
    case 'isim':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, locale));
    default:
      // Önerilen: satılabilir ürünler önce, kaynak sırası korunur.
      return sorted.sort((a, b) => Number(b.available) - Number(a.available));
  }
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ kategori?: string; q?: string; sirala?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { kategori, q = '', sirala } = await searchParams;
  const active = categories.find((c) => c.id === kategori)?.id as CategoryId | undefined;
  const sort: Sort = SORTS.includes(sirala as Sort) ? (sirala as Sort) : 'featured';

  const list = sortProducts(search(await getProducts(locale, active), q, locale), sort, locale);

  const heading = q
    ? `${t(locale, 'search.results')} “${q}”`
    : active
      ? categories.find((c) => c.id === active)!.name[locale]
      : t(locale, 'products.title');

  function href(categoryId?: CategoryId) {
    const params = new URLSearchParams();
    if (categoryId) params.set('kategori', categoryId);
    if (q) params.set('q', q);
    if (sort !== 'featured') params.set('sirala', sort);
    const qs = params.toString();
    return `/${locale}/urunler${qs ? `?${qs}` : ''}`;
  }

  return (
    <div className="wrap" style={{ paddingBlock: '2.5rem 4rem' }}>
      <h1>{heading}</h1>

      <ProductFilters locale={locale} query={q} sort={sort} category={active} />

      <div className="filters">
        <Link href={href()} className="chip" aria-current={!active ? 'true' : undefined}>
          {t(locale, 'products.all')}
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={href(c.id)}
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
