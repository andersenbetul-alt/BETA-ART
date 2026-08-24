# Skill Observation Log

Observations captured during task-oriented work.

**Status key:** OPEN = not yet actioned | ACTIONED (YYYY-MM-DD) = skill
updated/created | DECLINED (YYYY-MM-DD) = user decided not to pursue —
resolved statuses always carry their resolution date

---

## 2026-08-21

### Observation 1: A legibility floor and a fixed-width header are in direct tension

**Status:** OPEN
**Date:** 2026-08-21
**Session context:** Raising 114 small font sizes onto a three-step scale with a
12px floor, across four static properties.
**Skill:** New gate candidate: type-floor regression check
**Type:** internal
**Phase/Area:** Type scale changes / responsive header layout

**Issue:** The narrow breakpoints had been making the header fit 360px by
setting navigation and buttons at `.58rem` (9.28px). Applying a 12px floor
therefore reopened a header-overflow bug that had already been found and fixed
once before. `render-check.js` went from 0 findings to 83, then 57, then 5
across three attempted fixes, before returning to 0. Nothing in the CSS recorded
that those small sizes were load-bearing for layout rather than stylistic.

**Suggested improvement:** When a declaration exists only to make something fit,
say so in a comment at the declaration — this stylesheet already does that well
in places ("At 360px it is the 19px that pushes the bar past the edge"), and
those comments were the fastest route to the fix. Extend the practice to every
size below the floor.

**Principle:** A value tuned to solve a layout problem is not a style choice, and
changing it globally will silently reopen the problem it solved. Before a
sweeping change to any dimension, check whether the old values were load-bearing
— and prefer reclaiming space from tracking, padding and gaps over shrinking
text below a legibility threshold.

---

### Observation 2: Adding tokens to an existing `:root` can silently redefine one

**Status:** ACTIONED (2026-08-21) — became `tools/tokens.py`, which fails on a
custom property defined twice in one block. Verified against the original bug:
reintroducing the duplicate `--ease` is caught at the line.
**Date:** 2026-08-21
**Session context:** Appending a spacing/type/motion token block to the `:root`
of three stylesheets that already had their own tokens.
**Skill:** brandkit / design-tokens / any token-authoring workflow
**Type:** open-source
**Phase/Area:** Token emission into an existing codebase

**Issue:** The added block included `--ease`, which all three stylesheets already
defined with a different curve. The duplicate sat later in `:root` and therefore
won, changing the easing of every existing transition in each property. Nothing
failed — no gate covers it, and the visual difference is subtle enough to pass a
screenshot review. It was caught only by reading the diff.

**Suggested improvement:** Any workflow that emits a token block into an existing
file should first collect the custom properties already defined there and either
skip or rename collisions, and report them. A one-line check is enough:
compare the emitted names against `re.findall(r"(--[a-z0-9-]+)\s*:", src)`.

**Principle:** Adding to a namespace is a silent overwrite when the namespace is
last-wins. Generated additions must diff against what already exists, because
the failure mode is not an error — it is a change nobody asked for and no test
covers.

---

### Observation 3: Media queries add no specificity, so "later" beats "narrower"

**Status:** OPEN
**Date:** 2026-08-21
**Session context:** Fixing header overflow at 360px in a stylesheet with
several overlapping breakpoint blocks.
**Skill:** New skill candidate: css-cascade-debugging
**Type:** open-source
**Phase/Area:** Responsive fixes in long hand-written stylesheets

**Issue:** Two consecutive fix attempts failed with no visible effect, because
the rules were added to a `max-width: 400px` block that sat earlier in the file
than a `max-width: 460px` block touching the same properties. A more specific
breakpoint does not win; a later rule does. Both attempts looked correct in the
diff and were only disproved by measuring computed styles in a browser.

**Suggested improvement:** When a CSS fix has no effect, measure the computed
value before editing again — a second edit in the same place costs a full gate
run (~90s here) to disprove. For a stylesheet with overlapping breakpoints,
place override blocks at the end of the file and say why in a comment.

