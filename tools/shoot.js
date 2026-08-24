#!/usr/bin/env node
/**
 * Screenshot and measure this site in a real browser, with the real typefaces.
 *
 * Written after counting: in one session, thirty-nine throwaway Playwright
 * scripts, and the same font-interception boilerplate typed out ten separate
 * times. Every one of them existed because of the same environment fact —
 * Chromium here cannot CONNECT to fonts.googleapis.com, so a page rendered
 * straight from the browser measures Georgia and Arial instead of Fraunces and
 * Inter, and every measurement taken that way is quietly wrong.
 *
 * `render-check.js` handles that by blocking fonts and saying so. That is the
 * right call for a gate, which needs to be fast and deterministic. It is the
 * wrong call for anything you intend to look at or quote a number from.
 *
 * So this fetches the fonts once — over plain https, which is not blocked, only
 * the browser's tunnel is — caches them, and serves both font hosts to the page
 * by route interception. After that, the browser is looking at the same page a
 * visitor would.
 *
 *   node tools/shoot.js --out shots 1440 /  /beta-art/  /beta-art-business/
 *   node tools/shoot.js --out shots --full --dsf 1 1440 /legal.html
 *   node tools/shoot.js --measure "getComputedStyle(document.querySelector('h1')).fontFamily" 390 /
 *
 * Widths come first, comma-separated for more than one. Paths follow. With
 * --measure it prints the value instead of writing a file, which is what you
 * want when the question is "did that CSS change actually take effect".
 *
 * --do runs JavaScript in the page before the capture, so a state the visitor
 * has to reach by clicking can be measured and photographed like any other:
 *
 *   node tools/shoot.js --do "document.getElementById('theme-btn').click()" \
 *     --out shots 1440 /beta-art-blog/
 *
 * Every interactive surface here is a language switch, a filter or a picker —
 * they all leave their result in the DOM, so --do with --measure is enough to
 * check one end to end without a second harness.
 */

"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const https = require("https");
const crypto = require("crypto");
const { spawn } = require("child_process");

const ROOT = path.dirname(__dirname);
const CACHE = path.join(ROOT, "tools", ".fontcache");
const PW = "/opt/node22/lib/node_modules/playwright";

// the stylesheet every page in this project links
const GF = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500"
  + "&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";

const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
const name = (u) => crypto.createHash("md5").update(u).digest("hex").slice(0, 10) + ".woff2";

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "user-agent": UA } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return get(res.headers.location).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(url + " → HTTP " + res.statusCode));
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    }).on("error", reject);
  });
}

/** The CSS and every woff2 it points at, fetched once and kept. */
async function fonts() {
  fs.mkdirSync(CACHE, { recursive: true });
  const cssPath = path.join(CACHE, "gf.css");
  if (!fs.existsSync(cssPath)) {
    process.stderr.write("  fetching fonts (once)…\n");
    fs.writeFileSync(cssPath, await get(GF));
  }
  const css = fs.readFileSync(cssPath, "utf8");
  for (const url of css.match(/https:\/\/fonts\.gstatic\.com\/[^)]+/g) || []) {
    const f = path.join(CACHE, name(url));
    if (!fs.existsSync(f)) fs.writeFileSync(f, await get(url));
  }
  return css;
}

function serve(port) {
  const p = spawn("python3", ["-m", "http.server", String(port)],
    { cwd: ROOT, stdio: "ignore", detached: true });
  p.unref();
  return new Promise((r) => setTimeout(() => r(p), 1200));
}

function usage(msg) {
  process.stderr.write((msg ? msg + "\n\n" : "") +
    "  node tools/shoot.js [--out DIR] [--full] [--dsf N] [--base URL]\n" +
    "                      [--do JS] [--measure JS] WIDTH[,WIDTH] PATH [PATH…]\n");
  process.exit(msg ? 2 : 0);
}

async function main() {
  const argv = process.argv.slice(2);
  if (!argv.length || argv.includes("-h") || argv.includes("--help")) usage();

  const opt = { out: null, full: false, dsf: 2, base: null, measure: null, do: null };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--full") opt.full = true;
    else if (a === "--out") opt.out = argv[++i];
    else if (a === "--dsf") opt.dsf = Number(argv[++i]);
    else if (a === "--base") opt.base = argv[++i];
    else if (a === "--measure") opt.measure = argv[++i];
    else if (a === "--do") opt.do = argv[++i];
    else if (a.startsWith("--")) usage("unknown option " + a);
    else rest.push(a);
  }
  if (rest.length < 2) usage("need a width and at least one path");

  const widths = rest[0].split(",").map(Number);
  if (widths.some((w) => !w)) usage("first argument is the width, e.g. 1440 or 390,1440");
  const paths = rest.slice(1);
  if (!opt.out && !opt.measure) opt.out = "shots";

  const css = await fonts();
  let base = opt.base, server = null;
  if (!base) {
    const port = 8000 + (process.pid % 900);
    server = await serve(port);
    base = "http://127.0.0.1:" + port;
  }
  if (opt.out) fs.mkdirSync(opt.out, { recursive: true });

  const { chromium } = require(PW);
  const browser = await chromium.launch();
  try {
    for (const width of widths) {
      for (const p of paths) {
        const page = await browser.newPage({
          viewport: { width, height: 940 },
          deviceScaleFactor: opt.dsf,
        });
        await page.route(/fonts\.googleapis\.com/, (r) =>
          r.fulfill({ contentType: "text/css", body: css }));
        await page.route(/fonts\.gstatic\.com/, (r) => {
          const f = path.join(CACHE, name(r.request().url()));
          return fs.existsSync(f)
            ? r.fulfill({ contentType: "font/woff2", body: fs.readFileSync(f) })
            : r.abort();
        });

        const url = base + (p.startsWith("/") ? p : "/" + p);
        const res = await page.goto(url, { waitUntil: "networkidle", timeout: 40000 });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(400);

        if (opt.do) {
          // eslint-disable-next-line no-eval
          await page.evaluate((expr) => eval(expr), opt.do);
          await page.waitForTimeout(400);
        }

        const label = (p.replace(/^\/|\/$/g, "") || "index").replace(/[/.]/g, "-");

        if (opt.measure) {
          const v = await page.evaluate((expr) => {
            // eslint-disable-next-line no-eval
            const out = eval(expr);
            return typeof out === "object" ? JSON.stringify(out) : String(out);
          }, opt.measure);
          console.log("  %s  %s  %s", String(width).padStart(5) + "px",
            p.padEnd(34), v);
        } else {
          const file = path.join(opt.out, `${label}-${width}.png`);
          await page.screenshot({ path: file, fullPage: opt.full });
          const m = await page.evaluate(() => ({
            h: document.documentElement.scrollHeight,
            over: document.documentElement.scrollWidth > window.innerWidth,
          }));
          console.log("  %s  %s  %s  %dpx tall%s",
            String(width).padStart(5) + "px", String(res.status()),
            file.padEnd(40), m.h, m.over ? "   ⚠ SIDEWAYS SCROLL" : "");
        }
        await page.close();
      }
    }
  } finally {
    await browser.close();
    if (server) try { process.kill(-server.pid); } catch (e) { /* already gone */ }
  }
}

main().catch((e) => {
  process.stderr.write(String(e && e.message || e) + "\n");
  process.exit(1);
});
