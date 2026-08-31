#!/usr/bin/env node
/* NaviarCare sürücüsü — siteyi başlatır, gerçek tarayıcıyla sürer, ekran görüntüsü alır.
 *
 * Kullanım (naviar/care/ dizininden veya depo kökünden):
 *   node naviar/care/.claude/skills/run-naviar-care/driver.mjs smoke [çıktı-dizini]
 *   node naviar/care/.claude/skills/run-naviar-care/driver.mjs shot <sayfa[?sorgu]> [çıktı-dizini]
 *
 * smoke: sunucuyu kendi açar (8001 boşsa), kritik akışları sürer, kapatır.
 * shot : tek sayfanın tam ekran görüntüsü.
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
const KIP = process.argv[2] || 'smoke';
const OUT = (KIP === 'shot' ? process.argv[4] : process.argv[3]) || '/tmp/naviar-care-run';
mkdirSync(OUT, { recursive: true });

async function portAcik() {
  try { const r = await fetch(`http://localhost:${PORT}/index.html`); return r.ok; }
  catch { return false; }
}

async function sunucu() {
  if (await portAcik()) return null;                        // zaten çalışıyor
  const p = spawn('python3', ['-m', 'http.server', String(PORT), '--directory', SITE_DIR],
    { stdio: 'ignore', detached: true });
  for (let i = 0; i < 20; i++) { if (await portAcik()) return p; await new Promise(r => setTimeout(r, 250)); }
  throw new Error('sunucu 5 sn içinde açılmadı');
}

async function tarayici() {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 850 }, deviceScaleFactor: 0.75 });
  return { b, ctx };
}

const git = async (p, yol) => p.goto(`http://localhost:${PORT}/${yol}`, { waitUntil: 'networkidle' });

if (KIP === 'shot') {
  const yol = process.argv[3] || 'index.html';
  const srv = await sunucu();
  const { b, ctx } = await tarayici();
  const p = await ctx.newPage();
  await git(p, yol);
  await p.waitForTimeout(500);
  const ad = `${OUT}/${yol.replace(/[?&/=]/g, '_')}.png`;
  await p.screenshot({ path: ad, fullPage: true });
  console.log('görüntü:', ad);
  await b.close(); if (srv) process.kill(-srv.pid);
} else {
  // smoke: kritik akışlar
  const srv = await sunucu();
  const { b, ctx } = await tarayici();
  const p = await ctx.newPage();
  const hata = []; p.on('pageerror', e => hata.push(String(e)));
  let kalan = 0;
  const kontrol = (ad, k, ek = '') => {
    console.log((k ? '✅ ' : '❌ ') + ad + (ek ? ' → ' + ek : ''));
    if (!k) kalan++;
  };

  // 1. Ana sayfa
  await git(p, 'index.html');
  await p.waitForTimeout(400);
  kontrol('ana sayfa başlık', (await p.title()).includes('NaviarCare'));
  kontrol('ana sayfa nav (6 bağlantı)', (await p.locator('.nav-links a').count()) === 6);
  await p.screenshot({ path: `${OUT}/smoke-index.png`, fullPage: true });

  // 2. Triage sayfası
  await git(p, 'triage.html');
  kontrol('triage başlık', (await p.title()).includes('Symptom'));
  kontrol('triage 1. adım görünür', (await p.locator('#step-1').isVisible()));

  // 3. Booking sayfası
  await git(p, 'booking.html');
  kontrol('booking sayfası doktor kartları (≥4)', (await p.locator('.doctor-card').count()) >= 4);

  // 4. Languages sayfası
  await git(p, 'languages.html');
  kontrol('dil tablosu (≥100 satır)', (await p.locator('#lang-tbody tr').count()) >= 100);

  // 5. About sayfası
  await git(p, 'about.html');
  kontrol('about sayfası SSS (≥4 item)', (await p.locator('.faq-item').count()) >= 4);

  // 6. Join sayfası
  await git(p, 'join.html');
  kontrol('join sayfası form mevcut', (await p.locator('form').count()) >= 1);

  // 7. Konsol hatası yok
  kontrol('konsol/sayfa hatası yok', hata.length === 0, hata[0] || '');

  await b.close(); if (srv) process.kill(-srv.pid);
  console.log(kalan === 0 ? 'SMOKE: PASS' : `SMOKE: FAIL (${kalan})`);
  process.exit(kalan ? 1 : 0);
}
