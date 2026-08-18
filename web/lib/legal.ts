import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';
import type { Locale } from './i18n';

/**
 * Yasal metinler `docs/sozlesmeler/` altında tek kaynak olarak tutulur;
 * site onları derleme anında okur. Böylece avukata giden dosya ile
 * yayındaki metin ayrışamaz.
 */

export type LegalSlug = 'satis' | 'on-bilgilendirme' | 'iade' | 'gizlilik' | 'cerez';

type LegalPage = { slug: LegalSlug; file: string; title: string };

/**
 * Her dilin kendi belge seti var. Norveççe ve İngilizcede cayma hakkı
 * satış koşullarının içinde (§6) olduğu için ayrı `iade` sayfası yok.
 */
const pagesByLocale: Record<Locale, LegalPage[]> = {
  no: [
    { slug: 'satis', file: 'NO-salgsbetingelser.md', title: 'Salgsbetingelser' },
    { slug: 'gizlilik', file: 'NO-personvernerklaering.md', title: 'Personvernerklæring' },
    { slug: 'cerez', file: 'cerez-politikasi.md', title: 'Informasjonskapsler' },
  ],
  en: [
    { slug: 'satis', file: 'EN-terms-of-sale.md', title: 'Terms of sale' },
    { slug: 'gizlilik', file: 'EN-privacy-policy.md', title: 'Privacy policy' },
    { slug: 'cerez', file: 'cerez-politikasi.md', title: 'Cookie policy' },
  ],
  tr: [
    { slug: 'satis', file: 'TR-mesafeli-satis-sozlesmesi.md', title: 'Mesafeli Satış Sözleşmesi' },
    { slug: 'on-bilgilendirme', file: 'TR-on-bilgilendirme-formu.md', title: 'Ön Bilgilendirme Formu' },
    { slug: 'iade', file: 'TR-iade-ve-cayma-politikasi.md', title: 'İade ve Cayma Politikası' },
    { slug: 'gizlilik', file: 'TR-kvkk-aydinlatma-metni.md', title: 'KVKK Aydınlatma Metni' },
    { slug: 'cerez', file: 'cerez-politikasi.md', title: 'Çerez Politikası' },
  ],
};

const DOCS_DIR = path.join(process.cwd(), '..', 'docs', 'sozlesmeler');

export function legalPages(locale: Locale): LegalPage[] {
  return pagesByLocale[locale];
}

export type LegalDocument = {
  title: string;
  html: string;
  /** Doldurulmamış {{...}} alanları — varsa metin yayına hazır değildir. */
  placeholders: string[];
};

export async function getLegalDocument(
  locale: Locale,
  slug: string,
): Promise<LegalDocument | null> {
  const page = pagesByLocale[locale].find((p) => p.slug === slug);
  if (!page) return null;

  let markdown: string;
  try {
    markdown = await readFile(path.join(DOCS_DIR, page.file), 'utf8');
  } catch (error) {
    console.error(`[legal] ${page.file} okunamadı:`, error);
    return null;
  }

  // İlk H1 sayfa başlığı olarak ayrıca gösterildiği için gövdeden çıkarılır.
  const body = markdown.replace(/^#\s+.*\n/, '');

  const placeholders = [...new Set(body.match(/\{\{[A-Z_]+\}\}/g) ?? [])];

  return {
    title: page.title,
    html: await marked.parse(body, { gfm: true, breaks: false }),
    placeholders,
  };
}
