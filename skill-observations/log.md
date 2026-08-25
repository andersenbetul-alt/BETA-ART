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

**Status:** ACTIONED (2026-08-24) — became `tools/cascade.py`, which fails when a
declaration is shadowed by a later, wider `max-width` block **with a different
value**. Writing it found three such declarations still live in
`beta-art-business/styles.css`: the header's tightening below 560px had never
applied, measured at 6.4px where 4.8px was intended. Identical-value repetition
is counted and deliberately not failed — nineteen of those exist, and a gate
that fires on correct code is one people learn to skip.
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

**Status:** ACTIONED (2026-08-24) — became `check_harness_options` in
`tools/qc.py`, which fails on any key passed to `newContext`/`newPage` that
Playwright does not read. Its first version silently missed the *first* key in
each options object, so it passed its own verification while catching nothing —
the same class of failure it exists to catch, found only by reintroducing the
bug and watching it not fire.
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

### Observation 12: Thirty-nine throwaway harnesses, one missing tool

**Status:** ACTIONED (2026-08-24) — became `tools/shoot.js`, which caches the
webfonts once and serves them to the page by route interception.
**Date:** 2026-08-24
**Session context:** Asked whether the project needed another skill, I counted
what I had actually written instead of guessing.
**Skill:** Any repeated-scaffolding workflow
**Type:** internal
**Phase/Area:** Noticing a missing tool

**Issue:** In one session: **39 throwaway Playwright scripts**, and the same
font-interception boilerplate typed out from scratch **10 separate times**.

Every one existed because of a single environment fact — Chromium here cannot
CONNECT to `fonts.googleapis.com`, so a page rendered straight from the browser
measures Georgia and Arial instead of Fraunces and Inter, and every number
taken that way is quietly wrong. `render-check.js` handles it by blocking fonts
and saying so, which is right for a gate and wrong for anything you intend to
look at or quote.

The tell was not that any single script was bad. Each was fine and took two
minutes. The tell is the **count**, and the count was invisible until somebody
asked a question that made counting the obvious answer. Ten repetitions of the
same twelve lines is a missing tool, and it had been missing all session while
being worked around cheerfully every time.

Worth recording: `curl` reaches `fonts.googleapis.com` fine — only the
browser's tunnel is refused. The workaround had been treated as a fixed
constraint rather than a thing with a boundary worth probing.

**Suggested improvement:** When the same scaffolding is written a third time,
stop and build it. Count rather than estimate: "I keep doing this" is a feeling,
"ten times in one session" is a decision.

**Principle:** The strongest signal that a tool is missing is not friction —
each individual instance was frictionless — but repetition. Friction gets
noticed and fixed; cheap repetition is invisible until counted, and it is
where most of the waste lives.

### Observation 13: A builder deletes what a later tool restores, and the gap between them is invisible

**Status:** ACTIONED (2026-08-24) — closed from CI rather than by a gate. The
proposed `enrich.py --check` was never needed: `.github/workflows/gates.yml`
runs the gates on a pristine checkout and then asserts `git diff --exit-code`,
so a commit the gates had to *repair* fails the run. The reason no local gate
could do it is exactly the reason CI can — CI has an untouched copy to compare
against, and this working tree does not.
**Date:** 2026-08-24
**Session context:** Verifying, for a run skill, the claim that re-running a
generator is safe.

**Skill:** run-beta-art / the generators
**Type:** internal
**Phase/Area:** Generator sequencing

**Issue:** `python3 tools/generators/build.py` on a clean tree modifies all 25
service pages. Every one loses the same 32 lines: the `BreadcrumbList` JSON-LD
that carries the comment `derived structured data — tools/enrich.py`. The
builder writes the page from its data table, and the data table does not contain
the derived block, so the block is simply not written back. Nothing warns.

Running the gates afterwards returns the tree to **byte-identical**, because
`enrich.py` is a writer, not a checker, and `check.py` runs it. So the
round-trip is safe — but only as a round-trip. The intermediate state is a
working tree where 25 shipped pages have lost their structured data, and there
is no moment at which any gate reports it: run the gates and they fix it, don't
run them and nothing looks.

