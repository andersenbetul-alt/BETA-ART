import { notFound } from 'next/navigation';
import { isLocale, t } from '@/lib/i18n';
import { getProducts } from '@/lib/catalog';
import { shipping } from '@/lib/products';
import { isShopifyConfigured } from '@/lib/shopify';
import CartView from '@/components/CartView';

// Sepet, canlı stok ve fiyata dayanır — statik üretilmez.
export const dynamic = 'force-dynamic';

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const catalog = await getProducts(locale);

  return (
    <div className="wrap" style={{ paddingBlock: '2.5rem 4rem', maxWidth: 820 }}>
      <h1>{t(locale, 'cart.title')}</h1>
      <CartView
        locale={locale}
        catalog={catalog}
        shipping={shipping[locale]}
        checkoutEnabled={isShopifyConfigured()}
      />
    </div>
  );
}
