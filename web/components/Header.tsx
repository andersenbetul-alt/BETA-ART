'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { locales, t, type Locale } from '@/lib/i18n';
import { useCart } from './CartContext';

export default function Header({ locale }: { locale: Locale }) {
  const { count, ready } = useCart();
  const pathname = usePathname();
  // /no/urunler/x → urunler/x : dil değişince aynı sayfada kal
  const rest = pathname.split('/').slice(2).join('/');

  // Sorgu dizesi yalnızca istemcide okunur; useSearchParams bu bileşeni
  // Suspense'e zorlar ve statik üretimi bozar. Dil bağlantısı önce sorgusuz
  // basılır, hidrasyondan sonra filtre/sıralama korunacak şekilde tamamlanır.
  const [search, setSearch] = useState('');
  useEffect(() => {
    setSearch(window.location.search);
  }, [pathname]);

  return (
    <header className="header">
      <div className="wrap header-inner">
        <Link href={`/${locale}`} className="logo">COBBAN</Link>

        <nav className="nav" aria-label="COBBAN">
          <Link href={`/${locale}/urunler`}>{t(locale, 'nav.products')}</Link>
          <Link href={`/${locale}/kurumsal`}>{t(locale, 'nav.about')}</Link>
          <Link href={`/${locale}/sepet`}>
            {t(locale, 'nav.cart')}{ready && count > 0 ? ` (${count})` : ''}
          </Link>
        </nav>

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
      </div>
    </header>
  );
}
