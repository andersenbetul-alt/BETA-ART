import { SITE_URL } from '@/lib/site';
import type { Locale } from '@/lib/i18n';

export default function OrganizationJsonLd({ locale }: { locale: Locale }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'COBBAN',
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/favicon.svg`,
    email: 'hei@cobban.com',
    areaServed: ['NO', 'SE', 'DK', 'DE', 'TR'],
    currenciesAccepted: 'NOK, EUR, TRY',
    paymentAccepted: 'Visa, Mastercard, Vipps, Klarna',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  );
}