The exposure is a commit taken between the two steps. That is not hypothetical
housekeeping — it is exactly what happened with the 500 stale preview hosts
earlier in this project, where a generator run reintroduced something the site
had already left and the only reason it was caught was a later unrelated audit.

**Why it could not be a gate:** every gate here answers "is the tree correct
now?", and by the time a gate has run, `enrich.py` has already made the answer
yes. A gate cannot see the state it repairs. Catching this needs a *checking*
mode — `enrich.py --check`, exiting non-zero when a page is missing its derived
block and writing nothing — so that the question can be asked without being
answered by the asking. That was the shape proposed; the answer turned out to be
simpler and to live somewhere else — see the status above.

**Suggested improvement:** Where one tool repairs what another removes, the
repair must have a read-only mode, or the damage has no observable window.

**Principle:** A self-healing pipeline cannot be audited by running it. Any tool
that fixes on sight destroys the evidence a gate needs, so a fixer and a checker
are two tools, not one with a flag nobody passes.

*Closed the same day, from the other side: the checker did not have to be a
second tool. It had to be a second **copy** — which is what a CI runner is.*

### Observation 14: A summary picked the line with a number in it, and the number was in a sentence saying the opposite

**Status:** ACTIONED (2026-08-24) — `check.py` now cuts each readiness report at
its sign-off before looking for the count.
**Date:** 2026-08-24
**Session context:** Reading `check.py`'s readiness block while documenting it.

**Skill:** task-observer
**Type:** internal
**Phase/Area:** Reporting on reports

**Issue:** `check.py` summarises `gaps.py` and `launch.py` by taking the last
line of their output that contains a digit. Both tools end with a sign-off
explaining that exiting 0 is not a pass. That paragraph wraps, and its fragments
carry digits, so the summary showed:

    □ gaps.py        To gate on it, run `python3 tools/gaps.py --strict`.

— the digit being the `3` in `python3`. Removing that line moved the pick to
another wrapped fragment:

    □ launch.py      the site is ready — 6 item(s) above are still outstanding.

whose full sentence reads *"It is NOT a statement that the site is ready — 6
item(s) above are still outstanding."* The summary line said the site was ready.
The source said precisely the reverse, and the summariser could not tell,
because a fragment of a sentence is a grammatical sentence.

This is the same failure as Observation 9 from the other end: there, an
instrument measured a representation instead of the thing. Here, an instrument
measured a *fragment* of a representation, and fragments of careful writing are
where the qualifications get cut off. The more careful the source — and both
these tools are careful, at length, about not being read as a pass — the more
dangerous the excerpt.

**Suggested improvement:** When one tool excerpts another's prose, excerpt at a
boundary the source declares, not at one the reader guesses. `check.py` now cuts
at the `Exit status` sign-off, which both tools emit deliberately.

**Principle:** Heuristic excerpting inverts meaning most reliably on text that
was written to prevent a misreading, because the hedge and the claim are in the
same sentence and only the claim survives the cut.

### Observation 15: A search that cannot reach its index reports an empty ecosystem

**Status:** OPEN — no gate; a habit for using any search tool
**Date:** 2026-08-24
**Session context:** Asked to find skills for this project, ran `npx skills
find` across four queries.

**Skill:** find-skills
**Type:** external
**Phase/Area:** Trusting a tool's negative answer

**Issue:** Four searches — accessibility, SEO, localization, privacy — each
returned `No skills found`. Four clean negatives is a finding, and the finding
would have been written up as "the ecosystem has nothing for this project".

It was false. `npx skills find react` also returned `No skills found`, and a
React skill with 185,000 installs is the single most-installed thing in that
ecosystem. The registry host is blocked by this environment's egress policy:

    curl https://skills.sh/  →  curl: (56) CONNECT tunnel failed, response 403

The CLI does not distinguish an unreachable index from an empty one. Both print
the same sentence. Nothing is logged, nothing exits non-zero, and the message is
phrased as a fact about the world rather than about the request.

