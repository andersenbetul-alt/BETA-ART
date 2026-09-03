#!/usr/bin/env node
/* QBLOGG sürücüsü — siteyi başlatır, gerçek tarayıcıyla sürer, ekran görüntüsü alır.
 *
 * Kullanım (depo kökünden):
 *   node .claude/skills/run-qblogg/driver.mjs smoke [çıktı-dizini]
 *   node .claude/skills/run-qblogg/driver.mjs shot <sayfa[?sorgu]> [çıktı-dizini]
 *
 * smoke: sunucuyu kendisi açar (8000 boşsa), 7 kritik akışı sürer, kapatır.
 * shot : tek sayfanın tam ekran görüntüsü (reveal animasyonu sabitlenmiş).
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

if (KIP === 'shot') {
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

  await git(p, 'panel/index.html');
  kontrol('içerik paneli giriş ekranı (PAT formu)',
    (await p.locator('#girisForm input#pat').count()) === 1);

  await git(p, 'demo/q-work-audit.html');
  await p.click('input[name="task"]');
  await p.fill('#minutes', '60');
  await p.click('button.primary');
  await p.waitForSelector('#resultat:not([hidden])', { timeout: 2000 });
  kontrol('Action Pages demosu (Q Work Audit) uçtan uca çalışıyor',
    (await p.locator('#joinLink').getAttribute('href') || '').startsWith('mailto:'));

  kontrol('konsol/sayfa hatası yok', hata.length === 0, hata[0] || '');
  await b.close(); if (srv) process.kill(-srv.pid);
  console.log(kalan === 0 ? 'SMOKE: PASS' : `SMOKE: FAIL (${kalan})`);
  process.exit(kalan ? 1 : 0);
}
