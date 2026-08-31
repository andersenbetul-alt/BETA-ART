#!/usr/bin/env node
/* NAVIAR Care Pilot sürücüsü — siteyi başlatır, gerçek tarayıcıyla sürer, ekran görüntüsü alır.
 *
 * Kullanım (depo kökünden veya naviar/care-pilot/ içinden):
 *   node naviar/care-pilot/.claude/skills/run-naviar-care-pilot/driver.mjs smoke [çıktı-dizini]
 *   node naviar/care-pilot/.claude/skills/run-naviar-care-pilot/driver.mjs shot [çıktı-dizini]
 *
 * smoke: sunucuyu kendi açar (8002 boşsa), 7 kritik noktayı denetler, kapatır.
 * shot : ana sayfanın tam ekran görüntüsünü alır.
 * Çıktılar <çıktı-dizini|/tmp/naviar-care-pilot-run>/ altına .png yazar.
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

// naviar/care-pilot/ dizini (driver'ın dört seviye üstü)
const SITE_DIR = path.resolve(fileURLToPath(import.meta.url), '../../../..');
const PORT = 8002;
const KIP = process.argv[2] || 'smoke';
const OUT = process.argv[3] || '/tmp/naviar-care-pilot-run';
mkdirSync(OUT, { recursive: true });

async function portAcik() {
  try { const r = await fetch(`http://localhost:${PORT}/index.html`); return r.ok; }
  catch { return false; }
}

async function sunucu() {
  if (await portAcik()) return null;
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
  const srv = await sunucu();
  const { b, ctx } = await tarayici();
  const p = await ctx.newPage();
  await git(p, 'index.html');
  await p.waitForTimeout(400);
  const ad = `${OUT}/care-pilot-index.png`;
  await p.screenshot({ path: ad, fullPage: true });
  console.log('görüntü:', ad);
  await b.close(); if (srv) process.kill(-srv.pid);
} else {
  // smoke: 7 kritik kontrol
  const srv = await sunucu();
  const { b, ctx } = await tarayici();
  const p = await ctx.newPage();
  const hata = []; p.on('pageerror', e => hata.push(String(e)));
  let kalan = 0;
  const kontrol = (ad, k, ek = '') => {
    console.log((k ? '✅ ' : '❌ ') + ad + (ek ? ' → ' + ek : ''));
    if (!k) kalan++;
  };

  await git(p, 'index.html');
  await p.waitForTimeout(400);

  // 1. Başlık
  kontrol('sayfa başlığı "NAVIAR Care"', (await p.title()) === 'NAVIAR Care');

  // 2. Nav bağlantıları (3 adet)
  kontrol('navigasyon (3 bağlantı)', (await p.locator('nav.site a').count()) === 3);

  // 3. "Hvem er dette for" kartları (3 adet)
  kontrol('who-card (3 kart)', (await p.locator('.who-card').count()) === 3);

  // 4. Hizmetler tablosu (3 satır)
  kontrol('hizmetler tablosu (3 satır)', (await p.locator('table.services tbody tr').count()) === 3);

  // 5. Pilot bölge rozetleri (4 adet)
  kontrol('area-badge (4 bölge)', (await p.locator('.area-badge').count()) === 4);

  // 6. İletişim formu mevcut
  kontrol('iletişim formu (#requestForm)', (await p.locator('#requestForm').count()) === 1);

  // 7. Konsol hatası yok
  kontrol('konsol/sayfa hatası yok', hata.length === 0, hata[0] || '');

  await p.screenshot({ path: `${OUT}/smoke-index.png`, fullPage: true });

  await b.close(); if (srv) process.kill(-srv.pid);
  console.log(kalan === 0 ? 'SMOKE: PASS' : `SMOKE: FAIL (${kalan})`);
  process.exit(kalan ? 1 : 0);
}
