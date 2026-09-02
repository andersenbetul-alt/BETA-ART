#!/usr/bin/env node
// Beta Art bundle.html sürücüsü — üretilen tek dosyalık prototipi gerçek
// Chromium'da açar ve teslim önkoşullarını sınar:
//   1. üç marka fontu gerçekten yüklü (document.fonts.check),
//   2. sıfır dış ağ isteği (incognito/çevrimdışı garantisi),
//   3. sayfa hatasız render (pageerror + console.error boş),
//   4. tam boy ekran görüntüsü.
// Kullanım: node drive-bundle.mjs <bundle.html> <cikti-dizini> [--enter]
//   --enter: kapılı sayfalarda (galleri) "Enter the galleri" düğmesine basar.
// Çıkış kodu 0 = teslim edilebilir, 1 = etme.
//
// Playwright depo kökünden import edilemez (ESM, ERR_MODULE_NOT_FOUND);
// run-qblogg'daki çözümün aynısı:
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { resolve, basename, dirname } from "node:path";
const requireGlobal = createRequire("/opt/node22/lib/node_modules/");
const { chromium } = requireGlobal("playwright");

const [bundleArg, outArg, ...flags] = process.argv.slice(2);
if (!bundleArg || !outArg) {
  console.error("kullanım: node drive-bundle.mjs <bundle.html> <cikti-dizini> [--enter]");
  process.exit(1);
}
const bundle = resolve(bundleArg);
const outDir = resolve(outArg);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

const errors = [];
const external = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("request", (r) => { if (!r.url().startsWith("file://")) external.push(r.url()); });

await page.goto(`file://${bundle}`, { waitUntil: "networkidle" });
if (flags.includes("--enter")) {
  await page.getByRole("button", { name: "Enter the galleri" }).click();
}
await page.evaluate(() => document.fonts.ready);

const fonts = await page.evaluate(() =>
  Object.fromEntries(
    ["Fraunces", "Inter", "JetBrains Mono"].map((f) => [f, document.fonts.check(`16px "${f}"`)])
  )
);
const rendered = await page.evaluate(() => (document.getElementById("root")?.children.length ?? 0) > 0);

// Ad çakışmasın: her prototipin bundle'ı aynı adı taşır, klasör adı ayırt eder.
const shot = `${outDir}/${basename(dirname(bundle))}-${basename(bundle, ".html")}.png`;
await page.screenshot({ path: shot, fullPage: true });
await browser.close();

const fontsOk = Object.values(fonts).every(Boolean);
const pass = fontsOk && external.length === 0 && errors.length === 0 && rendered;
console.log("fontlar:", JSON.stringify(fonts));
console.log("dış istek:", external.length === 0 ? "SIFIR ✅" : external);
console.log("render:", rendered ? "✅" : "✗");
console.log("js hataları:", errors.length ? errors : "yok ✅");
console.log("görüntü:", shot);
console.log(pass ? "DRIVE: PASS" : "DRIVE: FAIL");
process.exit(pass ? 0 : 1);
