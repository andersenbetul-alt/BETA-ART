/* QBLOGG — proje sağlık kontrolü.
 * Bağımlılık yok: `node scripts/check.mjs`
 * Her değişiklikten sonra çalıştırın; commit öncesi zorunludur.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
const ok = [];

const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const pass = (m) => ok.push(m);

/* --- tarayıcı globallerini taklit ederek veri dosyalarını yükle --- */
const sandbox = {};
const load = (file) => {
  const src = read(file).replace(/\bwindow\b/g, 'sandbox');
  new Function('sandbox', src)(sandbox);
};
load('assets/js/i18n.js');
load('assets/js/posts.js');

const LANGS = sandbox.QB_LANGS.map((l) => l.code);
const I18N = sandbox.QB_I18N;
const POSTS = sandbox.QB_POSTS;
const HTML_FILES = readdirSync(ROOT).filter((f) => f.endsWith('.html'));

/* --- 1. Dil sözlükleri: anahtar seti tüm dillerde aynı olmalı --- */
{
  const base = Object.keys(I18N.en);
  let bad = 0;
  for (const code of LANGS) {
    const dict = I18N[code];
    if (!dict) { fail(`i18n: "${code}" sözlüğü yok`); bad++; continue; }
    const keys = Object.keys(dict);
    const missing = base.filter((k) => !keys.includes(k));
    const extra = keys.filter((k) => !base.includes(k));
    if (missing.length) { fail(`i18n [${code}]: eksik anahtar → ${missing.join(', ')}`); bad++; }
    if (extra.length) { fail(`i18n [${code}]: fazladan anahtar → ${extra.join(', ')}`); bad++; }
    const empty = keys.filter((k) => !String(dict[k]).trim());
    if (empty.length) { fail(`i18n [${code}]: boş değer → ${empty.join(', ')}`); bad++; }
  }
  if (!bad) pass(`i18n: ${LANGS.length} dil × ${base.length} anahtar eksiksiz`);
}

/* --- 2. Blog yazıları: her yazı her dilde tam olmalı --- */
{
  let bad = 0;
  const slugs = new Set();
  for (const p of POSTS) {
    if (slugs.has(p.slug)) { fail(`posts: "${p.slug}" slug'ı birden fazla kez kullanılmış`); bad++; }
    slugs.add(p.slug);
    if (!I18N.en['cat.' + p.category]) { fail(`posts [${p.slug}]: "cat.${p.category}" çevirisi yok`); bad++; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date)) { fail(`posts [${p.slug}]: tarih YYYY-AA-GG değil (${p.date})`); bad++; }
    for (const code of LANGS) {
      if (!p.t?.[code]?.trim()) { fail(`posts [${p.slug}]: ${code} başlığı eksik`); bad++; }
      if (!p.e?.[code]?.trim()) { fail(`posts [${p.slug}]: ${code} özeti eksik`); bad++; }
      const body = p.b?.[code];
      if (!Array.isArray(body) || !body.length || body.some((x) => !String(x).trim())) {
        fail(`posts [${p.slug}]: ${code} gövdesi eksik`); bad++;
      }
    }
  }
  if (!bad) pass(`posts: ${POSTS.length} yazı × ${LANGS.length} dil eksiksiz`);
}

/* --- 3. HTML: aynı id iki kez kullanılmasın (çiftlenen blok hatası) --- */
{
  let bad = 0;
  for (const file of HTML_FILES) {
    const html = read(file);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
    if (dupes.length) { fail(`${file}: aynı id birden fazla → ${dupes.join(', ')}`); bad++; }
    const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);
    const dupScripts = [...new Set(scripts.filter((s, i) => scripts.indexOf(s) !== i))];
    if (dupScripts.length) { fail(`${file}: script iki kez yükleniyor → ${dupScripts.join(', ')}`); bad++; }
  }
  if (!bad) pass(`html: ${HTML_FILES.length} sayfada çiftlenen id/script yok`);
}

