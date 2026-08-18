'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { t, type Locale } from '@/lib/i18n';
import { useCart } from './CartContext';
import LocaleLinks, { LocaleLinksFallback } from './LocaleLinks';

export default function Header({ locale }: { locale: Locale }) {
  const { count, ready } = useCart();
  const pathname = usePathname();
  // /no/urunler/x → urunler/x : dil değişince aynı sayfada kal
  const rest = pathname.split('/').slice(2).join('/');

  return (
    <header className="header">
      <div className="wrap header-inner">
        <Link href={`/${locale}`} className="logo">COBBAN</Link>

        <nav className="nav" aria-label={t(locale, 'a11y.mainNav')}>
          <Link href={`/${locale}/urunler`}>{t(locale, 'nav.products')}</Link>
          <Link href={`/${locale}/kurumsal`}>{t(locale, 'nav.about')}</Link>
          <Link href={`/${locale}/sepet`}>
            {t(locale, 'nav.cart')}{ready && count > 0 ? ` (${count})` : ''}
          </Link>
        </nav>

        <Suspense fallback={<LocaleLinksFallback locale={locale} rest={rest} />}>
          <LocaleLinks locale={locale} rest={rest} />
        </Suspense>
      </div>
    </header>
  );
}
