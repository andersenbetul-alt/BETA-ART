#!/usr/bin/env node
/* QBLOGG — yayınlanmış yazıları görünürlük kurallarına karşı denetler.
 *
 *   node scripts/gorunurluk.mjs           tüm yazılar, özet
 *   node scripts/gorunurluk.mjs <slug>    tek yazı, tam rapor
 *   node scripts/gorunurluk.mjs --dil en  başka dilde denetle (varsayılan tr)
 *
 * engine/visibility.mjs ile aynı kuralları kullanır. Motorun taslaklara
 * uyguladığı ölçütü, sitenin kendi yazılarına da uygulamak için var:
 * kendi kuralımıza uymayan bir hattı kimseye satamayız.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkVisibility, printReport } from '../engine/visibility.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const dilIdx = args.indexOf('--dil');
const lang = dilIdx >= 0 ? args[dilIdx + 1] : 'tr';
const only = args.find((a) => !a.startsWith('--') && a !== lang);

const sandbox = {};
const load = (f) => new Function('sandbox', readFileSync(join(ROOT, f), 'utf8').replace(/\bwindow\b/g, 'sandbox'))(sandbox);
load('assets/js/i18n.js');
load('assets/js/posts.js');

/* Blok modelini (dize | {h} | {ul} | {note}) markdown'a çevir. */
function toMarkdown(post, l) {
  const blocks = post.b[l] || post.b.en || [];
  const out = ['# ' + (post.t[l] || post.t.en)];
  for (const b of blocks) {
    if (typeof b === 'string') out.push(b);
    else if (b.h) out.push('## ' + b.h);
    else if (b.ul) out.push(b.ul.map((x) => '- ' + x).join('\n'));
    else if (b.note) out.push('> ' + b.note);
  }
  return out.join('\n\n');
}

const posts = sandbox.QB_POSTS.filter((p) => !only || p.slug === only);
if (!posts.length) {
  console.error(`Yazı bulunamadı: ${only}`);
  process.exit(1);
}

const titles = sandbox.QB_POSTS.map((p) => p.t[lang]).filter(Boolean);
const summary = [];

for (const post of posts) {
  const title = post.t[lang] || post.t.en;
  /* Kendi başlığını "kopya" saymamak için listeden çıkar. */
  const others = titles.filter((t) => t !== title);
  const result = checkVisibility({
    title,
    metaDescription: post.e[lang] || post.e.en,
    slug: post.slug,
    markdown: toMarkdown(post, lang),
    /* Sayfada gerçekten basılan iç bağlantılar: metin içi {see} blokları +
       şablonun bastığı iki "benzer yazı" kartı + blog'a dönüş bağlantısı. */
    clusterLinks: (post.b[lang] || []).filter((b) => b && b.see).map((b) => b.see).concat(['related-1', 'related-2', 'blog']),
    images: [],
    sources: (post.src || []).map((x) => x.t),
    originalValue: post.orig,
    schema: true,               // post.html BlogPosting şeması basıyor
    author: 'QBLOGG',
    updatedAt: post.date
  }, { publishedTitles: others });

  summary.push({ slug: post.slug, ...result });

  if (only) {
    console.log(`\n${title}\n${'─'.repeat(58)}`);
    printReport(result);
  }
}

if (!only) {
  console.log(`Görünürlük denetimi — dil: ${lang}\n${'─'.repeat(58)}`);
  const icon = { yayinlanabilir: '✓', gozden_gecir: '!', yayinlanamaz: '✗' };
  for (const s of summary) {
    console.log(`  ${icon[s.decision]} ${s.slug.padEnd(36)} ${s.passed} geçti · ${s.warned} uyarı · ${s.failed} kaldı`);
  }
  const blocked = summary.filter((s) => s.decision === 'yayinlanamaz').length;
  console.log('─'.repeat(58));
  console.log(`${summary.length} yazı · ${blocked} tanesi kural ihlaliyle işaretli`);
  console.log('Tek yazının tam raporu için: node scripts/gorunurluk.mjs <slug>');
}