**Principle:** When an edit appears to do nothing, the hypothesis to test first
is that it is being overridden, not that it was wrong. Measure the computed
result rather than re-reading the source.

---

### Observation 4: A wrong option name in a test harness produces confident wrong numbers

**Status:** OPEN
**Date:** 2026-08-21
**Session context:** Measuring rendered font sizes at 360px and 1280px with
Playwright to audit a type scale.
**Skill:** Any browser-measurement or screenshot workflow
**Type:** open-source
**Phase/Area:** Harness setup before measurement

**Issue:** `browser.newPage({ viewportSize: {...} })` was used instead of
`viewport`. Playwright silently ignored the unknown key and used its default
1280px viewport for both runs. The script reported identical results at "360px"
and "1280px" — which was itself the clue — but had the two widths differed only
slightly, the wrong numbers would have been indistinguishable from right ones and
would have gone into a written audit.

**Suggested improvement:** Include at least one value in measurement output that
must change between configurations (here, the `h1` size under a `clamp()`, or the
viewport width itself echoed back). A run whose invariant did not vary is a
broken harness, not a finding.

**Principle:** A measurement harness fails silently when given an unknown option.
Always print something that proves the configuration actually took effect,
before trusting anything else the harness reports.

---

### Observation 5: A gate can be blocked by a person even when the work looks mechanical

**Status:** OPEN
**Date:** 2026-08-21
**Session context:** Driving every gate to zero. `gaps` wanted per-language
URLs for the hub, the journal and the archive.
**Skill:** Any "make the checks pass" workflow
**Type:** internal
**Phase/Area:** Deciding what is machine-doable

**Issue:** Two of the three were mechanical and got done — the hub from
Norwegian already written in `i18n.js`, the journal from a new written copy
table. The archive looked like the same job, one size larger. It is not.
Measured by section, **96% of the archive index's 1,743 words are
legal-bearing**: the verification guarantee, licence tiers, refund terms,
model releases, the FAQ. Writing those in Norwegian would author a Norwegian
statement of the archive's legal position, unreviewed, while `docs/09` and the
licence terms are still waiting on a Norwegian lawyer — and Norwegian is
queue 1 in `languages.json` precisely because nobody has checked it yet.

The first instinct was right, but it was only an instinct until the sections
were counted. Counting turned a hunch into a number that can be handed to
somebody else.

**Suggested improvement:** Before deciding a content task is mechanical,
measure how much of it carries a commitment rather than a description. A
page that is 96% commitments is a legal document with pictures, whatever the
gate calls it.

**Principle:** "Can a machine do this?" and "should a machine do this
unreviewed?" are different questions, and the second one is answered by what
the words commit to, not by how hard they are to write. A gate that stays red
for a documented reason is worth more than a gate turned green by authoring
promises nobody has approved.


---

## 2026-08-23

### Observation 6: A class name travels between properties; the rule behind it does not

**Status:** ACTIONED (2026-08-23) — became `tools/classes.py`, which fails on a
class used by a page with no rule reachable from that page.
**Date:** 2026-08-23
**Session context:** Screenshotting all four properties to show the owner the
finished site.
**Skill:** Any "copy this component to the other property" workflow
**Type:** internal
**Phase/Area:** Four properties sharing a vocabulary but not a stylesheet

**Issue:** The hub's Norwegian page shipped with `EnglishNorsk` — two words, no
separator, default browser blue, underlined, on a site with no blue and no
underlined links. The markup was copied from the desk's Norwegian pages, where
`.lang-pair` is styled. The hub keeps its CSS inline and had no such rule.

It passed every gate. It is valid HTML referencing a class, and nothing had an
opinion about whether the class meant anything. It was caught by looking at a
screenshot — which is not a method, because there are 102 pages.

