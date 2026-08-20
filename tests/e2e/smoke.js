/* Naviar Care — browser smoke test.
   Drives the real pages in Chromium: language switching (including RTL),
   the full symptom-check flow, and the booking flow through to payment.
   Run with: node tests/e2e/smoke.js                                        */
"use strict";

const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const PORT = 8731;

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".json": "application/json"
};

function serve() {
  return http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    const file = path.join(ROOT, url === "/" ? "index.html" : url);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); res.end("not found"); return;
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
}

let passed = 0;
const failures = [];
async function check(name, fn) {
  try { await fn(); passed++; console.log("  ✓ " + name); }
  catch (e) { failures.push(name + " — " + e.message); console.log("  ✗ " + name + " — " + e.message); }
}
function assert(c, m) { if (!c) throw new Error(m || "assertion failed"); }
function eq(a, b, m) {
  if (a !== b) throw new Error((m || "value") + ": expected " + JSON.stringify(b) + ", got " + JSON.stringify(a));
}

(async () => {
  const server = serve();
  await new Promise((r) => server.listen(PORT, r));
  const base = "http://localhost:" + PORT;

  /* The pinned playwright build and the preinstalled browser can disagree on
     the revision, so find whichever chromium is actually on disk. */
  const candidates = fs.readdirSync("/opt/pw-browsers")
    .map((d) => path.join("/opt/pw-browsers", d, "chrome-linux", "chrome"))
    .filter((p) => fs.existsSync(p));
  if (!candidates.length) throw new Error("no chromium found under /opt/pw-browsers");
  const browser = await chromium.launch({ executablePath: candidates[0] });
  const context = await browser.newContext({ locale: "en-GB" });
  const page = await context.newPage();

  /* Block anything off-host. The pages reference Google Fonts, which may not
     resolve inside a sandbox - waiting on it makes every navigation hang and
     tells us nothing about our own code. */
  await context.route("**/*", (route) => {
    const url = route.request().url();
    if (url.startsWith(base)) return route.continue();
    return route.abort();
  });

  const consoleErrors = [];
  const isOurNoise = (text) =>
    /ERR_FAILED|ERR_BLOCKED|net::/.test(text) || /fonts\.(googleapis|gstatic)\.com/.test(text);
  page.on("pageerror", (e) => consoleErrors.push(String(e)));
  page.on("console", (m) => {
    // The route-block above aborts off-host requests, which Chromium reports as
    // a console error. That is the test's doing, not the page's.
    if (m.type() === "error" && !isOurNoise(m.text())) consoleErrors.push(m.text());
  });

  const PAGES = ["index.html", "triage.html", "booking.html", "languages.html", "join.html", "about.html", "legal.html", "feedback.html", "consultation.html"];

  console.log("\n  Naviar Care — browser smoke test");
  console.log("  " + "-".repeat(46));

  /* ---------------------------------------------------------- every page */
  for (const name of PAGES) {
    await check("loads " + name + " without script errors", async () => {
      consoleErrors.length = 0;
      const res = await page.goto(base + "/" + name, { waitUntil: "domcontentloaded" });
      eq(res.status(), 200, "status");
      await page.waitForTimeout(200);
      assert(consoleErrors.length === 0, consoleErrors.join(" | "));
      const h1 = await page.textContent("h1");
      assert(h1 && h1.trim().length > 3, "no heading rendered");
    });
  }

  /* ------------------------------------------------------------- i18n */
  await check("switching to Turkish translates the page", async () => {
    await page.goto(base + "/index.html", { waitUntil: "domcontentloaded" });
    const before = await page.textContent("h1");
    await page.selectOption("#lang-select", "tr");
    await page.waitForTimeout(400);
    const after = await page.textContent("h1");
    assert(after !== before, "heading did not change");
    assert(/dakika/i.test(after), "unexpected Turkish heading: " + after);
    eq(await page.getAttribute("html", "lang"), "tr");
  });

  await check("Arabic switches the document to right-to-left", async () => {
    await page.selectOption("#lang-select", "ar");
    await page.waitForTimeout(400);
    eq(await page.getAttribute("html", "dir"), "rtl", "dir");
    eq(await page.getAttribute("html", "lang"), "ar", "lang");
    const h1 = await page.textContent("h1");
    assert(/[؀-ۿ]/.test(h1), "heading is not Arabic script: " + h1);
  });

  await check("the chosen language survives navigation", async () => {
    await page.goto(base + "/booking.html", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    eq(await page.getAttribute("html", "lang"), "ar", "language was not remembered");
    eq(await page.getAttribute("html", "dir"), "rtl");
  });

  await check("switching back to English restores left-to-right", async () => {
    await page.selectOption("#lang-select", "en");
    await page.waitForTimeout(400);
    eq(await page.getAttribute("html", "dir"), "ltr");
  });

  /* ------------------------------------------------------------ triage */
  await check("symptom search finds a complaint and adds it", async () => {
    await page.goto(base + "/triage.html", { waitUntil: "domcontentloaded" });
    await page.fill("#symptom-input", "chest");
    await page.waitForTimeout(300);
    const results = await page.locator("#symptom-results button").count();
    assert(results > 0, "no search results");
    await page.locator("#symptom-results button").first().click();
    await page.waitForTimeout(200);
    const chosen = await page.locator("[data-selected-list] .selected-item").count();
    eq(chosen, 1, "symptom not added");
  });

  await check("searching in Turkish finds the same complaint", async () => {
    await page.goto(base + "/triage.html", { waitUntil: "domcontentloaded" });
    await page.selectOption("#lang-select", "tr");
    await page.waitForTimeout(500);
    await page.fill("#symptom-input", "göğüs");
    await page.waitForTimeout(300);
    const results = await page.locator("#symptom-results button").count();
    assert(results > 0, "Turkish search returned nothing");
    await page.selectOption("#lang-select", "en");
    await page.waitForTimeout(300);
  });

  await check("the wizard refuses to advance with no symptoms", async () => {
    await page.goto(base + "/triage.html", { waitUntil: "domcontentloaded" });
    await page.click("[data-triage-next]");
    await page.waitForTimeout(200);
    const visible = await page.locator('.triage-step[data-step="1"]').isVisible();
    assert(visible, "advanced without a symptom");
    assert(await page.locator("[data-error-symptoms]").isVisible(), "no error shown");
  });

  await check("a full symptom check reaches a result with a ranked specialty", async () => {
    await page.goto(base + "/triage.html?symptom=chest-pain", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);
    for (let step = 1; step <= 4; step++) {
      await page.click("[data-triage-next]");
      await page.waitForTimeout(250);
    }
    assert(await page.locator('.triage-step[data-step="5"]').isVisible(), "did not reach the result");
    const result = await page.textContent("[data-result-root]");
    assert(/Cardiology/i.test(result), "cardiology not in the result: " + result.slice(0, 200));
    assert(/%/.test(result), "no fit percentage shown");
  });

  await check("red flags escalate the result to emergency", async () => {
    await page.goto(base + "/triage.html?symptom=headache", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);
    await page.click("[data-triage-next]"); await page.waitForTimeout(200);
    await page.click("[data-triage-next]"); await page.waitForTimeout(200);
    await page.locator("[data-redflags] input[type=checkbox]").first().check();
    await page.click("[data-triage-next]"); await page.waitForTimeout(200);
    await page.click("[data-triage-next]"); await page.waitForTimeout(300);
    assert(await page.locator(".result-header--emergency").count() > 0, "no emergency banner");
  });

  await check("the pre-visit summary carries the preparation answers", async () => {
    await page.goto(base + "/triage.html?symptom=back-pain", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);
    await page.click("[data-triage-next]"); await page.waitForTimeout(200);
    await page.click("[data-triage-next]"); await page.waitForTimeout(200);
    await page.click("[data-triage-next]"); await page.waitForTimeout(200);
    await page.fill("#prep-medications", "Ibuprofen 400mg");
    await page.fill("#prep-questions", "Do I need a scan?");
    await page.click("[data-triage-next]"); await page.waitForTimeout(300);
    const summary = await page.textContent("[data-result-root]");
    assert(/Ibuprofen 400mg/.test(summary), "medication missing from the summary");
    assert(/Do I need a scan\?/.test(summary), "question missing from the summary");
  });

  /* ----------------------------------------------------------- booking */
  await check("the directory groups doctors by area of medicine", async () => {
    await page.goto(base + "/booking.html", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    const headings = await page.locator("[data-doctor-list] h2").count();
    assert(headings > 2, "expected several category headings, got " + headings);
    const cards = await page.locator("[data-doctor-list] article").count();
    assert(cards > 10, "expected the full roster, got " + cards);
  });

  await check("filtering by specialty narrows the list", async () => {
    await page.selectOption("[data-filter-specialty]", "cardiology");
    await page.waitForTimeout(300);
    const cards = await page.locator("[data-doctor-list] article").count();
    assert(cards > 0 && cards < 10, "unexpected result count: " + cards);
    const text = await page.textContent("[data-doctor-list]");
    assert(/Cardiology/i.test(text), "cardiology not shown");
  });

  await check("setting the patient country labels the session type", async () => {
    await page.selectOption("[data-filter-specialty]", "");
    await page.selectOption("[data-patient-country]", "TR");
    await page.waitForTimeout(400);
    const text = await page.textContent("[data-doctor-list]");
    assert(/Full consultation/i.test(text), "no full-consultation label");
    assert(/Second opinion/i.test(text), "no second-opinion label");
  });

  await check("every doctor stays reachable whatever the patient country", async () => {
    const counts = [];
    for (const country of ["TR", "US", "NG", "JP"]) {
      await page.selectOption("[data-patient-country]", country);
      await page.waitForTimeout(300);
      counts.push(await page.locator("[data-doctor-list] article").count());
    }
    assert(new Set(counts).size === 1, "roster size changed by country: " + counts.join(","));
  });

  await check("a doctor profile opens with licensing and expertise", async () => {
    await page.locator("[data-doctor-list] article button:has-text('View profile')").first().click();
    await page.waitForTimeout(400);
    const panel = await page.textContent("[data-booking-root]");
    assert(/Licensed in/i.test(panel), "licensed countries missing");
    assert(/Areas of expertise/i.test(panel), "expertise missing");
    assert(/Consults in/i.test(panel), "languages missing");
  });

  await check("booking requires explicit consent before payment", async () => {
    await page.locator("[data-booking-root] button:has-text('Book with this doctor')").click();
    await page.waitForTimeout(300);
    await page.fill("#bk-name", "Test Patient");
    await page.fill("#bk-contact", "test@example.com");
    await page.fill("#bk-reason", "Chest discomfort for two days");
    await page.locator("[data-booking-root] button[type=submit]").click();
    await page.waitForTimeout(300);
    const stillOnForm = await page.locator("#bk-consent").count();
    eq(stillOnForm, 1, "advanced to payment without consent");
  });

  await check("payment itemises the doctor fee and platform fee separately", async () => {
    await page.locator("#bk-consent").check();
    await page.locator("[data-booking-root] button[type=submit]").click();
    await page.waitForTimeout(400);
    const panel = await page.textContent("[data-booking-root]");
    assert(/Doctor's fee/i.test(panel), "doctor fee line missing");
    assert(/platform fee/i.test(panel), "platform fee line missing");
    assert(/Total/i.test(panel), "total missing");
    assert(/No payment will be taken/i.test(panel), "demo notice missing");
  });

  await check("confirming produces a booking reference and a room link", async () => {
    await page.locator("[data-booking-root] button[type=submit]").click();
    await page.waitForTimeout(400);
    const panel = await page.textContent("[data-booking-root]");
    assert(/NV-/.test(panel), "no booking reference");
    const link = await page.locator("[data-booking-root] a:has-text('consultation room')").count();
    assert(link > 0, "no link to the consultation room");
  });

  /* -------------------------------------------------------------- other */
  await check("the language table filters by search", async () => {
    await page.goto(base + "/languages.html", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    const all = await page.locator("[data-language-table] tr").count();
    await page.fill("[data-language-search]", "swahili");
    await page.waitForTimeout(300);
    const filtered = await page.locator("[data-language-table] tr").count();
    assert(filtered > 0 && filtered < all, "filter did nothing: " + filtered + "/" + all);
  });

  await check("the retention lookup shows a statutory period", async () => {
    await page.goto(base + "/legal.html", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    await page.selectOption("[data-retention-country]", "TR");
    await page.waitForTimeout(300);
    const text = await page.textContent("[data-retention-result]");
    assert(/20 years/i.test(text), "Turkish retention period wrong: " + text);
    await page.selectOption("[data-retention-age]", "child");
    await page.waitForTimeout(300);
    assert(/child/i.test(await page.textContent("[data-retention-result]")), "no minor rule shown");
  });

  await check("clinician registration rejects an incomplete application", async () => {
    await page.goto(base + "/join.html", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);
    await page.locator("#join-form button[type=submit]").click();
    await page.waitForTimeout(300);
    assert(await page.locator("#join-form").count() === 1, "form vanished on invalid submit");
    assert(await page.locator(".field.has-error").count() > 0, "no fields marked invalid");
  });

  await check("the feedback form switches between patient and doctor", async () => {
    await page.goto(base + "/feedback.html", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);
    const patient = await page.textContent("[data-feedback-form]");
    assert(/understand what you were describing/i.test(patient), "patient question missing");
    // The input is visually hidden behind a styled label, so click the label.
    await page.locator('[data-feedback-role] label:has(input[value="doctor"])').click();
    await page.waitForTimeout(300);
    const doctor = await page.textContent("[data-feedback-form]");
    assert(/right specialty/i.test(doctor), "doctor question missing");
  });

  await check("the consultation room does not connect until asked", async () => {
    await page.goto(base + "/consultation.html?doctor=d01&ref=NV-TEST", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    const text = await page.textContent("[data-consult-room]");
    assert(/end-to-end encrypted|Demonstration room/i.test(text), "no security statement");
    const frames = await page.locator("[data-consult-room] iframe").count();
    eq(frames, 0, "a video frame was created before joining");
  });

  await check("dark mode applies and is remembered", async () => {
    await page.goto(base + "/index.html", { waitUntil: "domcontentloaded" });
    await page.locator("[data-theme-toggle]").click();
    await page.waitForTimeout(200);
    eq(await page.getAttribute("html", "data-theme"), "dark");
    await page.goto(base + "/about.html", { waitUntil: "domcontentloaded" });
    eq(await page.getAttribute("html", "data-theme"), "dark", "theme not remembered");
    await page.locator("[data-theme-toggle]").click();
  });

  await check("the mobile layout does not scroll sideways", async () => {
    await page.setViewportSize({ width: 320, height: 800 });
    for (const name of ["index.html", "triage.html", "booking.html", "join.html", "legal.html", "feedback.html"]) {
      await page.goto(base + "/" + name, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(300);
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert(overflow <= 1, name + " overflows by " + overflow + "px");
    }
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  await browser.close();
  server.close();

  console.log("  " + "-".repeat(46));
  if (failures.length) {
    console.log("  " + passed + " passed, " + failures.length + " failed\n");
    process.exit(1);
  }
  console.log("  ✓ " + passed + " browser checks passed\n");
})().catch((e) => { console.error(e); process.exit(1); });
