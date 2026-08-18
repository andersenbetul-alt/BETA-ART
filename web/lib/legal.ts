import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Marked } from 'marked';
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Yalnızca güvenli protokoller; javascript: ve data: bağlantıları etkisizleşir. */
function safeHref(href: string): string {
  const value = href.trim();
  return /^(https?:|mailto:|tel:|[#/])/i.test(value) ? value : '#';
}

/**
 * Yasal metinler markdown olarak yazılır ve çıktı `dangerouslySetInnerHTML`
 * ile basılır. Bu belgeleri avukat veya ekip düzenleyecek, metin çoğu zaman
 * Word'den ya da webden yapıştırılacak. İki koruma var:
 *
 * 1. Ham HTML **silinmez, kaçırılır** — görünür metne dönüşür. Silmek,
 *    yapıştırılan bir maddenin sözleşmeden sessizce düşmesi demekti;
 *    eksik bir sözleşme, çirkin görünen bir sözleşmeden çok daha kötüdür.
 * 2. Bağlantı ve görsel adresleri protokol denetiminden geçer, böylece
 *    `[tık](javascript:...)` çalışan koda dönüşmez.
 */
const md = new Marked({ gfm: true, breaks: false });
md.use({
  renderer: {
    html: ({ text }) => escapeHtml(text),
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const attrs = title ? ` title="${escapeHtml(title)}"` : '';
      return `<a href="${escapeHtml(safeHref(href))}"${attrs}>${text}</a>`;
    },
    image({ href, title, text }) {
      const attrs = title ? ` title="${escapeHtml(title)}"` : '';
      return `<img src="${escapeHtml(safeHref(href))}" alt="${escapeHtml(text)}"${attrs} />`;
    },
  },
});

const DOCS_DIR = path.join(process.cwd(), '..', 'docs', 'sozlesmeler');

/**
 * Bir dilde olmayan sayfanın o dildeki karşılığı.
 *
 * Türkçede iade ve ön bilgilendirme ayrı belgelerdir; Norveççe ve İngilizcede
 * ikisi de satış koşullarının içindedir. Dil değiştirici yolu koruduğu için
 * /tr/kurumsal/iade sayfasından NO'ya geçiş /no/kurumsal/iade üretiyordu ve
 * 404 veriyordu. Bu eşleme onu doğru belgeye yönlendirir.
 */
const aliases: Record<Locale, Record<string, LegalSlug>> = {
  no: { iade: 'satis', 'on-bilgilendirme': 'satis' },
  en: { iade: 'satis', 'on-bilgilendirme': 'satis' },
  tr: {},
};

/** Bu dilde ayrı sayfası olmayan slug için hedef sayfa yönlendiriliyorsa onun slug'ı. */
export function getLegalAlias(locale: Locale, slug: string): LegalSlug | null {
  return aliases[locale][slug] ?? null;
}

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
    html: await md.parse(body),
    placeholders,
  };
}
