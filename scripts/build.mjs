#!/usr/bin/env node
/* Pre-render one HTML file per language.
 *
 *   npm run build      → dist/
 *
 * Why this exists. The twelve languages are applied in the browser, so every hreflang URL
 * (`/?lang=tr`, `/?lang=ar`, …) returns the same English HTML. A crawler sees one English
 * page twelve times, which is worse than having one language: duplicate URLs with no
 * distinct content. Twelve pre-rendered pages are twelve indexable pages.
 *
 * The site still works without this. Open index.html from the filesystem and the client-side
 * switcher behaves exactly as before — the build only adds the crawlable copies, so the
 * "drag the folder anywhere" property survives.
 */

import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const SITE = 'https://hximusic.com';
const RTL = new Set(['ar', 'ur']);

const html = readFileSync(join(root, 'index.html'), 'utf8');
// The figures live in one file; the pre-rendered pages get them baked in, formatted for the
// language, so a crawler and a visitor with JS off see the same numbers as everyone else.
const FIGURES = JSON.parse(readFileSync(join(root, 'assets/data/figures.json'), 'utf8'));
const SLOT = { streams: 'streams_help_urself', listeners: 'monthly_listeners' };
const unescape = (t) => t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
const num = (value, code, compact) =>
  new Intl.NumberFormat(code, compact ? { notation: 'compact', maximumFractionDigits: 1 } : {}).format(value);
// data-figure="…_checked" prints the date the figure was last verified, in this language's
// convention — so a stream count copied out of the press bios carries its date with it.
const when = (iso, code) => !iso ? '' :
  new Intl.DateTimeFormat(code, { year: 'numeric', month: 'long' }).format(new Date(iso + 'T00:00:00Z'));
const sandbox = { window: {} };
new Function('window', readFileSync(join(root, 'assets/js/i18n.js'), 'utf8'))(sandbox.window);
const LANGS = sandbox.window.HXI_LANGS;
// The store renders from JS at runtime, which left it empty in the pre-rendered HTML — a
// crawler saw a heading with nothing under it, and so did anyone with JS off. Build the same
// cards server-side; app.js redraws them identically once it loads.
new Function('window', readFileSync(join(root, 'assets/js/shop.js'), 'utf8'))(sandbox.window);
const SHOP = sandbox.window.HXI_SHOP || [];
const DICTS = sandbox.window.HXI_I18N;

// Localised head copy. Kept here rather than in the dictionaries because it is metadata,
// not page text — nothing on the page renders it.
const META = {
  en: ['HXI — Norwegian Drift Phonk Producer', 'Norwegian phonk producer from Oslo. 43M+ Spotify streams. Drift phonk, phonk house, montagem. Two tracks free for creators, with credit.'],
  zh: ['HXI — 挪威 Drift Phonk 制作人', '来自奥斯陆的挪威 phonk 制作人，Spotify 播放量超过 4300 万。Drift phonk、phonk house、montagem。 两首作品创作者可免费使用，署名即可。'],
  hi: ['HXI — नॉर्वेजियन ड्रिफ्ट फोंक प्रोड्यूसर', 'ओस्लो के नॉर्वेजियन फोंक प्रोड्यूसर। 4.3 करोड़+ स्पॉटिफ़ाई स्ट्रीम। ड्रिफ्ट फोंक, फोंक हाउस, मोंटाजेम। दो ट्रैक क्रिएटर्स के लिए मुफ़्त, श्रेय के साथ।'],
  es: ['HXI — Productor noruego de drift phonk', 'Productor noruego de phonk desde Oslo. Más de 43 M de reproducciones en Spotify. Drift phonk, phonk house, montagem. Dos temas libres para creadores, con crédito.'],
  ar: ['HXI — منتج درفت فونك نرويجي', 'منتج فونك نرويجي من أوسلو. أكثر من 43 مليون استماع على سبوتيفاي. دريفت فونك، فونك هاوس، مونتاجيم. مقطوعتان مجانيتان لصنّاع المحتوى، مع النسبة.'],
  fr: ['HXI — Producteur de drift phonk norvégien', 'Producteur de phonk norvégien basé à Oslo. Plus de 43 M d’écoutes sur Spotify. Drift phonk, phonk house, montagem. Deux titres libres pour les créateurs, avec crédit.'],
  bn: ['HXI — নরওয়েজিয়ান ড্রিফট ফোংক প্রযোজক', 'অসলোর নরওয়েজিয়ান ফোংক প্রযোজক। ৪.৩ কোটির বেশি স্পটিফাই স্ট্রিম। ড্রিফট ফোংক, ফোংক হাউস, montagem। দুটি ট্র্যাক নির্মাতাদের জন্য বিনামূল্যে, কৃতিত্ব সহ।'],
  pt: ['HXI — Produtor norueguês de drift phonk', 'Produtor norueguês de phonk, de Oslo. Mais de 43 mi de streams no Spotify. Drift phonk, phonk house, montagem. Duas faixas livres para criadores, com crédito.'],
  ru: ['HXI — норвежский дрифт-фонк-продюсер', 'Норвежский фонк-продюсер из Осло. Более 43 млн прослушиваний в Spotify. Дрифт-фонк, фонк-хаус, montagem. Два трека бесплатны для авторов — с указанием.'],
  ur: ['HXI — نارویجن ڈرفٹ فونک پروڈیوسر', 'اوسلو سے نارویجن فونک پروڈیوسر۔ اسپاٹیفائی پر 4.3 کروڑ سے زائد اسٹریمز۔ ڈرفٹ فونک، فونک ہاؤس، montagem۔ دو ٹریک تخلیق کاروں کے لیے مفت، کریڈٹ کے ساتھ۔'],
  no: ['HXI — norsk drift phonk-produsent', 'Norsk phonk-produsent fra Oslo. Over 43 millioner strømminger på Spotify. Drift phonk, phonk house, montagem. To låter er gratis for skapere, med kreditering.'],
  tr: ['HXI — Norveçli drift phonk prodüktörü', 'Oslo’dan Norveçli phonk prodüktörü. 43 milyondan fazla Spotify dinlenmesi. Drift phonk, phonk house, montagem. İki parça üreticiler için ücretsiz, kredi vererek.'],
};

