import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: { default: 'COBBAN — Norway made simple', template: '%s · COBBAN' },
  description: 'Ferry cancelled? Train missed? Road closed? COBBAN rebuilds your day.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="wrap">
          <div className="brand">
            <Link href="/" style={{ textDecoration: 'none' }}><b>COBBAN</b></Link>
            <span className="muted">Norway is complicated. We make it simple.</span>
          </div>
          {children}
          <p className="note">
            Transport data: Entur (NLOD). Weather: MET Norway. No account, no tracking.
          </p>
        </div>
      </body>
    </html>
  );
}
