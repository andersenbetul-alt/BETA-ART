/* Maximum Visibility — yayın öncesi otomatik kural denetimi.
 *
 * Kurallar belge olarak kalırsa uygulanmaz. Bu modül taslağı okur ve her
 * kuralı tek tek işaretler; ihlal varsa yayın kapısı kapanır.
 *
 * Not: Bunlar "Google'ı kandırma" kuralları değil. Hepsi okunabilirlik ve
 * bulunabilirlik kuralı — ikisi 2026'da aynı şey.
 */

const words = (t) => String(t).trim().split(/\s+/).filter(Boolean);

/* Bir kuralın sonucu: geçti / uyarı / kaldı. */
const ok = (id, msg) => ({ id, status: 'gecti', msg });
const warn = (id, msg) => ({ id, status: 'uyari', msg });
const fail = (id, msg) => ({ id, status: 'kaldi', msg });

/**
 * @param {object} draft
 *   title, metaDescription, markdown, pillar, clusterLinks[], images[],
 *   originalValue (özgün katkı: tablo, test, skor, hesaplayıcı…), sources[]
 * @param {object} context  publishedSlugs[], clusterSlugs[]
 */
export function checkVisibility(draft, context = {}) {
  const r = [];
  const md = String(draft.markdown || '');
  const lines = md.split('\n');
  const bodyWords = words(md.replace(/[#*_>`|-]/g, ' '));

  /* 1 — Tek ve net bir soruyu hedefliyor mu */
  const title = String(draft.title || '');
  r.push(title.length === 0 ? fail('1-baslik', 'Başlık yok')
    : title.length > 65 ? warn('1-baslik', `Başlık ${title.length} karakter — 65'in altı önerilir`)
    : ok('1-baslik', `${title.length} karakter`));

  const h1 = (md.match(/^#\s+(.+)$/m) || [])[1];
  r.push(!h1 ? fail('1-h1', 'H1 yok')
    : sameIntent(h1, title) ? ok('1-h1', 'H1 başlıkla aynı niyeti taşıyor')
    : warn('1-h1', 'H1 ile <title> farklı soruyu anlatıyor olabilir'));

  /* 2 — Cevap en üstte mi (40–80 kelimelik doğrudan cevap) */
  const firstPara = lines.filter((l) => l.trim() && !l.startsWith('#'))[0] || '';
  const fw = words(firstPara).length;
  r.push(fw === 0 ? fail('2-cevap', 'Giriş paragrafı yok')
    : fw > 120 ? warn('2-cevap', `İlk paragraf ${fw} kelime — doğrudan cevap 40–80 kelime olmalı`)
    : ok('2-cevap', `${fw} kelimelik doğrudan cevap`));

  const hasTakeaways = /key takeaways|önemli çıkarımlar|temel sonuçlar/i.test(md);
  r.push(hasTakeaways ? ok('2-cikarim', 'Çıkarımlar bölümü var')
                      : warn('2-cikarim', 'Kısa çıkarım listesi yok'));

  /* 3 — Küme içinde mi, bağlantılı mı */
  const internal = (md.match(/\]\((?!https?:)[^)]+\)/g) || []).length + (draft.clusterLinks || []).length;
  r.push(internal >= 3 ? ok('3-kume', `${internal} iç bağlantı`)
    : internal > 0 ? warn('3-kume', `Yalnızca ${internal} iç bağlantı — küme zayıf`)
    : fail('3-kume', 'İç bağlantı yok: sayfa kümeden kopuk'));

  /* 4 — Aynı sorunun kopyası mı (ölçekli içerik riski) */
  const dupe = (context.publishedTitles || []).find((t) => sameIntent(t, title));
  r.push(dupe ? fail('4-tekrar', `Aynı niyetli yazı zaten var: "${dupe}" — yeni yazı değil, güncelleme yapın`)
              : ok('4-tekrar', 'Mevcut yazılarla çakışmıyor'));

  /* 5 — Özgün katkı var mı */
  const originalSignals = [
    draft.originalValue,
    /\|.+\|.+\|/.test(md) && 'karşılaştırma tablosu',
    /future human score|bizim (test|değerlendirme|puan)/i.test(md) && 'kendi skorumuz',
    /(kendi|biz) (test ettik|ölçtük|denedik)/i.test(md) && 'kendi testimiz'
  ].filter(Boolean);
  r.push(originalSignals.length ? ok('5-ozgun', 'Özgün katkı: ' + originalSignals.join(', '))
    : fail('5-ozgun', 'Özgün katkı yok — bu yazı internetin yeniden yazılmış hâli'));

  /* 6 — Teknik temel */
  r.push(draft.metaDescription
    ? (draft.metaDescription.length > 160
        ? warn('6-meta', `Meta ${draft.metaDescription.length} karakter — 155 önerilir`)
        : ok('6-meta', `${draft.metaDescription.length} karakter`))
    : fail('6-meta', 'Meta açıklama yok'));
  r.push(draft.slug && /^[a-z0-9-]+$/.test(draft.slug) ? ok('6-slug', draft.slug)
                                                       : fail('6-slug', 'Slug yok veya biçimsiz'));

  /* 7 — Ağırlık: kelime başına makul uzunluk, aşırı uzun blok yok */
  const longest = Math.max(0, ...md.split(/\n{2,}/).map((p) => words(p).length));
  r.push(longest > 160 ? warn('7-okunur', `En uzun paragraf ${longest} kelime — bölün`)
                       : ok('7-okunur', `en uzun paragraf ${longest} kelime`));

  /* 8 — Şema: Article/BlogPosting var mı (FAQ rich result Mayıs 2026'da kaldırıldı) */
  r.push(draft.schema === false ? warn('8-sema', 'Yapılandırılmış veri işaretlenmemiş')
                                : ok('8-sema', 'BlogPosting şeması üretiliyor'));

  /* 10 — Görsel ve alt metin */
  const images = draft.images || (md.match(/!\[[^\]]*\]\([^)]+\)/g) || []);
  const missingAlt = (md.match(/!\[\s*\]\([^)]+\)/g) || []).length;
  r.push(!images.length ? warn('10-gorsel', 'Görsel yok — özgün grafik veya ekran görüntüsü ekleyin')
    : missingAlt ? fail('10-gorsel', `${missingAlt} görselde alt metin yok`)
    : ok('10-gorsel', `${images.length} görsel, alt metinler tam`));

  /* 15 — Otorite: kaynak, tarih, yazar */
  const sources = draft.sources?.length || (md.match(/https?:\/\//g) || []).length;
  r.push(sources >= 3 ? ok('15-kaynak', `${sources} kaynak`)
    : sources > 0 ? warn('15-kaynak', `Yalnızca ${sources} kaynak`)
    : fail('15-kaynak', 'Kaynak yok — para/kariyer konularında yayınlanamaz'));
  r.push(draft.author ? ok('15-yazar', draft.author) : warn('15-yazar', 'Yazar adı yok'));
  r.push(draft.updatedAt ? ok('15-tarih', draft.updatedAt) : warn('15-tarih', 'Güncelleme tarihi yok'));

  /* Uzunluk hedefi */
  r.push(bodyWords.length >= 1200 ? ok('uzunluk', `${bodyWords.length} kelime`)
    : bodyWords.length >= 700 ? warn('uzunluk', `${bodyWords.length} kelime — hedef 1.200+`)
    : fail('uzunluk', `${bodyWords.length} kelime — çok kısa`));

  const failed = r.filter((x) => x.status === 'kaldi');
  const warned = r.filter((x) => x.status === 'uyari');
  return {
    rules: r,
    failed: failed.length,
    warned: warned.length,
    passed: r.length - failed.length - warned.length,
    decision: failed.length ? 'yayinlanamaz' : warned.length > 4 ? 'gozden_gecir' : 'yayinlanabilir'
  };
}

/* İki başlık aynı arama niyetini mi taşıyor? Ölçekli içerik kontrolü için. */
export function sameIntent(a, b) {
  const norm = (t) => new Set(String(t).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/).filter((w) => w.length > 3));
  const A = norm(a), B = norm(b);
  if (!A.size || !B.size) return false;
  let shared = 0;
  for (const w of A) if (B.has(w)) shared++;
  return shared / Math.min(A.size, B.size) >= 0.75;
}

export function printReport(result) {
  const icon = { gecti: '✓', uyari: '!', kaldi: '✗' };
  for (const x of result.rules) console.log(`  ${icon[x.status]} ${x.id.padEnd(12)} ${x.msg}`);
  console.log(`\n  ${result.passed} geçti · ${result.warned} uyarı · ${result.failed} kaldı → ${result.decision}`);
}
