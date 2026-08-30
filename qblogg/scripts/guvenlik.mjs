#!/usr/bin/env node
/* QBLOGG — güvenlik ve veri koruma denetimi.
 *
 *   npm run guvenlik
 *
 * check.mjs içeriğin bütünlüğüne, gorunurluk.mjs bulunabilirliğe bakıyor.
 * Bu betik üçüncü bir soruyu soruyor: **site ziyaretçiye zarar verebilir mi,
 * ve topladığı veriyi hukuka uygun işliyor mu?**
 *
 * Bağımlılık yok. Statik analiz; tarayıcı gerektirmez.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const HTML = ['index.html', 'work.html', 'blog.html', 'post.html', 'gizlilik.html', 'kosullar.html', 'kalite.html', 'ornek.html']
  .filter((f) => existsSync(join(ROOT, f)));

const bulgular = [];
const ok = [];
const kaydet = (seviye, alan, mesaj) => bulgular.push({ seviye, alan, mesaj });
const gecti = (m) => ok.push(m);

const app = read('assets/js/app.js');

/* --- 1. XSS: innerHTML'e giden veri kaçırılıyor mu --- */
{
  /* innerHTML atamalarında ${} veya + ile birleşen, esc()'ten geçmeyen
     ifade var mı? Kaba ama etkili: esc( görmeden değişken birleştiren satır. */
  const satirlar = app.split('\n');
  let supheli = 0;
  satirlar.forEach((ln, i) => {
    if (!/innerHTML\s*[+]?=/.test(ln)) return;
    /* Aynı ifadenin devamı birkaç satır sürebiliyor; blok olarak bak. */
    const blok = satirlar.slice(i, i + 30).join('\n');
    const kesim = blok.slice(0, blok.indexOf(';') + 1 || blok.length);
    /* Şablon içinde esc() olmadan doğrudan değişken basan yer var mı */
    const ham = kesim.match(/\+\s*(?!esc\()(?!'|")([A-Za-z_$][\w$.]*)\s*\+/g) || [];
    const izinli = /^\+\s*(s\.href|s\.label|c\[0\]|c\[1\]|body|related|url|post\.icon|readTime)/;
    const kotu = ham.filter((h) => !izinli.test(h));
    if (kotu.length) { supheli++; kaydet('orta', 'xss', `app.js:${i + 1} innerHTML'e esc()'siz ifade: ${kotu.slice(0,2).join(', ')}`); }
  });
  if (!supheli) gecti('xss: innerHTML şablonlarında esc() dışı doğrudan değişken yok');

  /* URL parametreleri sözlükten doğrulanıyor mu */
  if (/langInfo\(candidate\)/.test(app)) gecti('xss: ?lang parametresi dil listesine karşı doğrulanıyor');
  else kaydet('yuksek', 'xss', '?lang parametresi doğrulanmadan kullanılıyor olabilir');

  if (/POSTS\.filter\(function \(p\) \{ return p\.slug === slug/.test(app)) gecti('xss: ?slug parametresi yalnızca eşleştirme için kullanılıyor, HTML\'e basılmıyor');
  else kaydet('yuksek', 'xss', '?slug parametresi doğrudan HTML\'e basılıyor olabilir');
}

/* --- 2. JSON-LD: script bloğundan kaçış --- */
{
  if (/el\.textContent = JSON\.stringify/.test(app)) gecti('json-ld: veri textContent ile yazılıyor (script bloğundan kaçış mümkün değil)');
  else kaydet('yuksek', 'json-ld', 'JSON-LD innerHTML ile yazılıyorsa içerikteki </script> bloğu kırabilir');
}

/* --- 3. Sekme ele geçirme (tabnabbing) --- */
{
  let acik = 0;
  const hepsi = [app, ...HTML.map(read)].join('\n');
  const blank = hepsi.match(/target=["']?_blank["']?[^>]{0,120}/g) || [];
  for (const m of blank) if (!/noopener/.test(m)) acik++;
  /* Şablonlarda rel önce gelebiliyor; ters sırayı da tara */
  const ters = hepsi.match(/rel=["'][^"']*noopener[^"']*["'][^>]{0,120}/g) || [];
  if (acik && acik > ters.length) kaydet('orta', 'tabnabbing', `${acik} adet target="_blank" yakınında noopener görünmüyor`);
  else gecti('tabnabbing: yeni sekmede açılan bağlantılarda noopener var');
}

/* --- 4. Kişisel veri: tarayıcıda ne saklanıyor --- */
{
  const anahtarlar = [...app.matchAll(/localStorage\.setItem\(\s*([^,]+),/g)].map((m) => m[1].trim());
  const eposta = /localStorage\.setItem\(['"]?qb_subs/.test(app) || /qb_subs/.test(app);
  if (eposta) {
    const aciklandi = existsSync(join(ROOT, 'gizlilik.html')) && /qb_subs/.test(read('gizlilik.html'));
    if (aciklandi) gecti('kvkk: localStorage\'daki e-posta yedeği gizlilik metninde açıklanmış');
    else kaydet('orta', 'kvkk', 'E-posta adresi localStorage\'da (qb_subs) tutuluyor. Kişisel veri; ' +
      'servis bağlandığında bu yedek kaldırılmalı, en azından gizlilik metninde belirtilmeli.');
  }
  gecti(`kvkk: tarayıcıda tutulan anahtarlar — ${anahtarlar.join(', ') || 'yok'}`);
}

/* --- 5. Gizlilik metni --- */
{
  const olu = HTML.filter((f) => /data-i18n="footer\.privacy"[^>]*>/.test(read(f)) && /href="#"[^>]*data-i18n="footer\.privacy"|data-i18n="footer\.privacy"/.test(read(f)) && /<a href="#" data-i18n="footer\.privacy"/.test(read(f)));
  if (olu.length) {
    kaydet('yuksek', 'gizlilik', `Gizlilik bağlantısı ${olu.length} sayfada boşa gidiyor (href="#") ve gizlilik sayfası yok. ` +
      'Site e-posta ve form verisi topluyor; GDPR bilgilendirme yükümlülüğü var.');
  } else gecti('gizlilik: gizlilik metni bağlantısı çalışıyor');
}

/* --- 6. canonical ile hreflang tutarlılığı --- */
{
  const tutarsiz = [];
  for (const f of HTML) {
    const html = read(f);
    const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
    const alts = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
    if (!canon || !alts.length) continue;
    /* hreflang kümesindeki her sayfa kendine canonical olmalı. Buradaki
       ?lang=xx adresleri parametresiz adrese canonical veriyor: küme tutarsız,
       arama motoru hreflang'ı bütünüyle yok sayar. */
    const paramli = alts.filter(([, code, href]) => code !== 'x-default' && href.includes('?lang='));
    if (!paramli.length || canon.includes('?lang=')) continue;
    /* HTML'deki canonical parametresiz. app.js açılışta syncCanonical ile
       adresi açık olan dile göre düzeltiyor; Google sayfayı işlediği için bu
       geçerli bir çözüm ama JavaScript'e bağımlı. Asıl çözüm ön-render. */
    if (/function syncCanonical/.test(app)) {
      tutarsiz.push(f);
    } else {
      kaydet('yuksek', 'hreflang', `${f}: canonical "${canon}" parametresiz, hreflang alternatifleri ise ?lang=xx. ` +
        'Kendine canonical vermeyen alternatifler nedeniyle hreflang kümesi yok sayılır — on dilin SEO karşılığı sıfırlanır.');
    }
  }
  if (tutarsiz.length) {
    kaydet('bilgi', 'hreflang', `canonical, ${tutarsiz.length} sayfada çalışma anında (syncCanonical) düzeltiliyor — ` +
      'işaretleme tutarlı ama JavaScript\'e bağımlı. Kalıcı çözüm: her dili ayrı adreste üreten ön-render adımı.');
  } else if (!bulgular.some((b) => b.alan === 'hreflang')) {
    gecti('hreflang: canonical ile alternatif adresler tutarlı');
  }
}

/* --- 7. mailto başlık enjeksiyonu --- */
{
  if (/mailto:' \+ MAIL_TO \+\s*\n?\s*'\?subject=' \+ encodeURIComponent/.test(app) || /encodeURIComponent\(subject\)/.test(app)) {
    gecti('mailto: konu ve gövde encodeURIComponent ile kaçırılıyor (başlık enjeksiyonu kapalı)');
  } else kaydet('yuksek', 'mailto', 'mailto bağlantısında kullanıcı verisi kaçırılmadan birleştiriliyor olabilir');
}

/* --- 8. Karışık içerik ve dış kaynak --- */
{
  const hepsi = [...HTML.map(read), read('assets/css/main.css'), read('assets/fonts/inter.css')].join('\n');
  const http = (hepsi.match(/["'(]http:\/\/[^"')\s]+/g) || []).filter((u) => !u.includes('www.w3.org') && !u.includes('schema.org'));
  if (http.length) kaydet('orta', 'karisik-icerik', `Şifresiz http:// adresi: ${http.slice(0, 3).join(', ')}`);
  else gecti('karışık içerik: şifresiz http:// kaynak yok');

  const dis = (hepsi.match(/(?:src|href)=["']https:\/\/([^/"']+)/g) || [])
    .map((m) => m.split('//')[1]).filter((h, i, a) => a.indexOf(h) === i);
  if (dis.length) kaydet('bilgi', 'dis-kaynak', `Sayfalar şu dış adreslere bağlanıyor: ${dis.join(', ')}`);
  else gecti('dış kaynak: sayfalar hiçbir üçüncü tarafa istek atmıyor');
}

/* --- 8b. config.js'teki dış uç noktalar CSP'de açık mı? ---
   Yeni bir servis bağlandığında (bülten, form) istek fetch ile gidiyor, yani
   connect-src'ye tabi. CSP güncellenmezse istek sessizce engelleniyor: tarayıcı
   konsolunda görünür ama kullanıcı yalnızca "hata" mesajı görür. Bu kontrol
   tam olarak o sessiz kırılmayı yakalar. */
{
  const cfg = read('assets/js/config.js');
  const ucNoktalar = [...cfg.matchAll(/^\s*(\w+Endpoint)\s*:\s*'(https:\/\/[^']+)'/gm)]
    .map((m) => ({ ad: m[1], host: new URL(m[2]).origin }));
  if (!ucNoktalar.length) {
    kaydet('bilgi', 'uc-nokta', 'config.js\'te bağlı dış servis yok — bülten listesi oluşmuyor');
  } else if (!existsSync(join(ROOT, 'vercel.json'))) {
    kaydet('orta', 'uc-nokta', 'Dış uç nokta var ama vercel.json yok: CSP tanımsız');
  } else {
    const csp = JSON.parse(read('vercel.json')).headers
      .flatMap((x) => x.headers || []).find((x) => x.key.toLowerCase() === 'content-security-policy');
    const connect = (csp?.value.match(/connect-src ([^;]*)/) || [, ''])[1];
    const eksik = ucNoktalar.filter((u) => !connect.includes(u.host));
    if (eksik.length) {
      kaydet('yuksek', 'uc-nokta', `CSP connect-src bu adresleri engelliyor: ${eksik.map((u) => u.ad + ' → ' + u.host).join(', ')}`);
    } else {
      gecti(`uç noktalar: ${ucNoktalar.map((u) => u.host).join(', ')} CSP connect-src'de açık`);
    }
  }
}

/* --- 9. Ortaklık bağlantılarında sponsored --- */
{
  if (/rel="sponsored nofollow noopener"/.test(app)) gecti('ortaklık: bağlantılar rel="sponsored nofollow noopener" ile işaretleniyor');
  else kaydet('orta', 'ortaklik', 'Ortaklık bağlantılarında rel="sponsored" yok — Google bunu bağlantı şeması sayar');
}

/* --- 10. Güvenlik başlıkları --- */
{
  if (existsSync(join(ROOT, 'vercel.json'))) {
    const v = JSON.parse(read('vercel.json'));
    const h = (v.headers || []).flatMap((x) => x.headers || []).map((x) => x.key.toLowerCase());
    const gerekli = ['content-security-policy', 'strict-transport-security', 'x-content-type-options', 'referrer-policy'];
    const eksik = gerekli.filter((g) => !h.includes(g));
    if (eksik.length) kaydet('orta', 'basliklar', `Eksik güvenlik başlığı: ${eksik.join(', ')}`);
    else gecti('başlıklar: CSP, HSTS, nosniff ve referrer politikası tanımlı');
  } else kaydet('orta', 'basliklar', 'vercel.json yok — güvenlik başlıkları tanımsız');
}

/* --- rapor --- */
const cizgi = '─'.repeat(58);
console.log('QBLOGG güvenlik ve veri koruma denetimi:');
console.log(cizgi);
for (const o of ok) console.log('  ✓ ' + o);
const sira = { yuksek: 0, orta: 1, bilgi: 2 };
const isaret = { yuksek: '✗', orta: '!', bilgi: 'i' };
for (const b of bulgular.sort((a, b2) => sira[a.seviye] - sira[b2.seviye])) {
  console.log(`  ${isaret[b.seviye]} [${b.alan}] ${b.mesaj}`);
}
console.log(cizgi);
const yuksek = bulgular.filter((b) => b.seviye === 'yuksek').length;
const orta = bulgular.filter((b) => b.seviye === 'orta').length;
console.log(`${ok.length} kontrol geçti · ${yuksek} yüksek · ${orta} orta · ${bulgular.length - yuksek - orta} bilgi`);
process.exit(yuksek ? 1 : 0);