const l = (code) => `${code}/`;
const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function render(code, { atRoot, source = html, slug = '', title, description }) {
  const dict = DICTS[code];
  const prefix = atRoot ? '' : '../';
  const self = `${SITE}/${atRoot ? '' : l(code)}${slug}`;
  let page = source;

  // 1. Substitute every translated string so the page reads correctly with JS switched off,
  //    which is the state a crawler indexes.
  page = page.replace(
    /(<([a-z0-9]+)([^>]*?)data-i18n="([a-z0-9_]+)"([^>]*?)>)([^<]*)(<\/\2>)/g,
    (match, open, tag, pre, key, post, text, close) => {
      if (dict[key] === undefined) return match;
      const value = dict[key].replace(/\{([a-z_]+)(:compact)?\}/g, (token, name, short) =>
        FIGURES[name] ? (short ? num(FIGURES[name].value, code, true) + '+'
                               : num(FIGURES[name].value, code, false)) : token);
      return open + escape(value) + close;
    },
  );

  // 1b. The figures, formatted for this language.
  page = page.replace(/(<(\w+)([^>]*?)data-figure="([a-z_]+)"([^>]*?)>)([^<]*)(<\/\2>)/g,
    (match, open, tag, pre, name, post, text, close) => {
      const parts = name.split('_');
      const shape = parts.pop();
      const figure = FIGURES[SLOT[parts.join('_')]];
      if (!figure) return match;
      // data-figure-locale pins a slot to one language. The press bios use it: they are
      // cleared in English and copied out whole, so "43.4M+" must not become "43,4 mill.+"
      // just because the surrounding page is Norwegian.
      const pinned = /data-figure-locale="([a-z-]+)"/.exec(pre + post);
      const loc = pinned ? pinned[1] : code;
      const value = shape === 'checked' ? when(figure.checkedAt, loc)
        : shape === 'compact'
        ? num(figure.value, loc, true) + (name === 'streams_compact' ? '+' : '')
        : num(figure.value, loc, false);
      return open + escape(value) + close;
    });

  // 1b-ii. The FAQ structured data, built from this language's own dictionary. Generating it
  // rather than writing it by hand is the point: the schema and the visible answers come from
  // the same strings, so Google can never be shown a claim the page does not make.
  {
    const dict = DICTS[code] || DICTS.en;
    const en = DICTS.en;
    const pick = (key) => (dict[key] != null ? dict[key] : en[key]);
    const entity = [];
    for (let i = 1; en[`faq_q${i}`]; i++) {
      entity.push({
        '@type': 'Question',
        name: pick(`faq_q${i}`),
        acceptedAnswer: { '@type': 'Answer', text: pick(`faq_a${i}`) },
      });
    }
    if (entity.length) {
      page = page.replace(
        /(<script type="application\/ld\+json" data-faq-schema>)[\s\S]*?(<\/script>)/,
        (m, open, close) => open + '\n' +
          JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: entity })
            .replace(/</g, '\\u003c') + '\n' + close);
    }
  }

  // 1b-iii. The catalogue as structured data. The archive rows are the only complete,
  // dated list of releases anywhere on the page, and they are already sourced one by one in
  // docs/RESEARCH.md — so the MusicGroup's track list is generated from them rather than
  // maintained twice. Reading the markup keeps the two from ever disagreeing.
  {
    const rows = [...page.matchAll(
      /<li><div><b>([^<]+)<\/b><span><time datetime="([^"]+)">[^<]*<\/time>([\s\S]*?)<\/span><\/div>(?:<a href="([^"]+)")?/g)];
    const tracks = rows.map(([, name, date, , url]) => {
      const item = { '@type': 'MusicRecording', name: unescape(name), byArtist: { '@type': 'MusicGroup', name: 'HXI' } };
      if (date) item.datePublished = date;
      if (url) item.sameAs = url;
      return item;
    });
    if (tracks.length) {
      page = page.replace(/("@type":"MusicGroup","name":"HXI")/,
        (m) => m + ',"track":' + JSON.stringify(tracks).replace(/</g, '\\u003c'));
    }
  }

  // Three of the four JSON-LD blocks are generated, and a broken one fails silently: the
  // page renders, the crawler drops the block, and nobody finds out. Parse them here so a
  // bad build stops instead.
  for (const [, body] of page.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(body);
    } catch (e) {
      throw new Error(`[${code}] a JSON-LD block does not parse: ${e.message}`);
    }
  }

  // 1c. The store, drawn the same way app.js draws it.
  if (SHOP.length && page.includes('id="shop-grid"')) {
    const money = (amount, currency) => {
      try {
        return new Intl.NumberFormat(code, {
          style: 'currency', currency,
          minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
        }).format(amount);
      } catch (e) { return `${amount} ${currency}`; }
    };
    const cards = SHOP.map((item) => {
      const kind = dict[item.kind === 'digital' ? 'shop_digital' : item.kind === 'experience' ? 'shop_experience' : 'shop_physical'] || '';
      const price = item.free ? (dict.shop_free || '')
        : item.price ? money(item.price.amount, item.price.currency) +
            (item.per === 'month' ? ' ' + (dict.shop_per_month || '') : '')
        : (dict.shop_soon || '');
      const cta = item.checkout ? (dict.shop_buy || '')
        : (item.signup ? dict.shop_get : dict.shop_notify) || '';
      const link = item.checkout
        ? `<a href="${item.checkout}" target="_blank" rel="noopener noreferrer">${escape(cta)}</a>`
        : `<a href="#drop">${escape(cta)}</a>`;
      const specs = (item.specs || []).map((k) => `<li>${escape(dict[k] || '')}</li>`).join('') +
        (item.edition
          ? `<li class="spec-edition">${escape((dict.shop_edition || '').replace('{n}', item.edition))}</li>`
          : '');
      const included = specs
        ? `<details class="product-specs"><summary>${escape(dict.shop_included || '')}</summary><ul>${specs}</ul></details>`
        : '';
      const delivery = item.delivery
        ? `<p class="product-delivery">${escape(dict[item.delivery] || '')}</p>`
        : '';
      return `<article class="card product"><p class="tag">${escape(kind)}</p>` +
        `<h3 class="h3 product-name">${escape(item.name)}</h3>` +
        `<p class="news-text">${escape(dict[item.desc] || '')}</p>` +
        `<p class="meta">${escape(price)}</p>` +
        included + delivery +
        `<p class="card-links">${link}</p></article>`;
    }).join('');
    page = page.replace('<div class="grid-3" id="shop-grid"></div>',
      `<div class="grid-3" id="shop-grid">${cards}</div>`);
  }

  // 2. Language, direction, and a marker the runtime uses to pin the pre-rendered language.
  page = page.replace(
    '<html lang="en" dir="ltr">',
    `<html lang="${code}" dir="${RTL.has(code) ? 'rtl' : 'ltr'}" data-page-lang="${code}">`,
  );

  // 3. Head copy in this language.
  page = page
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${escape(description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escape(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${escape(description)}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${escape(title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${escape(description)}$2`)
    .replace(/(<meta property="og:locale" content=")[^"]*(")/, `$1${code}$2`);

  // 4. Canonical points at this page; hreflang points at real directories, not query strings.
  page = page.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${self}">`);
  page = page.replace(/(\n<link rel="alternate"[^>]*>)+/, '\n' +
    LANGS.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${SITE}/${l.code}/${slug}">`).join('\n') +
    `\n<link rel="alternate" hreflang="x-default" href="${SITE}/${slug}">`);

  // 4b. One dictionary, not twelve. i18n.js carries every language so the un-built page can
  //     switch in place; a built page cannot — its switcher navigates to the other language's
  //     URL — so shipping all twelve makes every visitor download eleven they will never read.
  //     That is 66 KB gzipped against about 6 KB.
  page = page.replace(
    /<script src="assets\/js\/i18n\.js"><\/script>/,
    `<script src="assets/i18n/${code}.js"></script>`,
  );

  // 5. Asset paths, relative to where this file will sit.
  if (prefix) {
    page = page.replace(/(href|src)="(assets\/)/g, `$1="${prefix}$2`);
  }
  return page;
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// CNAME binds the custom domain on GitHub Pages and is ignored by every other host, so it
// is safe to ship either way. Pages reads it from the published root, which is dist/.
for (const entry of ['assets', 'robots.txt', '.well-known', '.nojekyll', '404.html', 'CNAME']) {
  const from = join(root, entry);
  if (existsSync(from)) cpSync(from, join(dist, entry), { recursive: true });
}

// index.html and, when it exists, privacy.html — English at the root, one directory each
// for the twelve languages. The privacy page takes its head copy from the dictionary rather
// than a second META table, so there is one place to translate it.
const privacy = existsSync(join(root, 'privacy.html')) ? readFileSync(join(root, 'privacy.html'), 'utf8') : null;

const headFor = (code, slug) => slug
  ? [`${DICTS[code].priv_title} — HXI`, DICTS[code].priv_intro]
  : META[code];

function emit(code, atRoot) {
  const dir = atRoot ? dist : join(dist, code);
  mkdirSync(dir, { recursive: true });
  for (const [slug, source] of [['', html], ['privacy.html', privacy]]) {
    if (!source) continue;
    const [title, description] = headFor(code, slug);
    const page = render(code, { atRoot, source, slug, title, description });
    writeFileSync(join(dir, slug || 'index.html'), page);
  }
}

emit('en', true);
for (const { code } of LANGS) emit(code, false);

// One file per language, each declaring only its own dictionary plus the switcher's list.
mkdirSync(join(dist, 'assets/i18n'), { recursive: true });
for (const { code } of LANGS) {
  writeFileSync(join(dist, 'assets/i18n', `${code}.js`),
    '/* Generated by scripts/build.mjs — one language per file. Edit assets/js/i18n.js. */\n' +
    `window.HXI_LANGS = ${JSON.stringify(LANGS)};\n` +
    'window.HXI_I18N = window.HXI_I18N || {};\n' +
    `window.HXI_I18N[${JSON.stringify(code)}] = ${JSON.stringify(DICTS[code])};\n`);
}

// The all-languages bundle is the source for the un-built page; nothing in dist/ loads it,
// so shipping 208 KB of it would be dead weight on every deploy.
rmSync(join(dist, 'assets/js/i18n.js'), { force: true });

const urls = [`${SITE}/`, ...LANGS.map((x) => `${SITE}/${x.code}/`)];
if (privacy) urls.push(`${SITE}/privacy.html`, ...LANGS.map((x) => `${SITE}/${x.code}/privacy.html`));
writeFileSync(join(dist, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => `  <url><loc>${u}</loc><changefreq>weekly</changefreq><priority>${u === SITE + '/' ? '1.0' : '0.8'}</priority></url>`).join('\n') +
  '\n</urlset>\n');

console.log(`Built ${urls.length} pages and a sitemap into dist/.`);
