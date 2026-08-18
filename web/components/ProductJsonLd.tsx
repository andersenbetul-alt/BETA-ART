import { currencyByLocale, type Locale } from '@/lib/i18n';
import type { ProductView } from '@/lib/types';

/** Google Merchant Center ve zengin sonuçlar için schema.org Product işaretlemesi. */
export default function ProductJsonLd({ product, locale }: { product: ProductView; locale: Locale }) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cobban.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.summary,
    sku: product.sku,
    brand: { '@type': 'Brand', name: 'COBBAN' },
    ...(product.imageUrl ? { image: [product.imageUrl] } : {}),
    ...(product.material ? { material: product.material } : {}),
    offers: {
      '@type': 'Offer',
      url: `${site}/${locale}/urunler/${product.slug}`,
      price: product.price,
      priceCurrency: product.currency || currencyByLocale[locale].code,
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'NO',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      // Veri kendi katalogumuzdan geliyor; JSON.stringify XSS'e karşı </script> kaçışıyla korunuyor.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  );
}
