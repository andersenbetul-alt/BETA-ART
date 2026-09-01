#!/usr/bin/env node
/* QBLOGG sürücüsü — siteyi başlatır, gerçek tarayıcıyla sürer, ekran görüntüsü alır.
 *
 * Kullanım (depo kökünden):
 *   node .claude/skills/run-qblogg/driver.mjs smoke [çıktı-dizini]
 *   node .claude/skills/run-qblogg/driver.mjs shot <sayfa[?sorgu]> [çıktı-dizini]
 *   node .claude/skills/run-qblogg/driver.mjs incognito
 *
 * smoke     : sunucuyu kendisi açar (8000 boşsa), 5 kritik akışı sürer, kapatır.
 * shot      : tek sayfanın tam ekran görüntüsü (reveal animasyonu sabitlenmiş).
 * incognito : ilk ziyaret + gizli mod davranışını sınar — (1) sıfır cookie/
 *             localStorage'lı temiz bağlam, (2) localStorage tamamen erişilemez
 *             (Safari'nin eski gizli modunda gerçek olan QuotaExceededError).
 *             app.js'teki tema/dil/bülten try/catch'lerinin gerçekten koruyup
 *             korumadığını doğrular; ekran görüntüsü almaz, çıkış kodu 0/1.
 * Çıktılar varsayılan olarak <çıktı-dizini|/tmp/qblogg-run>/ altına .png yazar.
 *
 * Playwright bu konteynerde küresel kuruludur ama depo kökünden import edilemez
 * (ERR_MODULE_NOT_FOUND) — bu yüzden createRequire ile /opt'tan çözüyoruz.
 */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const req = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = req('playwright');

const KOK = new URL('../../..', import.meta.url).pathname; // depo kökü
const PORT = 8000;
const KIP = process.argv[2] || 'smoke';
// smoke [outdir] | shot <sayfa> [outdir]
const OUT = (KIP === 'shot' ? process.argv[4] : process.argv[3]) || '/tmp/qblogg-run';
mkdirSync(OUT, { recursive: true });

async function portAcik() {
  try { const r = await fetch(`http://localhost:${PORT}/index.html`); return r.ok; }
  catch { return false; }
}

async function sunucu() {
  if (await portAcik()) return null;                       // zaten çalışıyor
  const p = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: KOK, stdio: 'ignore', detached: true });
  for (let i = 0; i < 20; i++) { if (await portAcik()) return p; await new Promise(r => setTimeout(r, 250)); }
  throw new Error('sunucu 5 sn içinde açılmadı');
}

async function tarayici() {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 850 }, deviceScaleFactor: 0.75 });
  return { b, ctx };
}

async function sabitle(p) {  // reveal animasyonu ekran görüntüsünde boş kart bırakmasın
  await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}' });
}

const git = async (p, yol) => p.goto(`http://localhost:${PORT}/${yol}`, { waitUntil: 'networkidle' });

if (KIP === 'incognito') {
  const srv = await sunucu();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

  const senaryo = async (ad, initScript) => {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 850 } });
    if (initScript) await ctx.addInitScript(initScript);
    const p = await ctx.newPage();
    const hatalar = [];
    p.on('pageerror', e => hatalar.push(String(e)));
    p.on('console', m => { if (m.type() === 'error') hatalar.push('console.error: ' + m.text()); });

    await git(p, 'index.html');
    const tema1 = await p.getAttribute('html', 'data-theme');
    const dil1 = await p.getAttribute('html', 'lang');
    await p.locator('#themeBtn').first().click({ timeout: 1000 }).catch(() => {});
    await p.reload({ waitUntil: 'networkidle' });
    const tema2 = await p.getAttribute('html', 'data-theme');

    await ctx.close();
    console.log(`\n== ${ad} ==`);
    console.log('  ilk tema:', tema1, '| ilk dil:', dil1, '| değiştir+yenile sonrası tema:', tema2);
    console.log('  sayfa/konsol hatası:', hatalar.length === 0 ? 'yok' : hatalar.length + ' → ' + hatalar[0]);
    return hatalar.length === 0;
  };

  const ok1 = await senaryo('1) Temiz gizli mod bağlamı (sıfır cookie/localStorage)');
  const ok2 = await senaryo('2) Sert senaryo — localStorage erişilemez (QuotaExceededError)', () => {
    const bozuk = {
      getItem() { throw new DOMException('QuotaExceededError'); },
      setItem() { throw new DOMException('QuotaExceededError'); },
      removeItem() { throw new DOMException('QuotaExceededError'); },
    };
    Object.defineProperty(window, 'localStorage', { value: bozuk, configurable: true });
  });

  await b.close(); if (srv) process.kill(-srv.pid);
  const gecti = ok1 && ok2;
  console.log('\nINCOGNITO:', gecti ? 'PASS' : 'FAIL');
  process.exit(gecti ? 0 : 1);
} else if (KIP === 'shot') {
  const yol = process.argv[3] || 'index.html';
  const srv = await sunucu();
  const { b, ctx } = await tarayici();
  const p = await ctx.newPage();
  await git(p, yol); await sabitle(p); await p.waitForTimeout(400);
  const ad = `${OUT}/${yol.replace(/[?&/=]/g, '_')}.png`;
  await p.screenshot({ path: ad, fullPage: true });
  console.log('görüntü:', ad);
  await b.close(); if (srv) process.kill(-srv.pid);
} else {
  // smoke: 5 akış
  const srv = await sunucu();
  const { b, ctx } = await tarayici();
  const p = await ctx.newPage();
  const hata = []; p.on('pageerror', e => hata.push(String(e)));
  let kalan = 0;
  const kontrol = (ad, k, ek = '') => { console.log((k ? '✅ ' : '❌ ') + ad + (ek ? ' → ' + ek : '')); if (!k) kalan++; };

  await git(p, 'index.html'); await sabitle(p);
  kontrol('ana sayfa + karşılaştırma tablosu (8 satır)', (await p.locator('.cmp-table tbody tr').count()) === 8);
  await p.screenshot({ path: `${OUT}/smoke-anasayfa.png`, fullPage: true });

  await git(p, 'post.html?slug=yazarak-para-kazanma-platformlari&lang=tr');
  kontrol('yazı sayfası TOC (≥3 bağlantı)', (await p.locator('.article-toc ol li a').count()) >= 3);

  await git(p, 'kalite.html');
  kontrol('kalite sayfası başlık', (await p.title()).includes('Kalite'));

  await git(p, 'index.html?lang=ar');
  kontrol('Arapça RTL', (await p.getAttribute('html', 'dir')) === 'rtl');

  await git(p, 'uye/index.html');
  kontrol('üye uygulaması (yapılandırmasızsa "Kurulum bekleniyor")',
    (await p.locator('#kurulum, #giris').count()) >= 1);

  kontrol('konsol/sayfa hatası yok', hata.length === 0, hata[0] || '');
  await b.close(); if (srv) process.kill(-srv.pid);
  console.log(kalan === 0 ? 'SMOKE: PASS' : `SMOKE: FAIL (${kalan})`);
  process.exit(kalan ? 1 : 0);
}
