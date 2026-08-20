import Link from 'next/link';
import { countryOrder, type CountryCode } from '@/lib/country.ts';

/**
 * Ülke seçici.
 *
 * En üstte duruyor çünkü turist ülkeyi bilir — panik anında bildiği tek
 * şey odur. Ülke değişince şehir ve sefer parametreleri anlamsızlaşır,
 * o yüzden bağlantı yalnızca `country` taşır: temiz başlangıç.
 */
export default function CountryPicker({
  active, basePath,
}: { active: CountryCode; basePath: string }) {
  return (
    <>
      <h2 className="small muted" style={{ margin: '0 0 .4rem', fontWeight: 600 }}>
        Which country are you in?
      </h2>
      <nav aria-label="Country" className="chips">
        {countryOrder.map((c) => (
          <Link
            key={c.code}
            href={`${basePath}?country=${c.code}`}
            className="chip"
            aria-current={c.code === active ? 'true' : undefined}
          >
            {c.name}
          </Link>
        ))}
      </nav>
    </>
  );
}
