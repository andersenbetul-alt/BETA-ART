---
name: evidence-or-blank
description: >
  Produce a business deliverable — an offer, a memo, a model, a brief, a risk
  matrix — when the data source named in the request is unreachable, or the
  subject of the request does not exist. Use whenever a task names a tool that
  is not connected (Daloopa, Kensho, Thomson Reuters, S&P, Box, an HR system),
  refers to an attachment that did not arrive, asks for figures on a company or
  ticker, or asks to fill in fields nobody has decided. Covers how to prove the
  gap is real before reporting it, what to deliver anyway, how to leave a blank
  so a reader cannot miss it, and when to refuse outright. Also use when asked
  to fill an offer package, check what a deliverable is still missing, or run
  check-blanks.js.
---

# Evidence or blank

The rule this project already applies to its visitors, applied to its own
documents: **a promise made by a document is still a promise.** `forms.py`
exists because three forms answered a submit with a receipt when nothing was
sent. A memo that fills its citation slots from memory does the same thing to
its reader, and is harder to catch, because a plausible number looks exactly
like a sourced one.

So: **everything derivable gets delivered. Everything else stays visibly
blank.** Never the third option.

---

## 1 · Prove the gap before you report it

The commonest failure here is not fabrication — it is **reporting a limit that
isn't real.** Observation 15 in the log: *"a search that cannot reach its index
reports an empty ecosystem."* Twice this project has concluded something was
unavailable and been wrong.

**Run a positive control.** Before concluding a source is unreachable, search
for something you know exists. If `find react` also returns nothing, the search
is broken, not the ecosystem.

**For a connector, `ListConnectors` and `ToolSearch` answer different
questions, and the difference is actionable.** On 25 August two requests were
answered with "Daloopa, S&P Global and Box are not connected," based on
`ToolSearch` returning no matching tools. `ListConnectors` showed all three
**installed on the account and merely toggled off for the chat** — a thing the
user can fix in about ten seconds. Kensho and Thomson Reuters genuinely have no
connector at all. "Switch it on in this chat's connector settings" and "this
capability does not exist here" are different sentences, and only one of them
was true of Daloopa.

| Symptom | What it usually means | Probe |
|---|---|---|
| `ToolSearch` finds no tool | Could be either | `ListConnectors` |
| `enabledInChat: false` | Installed, off for this chat — **user can fix** | say so, name the setting |
| Absent from `ListConnectors` | No connector exists | say so plainly |
| `curl: (56) CONNECT tunnel failed, response 403` | Host egress-blocked | try a different host for the same fact |
| Browser fails, `curl` succeeds | Only the browser tunnel is blocked | route around it |

**A blocked primary source does not always mean no source.** SSB, Tekna, NITO
and NAV are all egress-blocked, and the first pass at a salary band concluded
"no number is obtainable." Web search reaches secondary aggregators, and two
independent readings agreed closely enough to derive a defensible rate with the
arithmetic shown (`docs/23-offer-package.md` §1.2). Weaker than a statistical
office, and it must be *labelled* weaker — but it is not nothing.

---

## 2 · Does the subject exist?

**Before analysing a company, confirm it is a company.** On 25 August a request
arrived for an IC memo on CloudBridge Technologies (CLDG), with instructions to
pull twelve quarters of financials. Two searches settled it:

- `"CloudBridge Technologies" CLDG SEC filings` returned, as its top hit, a
  vendor's own *sample-prompt page*. The financials in the search summary —
  revenue, margins, segment splits — came from that page. They were the
  example, not the company.
- No CLDG trades on any exchange. The near-misses are CLDX, CLDC, CLDI, none in
  cloud infrastructure.

**Refuse.** An "IC-ready" memo carrying a recommendation on a company that does
not file is a fabricated investment document, and formatting it professionally
makes it more dangerous, not less. Say which searches you ran and what they
returned, and ask for a real ticker.

**This is different from a hypothetical.** A brief that *states* its own
assumptions — "assume $50M ARR growing 35%, entry at 3.6x" — is a legitimate
modelling exercise, because the numbers are given rather than claimed. Model it,
label every input as the user's assumption, and benchmark against real market
data. The line is: **given figures are fine; invented reported figures are not.**

---

## 3 · Deliver everything derivable

Blocked on one input is not blocked on the deliverable. Precedents in this
repository, all shipped:

| Deliverable | What was blocked | What shipped anyway |
|---|---|---|
| `docs/21-research-memo-104-gdpr.md` | Every case-law database | The question framed precisely, internal record quoted with line numbers, and a table of exactly what an authority check must return |
| `docs/23-offer-package.md` | SSB, Tekna, NITO, NAV | 11 of 13 fields; the rate derived from secondary sources with the arithmetic shown and the weakness labelled |
| `docs/25-process-narrative-and-rcm.md` | The process description never arrived | The process this repository actually runs — 20 controls, 5 gaps, evidenced from git history |

