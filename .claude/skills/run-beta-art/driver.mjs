#!/usr/bin/env node
/**
 * NAVIAR sitesini süren araç.
 *
 * Site çalışan bir sunucu gerektiriyor; bu betik ona tarayıcıyla bağlanır.
 * `chromium-cli` bu konteynerde yok, o yüzden sürücü projenin kendi
 * Playwright'ını kullanıyor.
 *
 * Komutlar:
 *   node .claude/skills/run-beta-art/driver.mjs sweep
 *       Sitemap'teki her rotayı gezer; HTTP durumu, konsol hatası ve sayfa
 *       hatası toplar. Çıkış kodu 0 = hepsi temiz.
 *
 *   node .claude/skills/run-beta-art/driver.mjs shot /tr [--dark] [--width 1280] [--out dosya.png]
 *       Ekran görüntüsü alır.
 *
 *   node .claude/skills/run-beta-art/driver.mjs flow
 *       İletişim formunu uçtan uca doldurup gönderir ve sonucu okur.
 *       Bu form bir Server Action; ağ isteğini değil, DOM'daki sonucu ölçer.
 *
 * Ortam:
 *   BASE   varsayılan http://127.0.0.1:7311
 *   OUT    ekran görüntüsü dizini, varsayılan ./.artifacts
 */

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE ?? "http://127.0.0.1:7311";
const OUT = process.env.OUT ?? join(process.cwd(), ".artifacts");

/**
 * GEREKLİ: Playwright'ın varsayılan başlatması bu konteynerde ÇALIŞMAZ.
 * Paket, kendi sürümüne karşılık gelen `chromium_headless_shell-<rev>`
 * dizinini arıyor; konteynerde kurulu olan `chromium-1194`. Sonuç:
 *   "Executable doesn't exist at /opt/pw-browsers/chromium_headless_shell-1234/…"
 * Bu yüzden çalıştırılabilir yol elle veriliyor.
 */
function chromePath() {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE) return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
  for (const p of [
    "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    "/opt/pw-browsers/chromium/chrome-linux/chrome",
  ]) {
    if (existsSync(p)) return p;
  }
  throw new Error("Chromium bulunamadı; PLAYWRIGHT_CHROMIUM_EXECUTABLE ver.");
}

async function browser() {
  return chromium.launch({ executablePath: chromePath() });
}

