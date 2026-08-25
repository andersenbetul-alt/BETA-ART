#!/usr/bin/env node
/**
 * frames.js — export each .frame in a page as its own PNG, at its own size.
 *
 * shoot.js takes one picture of a page. A carousel is not one picture: it is
 * eleven files that get uploaded one at a time, in order, and a single tall
 * strip cannot be posted. This clips each frame to its own box and writes
 * NN-slug.png so the upload order is the file order.
 *
 * It also refuses to export a frame whose content overflows its box, because
 * the overflow is invisible once it is a PNG — the text is simply gone, and
 * the file looks deliberate. That check caught the closing frame here running
 * 197px past the bottom edge.
 *
 *   node tools/frames.js docs/carousel-ai-fluency.html /tmp/carousel
 *   node tools/frames.js --selector .slide deck.html out/
 *
 * Fonts come from the same local cache shoot.js uses, so the type in the
 * exported file is the real typeface and not a fallback.
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const PW = "/opt/node22/lib/node_modules/playwright";
const { chromium } = (function () {
  try { return require(PW); }
  catch (e) { return require("playwright"); }
}());

const argv = process.argv.slice(2);
let selector = ".frame";
const rest = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--selector") selector = argv[++i];
  else rest.push(argv[i]);
}
const [src, outDir] = rest;
if (!src || !outDir) {
  console.error("usage: frames.js [--selector CSS] PAGE.html OUTDIR");
  process.exit(2);
}

// Chromium here cannot CONNECT to fonts.googleapis.com, so shoot.js keeps a
// local cache and fulfils the requests from it. Reuse *that* cache — same
// directory, same md5 naming — so an exported frame is set in real Fraunces
// rather than silently falling back to Georgia. Run shoot.js once to fill it.
const CACHE = path.join(__dirname, ".fontcache");
const cssName = (u) => crypto.createHash("md5").update(u).digest("hex").slice(0, 10) + ".woff2";

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const cssPath = path.join(CACHE, "gf.css");
  const haveFonts = fs.existsSync(cssPath);
  if (!haveFonts) {
    console.error("No font cache at tools/.fontcache — run tools/shoot.js once to fill it,");
    console.error("or the exported frames will be set in a fallback face.");
  }

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ deviceScaleFactor: 2 });

  if (haveFonts) {
    const css = fs.readFileSync(cssPath, "utf8");
    await ctx.route(/fonts\.googleapis\.com/, (r) =>
      r.fulfill({ contentType: "text/css", body: css }));
    await ctx.route(/fonts\.gstatic\.com/, (r) => {
      const f = path.join(CACHE, cssName(r.request().url()));
      return fs.existsSync(f)
        ? r.fulfill({ contentType: "font/woff2", body: fs.readFileSync(f) })
        : r.abort();
    });
  }

  const page = await ctx.newPage();
  await page.goto("file://" + path.resolve(src), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(400);

  const meta = await page.$$eval(selector, (els) =>
    els.map((el, i) => {
      const h = el.querySelector("h1,h2");
      const slug = (h ? h.textContent : "frame")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 34);
      return { i, slug, over: el.scrollHeight - el.clientHeight };
    })
  );

  const bad = meta.filter((m) => m.over > 0);
  if (bad.length) {
    for (const m of bad) {
      console.error(`frame ${String(m.i + 1).padStart(2, "0")} overflows its box by ${m.over}px — ${m.slug}`);
    }
    console.error("\nNothing exported. Overflow is invisible in a PNG: the text is");
    console.error("simply missing and the file looks intentional.");
    await browser.close();
    process.exit(1);
  }

  const els = await page.$$(selector);
  for (let i = 0; i < els.length; i++) {
    const name = `${String(i + 1).padStart(2, "0")}-${meta[i].slug}.png`;
    await els[i].screenshot({ path: path.join(outDir, name) });
    console.log(`  ${name}`);
  }

  await browser.close();
  console.log(`\n${els.length} frame(s) → ${outDir}`);
})();
