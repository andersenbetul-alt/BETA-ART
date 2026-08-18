'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';

function Links({ locale, rest, search }: { locale: Locale; rest: string; search: string }) {
  return (
    <span className="langs">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest ? `/${rest}` : ''}${search}`}
          className="lang"
          aria-current={l === locale ? 'true' : undefined}
          hrefLang={l}
        >
          {l}
        </Link>
      ))}
    </span>
  );
}

/**
 * Dil değiştirici. Sorgu dizesini korur, böylece arama ve sıralama
 * dil değişince kaybolmaz.
 *
 * useSearchParams bu bileşeni istemcide çözülmeye zorlar; Suspense sınırı
 * Header'da. Sorguyu pathname'e bakan bir useEffect ile okumak yeterli
 * değildi: filtreler yalnızca sorguyu değiştirdiği için efekt tetiklenmiyor
 * ve bağlantı eski sorguyla kalıyordu.
 */
export default function LocaleLinks({ locale, rest }: { locale: Locale; rest: string }) {
  const params = useSearchParams();
  const query = params.toString();
  return <Links locale={locale} rest={rest} search={query ? `?${query}` : ''} />;
}

/** Sunucuda basılan, sorgusuz ilk hâl. */
export function LocaleLinksFallback({ locale, rest }: { locale: Locale; rest: string }) {
  return <Links locale={locale} rest={rest} search="" />;
}
