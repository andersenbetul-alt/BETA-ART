/**
 * Uçtan uca duman testi — üretim derlemesine karşı HER ekranı açar.
 *
 * Birim testler veriyi doğruluyor; bu dosya SAYFAYI doğruluyor: turist
 * gerçekten bir cevap görüyor mu, yoksa boş bir kutu mu? 13 ülke × 6 ekran.
 *
 * Kullanım:  node tests/smoke.mjs [taban-url]
 */

const BASE = process.argv[2] ?? 'http://localhost:3111';

const COUNTRIES = [
  ['NO', 'Norway', '112', true],
  ['SE', 'Sweden', '112', false],
  ['DK', 'Denmark', '112', false],
  ['FI', 'Finland', '112', false],
  ['IS', 'Iceland', '112', false],
  ['DE', 'Germany', '112', false],
  ['NL', 'Netherlands', '112', false],
  ['AT', 'Austria', '112', false],
  ['FR', 'France', '112', false],
  ['IT', 'Italy', '112', false],
  ['ES', 'Spain', '112', false],
  ['PT', 'Portugal', '112', false],
  ['GR', 'Greece', '112', false],
];
const KINDS = ['cancelled', 'missed', 'road', 'car', 'eat', 'rain', 'meet', 'basics'];

/** Arayüzde asla görünmemesi gereken Türkçe kelimeler — yorumlar Türkçe, metin İngilizce. */
const TURKISH = ['için', 'değil', 'şehir', 'ülke', 'yağmur', 'canlı veri', 'seçenek', 'plana göre'];

let failures = 0;
let checks = 0;

function ok(cond, label) {
  checks++;
  if (!cond) { failures++; console.log(`  ✗ ${label}`); }
}