Looking for the same shape found four more, one of them five months old: the
hub's 404 restated `.btn` but not `h1`, so the page most likely to be reached
by accident had its headline in Inter while the whole rest of the site is
Fraunces; the journal's 404 used `.lead`, which the archive and desk define and
the journal calls `.standfirst`; 25 Norwegian service pages wrapped their pager
in `.pager-inner`, an archive class, collapsing a three-column grid into one;
and the journal's Norwegian page had the same unstyled language pair as the hub.

**Suggested improvement:** When moving markup between properties, move the rule
with it or rename to the class the destination already has. Never assume a
shared vocabulary means a shared stylesheet.

**Principle:** Four properties that share class names but not stylesheets will
leak markup between themselves, and the leak is invisible to HTML validation.
The check is per-page and cheap: collect the classes a page uses and the rules
it can actually reach.

### Observation 7: A generator kept a host the site had already left

**Status:** ACTIONED (2026-08-23) — became `check_generator_hosts` in
`tools/qc.py`, which fails when a builder writes a host no property serves.
**Date:** 2026-08-23
**Session context:** Re-running two builders to fix the class defects above.
**Skill:** Any "single source of truth" / code-generation workflow
**Type:** internal
**Phase/Area:** Generated pages, host migration

**Issue:** The four properties moved from Vercel preview addresses to their real
subdomains. Every shipped page was updated. **None of the eleven generators
were.** Running two of them put 500 preview URLs back into canonicals, hreflang,
`og:url` and cross-property links — in one command, silently, and correctly, in
the sense that the builder faithfully emitted what its data table said.

HEAD had zero preview hosts in shipped files. Two builder runs made it 500. The
regression was found only because the diff was read afterwards.

`launch.py` already detects preview hosts on shipped pages, but it is a
readiness report that exits 0, and it only speaks after the damage is committed.

**Suggested improvement:** When a value is changed in generated output, change
it in the generator in the same commit, or the output is not generated — it is
hand-maintained with extra steps. Where a project claims a single source of
truth, add a gate that asserts the source still agrees with what shipped.

**Principle:** "Never hand-edit a generated page" has a mirror image nobody
writes down: never hand-edit generated *output* without editing the generator.
A builder that has drifted from the site is a landmine that goes off the next
time anyone runs it, and it goes off silently because the builder is working
exactly as written.

---

## 2026-08-24

### Observation 8: Consent given under my own wrong description is not consent

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** Preparing to put the site live; the branch carrying it was
not the repository's default branch.
**Skill:** Any workflow that overwrites, force-pushes, deletes or migrates
**Type:** internal
**Phase/Area:** Destructive operations / obtaining approval

**Issue:** Early in the session I read `origin/main` and reported it held two
files, README.md and SECURITY.md. On that basis I offered the owner three
options and they chose "push the site to main". I had their explicit approval.

Before acting I fetched again. `main` had moved — and it held **QBLOGG**: a
different live project, 278 files, 123 commits, last commit the previous day,
**no common ancestor** with the branch I was about to push. Pushing would have
destroyed the main branch of a project that was not mine to touch.

Two failures compounded. The first was staleness: I read the branch once and
treated that reading as durable. The second is worse — **the owner's approval
was manufactured by my own incorrect description.** They did not approve
overwriting QBLOGG; they approved overwriting a two-file stub, because that is
what I told them was there. An approval is only as good as the facts it was
given, and I supplied those facts.

**Suggested improvement:** Before a destructive act, re-read the target in the
same turn as the act — never rely on a reading from earlier in the session. And
when approval was granted on the strength of something *you* described, treat
your description as part of what must be re-verified, not as settled ground.

**Principle:** "Look at the target before overwriting it" is usually taught as
protection against ignorance. The sharper case is protection against your own
earlier confidence: the more specific the description you gave, the more
completely the other person delegated the checking to you.

### Observation 9: A scan that measures markup reports defects a reader cannot see

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** An SEO scan across 102 pages, checking title and
description length.
**Skill:** Any audit or measurement tool
**Type:** internal
**Phase/Area:** Building measuring instruments