The control that caught it was cheap and generalises: **run a query whose answer
you already know.** "react" is to a skills index what a known-good sample is to
an assay. It cost one command and it inverted the conclusion.

Worth recording what is and is not blocked, because the distinction is not
obvious: discovery is gone, installation is not. `api.github.com` and
`raw.githubusercontent.com` answer, so `npx skills add owner/repo -l` clones and
lists fine, and installing by name works. You can fetch any skill here — you
just cannot ask which ones exist. Same shape as the font problem: `curl` reaches
`fonts.googleapis.com`, only the browser's tunnel is refused.

**Suggested improvement:** Before reporting that a search found nothing, run a
positive control. Before reporting that a host is unavailable, check whether it
is the whole host or one path — this environment blocks tunnels, not domains,
and the two look identical from inside a tool that only reports success.

**Principle:** An empty result and a broken connection are the same string in
most tools, and only one of them is information. A negative finding from a
search is worth exactly as much as the last positive control you ran through it.

### Observation 16: The comment was addressed to us; the sentence was addressed to the visitor

**Status:** ACTIONED (2026-08-24) — became `tools/forms.py`
**Date:** 2026-08-24
**Session context:** Asked what to do next, went to `launch.py`'s costliest
person-item — "give the 7 forms somewhere to post" — and read what the forms
actually did instead of what the report said about them.

**Skill:** run-beta-art / the gates
**Type:** internal
**Phase/Area:** A promise made by an interface rather than by copy

**Issue:** Three of the site's forms answered a submit with a receipt they
could not honour. The desk's enquiry form:

    // No backend here: connect a form endpoint or the studio inbox before launch.
    if (status) status.textContent = "Request received. A written scope and
      price follow within 48 hours, from hallo@beta-art.com.";
    form.reset();

The visitor is told their enquiry arrived; `form.reset()` then destroys it. They
wait 48 hours for a reply nobody can send, because nobody has their message. The
journal's newsletter form said "check your inbox for the confirmation letter"
with no list to join. The archive's licence form said "Request received" on a
page whose own preview banner, forty lines above, reads *"no enquiry sent from
this site is stored anywhere"* — the page contradicted itself, and the visitor
believes the form, not the banner.

Every one of the three had a comment above it saying there was no backend. **The
comment was addressed to us. The sentence was addressed to the visitor**, and
only one of those two is read by the person the promise is made to. A note to
the developer is not a disclosure to the user, and putting it in the source is
what made it feel handled.

`claims.py` did not catch this because it checks that a promise on a *page* is
an undertaking in the legal notice. This promise was not in the copy. It was
made at runtime, by JavaScript, only to the people who actually filled the form
in — the most committed visitors on the site.

