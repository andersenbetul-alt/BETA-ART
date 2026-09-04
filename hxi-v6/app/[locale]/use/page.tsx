import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, localeData, siteUrl } from '@/content/locales';

const NCS_TRACKS = [
  { name: 'Lock n’ Load', meta: '2024 · NCS', href: 'https://ncs.io/LockNLoad' },
  { name: 'Round Around', meta: '2025 · NCS · Nateki', href: 'https://ncs.io/roundaround' },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = localeData[locale].usePage;
  return {
    metadataBase: new URL(siteUrl),
    title: copy.title,
    description: copy.description,
    alternates: { canonical: `${siteUrl}/${locale}/use/` },
    robots: 'index, follow, noai, noimageai',
    icons: { icon: '/assets/favicon.svg' },
    openGraph: {
      title: copy.title,
      description: copy.description,
      type: 'website',
      url: `${siteUrl}/${locale}/use/`,
      siteName: 'HXI',
      images: [{ url: '/assets/og-hxi.jpg', width: 1200, height: 630, alt: 'HXI — Nordic Phonk' }]
    },
    twitter: { card: 'summary_large_image', title: copy.title, description: copy.description, images: ['/assets/og-hxi.jpg'] }
  };
}

export default async function UsePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = localeData[locale];
  const copy = d.usePage;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}/${locale}/use/#webpage`,
        url: `${siteUrl}/${locale}/use/`,
        name: copy.title,
        description: copy.description,
        inLanguage: d.hreflang,
        about: { '@id': `${siteUrl}/#artist` }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'HXI', item: `${siteUrl}/${locale}/` },
          { '@type': 'ListItem', position: 2, name: copy.heading, item: `${siteUrl}/${locale}/use/` }
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <a className="skip" href="#main">{d.skip}</a>
      <header className="nav privacy-nav">
        <Link className="brand" href={`/${locale}/`} aria-label="HXI"><b>X</b> HXI</Link>
        <Link className="nav-cta" href={`/${locale}/`}>{d.privacy.back}</Link>
      </header>
      <main className="section privacy-page" id="main">
        <div className="section-inner privacy-inner">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="privacy-title">{copy.heading}</h1>
          <p className="privacy-lead">{copy.lead}</p>
          <div className="use-note">
            <p className="eyebrow">{copy.noteH}</p>
            <p>{copy.note}</p>
          </div>
          <h2>{copy.ncsH}</h2>
          <p>{copy.ncsP}</p>
          <div className="creator-list mt24">
            {NCS_TRACKS.map((t) => (
              <a key={t.name} className="creator-link" href={t.href} target="_blank" rel="noopener noreferrer">
                <strong>{t.name} · {t.meta}</strong>
                <span>{copy.checkTerms}</span>
              </a>
            ))}
          </div>
          <div className="actions mt24">
            <a className="btn ghost" href="https://ncs.io/artist/1169/hxi" target="_blank" rel="noopener noreferrer">{d.credits.ncsCta}</a>
          </div>
          <h2>{copy.proH}</h2>
          <p>{copy.proP}</p>
          <div className="actions mt34">
            <Link className="btn primary" href={`/${locale}/sync/`}>{copy.syncCta}</Link>
            <Link className="btn" href={`/${locale}/`}>{d.privacy.back}</Link>
          </div>
        </div>
      </main>
    </>
  );
}
