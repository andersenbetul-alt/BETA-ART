/**
 * Erişilebilirlik denetimi.
 *
 * Derlenmiş siteyi başlatır, her sayfayı axe-core ile tarar ve bir ihlal
 * bulursa sıfırdan farklı bir kodla çıkar.
 *
 *   npm run build && npm run audit:a11y
 *
 * Tarayıcıyı Playwright'ın kendi indirdiği sürümle çalıştırır. Ortamda hazır
 * bir Chromium varsa `PLAYWRIGHT_CHROMIUM_EXECUTABLE` ile yolunu verebilirsiniz.
 *
 * Tarayıcı gerektirdiği için `npm run check` içinde değildir; yayına almadan
 * önce ve arayüzde renk/işaretleme değiştiren her değişiklikten sonra çalıştırın.
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const PORT = Number(process.env.AUDIT_PORT ?? 3399);
const BASE = `http://127.0.0.1:${PORT}`;

// Her şablonu en az bir kez kapsayacak sayfa listesi
const PATHS = [
  "/tr",
  "/tr/hizmetler",
  "/tr/yaklasim",
  "/tr/icgoruler",
  "/tr/icgoruler/strateji-neden-rafta-kalir",
  "/tr/hakkimizda",
  "/tr/kariyer",
  "/tr/kariyer/kidemli-yonetim-danismani",
  "/tr/iletisim",
  "/tr/gizlilik",
  "/en",
  "/en/services",
  "/en/insights/strateji-neden-rafta-kalir",
  "/en/careers/danismanlik-stajyeri",
  "/en/contact",
];

const VIEWPORTS = [
  { name: "mobil", width: 390, height: 844 },
  { name: "masaüstü", width: 1280, height: 900 },
];

/**
 * Tarayıcıyı başlatır. Ortamda kurulu bir Chromium varsa
 * `PLAYWRIGHT_CHROMIUM_EXECUTABLE` üzerinden kullanılır; yoksa Playwright'ın
 * indirdiği sürüm denenir ve eksikse ne yapılacağı söylenir.
 */
async function launchBrowser() {
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
  try {
    return await chromium.launch(executablePath ? { executablePath } : {});
  } catch (error) {
    throw new Error(
      "Chromium başlatılamadı. `npx playwright install chromium` çalıştırın " +
        "veya mevcut bir tarayıcının yolunu PLAYWRIGHT_CHROMIUM_EXECUTABLE " +
        `ortam değişkeniyle verin.\nAsıl hata: ${error.message}`,
    );
  }
}

async function waitForServer(timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/tr`);
      if (res.ok) return;
    } catch {
      // sunucu henüz ayakta değil
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error("Sunucu zamanında ayağa kalkmadı. Önce `npm run build` çalıştırın.");
}

const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  stdio: "ignore",
  detached: false,
});

let browser;
try {
  await waitForServer();
  browser = await launchBrowser();

  const findings = new Map();

  for (const viewport of VIEWPORTS) {
    for (const path of PATHS) {
      const page = await browser.newPage({
        viewport: { width: viewport.width, height: viewport.height },
      });
      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
      await page.addScriptTag({ content: axeSource });
      const { violations } = await page.evaluate(async () =>
        window.axe.run(document, { resultTypes: ["violations"] }),
      );

      for (const violation of violations) {
        const entry = findings.get(violation.id) ?? {
          impact: violation.impact,
          help: violation.help,
          helpUrl: violation.helpUrl,
          nodes: 0,
          where: new Set(),
          sample: violation.nodes[0]?.html ?? "",
        };
        entry.nodes += violation.nodes.length;
        entry.where.add(`${path} (${viewport.name})`);
        findings.set(violation.id, entry);
      }

      await page.close();
    }
  }

  const checked = PATHS.length * VIEWPORTS.length;

  if (findings.size === 0) {
    console.log(`✓ Erişilebilirlik: ${checked} sayfa görünümünde ihlal bulunamadı.`);
    process.exitCode = 0;
  } else {
    console.error(`✗ Erişilebilirlik: ${findings.size} kural ihlal edildi.\n`);
    const rank = { critical: 0, serious: 1, moderate: 2, minor: 3 };
    const sorted = [...findings].sort(
      (a, b) => (rank[a[1].impact] ?? 9) - (rank[b[1].impact] ?? 9),
    );
    for (const [id, f] of sorted) {
      console.error(`[${f.impact}] ${id} — ${f.nodes} öğe`);
      console.error(`  ${f.help}`);
      console.error(`  ${[...f.where].slice(0, 5).join(", ")}`);
      console.error(`  ${f.sample.replace(/\s+/g, " ").slice(0, 140)}`);
      console.error(`  ${f.helpUrl}\n`);
    }
    process.exitCode = 1;
  }
} finally {
  browser?.close();
  server.kill("SIGTERM");
}
