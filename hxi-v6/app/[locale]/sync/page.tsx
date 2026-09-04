import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, localeData, siteUrl } from '@/content/locales';

const SYNC_MAIL = 'mailto:booking@hximusic.com?subject=HXI%20sync%20inquiry';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = localeData[locale].syncPage;
  return {
    metadataBase: new URL(siteUrl),
    title: copy.title,
    description: copy.description,
    alternates: { canonical: `${siteUrl}/${locale}/sync/` },
    robots: 'index, follow, noai, noimageai',
    icons: { icon: '/assets/favicon.svg' },
    openGraph: {
      title: copy.title,
      description: copy.description,
      type: 'website',
      url: `${siteUrl}/${locale}/sync/`,
      siteName: 'HXI',
      images: [{ url: '/assets/og-hxi.jpg', width: 1200, height: 630, alt: 'HXI — Nordic Phonk' }]
    },
    twitter: { card: 'summary_large_image', title: copy.title, description: copy.description, images: ['/assets/og-hxi.jpg'] }
  };
}

export default async function SyncPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = localeData[locale];
  const copy = d.syncPage;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}/${locale}/sync/#webpage`,
        url: `${siteUrl}/${locale}/sync/`,
        name: copy.title,
        description: copy.description,
        inLanguage: d.hreflang,
        about: { '@id': `${siteUrl}/#artist` }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'HXI', item: `${siteUrl}/${locale}/` },
          { '@type': 'ListItem', position: 2, name: copy.heading, item: `${siteUrl}/${locale}/sync/` }
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
          <h2>{copy.worksH}</h2>
          <div className="proof-grid mt24 sync-works">
            {copy.works.map((w) => (
              <article className="proof-card" key={w.t}>
                <span className="tag">{w.meta}</span>
                <h3>{w.t}</h3>
                <p>{w.c}</p>
              </article>
            ))}
          </div>
          <h2>{copy.fieldsH}</h2>
          <ul className="sync-fields">
            {copy.fields.map((f) => <li key={f}>{f}</li>)}
          </ul>
          <div className="actions mt34">
            <a className="btn primary" href={SYNC_MAIL}>{copy.emailCta}</a>
            <Link className="btn" href={`/${locale}/`}>{d.privacy.back}</Link>
          </div>
          <p className="sync-note">{copy.note}</p>
        </div>
      </main>
    </>
  );
}
