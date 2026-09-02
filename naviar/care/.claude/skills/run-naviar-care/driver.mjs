#!/usr/bin/env node
/* NaviarCare sürücüsü — siteyi başlatır, gerçek tarayıcıyla sürer, ekran görüntüsü alır.
 *
 * Kullanım (depo kökünden):
 *   node naviar/care/.claude/skills/run-naviar-care/driver.mjs smoke [çıktı-dizini]
 *   node naviar/care/.claude/skills/run-naviar-care/driver.mjs shot <sayfa[?sorgu]> [çıktı-dizini] [--login] [--consent] [--tab=doctors]
 *
 * smoke : sunucuyu kendi açar (8001 boşsa), 12 kritik akışı sürer, kapatır. Çıkış 0/1.
 * shot  : tek sayfanın tam ekran görüntüsü.
 *   --login     admin.html için: ilk kurulum parolasını girer, panele geçer
 *   --tab=X     admin.html için: dashboard|doctors|requests|settings sekmesini açar
 *   --consent   profile.html/booking.html için: NCB onayını + örnek bir favoriyi
 *               önceden yazar (yoksa profil sayfası yalnızca onay kapısını gösterir)
 * Çıktılar <çıktı-dizini|/tmp/naviar-care-run>/ altına .png yazar.
 *
 * Playwright bu konteynerde küresel kuruludur ama depo kökünden import edilemez
 * (ERR_MODULE_NOT_FOUND) — createRequire ile /opt'tan çözüyoruz.
 */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const req = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = req('playwright');

// naviar/care/ dizini (driver'ın üç seviye üstü)
const SITE_DIR = path.resolve(fileURLToPath(import.meta.url), '../../../..');
const PORT = 8001;
const ADMIN_PW = 'smoke-pass-1234';                         // yalnızca yerel; localStorage'da kalır

const args  = process.argv.slice(2);
const flags = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => {
  const [k, v] = a.slice(2).split('='); return [k, v ?? true];
}));
const pos   = args.filter(a => !a.startsWith('--'));
const KIP   = pos[0] || 'smoke';
const OUT   = (KIP === 'shot' ? pos[2] : pos[1]) || '/tmp/naviar-care-run';
mkdirSync(OUT, { recursive: true });

async function portAcik() {
  try { const r = await fetch(`http://localhost:${PORT}/index.html`); return r.ok; }
  catch { return false; }
}

let srv = null;                                             // driver'ın kendi açtığı sunucu
async function sunucu() {
  if (await portAcik()) return null;                        // zaten çalışıyor
  srv = spawn('python3', ['-m', 'http.server', String(PORT), '--directory', SITE_DIR],
    { stdio: 'ignore', detached: true });
  srv.unref();                                              // yoksa node çıkmaz: çocuk tanıtıcısı event loop'u açık tutar
  for (let i = 0; i < 20; i++) { if (await portAcik()) return srv; await new Promise(r => setTimeout(r, 250)); }
  throw new Error('sunucu 5 sn içinde açılmadı');
}
// Driver çökse de (Playwright timeout vb.) kendi açtığı sunucuyu kapat
process.on('exit', () => { if (srv) { try { process.kill(-srv.pid); } catch {} } });

async function tarayici() {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  return b;
}
// Her context ayrı localStorage/sessionStorage taşır — onay ve admin akışları böyle izole edilir.
const baglam = b => b.newContext({ viewport: { width: 1280, height: 850 }, deviceScaleFactor: 0.75 });

const git = async (p, yol) => p.goto(`http://localhost:${PORT}/${yol}`, { waitUntil: 'networkidle' });

// NCB onayını ve isteğe bağlı bir favoriyi sayfa açılmadan localStorage'a yazar
async function onayVer(ctx, favori) {
  await ctx.addInitScript(({ favori }) => {
    localStorage.setItem('NC_CONSENT', 'yes');
    if (favori && !localStorage.getItem('NC_BEHAVIOR')) {
      localStorage.setItem('NC_BEHAVIOR', JSON.stringify({
        v: 2, firstVisit: Date.now() - 86400000, lastVisit: Date.now(), visits: 3,
        specialties: { cardiology: 2 }, doctors: [], pages: { 'booking.html': 2 },
        lang: null, favorites: [favori],
      }));
    }
  }, { favori });
}

