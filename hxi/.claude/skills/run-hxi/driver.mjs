#!/usr/bin/env node
/* HXI sürücüsü — siteyi başlatır, gerçek tarayıcıyla sürer, ekran görüntüsü alır.
 *
 * Kullanım (depo kökünden):
 *   node hxi/.claude/skills/run-hxi/driver.mjs smoke [çıktı-dizini]
 *   node hxi/.claude/skills/run-hxi/driver.mjs shot <sayfa> [çıktı-dizini] [--mobile] [--menu]
 *
 * smoke : sunucuyu kendi açar (8003 boşsa), kritik akışları sürer, kapatır. Çıkış 0/1.
 * shot  : tek sayfanın tam ekran görüntüsü. --mobile 390×844; --menu mobil menüyü açar.
 * Çıktılar <çıktı-dizini|/tmp/hxi-run>/ altına .png yazar.
 *
 * Site kök-mutlak yollar kullanır (/style.css, /app.js) → sunucu hxi/ dizinini kök yapar.
 * Dış kaynaklar bu konteynerde Chromium'a ulaşmaz: cdn.websitepublisher.ai (logo) ve
 * open.spotify.com askıda kalır; fonts.googleapis.com ~13 sn sonra ERR_CONNECTION_RESET
 * alır (curl ile 200, Chromium'un proxy tüneli kopuyor; ignoreHTTPSErrors fark etmiyor).
 * Bu yüzden localhost dışı her istek iptal edilir — yoksa networkidle sayfa başına 13 sn
 * bekler. Görüntülerde yedek font ve logo boşluğu normaldir; tipografi burada doğrulanamaz.
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

// hxi/ dizini (driver'ın üç seviye üstü)
const SITE_DIR = path.resolve(fileURLToPath(import.meta.url), '../../../..');
const PORT = 8003;                                          // 8000 QBLOGG, 8001 care, 8002 care-pilot

const args  = process.argv.slice(2);
const flags = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => [a.slice(2), true]));
const pos   = args.filter(a => !a.startsWith('--'));
const KIP   = pos[0] || 'smoke';
const OUT   = (KIP === 'shot' ? pos[2] : pos[1]) || '/tmp/hxi-run';
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
// Driver çökse de kendi açtığı sunucuyu kapat
process.on('exit', () => { if (srv) { try { process.kill(-srv.pid); } catch {} } });

const MASAUSTU = { width: 1280, height: 850 };
const MOBIL    = { width: 390, height: 844 };

async function baglam(b, mobil) {
  const ctx = await b.newContext({ viewport: mobil ? MOBIL : MASAUSTU, deviceScaleFactor: mobil ? 1 : 0.75 });
  await ctx.route(u => !u.href.startsWith('http://localhost'), r => r.abort()); // dış istekleri kes (üstteki not)
  return ctx;
}

const git = async (p, yol) => p.goto(`http://localhost:${PORT}/${yol}`, { waitUntil: 'networkidle' });

if (KIP === 'shot') {
  const yol = pos[1] || 'index.html';
  await sunucu();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await baglam(b, flags.mobile);
  const p = await ctx.newPage();
  await git(p, yol);
  if (flags.menu) { await p.click('#menu-open'); await p.locator('#mobile-menu.open').waitFor(); }
  await p.waitForTimeout(400);
  const ad = `${OUT}/${yol.replace(/[?&/=]/g, '_')}${flags.mobile ? '-mobile' : ''}${flags.menu ? '-menu' : ''}.png`;
  await p.screenshot({ path: ad, fullPage: !flags.menu });
  console.log('görüntü:', ad);
  await b.close();
} else {
  await sunucu();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const hata = [], yerel404 = [];
  let kalan = 0;
  const kontrol = (ad, k, ek = '') => {
    console.log((k ? '✅ ' : '❌ ') + ad + (ek ? ' → ' + ek : ''));
    if (!k) kalan++;
  };
  const sayfa = async ctx => {
    const p = await ctx.newPage();
    p.on('pageerror', e => hata.push(String(e)));
    p.on('response', r => { if (r.url().startsWith('http://localhost') && r.status() >= 400) yerel404.push(r.url()); });
    return p;
  };

  // ── A. Masaüstü ───────────────────────────────────────────────────────────
  const ctxA = await baglam(b, false);
  const p = await sayfa(ctxA);

  // 1. Ana sayfa
  await git(p, 'index.html');
  kontrol('ana sayfa başlık', (await p.title()).startsWith('HXI'));
  kontrol('CSS kök-mutlak yoldan uygulandı (body #080808)',
    (await p.evaluate(() => getComputedStyle(document.body).backgroundColor)) === 'rgb(8, 8, 8)');
  kontrol('masaüstü nav (6 iç + Listen)', (await p.locator('.nav-links a').count()) === 7);
  kontrol('masaüstünde menü düğmesi gizli', !(await p.locator('#menu-open').isVisible()));
  kontrol('seçilmiş işler (4 kart)', (await p.locator('.work').count()) === 4);
  const ld = await p.evaluate(() => { try { return JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@type']; } catch { return null; } });
  kontrol('JSON-LD geçerli, MusicGroup', ld === 'MusicGroup', String(ld));
  await p.screenshot({ path: `${OUT}/smoke-index.png`, fullPage: true });

  // 2. Music: tıklamayla yüklenen Spotify oynatıcı
  await git(p, 'music.html');
  kontrol('music yayın kartları (6)', (await p.locator('.release-card').count()) === 6);
  kontrol('oynatıcı başta yüklü değil', (await p.locator('#spotify-help iframe').count()) === 0);
  await p.click('[data-player]');
  kontrol('Load player → iframe eklendi, düğme kalktı',
    (await p.locator('#spotify-help iframe').count()) === 1
    && (await p.locator('#spotify-help').getAttribute('data-loaded')) === '1'
    && (await p.locator('[data-player]').count()) === 0);

  // 3. Tüm iç bağlantılar: her sayfa açılır, noindex taşır, CSS/JS yüklenir
  const sayfalar = ['index.html', 'music.html', 'credits.html', 'creator-use.html', 'sync.html',
                    'press.html', 'booking.html', 'privacy.html', 'legal.html'];
  const eksikRobots = [];
  const kirik = new Set();
  for (const s of sayfalar) {
    await git(p, s);
    const robots = await p.locator('meta[name="robots"]').getAttribute('content').catch(() => null);
    if (robots !== 'noindex,nofollow') eksikRobots.push(s);
    const hrefler = await p.evaluate(() => Array.from(document.querySelectorAll('a[href^="/"]')).map(a => a.getAttribute('href')));
    for (const h of new Set(hrefler)) {
      const r = await fetch(`http://localhost:${PORT}${h}`);
      if (!r.ok) kirik.add(`${s} → ${h}`);
    }
  }
  kontrol(`${sayfalar.length} sayfa noindex,nofollow`, eksikRobots.length === 0, eksikRobots.join(', '));
  kontrol('iç bağlantılar 200', kirik.size === 0, [...kirik].join(', '));
  await ctxA.close();

  // ── B. Mobil: hamburger menü ──────────────────────────────────────────────
  const ctxB = await baglam(b, true);
  const pb = await sayfa(ctxB);
  await git(pb, 'index.html');
  kontrol('mobilde menü düğmesi görünür', await pb.locator('#menu-open').isVisible());
  kontrol('mobilde menü kapalı başlar', !(await pb.locator('#mobile-menu').isVisible()));
  await pb.click('#menu-open');
  kontrol('menü açıldı (open, aria-hidden=false, aria-expanded=true)',
    (await pb.locator('#mobile-menu.open').isVisible())
    && (await pb.locator('#mobile-menu').getAttribute('aria-hidden')) === 'false'
    && (await pb.locator('#menu-open').getAttribute('aria-expanded')) === 'true');
  kontrol('menüde 6 bağlantı', (await pb.locator('#mobile-menu a').count()) === 6);
  kontrol('açıkken body kaydırma kilitli', (await pb.evaluate(() => document.body.style.overflow)) === 'hidden');
  await pb.screenshot({ path: `${OUT}/smoke-mobile-menu.png` });
  await pb.click('#menu-close');
  kontrol('menü kapandı', !(await pb.locator('#mobile-menu').isVisible())
    && (await pb.evaluate(() => document.body.style.overflow)) === '');
  await ctxB.close();

  // ── C. Hata yok ───────────────────────────────────────────────────────────
  kontrol('konsol/sayfa hatası yok', hata.length === 0, hata[0] || '');
  kontrol('yerel 404 yok', yerel404.length === 0, yerel404[0] || '');

  await b.close();
  console.log(kalan === 0 ? 'SMOKE: PASS' : `SMOKE: FAIL (${kalan})`);
  process.exit(kalan ? 1 : 0);
}
