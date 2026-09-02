import { notFound } from 'next/navigation';
import { isLocale, localeData, type Locale } from '@/content/locales';
import '../globals.css';

export async function generateStaticParams() {
  return Object.keys(localeData).map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const data = localeData[locale as Locale];

  return (
    <html lang={data.lang} dir={data.direction}>
      <body>{children}</body>
    </html>
  );
}