/** Sunucu ayakta mı — değilse anlamlı hata ver, 30 sn timeout'a düşme. */
async function requireServer() {
  try {
    const r = await fetch(`${BASE}/tr`, { signal: AbortSignal.timeout(5000) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
  } catch (e) {
    console.error(`Sunucuya ulaşılamıyor: ${BASE} (${e.message})`);
    console.error("Önce başlat:  npm run build && PORT=7311 npm start &");
    process.exit(2);
  }
}

/** Rotaları sitemap'ten alır — elle liste tutmak sapmaya yol açar. */
async function routes() {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  // sitemap üretim alan adını yazıyor; yerel sunucuya çeviriyoruz
  return [...new Set(urls.map((u) => new URL(u).pathname))].sort();
}

async function sweep() {
  await requireServer();
  const paths = await routes();
  const b = await browser();
  const page = await b.newPage();

  const problems = [];
  let consoleErrors = [];
  let pageErrors = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", (e) => pageErrors.push(e.message));

  console.log(`${paths.length} rota geziliyor — ${BASE}\n`);
  for (const p of paths) {
    consoleErrors = [];
    pageErrors = [];
    const res = await page.goto(BASE + p, { waitUntil: "domcontentloaded" });
    const status = res?.status() ?? 0;
    const title = await page.title();
    const h1 = await page.locator("h1").first().textContent().catch(() => null);

    const bad = [];
    if (status !== 200) bad.push(`HTTP ${status}`);
    if (!h1) bad.push("h1 yok");
    if (pageErrors.length) bad.push(`sayfa hatası: ${pageErrors[0]}`);
    // Konsol hatalarında ağ kaynaklı olanlar ayıklanıyor: bu konteynerde
    // dış kaynaklar (varsa) ERR_CONNECTION_RESET veriyor, bu siteye ait
    // bir kusur değil.
    const real = consoleErrors.filter((t) => !/ERR_(CONNECTION|NAME|INTERNET)/.test(t));
    if (real.length) bad.push(`konsol: ${real[0].slice(0, 80)}`);

    if (bad.length) problems.push({ path: p, bad });
    console.log(`  ${bad.length ? "✗" : "✓"} ${status} ${p.padEnd(38)} ${(title || "").slice(0, 46)}`);
    if (bad.length) console.log(`      ${bad.join(" | ")}`);
  }

  await b.close();
  console.log(`\n${paths.length - problems.length}/${paths.length} temiz`);
  process.exit(problems.length ? 1 : 0);
}

async function shot(path, opts) {
  await requireServer();
  await mkdir(OUT, { recursive: true });
  const b = await browser();
  const page = await b.newPage({
    viewport: { width: opts.width, height: opts.height },
    colorScheme: opts.dark ? "dark" : "light",
  });
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  const name = opts.out ?? `${path.replace(/\W+/g, "_") || "root"}${opts.dark ? "-dark" : ""}.png`;
  const file = join(OUT, name);
  await page.screenshot({ path: file, fullPage: opts.full });
  await b.close();
  console.log(file);
}

async function flow() {
  await requireServer();
  await mkdir(OUT, { recursive: true });
  const b = await browser();
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${BASE}/tr/iletisim`, { waitUntil: "networkidle" });

  // Alan adları sabit; id'ler React tarafından üretiliyor ve her derlemede
  // değişiyor, o yüzden name ile seçiliyor.
  await page.fill('input[name="name"]', "Test Kullanıcı");
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('input[name="company"]', "Test A.Ş.");
  await page.fill('textarea[name="message"]', "Sürücü betiğinden gönderilen uçtan uca deneme mesajı.");
  // `website` bir bal küpü: doldurulursa gönderim sessizce reddedilir.
  // Bilinçli olarak BOŞ bırakılıyor.

  await page.click('button[type="submit"]');

  /**
   * Başarılı gönderimde form DOM'dan TAMAMEN KALKIYOR; yerine teşekkür
   * durumu geliyor. Bu yüzden "form metni değişti mi" diye beklemek
   * çalışmaz — locator hiç eşleşmeyip 30 sn timeout'a düşer. Doğru sinyal
   * formun YOKLUĞU.
   */
  const gone = await page
    .waitForFunction(() => !document.querySelector("form"), null, { timeout: 15000 })
    .then(() => true)
    .catch(() => false);

  // Server Action olduğu için ağ yanıtı okunmaz; ölçülen şey main içeriği.
  const after = await page.locator("main").innerText();
  const file = join(OUT, "flow-contact.png");
  await page.screenshot({ path: file, fullPage: true });
  await b.close();

  console.log(`form kayboldu mu (başarı sinyali): ${gone ? "EVET" : "HAYIR"}`);
  console.log("--- gönderim sonrası main içeriği ---");
  console.log(after.split("\n").filter(Boolean).slice(0, 10).map((l) => "  " + l).join("\n"));
  console.log(`\nekran görüntüsü: ${file}`);
  process.exit(gone ? 0 : 1);
}

const [cmd, ...rest] = process.argv.slice(2);
const flag = (n, d) => {
  const i = rest.indexOf(`--${n}`);
  return i === -1 ? d : rest[i + 1];
};

if (cmd === "sweep") await sweep();
else if (cmd === "shot")
  await shot(rest[0]?.startsWith("--") ? "/tr" : (rest[0] ?? "/tr"), {
    width: Number(flag("width", 1280)),
    height: Number(flag("height", 900)),
    dark: rest.includes("--dark"),
    full: rest.includes("--full"),
    out: flag("out", undefined),
  });
else if (cmd === "flow") await flow();
else {
  console.error("kullanım: driver.mjs sweep | shot <yol> [--dark --full --width N --out ad.png] | flow");
  process.exit(64);
}
