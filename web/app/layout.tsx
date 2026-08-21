import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';
import { siteUrl } from '@/lib/site.ts';

const description =
  'Ferry cancelled, train missed, rain ruining the day? Tell COBBAN what went wrong anywhere '
  + 'in Europe and get the fix — with your hotel, dinner and flight still accounted for.';

export const metadata = {
  /*
   * Mutlak adres olmadan canonical etiketleri ve paylaşım kartları çözümlenmiyor.
   * Yardım sayfaları göreli canonical veriyor; kökü buradan alıyorlar.
   */
  metadataBase: new URL(siteUrl),
  title: { default: 'COBBAN — travel problems in Europe, solved in one screen', template: '%s · COBBAN' },
  description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'COBBAN',
    title: 'COBBAN — travel problems in Europe, solved in one screen',
    description,
    url: siteUrl,
    locale: 'en',
  },
  /* Görseller app/ altındaki dosya adı sözleşmesinden geliyor (opengraph-image.png,
     twitter-image.png): Next boyutu, tipi ve önbellek anahtarını kendi üretiyor.
     Kart tipi 1200×630 için summary_large_image olmalı. */
  twitter: { card: 'summary_large_image', title: 'COBBAN', description },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="wrap">
          <div className="brand">
            <Link href="/" style={{ textDecoration: 'none' }}><b>COBBAN</b></Link>
            <span className="muted">Europe is complicated. We make it simple.</span>
          </div>
          {children}
          <p className="note">
            Live departures in Norway: Entur (NLOD). Weather worldwide: MET Norway.
            Everything else is checked by hand. No account, no tracking.
          </p>
        </div>
      </body>
    </html>
  );
}
