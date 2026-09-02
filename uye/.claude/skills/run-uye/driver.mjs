#!/usr/bin/env node
/**
 * run-uye/driver.mjs
 * QBLOGG Üye (Q Brief Pro) sub-app sürücüsü.
 *
 * Kullanım (BETA-ART/ kökünden):
 *   node uye/.claude/skills/run-uye/driver.mjs smoke <outdir>
 *   node uye/.claude/skills/run-uye/driver.mjs shot  <outdir>
 *
 * Supabase olmadan: uygulama "Kurulum bekleniyor" ekranı gösterir — bu beklenen
 * davranıştır ve smoke test için yeterlidir (sayfa yüklenip başlık doğrulanır).
 */
import { createServer } from 'http';
import { createReadStream, existsSync, mkdirSync, statSync } from 'fs';
import { extname, join, resolve } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __dir = fileURLToPath(new URL('.', import.meta.url));
// Serve BETA-ART root (uye/ içindeki .claude/skills/run-uye/'dan 4 üst dizin)
const SERVE_ROOT = resolve(__dir, '../../../../');
const PORT = 8094;

const MIME = {
  '.html':'text/html','.css':'text/css','.js':'application/javascript',
  '.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg',
  '.json':'application/json','.ico':'image/x-icon','.sql':'text/plain',
};

function startServer() {
  return new Promise((ok, fail) => {
    const s = createServer((req, res) => {
      let filePath = join(SERVE_ROOT, req.url.split('?')[0]);
      // Dizin isteği → index.html'e yönlendir
      try { if (statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html'); } catch {}
      if (!existsSync(filePath)) { res.writeHead(404); res.end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
      createReadStream(filePath).pipe(res);
    });
    s.listen(PORT, () => ok(s));
    s.on('error', fail);
    setTimeout(() => fail(new Error('server timeout')), 5000);
  });
}

async function withBrowser(fn) {
  const req = createRequire('/opt/node22/lib/node_modules/');
  const { chromium } = req('playwright');
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium',
    args: ['--no-sandbox', '--disable-gpu'],
  });
  try { return await fn(browser); } finally { await browser.close(); }
}

const [cmd, outArg] = process.argv.slice(2);
const outDir = outArg || '/tmp/uye-run';
mkdirSync(outDir, { recursive: true });

const server = await startServer();

try {
  if (!cmd || cmd === 'smoke') {
    let pass = true;
    await withBrowser(async browser => {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      page.on('pageerror', e => { if (!e.message.includes('supabase')) { console.error('PAGE ERR:', e.message); pass = false; } });

      await page.goto(`http://localhost:${PORT}/uye/`, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(1000);

      // 1. Başlık
      const title = await page.title();
      if (!title.includes('QBLOGG') && !title.includes('Üye') && !title.includes('Brief')) {
        console.error('❌ Beklenen başlık yok:', title); pass = false;
      } else console.log('✅ title:', title);

      // 2. Kurulum ekranı veya giriş formu görünür
      const setupVisible = await page.evaluate(() => {
        const body = document.body.innerText;
        return body.includes('Supabase') || body.includes('Kurulum') || body.includes('Giriş') ||
               body.includes('supabase') || body.includes('config') || body.length > 50;
      });
      if (!setupVisible) { console.error('❌ Sayfa içeriği boş'); pass = false; }
      else console.log('✅ sayfa içerik yüklendi (kurulum/giriş ekranı)');

      // 3. Ekran görüntüsü
      await page.screenshot({ path: join(outDir, 'smoke.png') });
      console.log('✅ screenshot kaydedildi');
    });

    console.log(pass ? 'SMOKE: PASS' : 'SMOKE: FAIL');
    process.exitCode = pass ? 0 : 1;

  } else if (cmd === 'shot') {
    await withBrowser(async browser => {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await page.goto(`http://localhost:${PORT}/uye/`, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(1000);
      const out = join(outDir, 'uye-viewport.png');
      await page.screenshot({ path: out });
      console.log('SHOT:', out);
    });
  } else {
    console.error('Bilinmeyen komut:', cmd);
    console.error('Kullanım: driver.mjs [smoke|shot] <outdir>');
    process.exitCode = 1;
  }
} finally {
  server.close();
}
