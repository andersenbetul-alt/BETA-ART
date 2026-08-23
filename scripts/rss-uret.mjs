/* QBLOGG — RSS 2.0 beslemesi üretir. Bağımlılık yok: `npm run rss`
 * Determinizm: aynı girdiden bayt bayt aynı feed.xml çıkar — "şimdi" damgası
 * yok; lastBuildDate en yeni yazının kendi tarihinden türetilir.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

/* --- tarayıcı globallerini taklit ederek veri dosyalarını yükle (check.mjs ile aynı desen) --- */
const sandbox = {};
const load = (file) => {
  const src = read(file).replace(/\bwindow\b/g, 'sandbox');
  new Function('sandbox', src)(sandbox);
};
load('assets/js/config.js');
load('assets/js/i18n.js');
load('assets/js/posts.js');

const SITE = sandbox.QB_CONFIG.siteUrl;
const DESC = sandbox.QB_I18N.tr['meta.desc'];
const POSTS = sandbox.QB_POSTS;

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const posts = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
const lastBuildDate = new Date(posts[0].date).toUTCString();

const items = posts.map((p) => {
  const link = `${SITE}/post.html?slug=${p.slug}`;
  return `  <item>
    <title>${esc(p.t.tr)}</title>
    <link>${esc(link)}</link>
    <guid isPermaLink="true">${esc(link)}</guid>
    <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    <description>${esc(p.e.tr)}</description>
  </item>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>QBLOGG</title>
  <link>${esc(SITE)}</link>
  <description>${esc(DESC)}</description>
  <language>tr</language>
  <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
</channel>
</rss>
`;

writeFileSync(join(ROOT, 'feed.xml'), xml);
console.log(`feed.xml: ${posts.length} öğe yazıldı`);
