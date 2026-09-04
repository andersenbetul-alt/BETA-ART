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

  // Only releases with a verified track/album URL enter the schema (rule 8 —
  // no fabricated data). Entries whose link resolves to the artist page are
  // omitted rather than pointed at a generic URL.
  const recordings = [
    { name: 'help urself', url: 'https://open.spotify.com/album/06b4DfalAz3dIQ03bb0onI', year: '2022' },
    { name: 'AURORA LOVE', url: 'https://open.spotify.com/track/5VjosjVlvJPfnttKebrJ6Q', year: '2025' },
    { name: 'X-PIRATA', url: 'https://open.spotify.com/track/1zy2jcxgoURrOTfgdQkVsI', year: '2024' },
    { name: 'Put you in a COFFIN!', url: 'https://open.spotify.com/track/2ilS7mn0Bd9O06gZqcNoDK', year: '2023' }
  ];

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
    ],
    track: recordings.map((r) => ({
      '@type': 'MusicRecording',
      name: r.name,
      url: r.url,
      datePublished: r.year,
      byArtist: { '@id': `${siteUrl}/#artist` }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SitePage locale={locale as Locale} />
    </>
  );
}