// admin.html: ilk kurulum ekranından parola koyup panele geçer
async function adminGiris(p) {
  await p.fill('#setup-pw', ADMIN_PW);
  await p.fill('#setup-pw2', ADMIN_PW);
  await p.click('#setup-btn');
  await p.locator('#admin-panel').waitFor({ state: 'visible', timeout: 3000 });
}

if (KIP === 'shot') {
  const yol = pos[1] || 'index.html';
  await sunucu();
  const b = await tarayici();
  const ctx = await baglam(b);
  if (flags.consent) await onayVer(ctx, 'ak');
  const p = await ctx.newPage();
  p.on('dialog', d => d.dismiss());
  await git(p, yol);
  if (flags.login && yol.startsWith('admin.html')) {
    await adminGiris(p);
    if (flags.tab && flags.tab !== 'dashboard') {
      await p.click(`#tabBtn-${flags.tab}`);
      await p.locator(`#tab-${flags.tab}`).waitFor({ state: 'visible' });
    }
  }
  await p.waitForTimeout(500);
  const ad = `${OUT}/${yol.replace(/[?&/=]/g, '_')}${flags.login ? '-panel' : ''}${flags.tab ? '-' + flags.tab : ''}.png`;
  await p.screenshot({ path: ad, fullPage: true });
  console.log('görüntü:', ad);
  await b.close();
} else {
  // smoke: kritik akışlar
  await sunucu();
  const b = await tarayici();
  const hata = [];
  let kalan = 0;
  const kontrol = (ad, k, ek = '') => {
    console.log((k ? '✅ ' : '❌ ') + ad + (ek ? ' → ' + ek : ''));
    if (!k) kalan++;
  };
  const sayfa = async ctx => {
    const p = await ctx.newPage();
    p.on('pageerror', e => hata.push(String(e)));
    p.on('dialog', d => { hata.push('beklenmeyen dialog: ' + d.message()); d.dismiss(); });
    return p;
  };

  // ── A. Herkese açık sayfalar (tek context) ────────────────────────────────
  const ctxA = await baglam(b);
  const p = await sayfa(ctxA);

  // 1. Ana sayfa
  await git(p, 'index.html');
  await p.waitForTimeout(400);
  kontrol('ana sayfa başlık', (await p.title()).includes('NaviarCare'));
  kontrol('ana sayfa nav (6 bağlantı)', (await p.locator('.nav-links a').count()) === 6);
  await p.screenshot({ path: `${OUT}/smoke-index.png`, fullPage: true });

  // 2. Triage
  await git(p, 'triage.html');
  kontrol('triage başlık', (await p.title()).includes('Symptom'));
  kontrol('triage 1. adım görünür', await p.locator('#step-1').isVisible());

  // 3. Booking: kartlar + NCB onay bandı + favori kaydetme
  await git(p, 'booking.html');
  const doktorSayisi = await p.evaluate(() => (window.NC_DOCTORS || []).length);
  const kart = await p.locator('.doctor-card').count();
  kontrol(`booking doktor kartları (= doctors.js, ${doktorSayisi})`, kart === doktorSayisi && kart > 0, `bulunan ${kart}`);
  kontrol('her kartta favori düğmesi', (await p.locator('.ncb-fav-btn').count()) === kart);
  // NCB.init bandı 1,5 sn sonra gösterir
  const evet = p.locator('#ncb-banner .ncb-btn-yes');
  await evet.waitFor({ state: 'visible', timeout: 4000 }).catch(() => {});
  kontrol('NCB onay bandı çıktı', await evet.isVisible());
  await evet.click();
  kontrol('onay localStorage\'a yazıldı', (await p.evaluate(() => localStorage.getItem('NC_CONSENT'))) === 'yes');
  const ilkFav = p.locator('.ncb-fav-btn').first();
  const favId = await ilkFav.getAttribute('data-fav-id');
  await ilkFav.click();
  kontrol('favori düğmesi aria-pressed=true', (await ilkFav.getAttribute('aria-pressed')) === 'true');
  const favs = await p.evaluate(() => JSON.parse(localStorage.getItem('NC_BEHAVIOR') || '{}').favorites || []);
  kontrol('favori NC_BEHAVIOR.favorites içinde', favs.length === 1 && favs[0] === favId, JSON.stringify(favs));
  // view-profile.html doctors.js'i YÜKLEMEZ (kendi satır içi kopyası var) — beklenen adı buradan al
  const adBekle = await p.evaluate(id => (window.NC_DOCTORS || []).find(d => d.id === id)?.name, favId);

  // 4. Profil (aynı context → onay var, 1 favori var)
  await git(p, 'profile.html');
  kontrol('profil görünümü açık (onay var)', await p.locator('#profile-view').isVisible());
  kontrol('kaydedilen doktor listelendi (1 kart)', (await p.locator('#saved-list .saved-card').count()) === 1);
  await p.screenshot({ path: `${OUT}/smoke-profile.png`, fullPage: true });

  // 5. Danışman profili
  await git(p, `view-profile.html?id=${favId}`);
  const adGoruntu = await p.locator('#bc-name').textContent();
  kontrol('view-profile doktor adı = doctors.js (iki liste ayrışmamış)', !!adBekle && adGoruntu === adBekle, `${adGoruntu} / ${adBekle}`);
  await git(p, 'view-profile.html?id=yok');
  kontrol('view-profile bilinmeyen id → "not found"', await p.locator('.not-found').isVisible());

  // 6. Languages
  await git(p, 'languages.html');
  kontrol('dil tablosu (≥100 satır)', (await p.locator('#lang-tbody tr').count()) >= 100);

  // 7. About
  await git(p, 'about.html');
  kontrol('about SSS (≥4 item)', (await p.locator('.faq-item').count()) >= 4);

  // 8. Join (4 adımlı sihirbaz, <form> etiketi yok)
  await git(p, 'join.html');
  kontrol('join 1. adım görünür', await p.locator('#jstep-1').isVisible());
  kontrol('join uzmanlık kartları (≥10)', (await p.locator('#jstep-1 .spec-card').count()) >= 10);
  await ctxA.close();

  // ── B. Profil, onay yokken (temiz context) ────────────────────────────────
  const ctxB = await baglam(b);
  const pb = await sayfa(ctxB);
  await git(pb, 'profile.html');
  kontrol('profil onay kapısı (onay yok)', await pb.locator('#no-consent-view').isVisible()
    && !(await pb.locator('#profile-view').isVisible()));
  await ctxB.close();

  // ── C. Admin paneli (temiz context: kurulum → panel → çıkış → giriş) ──────
  const ctxC = await baglam(b);
  const pc = await sayfa(ctxC);
  await git(pc, 'admin.html');
  kontrol('admin ilk kurulum ekranı', await pc.locator('#auth-setup').isVisible());
  await adminGiris(pc);
  kontrol('admin paneli açıldı', await pc.locator('#admin-panel').isVisible());
  kontrol('admin doktor tablosu (= doctors.js)', (await pc.locator('#doctors-tbody tr').count()) === doktorSayisi);
  await pc.click('#tabBtn-doctors');
  kontrol('admin doktor sekmesi', await pc.locator('#tab-doctors').isVisible());
  await pc.screenshot({ path: `${OUT}/smoke-admin-doctors.png`, fullPage: true });
  await pc.click('#logout-btn');
  kontrol('çıkış → giriş ekranı', await pc.locator('#auth-login').isVisible());
  await pc.fill('#login-pw', 'yanlis-parola');
  await pc.click('#login-btn');
  await pc.locator('#auth-login-error').waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
  kontrol('yanlış parola reddedildi', await pc.locator('#auth-login-error').isVisible());
  await pc.fill('#login-pw', ADMIN_PW);
  await pc.click('#login-btn');
  await pc.locator('#admin-panel').waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
  kontrol('doğru parola → panel', await pc.locator('#admin-panel').isVisible());
  await ctxC.close();

  // ── D. Konsol hatası yok ──────────────────────────────────────────────────
  kontrol('konsol/sayfa hatası yok', hata.length === 0, hata[0] || '');

  await b.close();
  console.log(kalan === 0 ? 'SMOKE: PASS' : `SMOKE: FAIL (${kalan})`);
  process.exit(kalan ? 1 : 0);
}
