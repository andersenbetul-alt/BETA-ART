// Root layout required by Next.js.
// Actual <html> and <body> with locale-specific lang/dir
// are rendered by app/[locale]/layout.tsx.
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return children as React.ReactElement;
}
