import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, locales, t } from '@/lib/i18n';
import { getLegalDocument, legalPages } from '@/lib/legal';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    legalPages(locale).map((page) => ({ locale, sayfa: page.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; sayfa: string }>;
}): Promise<Metadata> {
  const { locale, sayfa } = await params;
  if (!isLocale(locale)) return {};
  const doc = await getLegalDocument(locale, sayfa);
  if (!doc) return {};
  return {
    title: doc.title,
    alternates: { canonical: `/${locale}/kurumsal/${sayfa}` },
    // Eksik alan varsa metin taslaktır; arama motorunun indekslemesi istenmez.
    robots: doc.placeholders.length > 0 ? { index: false, follow: false } : undefined,
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; sayfa: string }>;
}) {
  const { locale, sayfa } = await params;
  if (!isLocale(locale)) notFound();

  const doc = await getLegalDocument(locale, sayfa);
  if (!doc) notFound();

  return (
    <div className="wrap legal">
      <p style={{ paddingTop: '1.5rem' }}>
        <Link href={`/${locale}/kurumsal`} className="small muted">← {t(locale, 'about.title')}</Link>
      </p>

      <h1>{doc.title}</h1>

      {doc.placeholders.length > 0 && (
        <div className="notice" role="note">
          <strong>{t(locale, 'legal.draftTitle')}</strong>
          <p className="small" style={{ margin: '.5rem 0 0' }}>
            {t(locale, 'legal.draftBody')}
          </p>
          <p className="small muted" style={{ margin: '.5rem 0 0' }}>
            <code>{doc.placeholders.join(' · ')}</code>
          </p>
        </div>
      )}

      <article dangerouslySetInnerHTML={{ __html: doc.html }} />
    </div>
  );
}
