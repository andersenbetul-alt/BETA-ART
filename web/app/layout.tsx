import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://cobban.com'),
  title: { default: 'COBBAN', template: '%s · COBBAN' },
  description: 'Nordisk enkelhet, håndplukket kvalitet.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