/* --- 4. HTML: kullanılan çeviri anahtarları sözlükte var mı --- */
{
  let bad = 0;
  const base = Object.keys(I18N.en);
  for (const file of HTML_FILES) {
    const html = read(file);
    const used = new Set();
    for (const m of html.matchAll(/data-i18n(?:-title|-content)?="([^"]+)"/g)) used.add(m[1]);
    for (const m of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
      for (const pair of m[1].split(',')) {
        const key = pair.split(':')[1];
        if (key) used.add(key.trim());
      }
    }
    for (const m of html.matchAll(/data-field="([^"]+)"/g)) used.add(m[1]);
    const unknown = [...used].filter((k) => !base.includes(k));
    if (unknown.length) { fail(`${file}: sözlükte olmayan anahtar → ${unknown.join(', ')}`); bad++; }
  }
  if (!bad) pass('html: tüm data-i18n anahtarları sözlükte mevcut');
}

/* --- 5. Bağlantılar ve varlıklar gerçekten var mı --- */
{
  let bad = 0;
  for (const file of HTML_FILES) {
    const html = read(file);
    const refs = [
      ...[...html.matchAll(/(?:href|src)="(?!https?:|mailto:|data:|#)([^"]+)"/g)].map((m) => m[1])
    ];
    for (const ref of new Set(refs)) {
      const path = ref.split('#')[0].split('?')[0].replace(/^\.\//, '');
      if (!path) continue;
      if (!existsSync(join(ROOT, path))) { fail(`${file}: kırık bağlantı → ${ref}`); bad++; }
    }
  }
  if (!bad) pass('html: tüm yerel bağlantı ve varlıklar mevcut');
}

/* --- 6. sitemap.xml gerçek sayfaları ve gerçek slug'ları göstermeli --- */
{
  let bad = 0;
  const sitemap = read('sitemap.xml');
  const locs = [...sitemap.matchAll(/<loc>[^<]*?\/([^<\/]+)<\/loc>/g)].map((m) => m[1]);
  for (const loc of locs) {
    const [page, query] = loc.split('?');
    if (!existsSync(join(ROOT, page))) { fail(`sitemap: olmayan sayfa → ${page}`); bad++; }
    const slug = query && new URLSearchParams(query.replace(/&amp;/g, '&')).get('slug');
    if (slug && !POSTS.some((p) => p.slug === slug)) { fail(`sitemap: olmayan yazı → ${slug}`); bad++; }
  }
  for (const p of POSTS) {
    if (!locs.some((l) => l.includes('slug=' + p.slug))) { warn(`sitemap: "${p.slug}" listelenmemiş`); }
  }
  if (!bad) pass(`sitemap: ${locs.length} URL doğrulandı`);
}

/* --- 7. Her sayfa i18n/posts/app dosyalarını yüklüyor mu --- */
{
  let bad = 0;
  for (const file of HTML_FILES) {
    const html = read(file);
    for (const need of ['assets/js/i18n.js', 'assets/js/posts.js', 'assets/js/app.js', 'assets/css/main.css']) {
      if (!html.includes(need)) { fail(`${file}: ${need} yüklenmiyor`); bad++; }
    }
    if (!/<html[^>]+lang=/.test(html)) { fail(`${file}: <html lang> yok`); bad++; }
    if (!html.includes('<meta charset="utf-8">')) { fail(`${file}: charset eksik`); bad++; }
  }
  if (!bad) pass('html: her sayfa gerekli stil ve betikleri yüklüyor');
}

/* --- Sonuç --- */
const line = '─'.repeat(58);
console.log(line);
for (const m of ok) console.log('  ✓ ' + m);
for (const m of warnings) console.log('  ! ' + m);
for (const m of errors) console.log('  ✗ ' + m);
console.log(line);
if (errors.length) {
  console.log(`${errors.length} hata, ${warnings.length} uyarı — düzeltmeden commit etmeyin.`);
  process.exit(1);
}
console.log(`Tüm kontroller geçti (${ok.length} kontrol, ${warnings.length} uyarı).`);
