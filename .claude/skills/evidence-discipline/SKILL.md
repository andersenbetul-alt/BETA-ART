---
name: evidence-discipline
description: Use when about to report that something works, passes, or is fixed — and when writing the test or check that will back that claim. Catches the gap between what was actually checked and what is being claimed: assertions on preconditions instead of behaviour, clean runs mistaken for a fixed cause, and checks run as a privileged actor the real user is not. Also use when a check has never been observed failing.
---

# Evidence Discipline

**Author:** derived from observations 1–3 in `skill-observations/log.md`
(BETA-ART, 2026-08-22). Licence: CC BY 4.0 — share and adapt with credit.

The failure this prevents: a check runs, it comes back green, and the green
is reported as proof of a claim the check never tested. Every instance below
is from real work, not invented.

## The rule

**Name the claim. Name what the check actually observes. If they differ, the
check is not evidence.**

Everything else here is that rule applied to the three ways it goes wrong.

## 1. Assert the behaviour, not a precondition

A precondition of X is not X.

| Claim | Precondition (weak) | Behaviour (evidence) |
| ----- | ------------------- | -------------------- |
| Skip link works | target element exists | focus moved to the target |
| Menu opens | `.open` class is applied | computed `display` changed |
| Auth blocks writes | policy row exists in `pg_policies` | the write was refused |
| Endpoint is up | process is listening | a request returned a body |

**The test:** *if I broke the feature but left the structure intact, would
this check still pass?* If yes, it is testing structure and claiming
behaviour.

Worked example — a real one that shipped:

```js
// Passed while the skip link did nothing at all.
assert.ok(await page.$('#main'));          // the target exists

// What it should assert:
await page.keyboard.press('Tab');
await page.keyboard.press('Enter');
assert.equal(await page.evaluate(() => document.activeElement.id), 'main');
```

## 2. Capture the failure before explaining it

Order is **capture → hypothesise → fix**. Never hypothesise → fix → hope.

For an intermittent failure, loop until it fails and dump the assertion
verbatim. A plausible cause plus some clean runs is not a diagnosis: if a bug
appears roughly 1 run in 8, six passes afterwards is an unremarkable outcome
for a bug that is still there.

Worked example: an intermittent 44px hit-target failure was diagnosed twice —
"slow layout", then "click race" — and both fixes were followed by clean
runs. The raw text settled it in one line:

```
got 43.999996185302734, need >= 44
```

Floating point, from a CSS transform mid-animation. Neither hypothesis was
close. See `references/worked-examples.md` for the full trail.

**Suspect sub-pixel geometry** wherever transforms, zoom, or device pixel
ratios are involved — exact float comparison on layout values is a latent
intermittent failure.

## 3. Run the check as the actor who will really hit it

A check run with more privilege than a real user proves nothing about that
user.

- Database authorization → connect as the unprivileged application role.
  Superusers and table owners **bypass RLS entirely**, so a policy suite run
  as superuser can pass against policies that do not work.
- Web UI → drive the rendered page. Calling the function underneath skips
  every seam where bugs live.
- CLI → type the command. Importing the module and calling the export is a
  unit test you just wrote.

## 4. Prove the check can fail

A check never observed failing is not known to be a check.

Before trusting a new test, build gate, or lint rule: break the thing it
guards, watch it go red, restore. Record what the failure looked like.

Worked example, both directions:

```
break the menu toggle   → 3 tests fail        ✓ suite has teeth
rename a CSS variable   → build fails, names the variable   ✓ build has teeth
```

This also calibrates tolerances. After loosening a float comparison to
`>= 43.5`, re-breaking it confirmed a genuine regression still fails:
`got 24, need >= 44`.

## Pre-flight — run before reporting

Rules in a skill are not reliably followed mid-flow. Check output against
these before saying it works:

- [ ] I can state the claim, and separately state what the check observed.
      They match.
- [ ] The check would fail if the feature broke but the structure survived.
- [ ] For any "flaky" call: I captured the raw failure text, not just a count.
- [ ] The check ran at the same privilege as a real user.
- [ ] I have seen this check fail at least once, deliberately.
- [ ] Anything I did *not* verify is stated as unverified.

Any box unticked → say so plainly in the report. "Tests pass" and "I ran the
app and watched it work" are different claims; do not print the second when
you did the first.