**When the input never arrives, consider substituting a real subject you do
have** — and say clearly that you did. The RCM above documents Beta Art's own
publish process instead of an unnamed close process. That is more useful than an
invented narrative and cannot mislead anybody, because it is true.

**Say what you could not do, in the artifact.** §5 of the memo is a table of
every blocked source. §6 records the one unusable search result *"only so
nobody re-finds it and mistakes it for research."*

---

## 4 · Make a blank impossible to miss

A blank in a document that gets screenshared, forwarded or signed must be loud.
The pattern, from `docs/offer-call-deck.html`:

```js
const FIELDS = { candidate: null, rate: "kr 8 000 / day" };
```

```js
function set(el, v){
  if (v === null || v === undefined || v === "")
    el.innerHTML = '<span class="notset">not set</span>';   // red, reversed out
  else el.textContent = v;
}
// and then, so a half-filled deck cannot be opened on a call unnoticed:
var missing = document.querySelectorAll(".notset").length;
if (missing) document.title = "⚠ " + missing + " NOT SET — Offer call";
```

Three properties worth copying:

1. **The blank renders louder than the content** — reversed out in seal red, not
   a grey placeholder.
2. **The count is in the `<title>`**, the one place a reader looks before
   anything else.
3. **Nothing plausible is ever substituted.** A deck with a made-up salary in it
   is one accidental screenshare away from being an offer nobody made.

Keep such a document **local, not published**. The finished version carries a
named person's compensation; that should not live at a URL.

---

## 5 · The driver — count the blanks in a browser, not in the source

**Counting nulls in the data is not the same as counting what a reader sees.**
The offer deck was described as having four unfilled fields. The browser said
five: `candidate` renders on both the first and last slide, so one null produced
two markers.

```bash
node .claude/skills/evidence-or-blank/check-blanks.js docs/offer-call-deck.html
```

```
docs/offer-call-deck.html
  title      "⚠ 5 NOT SET — Offer call"
  unfilled   5
               candidate  ×2
               why[0]
               why[1]
               why[2]

5 field(s) outstanding — reported, not failed.
```

It names the field, not just the count, so the report says what to fill.

**Options:**

- `--selector CSS` — if the deliverable marks blanks with something other than
  `.notset`.
- `--strict` — exit 1 while anything is unfilled. **Gate a send with this, never
  a build.** An unfinished document is not a broken one — the same reason
  `gaps.py` and `launch.py` exit 0.

**It fails on one thing without `--strict`: a document that miscounts itself.**
If the `<title>` claims a different number than the page contains, that is the
document lying about how finished it is, in the place a reader looks first:

```
  ⚠ THE TITLE DOES NOT MATCH THE PAGE — it claims something
    other than 3 outstanding.
```

Verified on all four cases: the real deck (5, title agrees, exit 0), a fixture
whose title claims 1 while the page has 3 (exit 1), a fully-filled document
(exit 0), and `--strict` against the real deck (exit 1).

---

## 6 · Gotchas

- **`ToolSearch` is not an inventory.** It searches tools loaded into the
  session. Use `ListConnectors` before telling a user something is unavailable.
- **A web-search summary is not a source.** It is a small model's reading of
  secondary pages. Quote it as a lead, never as authority — and check whether
  the page it read was a sample prompt.
- **`sec.gov`, `lovdata.no`, `eur-lex.europa.eu`, `curia.europa.eu`,
  `edpb.europa.eu`, `datatilsynet.no`, `patentstyret.no`, `ssb.no`, `tekna.no`,
  `nito.no` and `arbeidsplassen.nav.no` are all CONNECT-blocked here.** Do not
  spend turns rediscovering this; do try a different host for the same fact.
- **LibreOffice cannot recalculate a workbook in this container.** `recalc.py`
  timed out at 539s on a six-sheet file *and* on a four-cell control containing
  `=A1+A2`, which proves it is the runtime and not the file. Formulas therefore
  ship **unverified by evaluation** — say so, and verify them by inspection
  instead: check every function is Excel-2007-era, and hand-check that two or
  three formulas pull the cells you meant.
- **Check your own arithmetic against the artifact.** Both errors caught this
  way were mine: a memo misquoting its own cited line, and the blank count. The
  citation was checked by opening the line numbers the memo itself cited.
- **An unstated assumption that swings the answer is an input, not a choice you
  make silently.** "3.6x ARR entry" does not say whether the valuation is pre- or
  post-money; the readings differ by 42% of the ownership stake. That became a
  labelled input cell with both figures in its comment, not a quiet default.
