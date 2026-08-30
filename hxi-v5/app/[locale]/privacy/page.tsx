import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, localeData, siteUrl } from '@/content/locales';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = localeData[locale].privacy;
  return {
    metadataBase: new URL(siteUrl),
    title: copy.title,
    description: copy.description,
    alternates: { canonical: `${siteUrl}/${locale}/privacy/` },
    robots: 'index, follow, noai, noimageai',
    icons: { icon: '/assets/favicon.svg' },
    openGraph: {
      title: copy.title,
      description: copy.description,
      type: 'website',
      url: `${siteUrl}/${locale}/privacy/`,
      siteName: 'HXI',
      images: [{ url: '/assets/og-hxi.jpg', width: 1200, height: 630, alt: 'HXI — Nordic Phonk' }]
    },
    twitter: { card: 'summary_large_image', title: copy.title, description: copy.description, images: ['/assets/og-hxi.jpg'] }
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = localeData[locale];
  const copy = d.privacy;

  return (
    <>
      <a className="skip" href="#main">{d.skip}</a>
      <header className="nav privacy-nav">
        <Link className="brand" href={`/${locale}/`} aria-label="HXI"><b>X</b> HXI</Link>
        <Link className="nav-cta" href={`/${locale}/`}>{copy.back}</Link>
      </header>
      <main className="section privacy-page" id="main">
        <div className="section-inner privacy-inner">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="privacy-title">{copy.heading}</h1>
          <p className="privacy-lead">{copy.lead}</p>
          <h2>{copy.hostingH}</h2><p>{copy.hostingP}</p>
          <h2>{copy.spotifyH}</h2><p>{copy.spotifyP}</p>
          <h2>{copy.contactH}</h2><p>{copy.contactP}</p>
          <div className="actions mt34"><Link className="btn primary" href={`/${locale}/`}>{copy.back}</Link></div>
        </div>
      </main>
    </>
  );
}
