import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SitePage } from '@/components/SitePage';
import { isLocale, localeCodes, localeData, siteUrl, type Locale } from '@/content/locales';

function alternates(locale: Locale) {
  const languages = Object.fromEntries(
    localeCodes.map((code) => [localeData[code].hreflang, `${siteUrl}/${code}/`])
  );
  return {
    canonical: `${siteUrl}/${locale}/`,
    languages: { ...languages, 'x-default': `${siteUrl}/en/` }
  };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = localeData[locale];
  return {
    metadataBase: new URL(siteUrl),
    title: d.title,
    description: d.description,
    robots: 'index, follow, noai, noimageai',
    alternates: alternates(locale),
    icons: { icon: '/assets/favicon.svg' },
    openGraph: {
      type: 'website',
      title: d.title,
      description: d.description,
      url: `${siteUrl}/${locale}/`,
      siteName: 'HXI',
      images: [{ url: '/assets/og-hxi.jpg', width: 1200, height: 630, alt: 'HXI — Nordic Phonk' }]
    },
    twitter: {
      card: 'summary_large_image',
      title: d.title,
      description: d.description,
      images: ['/assets/og-hxi.jpg']
    },
    other: {
      'theme-color': '#0A0A0A'
    }
  };
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = localeData[locale];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    '@id': `${siteUrl}/#artist`,
    name: 'HXI',
    url: `${siteUrl}/${locale}/`,
    description: d.description,
    image: `${siteUrl}/assets/og-hxi.jpg`,
    foundingLocation: { '@type': 'Place', name: 'Oslo, Norway' },
    foundingDate: '2021',
    genre: ['Phonk', 'Electronic', 'Drift Phonk'],
    sameAs: [
      'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU',
      'https://www.instagram.com/prod.hxi/',
      'https://www.youtube.com/@hximusic',
      'https://ncs.io/artist/1169/hxi'
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SitePage locale={locale as Locale} />
    </>
  );
}