**Issue:** The scan flagged two journal titles as over the 65-character limit.
They were not. Both contain `&mdash;`, which is seven characters in the source
and one character on the screen. Rendered, they are 60 and 61 — comfortably
inside the band. I had been about to "fix" two correct titles.

The same shape appeared twice more in one session. The logo lockups shipped on a
720-wide canvas when the artwork ended at 364, because the width was assumed
rather than measured from the rendered output — a quarter of every file was
empty, which throws alignment off wherever the asset is placed. And earlier,
`viewportSize` instead of `viewport` meant two "different widths" were both
measured at 1280 (observation 4).

Three different bugs, one family: **the instrument measured a representation
rather than the thing.**

**Suggested improvement:** Decide explicitly which representation a measurement
is about — source, rendered, or as-shipped — and convert before comparing.
Where the artifact is visual, measure the rendered pixels, not the code that
produced them.

**Principle:** A measuring instrument that is wrong is worse than none, because
its output is specific, numeric and confident. Before acting on a finding,
check that the number describes what a person would experience.

### Observation 10: A gate that fails on documentation teaches people to skip the run

**Status:** ACTIONED (2026-08-24) — `check_generator_hosts` now reads Python as
string literals via `ast`, so comments and docstrings cannot trip it.
**Date:** 2026-08-24
**Session context:** Verifying the host gate written earlier the same day.
**Skill:** Gate and linter design
**Type:** internal
**Phase/Area:** Writing new gates

**Issue:** The gate scanned generators line by line for hosts the site no longer
serves. Probing it, I put an old host inside a **comment** — a note recording
where a property used to live — and the gate failed the build, claiming the file
"writes" it. A comment writes nothing.

The consequence is worse than a stray failure: documenting the host migration
would have failed the gate that exists *because* of the host migration. `qc.py`
already says why that matters in its own docstring — a gate that cannot go green
is not a gate, it is noise that teaches everyone to skip the whole run.

Notably, the gate had passed its own verification. I had proved it catches the
bug; I had not asked what else it catches.

**Suggested improvement:** After proving a new gate fires on the defect, spend
the same effort proving it stays quiet on the legitimate cases nearest to that
defect — especially comments, docstrings, test fixtures and historical notes.

**Principle:** A gate is defined by both halves: what it fails, and what it lets
through. Only testing the first half ships a gate that is right about the bug
and wrong about the codebase.

### Observation 11: The translation reached the body and stopped at the head

**Status:** ACTIONED (2026-08-24) — `check_translated_meta` in `tools/qc.py`
fails a Norwegian page whose description matches its English counterpart.
**Date:** 2026-08-24
**Session context:** An SEO scan turned up three duplicate titles.
**Skill:** i18n / generated multilingual pages
**Type:** internal
**Phase/Area:** Translation pipelines

**Issue:** The Norwegian hub and the Norwegian journal shipped with the English
`<title>` and the English `<meta name="description">` — the only two strings a
search result displays, on the two pages built specifically to be found in
Norwegian. The entire reason those URLs exist was defeated at the head of the
document while the body was perfectly translated.

The cause generalises: the generators swap the text of elements carrying a
`data-i18n` key, and `<title>` and `<meta>` carry no such key, so the swap
silently never reached them. Nothing failed — the pages were valid, indexable
and wrong.

One of the three duplicates was **not** a defect: `s-chatbot.html` is "Chatbot"
in both languages because that is the Norwegian word, and hreflang already tells
a search engine those are language variants. The gate therefore checks the
description, not the title — a full sentence identical in two languages is
always an untranslated string, while a one-word title legitimately can be.

**Suggested improvement:** When a translation mechanism keys off a marker,
enumerate what carries no marker — `<title>`, `<meta>`, `alt`, `aria-label`,
`og:*`, JSON-LD — and either give them keys or handle them explicitly.

**Principle:** A translation pipeline covers exactly what it can see. The
untranslated remainder is not random: it is whatever the mechanism has no
handle on, which is reliably the metadata a reader never looks at directly and a
search engine looks at first.
