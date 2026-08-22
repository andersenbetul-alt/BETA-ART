#!/usr/bin/env node
/* QBLOGG — tek dosyalık, tıklanabilir önizleme üretir.
 *
 *   npm run onizleme            → onizleme/qblogg.html
 *
 * Neden var: site beş ayrı HTML dosyası ve dört ayrı betikten oluşuyor.
 * Birine göstermek için sunucu kurmak gerekiyordu. Bu betik hepsini tek
 * dosyaya gömüyor — yazı tipleri dahil, dışarıya hiç istek atmadan.
 *
 * Yönlendirme: sayfalar `?page=` ile değişiyor. `slug` ve `lang` gerçek
 * sorgu dizesinde kalıyor ki app.js'in param() okuması aynen çalışsın.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (p) => readFileSync(join(ROOT, p), 'utf8');
const b64 = (p) => readFileSync(join(ROOT, p)).toString('base64');

const SAYFALAR = [
  ['index',    'index.html'],
  ['work',     'work.html'],
  ['blog',     'blog.html'],
  ['post',     'post.html'],
  ['gizlilik', 'gizlilik.html'],
  ['kosullar', 'kosullar.html']
];

/* --- yazı tiplerini CSS'in içine göm --- */
let fontCss = oku('assets/fonts/inter.css');
fontCss = fontCss.replace(/url\(\.\/([^)]+\.woff2)\)/g,
  (_, dosya) => `url(data:font/woff2;base64,${b64('assets/fonts/' + dosya)})`);

const anaCss = oku('assets/css/main.css');

/* --- her sayfanın <main> gövdesi --- */
const govde = {};
for (const [ad, dosya] of SAYFALAR) {
  const html = oku(dosya);
  const bas = html.indexOf('<main');
  const son = html.indexOf('</main>') + '</main>'.length;
  if (bas < 0 || son < bas) throw new Error(`${dosya}: <main> bulunamadı`);
  govde[ad] = html.slice(bas, son);
}

/* --- iskelet: index.html'in başlık ve altbilgisi --- */
const temel = oku('index.html');
const bodyBas = temel.indexOf('<body>') + '<body>'.length;
const mainBas = temel.indexOf('<main');
const mainSon = temel.indexOf('</main>') + '</main>'.length;
/* İlk <script src=> etiketinden itibaren kes: dördü de gömüleceği için
   dosya yolu gösteren etiketler kalırsa önizleme 404 istekleri atar. */
const bodySon = temel.indexOf('<script src=', mainSon);
const ustBolum = temel.slice(bodyBas, mainBas);   // skip link + header
const altBolum = temel.slice(mainSon, bodySon);   // footer + toast + to-top

const YONLENDIRICI = `
/* Tek dosyalık önizlemenin yönlendiricisi. Gerçek sitede bu kod yok. */
(function () {
  var GOVDE = __GOVDE__;
  function sayfaAdi() {
    var p = new URLSearchParams(location.search).get('page');
    return GOVDE[p] ? p : 'index';
  }
  function ciz(ad, slug, lang) {
    var q = new URLSearchParams();
    q.set('page', ad);
    if (slug) q.set('slug', slug);
    if (lang) q.set('lang', lang);
    history.replaceState(null, '', '?' + q.toString());
    var eski = document.getElementById('main');
    var yeni = document.createElement('div');
    yeni.innerHTML = GOVDE[ad];
    eski.replaceWith(yeni.firstElementChild);
    window.QB_BOOT();
    window.scrollTo(0, 0);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || /^(https?:|mailto:|#)/.test(href)) return;
    var m = href.match(/^(?:\\.\\/)?([a-z]+)\\.html(?:\\?(.*))?$/);
    if (!m || !GOVDE[m[1]]) return;
    e.preventDefault();
    var s = new URLSearchParams(m[2] || '');
    var lang = new URLSearchParams(location.search).get('lang');
    ciz(m[1], s.get('slug'), s.get('lang') || lang);
  }, true);
  /* Dil düğmesi sayfayı yeniden yüklüyor; page parametresini koru. */
  var ilk = sayfaAdi();
  if (ilk !== 'index') {
    var s = new URLSearchParams(location.search);
    ciz(ilk, s.get('slug'), s.get('lang'));
  }
})();`;

const cikti = `<!DOCTYPE html>
<html lang="tr" dir="ltr" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>QBLOGG — önizleme</title>
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="./index.html">
<link rel="icon" href="data:image/svg+xml;base64,${b64('assets/brand/qblogg-favicon.svg')}" type="image/svg+xml">
<style>${fontCss}</style>
<style>${anaCss}</style>
</head>
<body>
${ustBolum}
${govde.index}
${altBolum}
<script>${oku('assets/js/config.js')}</script>
<script>${oku('assets/js/i18n.js')}</script>
<script>${oku('assets/js/posts.js')}</script>
<script>${oku('assets/js/app.js')}</script>
<script>${YONLENDIRICI.replace('__GOVDE__', JSON.stringify(govde))}</script>
</body>
</html>`;

mkdirSync(join(ROOT, 'onizleme'), { recursive: true });
const hedef = join(ROOT, 'onizleme', 'qblogg.html');
writeFileSync(hedef, cikti, 'utf8');
const kb = (Buffer.byteLength(cikti) / 1024).toFixed(0);
console.log(`önizleme yazıldı: onizleme/qblogg.html (${kb} KB, ${SAYFALAR.length} sayfa, dış istek yok)`);
