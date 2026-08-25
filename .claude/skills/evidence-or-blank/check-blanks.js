#!/usr/bin/env node
/**
 * check-blanks.js — count what a deliverable is still missing, in a real browser.
 *
 * A document that fills its own gaps with plausible-looking values is worse than
 * one that is visibly unfinished, because nobody can tell it is wrong by looking
 * at it. The pattern this checks: a deliverable renders every unfilled field as a
 * loud marker, and says in its own <title> how many are left.
 *
 * This exists because the count is easy to get wrong by reading the source. On
 * 25 August the offer deck was described as having four unfilled fields; the
 * browser said five, because the candidate's name renders on two slides and one
 * FIELDS entry had produced two markers. Counting nulls in the data is not the
 * same as counting what a reader sees.
 *
 *   node .claude/skills/evidence-or-blank/check-blanks.js docs/offer-call-deck.html
 *   node .claude/skills/evidence-or-blank/check-blanks.js --selector .todo  page.html
 *   node .claude/skills/evidence-or-blank/check-blanks.js --strict          page.html
 *
 * --strict exits 1 when anything is still unfilled. Use it to gate a send, never
 * to gate a build: an unfinished document is not a broken one.
 */
const path = require("path");
const PW = "/opt/node22/lib/node_modules/playwright";
const { chromium } = (function () {
  try { return require(PW); }
  catch (e) { return require("playwright"); }
}());

const argv = process.argv.slice(2);
let selector = ".notset", strict = false;
const files = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--selector") selector = argv[++i];
  else if (argv[i] === "--strict") strict = true;
  else files.push(argv[i]);
}
if (!files.length) {
  console.error("usage: check-blanks.js [--selector CSS] [--strict] FILE [FILE…]");
  process.exit(2);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let outstanding = 0, failed = false;

  for (const f of files) {
    const abs = path.resolve(f);
    await page.goto("file://" + abs, { waitUntil: "load" });
    // The page fills itself from script; give it a tick before counting.
    await page.waitForTimeout(200);

    const r = await page.evaluate((sel) => {
      const marks = Array.from(document.querySelectorAll(sel));
      // Which named field each marker belongs to, so the report says what to fill
      // rather than only how many are left.
      const named = marks.map((m) => {
        const holder = m.closest("[data-f]");
        if (holder) return holder.getAttribute("data-f");
        const list = m.closest("li");
        if (list && list.parentElement) {
          return (list.parentElement.id || "list") +
                 "[" + Array.from(list.parentElement.children).indexOf(list) + "]";
        }
        return "(unnamed)";
      });
      const counts = {};
      for (const n of named) counts[n] = (counts[n] || 0) + 1;
      return { title: document.title, n: marks.length, counts };
    }, selector);

    outstanding += r.n;
    const warns = /\d/.test(r.title) && String(r.n) !== "0"
      ? r.title.includes(String(r.n)) : true;

    console.log(`${f}`);
    console.log(`  title      ${JSON.stringify(r.title)}`);
    console.log(`  unfilled   ${r.n}`);
    for (const [k, v] of Object.entries(r.counts)) {
      console.log(`               ${k}${v > 1 ? `  ×${v}` : ""}`);
    }
    if (r.n > 0 && !warns) {
      // The count in the title disagreeing with the count on the page is the
      // failure this tool is really for: the document is lying about how
      // finished it is, in the one place a reader looks first.
      console.log(`  ⚠ THE TITLE DOES NOT MATCH THE PAGE — it claims something`);
      console.log(`    other than ${r.n} outstanding.`);
      failed = true;
    }
    console.log();
  }

  await browser.close();

  if (failed) {
    console.log("A document that miscounts its own gaps is the thing this checks for.");
    process.exit(1);
  }
  if (strict && outstanding > 0) {
    console.log(`${outstanding} field(s) still unfilled. --strict, so this is a failure.`);
    process.exit(1);
  }
  console.log(outstanding === 0
    ? "Nothing outstanding."
    : `${outstanding} field(s) outstanding — reported, not failed.`);
})();
