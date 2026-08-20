/* Naviar Care — static checks over the source tree.
   Catches the classes of mistake that are invisible in review but break at
   runtime or in another locale. Run with: node tests/lint.test.js           */
"use strict";

const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

let passed = 0;
const failures = [];
function check(name, fn) {
  try { fn(); passed++; } catch (e) { failures.push(name + " — " + e.message); }
}
function assert(c, m) { if (!c) throw new Error(m || "assertion failed"); }

const jsFiles = fs.readdirSync(path.join(root, "assets/js"))
  .filter((f) => f.endsWith(".js"))
  .map((f) => ({ name: f, body: fs.readFileSync(path.join(root, "assets/js", f), "utf8") }));

const i18nFiles = fs.existsSync(path.join(root, "assets/js/i18n"))
  ? fs.readdirSync(path.join(root, "assets/js/i18n")).filter((f) => f.endsWith(".js"))
  : [];

const htmlFiles = fs.readdirSync(root).filter((f) => f.endsWith(".html"))
  .map((f) => ({ name: f, body: fs.readFileSync(path.join(root, f), "utf8") }));

/* ------------------------------------------------------------------ js -- */

check("no raw combining marks in regex character classes", () => {
  // Easy to introduce via copy-paste and silently wrong: the literal marks
  // are invisible, so the class matches nothing useful.
  const bad = [];
  for (const f of jsFiles) {
    if (/\[[̀-ͯ]/.test(f.body)) bad.push(f.name);
  }
  assert(bad.length === 0, "use \\u0300-\\u036f instead, in: " + bad.join(", "));
});

check("no leftover debugging statements", () => {
  const bad = [];
  for (const f of jsFiles) {
    if (/console\.(log|debug)\s*\(/.test(f.body)) bad.push(f.name);
    if (/\bdebugger\b/.test(f.body)) bad.push(f.name + " (debugger)");
  }
  assert(bad.length === 0, bad.join(", "));
});

check("no unresolved placeholders left in default strings", () => {
  // A {name} that no caller substitutes reaches the patient verbatim.
  const bad = [];
  for (const f of jsFiles) {
    const calls = f.body.match(/UI\.t\(\s*"[^"]+"\s*,\s*"[^"]*\{\w+\}[^"]*"/g) || [];
    for (const c of calls) bad.push(f.name + ": " + c.slice(0, 60));
  }
  assert(bad.length === 0, "UI.t (not format) with a placeholder: " + bad.join(" | "));
});

check("patient-supplied values never reach innerHTML unescaped", () => {
  const bad = [];
  for (const f of jsFiles) {
    const lines = f.body.split("\n");
    lines.forEach((line, i) => {
      if (!/innerHTML\s*=/.test(line)) return;
      if (/innerHTML\s*=\s*""/.test(line)) return;                 // clearing
      if (/UI\.escapeHTML|escapeHTML\(/.test(line)) return;         // escaped
      if (/innerHTML\s*=\s*['"`]/.test(line)) return;               // literal
      if (/innerHTML\s*=\s*\w+(\.\w+)*\s*;?\s*$/.test(line) === false) return;
      bad.push(f.name + ":" + (i + 1));
    });
  }
  assert(bad.length === 0, "unescaped assignment at " + bad.join(", "));
});

/* ---------------------------------------------------------------- html -- */

check("every page loads the same core scripts", () => {
  const CORE = [
    "assets/js/i18n.js", "assets/js/config.js", "assets/js/data-specialties.js",
    "assets/js/data-symptoms.js", "assets/js/data-languages.js",
    "assets/js/data-countries.js", "assets/js/data-retention.js",
    "assets/js/data-doctors.js", "assets/js/triage-engine.js",
    "assets/js/booking-engine.js", "assets/js/main.js"
  ];
  const missing = [];
  for (const f of htmlFiles) {
    for (const src of CORE) {
      if (!f.body.includes('src="' + src + '"')) missing.push(f.name + " -> " + src);
    }
  }
  assert(missing.length === 0, missing.join(", "));
});

check("every page sets the theme before first paint", () => {
  const bad = htmlFiles.filter((f) => !f.body.includes("naviar.theme")).map((f) => f.name);
  assert(bad.length === 0, "flash of wrong theme in: " + bad.join(", "));
});

/* Compare the shared chrome only — breadcrumbs legitimately mention the
   page's own section, so whole-page counts differ by design. */
function block(body, open, close) {
  const start = body.indexOf(open);
  const end = body.indexOf(close, start);
  return start === -1 || end === -1 ? "" : body.slice(start, end);
}

check("every page carries the same navigation", () => {
  const navOf = (body) =>
    (block(body, '<nav class="nav"', "</nav>").match(/data-i18n="nav\.[a-z]+"/g) || []).join(",");
  const reference = navOf(htmlFiles[0].body);
  assert(reference.length > 0, "could not find the nav block");
  const drifted = htmlFiles.filter((f) => navOf(f.body) !== reference).map((f) => f.name);
  assert(drifted.length === 0, "navigation drifted in: " + drifted.join(", ") + " (vs " + htmlFiles[0].name + ")");
});

check("a page in the main nav marks itself as current, and only itself", () => {
  // Sub-pages (legal, feedback, consultation) are reachable but not in the
  // nav, so they correctly mark nothing.
  const inNav = new Set(
    (block(htmlFiles[0].body, '<nav class="nav"', "</nav>").match(/href="([^"]+\.html)"/g) || [])
      .map((h) => h.match(/href="([^"]+)"/)[1])
  );
  const bad = [];
  for (const f of htmlFiles) {
    const nav = block(f.body, '<nav class="nav"', "</nav>");
    const current = (nav.match(/aria-current="page"/g) || []).length;
    const expected = inNav.has(f.name) ? 1 : 0;
    if (current !== expected) bad.push(f.name + " has " + current + ", expected " + expected);
  }
  assert(bad.length === 0, bad.join(", "));
});

check("every page carries the same footer links", () => {
  const footerOf = (body) =>
    (block(body, '<footer class="site-footer"', "</footer>").match(/data-i18n="(?:footer|nav)\.[a-z-]+"/g) || []).join(",");
  const reference = footerOf(htmlFiles[0].body);
  assert(reference.length > 0, "could not find the footer block");
  const drifted = htmlFiles.filter((f) => footerOf(f.body) !== reference).map((f) => f.name);
  assert(drifted.length === 0, "footer drifted in: " + drifted.join(", "));
});

check("every internal link points at a page that exists", () => {
  const pages = new Set(htmlFiles.map((f) => f.name));
  const bad = [];
  for (const f of htmlFiles) {
    const hrefs = f.body.match(/href="([^"#?]+\.html)[^"]*"/g) || [];
    for (const h of hrefs) {
      const target = h.match(/href="([^"#?]+\.html)/)[1];
      if (!pages.has(target)) bad.push(f.name + " -> " + target);
    }
  }
  assert(bad.length === 0, bad.join(", "));
});

check("every page declares a title and a description", () => {
  const bad = [];
  for (const f of htmlFiles) {
    if (!/<title[^>]*>[^<]{5,}<\/title>/.test(f.body)) bad.push(f.name + " (title)");
    if (!/name="description"[^>]*content="[^"]{20,}"/.test(f.body)) bad.push(f.name + " (description)");
  }
  assert(bad.length === 0, bad.join(", "));
});

check("no page hardcodes a language into the html tag other than en", () => {
  const bad = htmlFiles.filter((f) => !/<html lang="en"/.test(f.body)).map((f) => f.name);
  assert(bad.length === 0, bad.join(", "));
});

/* ---------------------------------------------------------------- i18n -- */

check("all dictionaries hold exactly the same keys as English", () => {
  if (!i18nFiles.includes("en.js")) throw new Error("en.js missing");
  const load = (file) => {
    const body = fs.readFileSync(path.join(root, "assets/js/i18n", file), "utf8");
    const json = body.slice(body.indexOf("{"), body.lastIndexOf("}") + 1);
    return JSON.parse(json);
  };
  const en = load("en.js");
  const problems = [];
  for (const file of i18nFiles) {
    if (file === "en.js") continue;
    const table = load(file);
    const missing = Object.keys(en).filter((k) => !(k in table));
    const extra = Object.keys(table).filter((k) => !(k in en));
    if (missing.length) problems.push(file + " missing " + missing.length + " (" + missing.slice(0, 3).join(", ") + ")");
    if (extra.length) problems.push(file + " has " + extra.length + " unknown (" + extra.slice(0, 3).join(", ") + ")");
  }
  assert(problems.length === 0, problems.join(" | "));
});

check("no dictionary entry is empty or left as its own key", () => {
  const problems = [];
  for (const file of i18nFiles) {
    const body = fs.readFileSync(path.join(root, "assets/js/i18n", file), "utf8");
    const table = JSON.parse(body.slice(body.indexOf("{"), body.lastIndexOf("}") + 1));
    for (const [k, v] of Object.entries(table)) {
      if (!v || !String(v).trim()) problems.push(file + ":" + k + " empty");
      else if (v === k) problems.push(file + ":" + k + " untranslated");
    }
  }
  assert(problems.length === 0, problems.slice(0, 6).join(", "));
});

check("placeholders survive translation", () => {
  // A dropped {n} silently renders a sentence with a hole in it.
  const load = (file) => {
    const body = fs.readFileSync(path.join(root, "assets/js/i18n", file), "utf8");
    return JSON.parse(body.slice(body.indexOf("{"), body.lastIndexOf("}") + 1));
  };
  const en = load("en.js");
  const problems = [];
  for (const file of i18nFiles) {
    if (file === "en.js") continue;
    const table = load(file);
    for (const [k, v] of Object.entries(en)) {
      const want = (v.match(/\{\w+\}/g) || []).sort().join(",");
      const got = ((table[k] || "").match(/\{\w+\}/g) || []).sort().join(",");
      if (want !== got) problems.push(file + ":" + k + " expected [" + want + "] got [" + got + "]");
    }
  }
  assert(problems.length === 0, problems.slice(0, 6).join(" | "));
});

/* --------------------------------------------------------------- report -- */

console.log("\n  Naviar Care — source checks");
console.log("  " + "-".repeat(46));
if (failures.length) {
  for (const f of failures) console.log("  ✗ " + f);
  console.log("\n  " + passed + " passed, " + failures.length + " failed\n");
  process.exit(1);
}
console.log("  ✓ " + passed + " checks passed\n");
