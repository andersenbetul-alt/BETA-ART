#!/usr/bin/env node
/*
 * COBBAN surucusu — uygulamayi baslatir, gezer, ekran goruntusu alir.
 *
 * Playwright global kurulu ve tarayici /opt/pw-browsers altinda; bu yuzden
 * mutlak yoldan import ediyoruz. Kok kullanici oldugumuz icin --no-sandbox
 * sart, yoksa Chromium hic acilmiyor.
 *
 * Kullanim (web/ dizininden):
 *   node .claude/skills/run-cobban/driver.mjs shots      # tum ekranlar, iki tema
 *   node .claude/skills/run-cobban/driver.mjs smoke      # 1758 kontrol
 *   node .claude/skills/run-cobban/driver.mjs assets     # gorsel yollari + favicon
 *   node .claude/skills/run-cobban/driver.mjs skeleton   # yukleniyor iskeleti
 *   node .claude/skills/run-cobban/driver.mjs all
 */
import { spawn, execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

/* Tarayici yolunu ortamdan BEKLEME. Oturum kabugunda
 * PLAYWRIGHT_BROWSERS_PATH tanimli, ama temiz bir kabukta degil ve o zaman
 * Chromium bulunamiyor. Import'tan ONCE kendimiz kuruyoruz. */
process.env.PLAYWRIGHT_BROWSERS_PATH ??= '/opt/pw-browsers';
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');

const PORT = Number(process.env.COBBAN_PORT ?? 3111);
const OUT = process.env.COBBAN_SHOTS ?? '/tmp/cobban-shots';
const BASE = `http://localhost:${PORT}`;

// Gezilmeye deger her ekran. Ulke/sehir sorgu parametresiyle tasiniyor.
const SCREENS = [
  ['home',   '/'],
  ['basics', '/sorun/basics?country=GR'],
  ['cancel', '/sorun/cancelled?country=NO'],
  ['car',    '/sorun/car?country=FR&car=rental'],
  ['meet',   '/sorun/meet?country=DE'],
  ['rain',   '/sorun/rain?country=IT'],
  ['help',   '/help/ferry-cancelled-norway'],
];

const sh = (c) => execSync(c, { encoding: 'utf8', stdio: 'pipe' }).trim();

/* Ayakta kalmis eski sunucu en sinsi hata: yeni derlemeyi degil eskisini
 * servis eder ve hicbir sey yanlis gorunmez. Her zaman once oldur.
 * DIKKAT: "next start" deseni kendi komut satirini de eslestirip kabugu
 * olduruyor (exit 144). Koseli parantez bunu engelliyor. */
function killServer() {
  try { execSync('pkill -f "next[-]server"', { stdio: 'ignore' }); } catch { /* zaten yok */ }
}

async function startServer() {
  killServer();
  await new Promise((r) => setTimeout(r, 800));
  const live = process.env.COBBAN_LIVE_DATA === 'true';
  const p = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    stdio: 'ignore', detached: true,
    env: { ...process.env, ...(live ? { COBBAN_LIVE_DATA: 'true' } : {}) },
  });
  p.unref();
  for (let i = 0; i < 60; i++) {
    try { sh(`curl -sf -o /dev/null ${BASE}/`); return; } catch { /* henuz degil */ }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`sunucu ${PORT} portunda acilmadi — .next var mi? "npm run build" calistir.`);
}

async function shots() {
  mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  let n = 0;
  for (const scheme of ['light', 'dark']) {
    const ctx = await b.newContext({
      viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: scheme,
    });
    const page = await ctx.newPage();
    for (const [name, path] of SCREENS) {
      await page.goto(BASE + path, { waitUntil: 'networkidle' });
      const f = `${OUT}/${scheme}-${name}.png`;
      await page.screenshot({ path: f, fullPage: true });
      console.log(`  ${f}`); n++;
    }
    await ctx.close();
  }
  await b.close();
  console.log(`  ${n} ekran goruntusu → ${OUT}`);
}

async function assets() {
  // Gorseller derleme aninda ImageResponse ile uretiliyor, ikili dosya yok.
  for (const p of ['icon', 'apple-icon', 'opengraph-image', 'twitter-image', 'favicon.ico']) {
    const r = sh(`curl -s -o /dev/null -w '%{http_code} %{content_type}' ${BASE}/${p}`);
    console.log(`  /${p.padEnd(18)} ${r}`);
  }
  console.log('  not: /favicon.ico 404 — acik bulgu, docs/findings.md');
}

async function skeleton() {
  /* Yukleniyor iskeleti YALNIZCA canli veri acikken gorunur: demo veri
   * senkron donuyor, Suspense hic askiya alinmiyor. Entur engelli oldugu
   * icin istek hizli basarisiz olup demo veriye dusuyor — ama fallback
   * yine de akisa giriyor, iskeleti orada yakaliyoruz. */
  process.env.COBBAN_LIVE_DATA = 'true';
  await startServer();
  const html = sh(`curl -s '${BASE}/sorun/cancelled?country=NO'`);
  const has = html.includes('class="skeleton');
  console.log(`  iskelet HTML'de: ${has ? 'EVET' : 'HAYIR'}`);
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await b.newPage();
  await page.route('**/_next/static/chunks/**.js', async (r) => {
    await new Promise((res) => setTimeout(res, 2500)); await r.continue();
  });
  await page.goto(`${BASE}/sorun/cancelled?country=NO`, { waitUntil: 'commit' });

  /* Canli iskeleti YAKALAMAK KARARSIZ: kabuk-icerik degisimi sunucudan
   * akiyor ve bazen Playwright baglanmadan bitiyor. Yakalayabilirsek
   * sayariz, yakalayamazsak bu bir hata degil. */
  try {
    await page.waitForSelector('.skeleton', { timeout: 5000 });
    console.log(`  canli iskelet yakalandi: ${await page.locator('.skeleton').count()} adet`);
  } catch {
    console.log('  canli iskelet yakalanamadi (degisim cok hizli) — hata degil');
  }

  /* Asil olcum bu ve deterministik: jeton cozuluyor mu?
   * --track tanimsizken burasi rgba(0, 0, 0, 0) donuyordu. */
  const bg = await page.evaluate(() => {
    const d = document.createElement('div');
    d.className = 'skeleton'; document.body.appendChild(d);
    const c = getComputedStyle(d).backgroundColor; d.remove(); return c;
  });
  console.log(`  .skeleton arka plani: ${bg}   (rgba(0, 0, 0, 0) = jeton tanimsiz)`);
  await b.close();
}

function smoke() {
  // smoke.mjs adresi argv[2]'den alir; varsayilani zaten 3111.
  console.log(sh(`npm run smoke -- ${BASE}`).split('\n').slice(-3).join('\n'));
}

const cmd = process.argv[2] ?? 'all';
const needsServer = ['shots', 'smoke', 'assets', 'all'].includes(cmd);
if (needsServer) await startServer();

try {
  if (cmd === 'shots' || cmd === 'all') { console.log('\nekran goruntuleri'); await shots(); }
  if (cmd === 'assets' || cmd === 'all') { console.log('\ngorsel yollari'); await assets(); }
  if (cmd === 'smoke' || cmd === 'all') { console.log('\nduman testi'); smoke(); }
  if (cmd === 'skeleton') { console.log('\niskelet'); await skeleton(); }
} finally {
  killServer();
  console.log('\nsunucu kapatildi.');
}
