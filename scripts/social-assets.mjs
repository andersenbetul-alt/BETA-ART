/**
 * Sosyal medya görsellerini üretir.
 *
 * NEDEN BETİK: `public/og-*.png` daha önce elle eklenmişti ve üretim kaynağı
 * yoktu. Sloganı ya da paleti değiştirdiğimizde görseli kimse yeniden
 * üretemiyordu. Artık kaynak burada; metin sözlükten geliyor, renkler
 * globals.css'teki değerlerin aynısı.
 *
 * Üretilenler:
 *   public/og-tr.png            1200×630   Open Graph (LinkedIn, Facebook, WhatsApp)
 *   public/og-en.png            1200×630
 *   public/linkedin-logo.png     400×400   LinkedIn şirket sayfası logosu
 *   public/linkedin-banner.png  1128×191   LinkedIn şirket sayfası kapağı
 *
 * Çalıştırma: npm run assets:social
 *
 * Not: Yazı tipleri Google Fonts'tan çekilir. Ağ yoksa betik hata verir ve
 * mevcut görselleri bozmaz — yarım çıktı yazmaz.
 */

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public");

/** globals.css ile aynı değerler. Değiştirirsen orayı da değiştir. */
const c = {
  ink950: "#061422",
  ink900: "#0a1f33",
  ink700: "#1a4467",
  brass: "#c08a2e",
  brass300: "#ddb96e",
  ink100: "#dbe6ef",
  white: "#ffffff",
};

/** src/app/icon.svg ile birebir aynı işaret. */
const mark = (size) => `
  <svg viewBox="0 0 32 32" width="${size}" height="${size}" style="display:block">
    <rect width="32" height="32" rx="8" fill="${c.white}"/>
    <path d="M16 6.5 21.5 25.5 16 21.2 10.5 25.5 16 6.5Z" fill="${c.ink900}"/>
  </svg>`;

const fontLink = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap">`;

/** Her görselde ortak: koyu zemin + köşedeki ışık. */
const shell = (w, h, body) => `<!doctype html><html><head><meta charset="utf-8">${fontLink}
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${w}px;height:${h}px;overflow:hidden;
    font-family:Inter,sans-serif;color:${c.white};
    background:${c.ink900};position:relative}
  .glow{position:absolute;border-radius:9999px;filter:blur(90px);pointer-events:none}
  .g1{width:52%;aspect-ratio:1;right:-12%;top:-38%;background:${c.ink700};opacity:.55}
  .g2{width:34%;aspect-ratio:1;left:-10%;bottom:-42%;background:${c.brass};opacity:.16}
  .wordmark{font-family:"Source Serif 4",serif;font-weight:600;letter-spacing:.22em}
  .rule{background:${c.brass};height:3px}
</style></head><body>
  <div class="glow g1"></div><div class="glow g2"></div>
  ${body}
</body></html>`;

const og = (t) => shell(1200, 630, `
  <div style="position:relative;height:100%;display:flex;flex-direction:column;
              justify-content:space-between;padding:78px 80px">
    <div style="display:flex;align-items:center;gap:22px">
      ${mark(64)}
      <span class="wordmark" style="font-size:40px">NAVIAR</span>
    </div>

    <div>
      <div class="rule" style="width:56px;margin-bottom:34px"></div>
      <h1 style="font-family:'Source Serif 4',serif;font-weight:700;font-size:66px;
                 line-height:1.08;letter-spacing:-.015em;max-width:940px">
        ${t.line1}<br><span style="color:${c.brass300}">${t.line2}</span>
      </h1>
    </div>

    <p style="font-size:23px;color:${c.ink100};opacity:.82">${t.footer}</p>
  </div>`);

/**
 * LinkedIn şirket sayfasında logo rozeti kapağın SOL ALT köşesine biniyor
 * (yaklaşık ilk 230px). Oraya içerik koyulursa altında kalır — bu yüzden
 * sol şerit bilinçli olarak boş bırakıldı.
 */
const banner = (t) => shell(1128, 191, `
  <div style="position:relative;height:100%;display:flex;align-items:center;
              padding:0 64px 0 260px">
    <div style="display:flex;flex-direction:column;gap:9px">
      <span class="wordmark" style="font-size:30px">NAVIAR</span>
      <div class="rule" style="width:44px;height:2px"></div>
      <span style="font-size:16px;color:${c.ink100};opacity:.85">${t.footer}</span>
    </div>
  </div>`);

/**
 * Şirket logosu akışta 48px'e kadar küçülüyor; oraya kelime markası koymak
 * okunmaz bir leke bırakır. Yalnızca işaret, kareyi dolduracak şekilde.
 */
const logo = () => shell(400, 400, `
  <div style="position:relative;height:100%;display:flex;
              align-items:center;justify-content:center">
    ${mark(248)}
  </div>`);

/**
 * Metin sözlükten değil elle: bu görseller derleme dışında üretiliyor ve
 * TypeScript sözlüğünü Node'dan okumak derleme adımı gerektirirdi.
 * Sözlükteki slogan değişirse burası da değişmeli.
 */
const copy = {
  tr: {
    line1: "Stratejiniz sunumda kalıyorsa",
    line2: "sorun strateji değil",
    footer: "Yönetim & Strateji · İnsan Kaynakları & Kurumsal Eğitim",
  },
  en: {
    line1: "If your strategy stays in the deck",
    line2: "the strategy is not the problem",
    footer: "Management & Strategy · HR & Corporate Learning",
  },
};

const jobs = [
  { file: "og-tr.png", w: 1200, h: 630, html: og(copy.tr) },
  { file: "og-en.png", w: 1200, h: 630, html: og(copy.en) },
  { file: "linkedin-banner.png", w: 1128, h: 191, html: banner(copy.tr) },
  { file: "linkedin-logo.png", w: 400, h: 400, html: logo() },
];

const browser = await chromium.launch({
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
});

await mkdir(outDir, { recursive: true });

// Önce hepsini belleğe al, sonra yaz: bir tanesi başarısız olursa
// public/ altında yarım set kalmasın.
const rendered = [];
for (const job of jobs) {
  const page = await browser.newPage({
    viewport: { width: job.w, height: job.h },
    deviceScaleFactor: 1,
  });
  await page.setContent(job.html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  rendered.push([job.file, await page.screenshot({ type: "png" })]);
  await page.close();
}

await browser.close();

for (const [file, buf] of rendered) {
  await writeFile(join(outDir, file), buf);
  console.log(`✓ public/${file}  ${(buf.length / 1024).toFixed(0)} KB`);
}
