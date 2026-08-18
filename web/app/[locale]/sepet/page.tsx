import { notFound } from 'next/navigation';
import { isLocale, t } from '@/lib/i18n';
import CartView from '@/components/CartView';

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="wrap" style={{ padding: '2.5rem 0 4rem', maxWidth: 820 }}>
      <h1>{t(locale, 'cart.title')}</h1>
      <CartView locale={locale} />
    </div>
  );
}
