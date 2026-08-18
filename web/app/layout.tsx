import type { ReactNode } from 'react';
import './globals.css';
import { SITE_URL } from '@/lib/site';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'COBBAN', template: '%s · COBBAN' },
  description: 'Nordisk enkelhet, håndplukket kvalitet.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