/** Script ve stil bloklarını atıp görünür metni çıkarır. */
function visibleText(html) {
  const body = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ');
  return body
    .replace(/&quot;/g, '"').replace(/&#x27;|&apos;/g, "'")
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function currentChip(html) {
  const nav = html.match(/<nav aria-label="Country"[\s\S]*?<\/nav>/);
  if (!nav) return null;
  const m = nav[0].match(/aria-current="true"[^>]*>([^<]+)</);
  return m ? m[1] : null;
}

function countryChipCount(html) {
  const nav = html.match(/<nav aria-label="Country"[\s\S]*?<\/nav>/);
  return nav ? (nav[0].match(/class="chip"/g) ?? []).length : 0;
}

async function get(path) {
  const res = await fetch(BASE + path);
  return { status: res.status, html: await res.text() };
}

console.log(`COBBAN duman testi → ${BASE}\n`);

/* ---------------------------------------------------- her ülke, her ekran */

for (const [code, name, emergency, hasTransport] of COUNTRIES) {
  const problems = [];

  for (const kind of KINDS) {
    const path = `/sorun/${kind}?country=${code}`;
    const { status, html } = await get(path);
    const text = visibleText(html);
    const label = `${code}/${kind}`;

    ok(status === 200, `${label}: HTTP ${status}`);
    if (status !== 200) { problems.push(kind); continue; }

    // Ülke seçici doğru ülkeyi işaretliyor mu?
    ok(countryChipCount(html) === 13, `${label}: ülke seçicide 13 ülke yok`);
    ok(currentChip(html) === name, `${label}: seçili ülke "${currentChip(html)}", beklenen "${name}"`);

    // Arayüzde Türkçe sızıntısı
    for (const word of TURKISH) {
      ok(!text.includes(word), `${label}: arayüzde Türkçe — "${word}"`);
    }

    // Boş ekran kontrolü: her sayfada gerçek bir cevap kutusu olmalı
    ok(/class="answer"/.test(html) || /class="option"/.test(html),
       `${label}: cevap kutusu yok — boş ekran`);

    if (kind === 'car') {
      // Ürünün burada verdiği söz: uydurulmuş garaj yok.
      ok(text.includes('We do not list individual garages'),
         `${label}: garaj listelemediğimizi söylemiyor`);
      ok(text.includes('rental'), `${label}: kiralık ayrımı yok`);
      ok(/vest/i.test(text), `${label}: güvenlik adımı yok`);
      // Telefon numarasına benzeyen hiçbir şey olmamalı (112 hariç).
      const phones = (text.match(/\b\d{3}[\s-]?\d{2,}[\s-]?\d{2,}\b/g) ?? []);
      ok(phones.length === 0, `${label}: doğrulanmamış numara sızmış: ${phones[0]}`);
    }

    if (kind === 'basics') {
      ok(text.includes(`Emergency in ${name}: ${emergency}`), `${label}: acil numara satırı yok`);
      const costs = (text.match(/Not knowing costs you:/g) ?? []).length;
      ok(costs >= 4, `${label}: yalnızca ${costs} temel bilgi maddesi`);
      ok(text.includes('112 reaches an English-speaking operator'), `${label}: 112 açıklaması yok`);
    }

    if (kind === 'eat') {
      ok(/min walk/.test(text), `${label}: tek bir yer bile listelenmemiş`);
      ok(!text.includes('No hand-picked places'), `${label}: boş yer listesi`);
    }

    if (kind === 'rain') {
      ok(text.includes('Go indoors') || text.includes('Hold your plan'),
         `${label}: hava kararı yok`);
      if (text.includes('Go indoors')) {
        ok(/min walk/.test(text), `${label}: "içeri geç" dedi ama kapalı mekan listelemedi`);
      }
    }

    if (kind === 'car') {
      // Ürünün burada verdiği söz: uydurulmuş garaj yok.
      ok(text.includes('We do not list individual garages'),
         `${label}: garaj listelemediğimizi söylemiyor`);
      ok(text.includes('rental'), `${label}: kiralık ayrımı yok`);
      ok(/vest/i.test(text), `${label}: güvenlik adımı yok`);
      // Telefon numarasına benzeyen hiçbir şey olmamalı (112 hariç).
      const phones = (text.match(/\b\d{3}[\s-]?\d{2,}[\s-]?\d{2,}\b/g) ?? []);
      ok(phones.length === 0, `${label}: doğrulanmamış numara sızmış: ${phones[0]}`);
    }

    if (kind === 'basics') {
      // İhbar hattı "Emergency" satırına asla karışmamalı.
      const emergencyLine = (text.match(/Emergency in [^.]+\./) ?? [''])[0];
      ok(!/0900|\b114\b/.test(emergencyLine),
         `${label}: acil satırında ihbar hattı var — "${emergencyLine}"`);
      ok(text.includes('112'), `${label}: 112 yok`);
      if (/0900|\b114\b/.test(text)) {
        ok(text.includes('only when someone is in danger'),
           `${label}: ihbar hattı var ama ne zaman aranmayacağı yazmıyor`);
      }
    }

    if (kind === 'meet') {
      // Küratörlü etkinlik olmayan şehirde bile evrensel blok durmalı.
      ok(text.includes('Anywhere in Europe, tonight'), `${label}: evrensel blok yok`);
      ok(text.includes('Free walking tour'), `${label}: evrensel maddeler eksik`);
      ok(text.includes('cannot go stale'), `${label}: veri dürüstlüğü notu yok`);
      ok(/Tonight|Today|Tomorrow|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/.test(text),
         `${label}: hiçbir gün etiketi yok`);
      ok(!/thing on today in undefined|NaN/.test(text), `${label}: bozuk sayaç metni`);
    }

    if (['cancelled', 'missed', 'road'].includes(kind)) {
      if (hasTransport) {
        ok(text.includes('Next departure') || text.includes('Nothing left today'),
           `${label}: sefer cevabı yok`);
        ok(/impact-(safe|tight|breaks)/.test(html), `${label}: plan etkisi rozeti yok`);
        ok(text.includes('From') && text.includes('To'), `${label}: şehir seçici yok`);
      } else {
        ok(text.includes(`We don’t have live departures in ${name} yet`),
           `${label}: ulaşımsız ülke açıklaması yok`);
        ok(text.includes('Ask for re-routing, not a refund'), `${label}: AB yolcu hakları yok`);
        ok(text.includes(`Emergency in ${name}: ${emergency}`), `${label}: acil numara yok`);
        ok(!text.includes('coming soon') && !text.includes('Coming soon'),
           `${label}: "yakında" yazıyor`);
      }
    }
  }
  console.log(`${problems.length === 0 ? '✓' : '✗'} ${code} ${name}`);
}

/* ------------------------------------------------------------ kenar durumlar */

console.log('\nKenar durumlar');
{
  const { status, html } = await get('/sorun/basics?country=ZZ');
  ok(status === 200, `bilinmeyen ülke kodu: HTTP ${status}`);
  ok(currentChip(html) === 'Norway', 'bilinmeyen ülke kodu varsayılana düşmüyor');

  const bad = await get('/sorun/hicbirsey');
  ok(bad.status === 404, `bilinmeyen sorun türü 404 vermeli, ${bad.status} verdi`);

  const home = await get('/?country=GR');
  ok(home.status === 200, `anasayfa: HTTP ${home.status}`);
  ok(currentChip(home.html) === 'Greece', 'anasayfa ülke seçimini taşımıyor');
  const kept = (home.html.match(/href="\/sorun\/[a-z]+\?country=GR"/g) ?? []).length;
  ok(kept === 8, `anasayfadaki 8 bağlantı ülkeyi taşımalı, ${kept} taşıyor`);

  const meetNoCity = await get('/sorun/meet?country=NO&city=tromso');
  ok(meetNoCity.status === 200, 'etkinliksiz şehir sayfayı kırıyor');
  ok(visibleText(meetNoCity.html).includes('Anywhere in Europe, tonight'),
     'etkinliksiz şehirde boş ekran');

  const noCity = await get('/sorun/eat?country=IT&city=atlantis');
  ok(noCity.status === 200, 'olmayan şehir kimliği sayfayı kırıyor');
  ok(/min walk/.test(visibleText(noCity.html)), 'olmayan şehir kimliğinde boş liste');

  const sameCity = await get('/sorun/cancelled?country=NO&from=bergen&to=bergen');
  ok(sameCity.status === 200, 'aynı şehir seçimi sayfayı kırıyor');
  ok(!visibleText(sameCity.html).includes('Pick a different destination'),
     'aynı şehir seçiminde çıkmaz sokak ekranı');
}

/* ------------------------------------------- bağlantılar gerçekten çalışıyor mu */

console.log('\nBağlantılar');
{
  const seen = new Set();
  for (const path of ['/', '/sorun/basics?country=GR', '/sorun/cancelled?country=NO', '/help/ferry-cancelled-norway']) {
    const { html } = await get(path);
    for (const m of html.matchAll(/href="(\/[^"#]*)"/g)) seen.add(m[1]);
  }
  const links = [...seen].filter((l) => !l.startsWith('/_next'));
  let broken = 0;
  for (const link of links) {
    const res = await fetch(BASE + link, { method: 'GET' });
    if (res.status !== 200) { broken++; console.log(`  ✗ ${link} → ${res.status}`); }
  }
  checks += links.length;
  failures += broken;
  console.log(`  ${links.length} bağlantı denendi, ${broken} kırık`);
}

console.log(`\n${failures === 0 ? '✓ HEPSİ GEÇTİ' : '✗ BAŞARISIZ'} — ${checks} kontrol, ${failures} hata`);
process.exit(failures === 0 ? 0 : 1);
