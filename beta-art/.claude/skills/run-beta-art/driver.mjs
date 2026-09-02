#!/usr/bin/env node
/* Beta Art sürücüsü — dev sunucusunu başlatır, Chromium ile sürer, ekran görüntüsü alır.
 *
 * Kullanım (beta-art/ klasöründen):
 *   node .claude/skills/run-beta-art/driver.mjs smoke [çıktı-dizini]
 *   node .claude/skills/run-beta-art/driver.mjs shot [çıktı-dizini]
 *
 * smoke: sunucuyu başlatır, ana sayfayı doğrular, ekran görüntüsü alır, kapatır.
 * shot : aynı, yalnızca tam sayfa ekran görüntüsü alır.
 * Çıktılar <çıktı-dizini|/tmp/beta-art-run>/ altına .png yazar.
 *
 * Playwright bu konteynerde küresel kuruludur ama beta-art/node_modules'dan
 * import edilemez — createRequire ile /opt'tan çözüyoruz (run-qblogg ile aynı desen).
 */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const req = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = req('playwright');

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..'); // beta-art/
const PORT = 8100;
const KIP = process.argv[2] || 'smoke';
const OUT = process.argv[3] || '/tmp/beta-art-run';
mkdirSync(OUT, { recursive: true });

/* @supabase/supabase-js: bun install Lovable registry'den 403 aldığında eksik kalır.
   npm (standart registry) ile yükle. */
function supabaseKur() {
  const hedef = join(KOK, 'node_modules/@supabase/supabase-js');
  if (existsSync(hedef)) return;
  console.log('📦 @supabase/supabase-js eksik — npm ile kuruluyor…');
  execSync('npm install --legacy-peer-deps @supabase/supabase-js@2.112.3',
    { cwd: KOK, stdio: 'inherit' });
}

async function portAcik() {
  try { const r = await fetch(`http://localhost:${PORT}/`); return r.ok; }
  catch { return false; }
}

async function sunucu() {
  if (await portAcik()) return null;
  supabaseKur();
  // vite.config.local.ts: @lovable.dev/vite-tanstack-config yerine standart eklentiler
  const localCfg = join(KOK, 'vite.config.local.ts');
  const p = spawn(
    'bun', ['run', 'vite', 'dev', '--config', localCfg, '--port', String(PORT)],
    { cwd: KOK, stdio: 'ignore', detached: true }
  );
  for (let i = 0; i < 40; i++) {
    if (await portAcik()) return p;
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`beta-art sunucusu ${PORT}/TCP üzerinde 20 saniyede açılmadı`);
}

async function tarayici() {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 0.75 });
  return { b, ctx };
}

const srv = await sunucu();
const { b, ctx } = await tarayici();
const p = await ctx.newPage();
const hatalar = []; p.on('pageerror', e => hatalar.push(String(e)));

await p.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });

if (KIP === 'smoke') {
  let kalan = 0;
  const kontrol = (ad, k, ek = '') => {
    console.log((k ? '✅ ' : '❌ ') + ad + (ek ? ' → ' + ek : ''));
    if (!k) kalan++;
  };

  const baslik = await p.title();
  kontrol('sayfa başlığı "Beta Art"', baslik.includes('Beta Art'), baslik);

  const h1 = await p.locator('h1').first().textContent().catch(() => '');
  kontrol('h1 "Photography" içeriyor', h1.includes('Photography'), h1.trim());

  const navSayisi = await p.locator('nav a').count();
  kontrol('navigasyon bağlantıları (≥4)', navSayisi >= 4, `${navSayisi} bağlantı`);

  kontrol('konsol/sayfa hatası yok', hatalar.length === 0, hatalar[0] || '');

  const yol = `${OUT}/smoke-anasayfa.png`;
  await p.screenshot({ path: yol, fullPage: false });
  console.log('görüntü:', yol);

  await b.close();
  if (srv) process.kill(-srv.pid);
  console.log(kalan === 0 ? 'SMOKE: PASS' : `SMOKE: FAIL (${kalan})`);
  process.exit(kalan ? 1 : 0);
} else {
  const yol = `${OUT}/beta-art-home.png`;
  await p.screenshot({ path: yol, fullPage: true });
  console.log('görüntü:', yol);
  await b.close();
  if (srv) process.kill(-srv.pid);
}
