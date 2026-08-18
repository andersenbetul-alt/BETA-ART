import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, t, type Locale } from '@/lib/i18n';
import { legalPages } from '@/lib/legal';

const intro: Record<Locale, string> = {
  no: 'COBBAN er en kuratert nettbutikk. Vi velger få, men riktige produkter — laget av folk vi kjenner, i materialer vi tør stå for.',
  en: 'COBBAN is a curated online store. We choose few but right products — made by people we know, in materials we stand behind.',
  tr: 'COBBAN, seçki yapan bir online mağazadır. Az ama doğru ürün seçiyoruz — tanıdığımız insanların ürettiği, arkasında durabildiğimiz malzemelerden.',
};

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="wrap" style={{ paddingBlock: '2.5rem 4rem', maxWidth: 760 }}>
      <h1>{t(locale, 'about.title')}</h1>
      <p style={{ fontSize: '1.125rem' }}>{intro[locale]}</p>

      <h2 style={{ marginTop: '3rem' }}>{t(locale, 'footer.legal')}</h2>
      <ul>
        {legalPages(locale).map((page) => (
          <li key={page.slug} style={{ marginBottom: '.4rem' }}>
            <Link href={`/${locale}/kurumsal/${page.slug}`}>{page.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