And the answer already existed here. `beta-art/release.js`, months older, in
Norwegian:

    if (!ENDPOINT) {
      /* Ingen mottaker satt opp. Si det rett ut framfor å vise en hake. */

— *no recipient set up, say it straight out rather than showing a checkmark.*
One of four forms had the pattern. Three did not. Same shape as observation 6:
the thing travelled between properties, the rule behind it did not.

**Suggested improvement:** All three now hold their input rather than resetting
it, say plainly that nothing was sent, and name the address to send it to. Each
carries an empty `ENDPOINT`; setting it switches on a real POST whose success
sentence lives in the `.then`, and whose failure sentence says nothing was
stored. `forms.py` fails any arrival claim that sits outside a `.then`.

The gate found the third form on its first run — one I had not known about
while writing it.

**Principle:** A comment is a message to whoever edits the file. A status line
is a message to whoever trusted the form. Explaining a missing backend in the
source does not disclose it to anybody outside the repository, and the more
carefully the comment is written the more convincingly it stands in for the
work.

### Observation 17: I wrote the same gate-fails-on-documentation bug I had documented that morning

**Status:** ACTIONED (2026-08-24) — `forms.py` strips comments before scanning
**Date:** 2026-08-24
**Session context:** First run of the new `forms.py`, on the tree it had just
been written to certify.

**Skill:** task-observer
**Type:** internal
**Phase/Area:** Promoting an observation to a gate

**Issue:** `forms.py` came back with five findings on a tree I had just fixed.
Two were its own explanation: in the repaired files I had quoted the bad
sentences inside `//` comments, to record why they were bad, and the gate read
the comments as code.

This is **observation 10, exactly** — a gate failing on documentation — which I
had written up and fixed in `qc.py` earlier the same day, using `ast` so that
Python comments and docstrings cannot trip a scan. The principle was recorded.
It did not transfer, because the new gate scans JavaScript and `ast` does not
reach it, so the fix was filed as *a Python fix* rather than as *the rule that
a scanner must not read its own explanation*.

Two of the other three findings were also mine: `\bsendt\b` and `\bregistrert\b`
matched `release.js` saying "samtykket blir først registrert når teksten under er
sendt" — the consent is registered *once you have sent* the text. A condition,
read as a receipt. The pattern was tuned to the words rather than to the claim.

Only the fifth finding was real, and it was the one I had not known about.

**Suggested improvement:** When promoting an observation to a gate, re-read the
log for observations about *gates*, not only for observations about the subject.
The half-one/half-two check in `references/promoting-to-a-gate.md` caught this —
half one failed and said why — but only because the gate was run against a tree
already known to be clean. A gate first run on a dirty tree would have shown
five findings and looked correct.

**Principle:** A fix recorded against one language files itself under that
language. The lesson generalises and the filing does not, so the second
occurrence looks like a new bug. When a gate is written, the first thing to
check is whether it fails on the sentence explaining what it checks.

---

### Observation 18: A gate that judges shipped code judged the tool that reports on it

**Status:** ACTIONED · **Tags:** qc.py, evidence-or-blank, gate design
**Date:** 2026-08-25

**Issue:** A new skill driver, `.claude/skills/evidence-or-blank/check-blanks.js`,
failed `qc.py` on two findings: *leaves a console.log in shipped code*, and
*is not in strict mode*. Both rules are correct rules. Neither applies to the
file, because the file is not shipped — the site never serves `.claude/`, and
the driver's entire purpose is to print a report to a terminal. It was failed
for doing the thing it exists to do.

`walk()` already excluded `.git`, `tools`, `docs` and `__pycache__`, for exactly
this reason. `.claude` was missing from the list, because when that list was
written the repository had no skills in it. The exclusion was not wrong when it
was written; it stopped being complete when the project grew a new kind of
directory that holds code but ships nothing.

This is the **third** appearance of the family in observations 10 and 17 — a
scanner reading something addressed to us as though it were addressed to a
visitor. 10 was a gate reading its own Python docstrings. 17 was the same bug
rewritten in JavaScript the same day. 18 is the same distinction again, moved up
a level: not *which lines* in a file are product, but *which directories*.

**What was done:** one word added to the exclusion list, with the reason written
beside it so the next person adding a directory knows the test to apply. Verified
on both halves per `references/promoting-to-a-gate.md`: the skill driver now
passes, and a deliberately planted `beta-art/probe.js` containing a bare
`console.log` is still caught. The exclusion narrows what is scanned; it does not
blind the gate.

**Suggested improvement:** The question a scanner must answer first is not "does
this file break a rule?" but **"is this file addressed to a visitor?"** That
question is answered by the directory far more often than by the file. When a new
top-level directory appears that holds code the site does not serve, the
exclusion lists in `qc.py`, `classes.py` and `tokens.py` are the places to look
before writing anything in it.

**Principle:** An exclusion list is a claim about the shape of the repository,
and the repository changes shape. `tools/` and `docs/` were excluded when they
were the only places code lived that nobody visits. `.claude/` became a third
such place and inherited nothing, because a list of names cannot notice that a
new name belongs in it. The rule that generalises is the *reason* for the list —
addressed to us, not to a visitor — and reasons are what should be written down
next to lists.
