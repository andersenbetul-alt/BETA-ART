---
name: financial-model-build
description: Use when building a spreadsheet financial model someone will make a decision on — investment memo, returns analysis, valuation, scenario/sensitivity build, IC or board deliverable. Covers sanity-checking the output against the inputs, labelling every number's provenance, verifying formulas beyond a clean recalc, and keeping dependent grids consistent when a lever is added. Also use when handed assumptions to model "as stated" and when a model's result looks too good.
---

# Financial Model Build

**Author:** derived from the MediTech Solutions IC model (BETA-ART session,
2026-08-25). Licence: CC BY 4.0 — share and adapt with credit.

Scope note: this skill is about quantitative deliverables generally. It lives
in the BETA-ART repo because that repo is the durable memory, not because it
has anything to do with the art site.

Companion skill: `evidence-discipline` covers the general case of a green
check being reported as proof of an untested claim. This skill is that rule
applied to models, plus the failures specific to them.

## The rule

**A model's job is to be wrong out loud.** Every number carries a visible
label saying where it came from, every implausible output is investigated as
evidence about the inputs, and the client's own assumptions get tested rather
than transcribed.

A model that quietly launders assumptions into authoritative-looking output
is worse than no model, because it converts a guess into a number someone
will act on.

## 1. An implausible output is evidence about the inputs

This is the one that matters most, and it is easy to miss because the
arithmetic is correct.

Real case: a deal team supplied 3.6x ARR entry, 7.0x exit, 35% growth, 18%
EBITDA, five-year hold. Modelled exactly as stated, the base case returned
**8.7x MOIC and 54% IRR**. Every formula was right. The recalc was clean.

No growth-equity base case returns 8.7x. The output was not a finding about
the deal — it was a finding about the inputs. Working backwards: a company
growing 35% durably is not available at 3.6x ARR when the sector's premium
public name trades at 5.9x on 13% growth. So either the ARR is not really
recurring, there is an undisclosed problem behind the price, or growth
decays hard and nobody said so.

**The check:** before presenting any headline number, ask *is this a result a
practitioner in this field would find unremarkable?* If it is spectacular,
the inputs are the suspect, not the opportunity.

**What to do about it — do not silently fix it.** Add the missing lever as a
labelled input, set it to a defensible value, and **keep the client's literal
case reachable** by documenting the setting that reproduces it (here, decay =
0%). Both numbers go to the decision-maker. Silently re-engineering the
assumptions to produce a sensible answer hides the finding, which was the
most valuable thing the model produced.

## 2. Label every number's provenance, on a tab the reader will open

Three categories, no exceptions:

| Category | Means | Treatment |
| -------- | ----- | --------- |
| **Given** | The client stated it | Named as theirs, marked not independently verified |
| **Sourced** | Real external data | Cited: source, figure, date, URL |
| **Model assumption** | You chose it | Flagged loudest of the three, with what it does to the answer |

A dedicated **Sources & Gaps** tab beats scattered cell comments, because it
can be read as a list and audited in one pass. It also holds the negative
space: what was requested and not obtained, named explicitly, so a reader
never mistakes silence for absence of risk.

State the grade of your sourcing. Comps from live web search are directionally
sound for a screen and are *not* diligence-grade; say so in the file, not just
in chat.

## 3. A clean recalc is not a correct model

`recalc.py` returning `errors_found: 0` proves your formulas *evaluate*. It
says nothing about whether they compute the right thing — an off-by-one range
or a reference to the wrong row produces a clean, confidently wrong workbook.

**Verify by recomputing the headline independently**, in Python or by hand,
and comparing:

```python
arr = 50.0
for t in range(5): arr *= (1 + 0.35 * (0.85 ** t))
moic = (7.0 * arr * (75/180)) / 75          # 6.132
# workbook Model!B<moic_row> reads 6.132  -> ties
```

Then **cross-check one grid against another**: the sensitivity cell at the
base-case coordinates must equal the base case on the model tab. If those two
disagree, one of them is wrong and the recalc will never tell you.

## 4. Adding a lever means every dependent grid adopts it

When assumption 1 changes shape, everything downstream that compounds it has
to change with it — in the same edit.

Adding growth decay to the MediTech model meant touching the model tab's ARR
build, *both* sensitivity grids, and the concentration-risk MOIC. Missing any
one leaves two tabs that disagree while both recalc clean. The sensitivity
grid is the usual casualty because its closed-form shortcut `(1+g)^n` silently
stops matching the year-by-year build.

**The check:** after any assumption change, re-run the cross-grid tie in §3.

## 5. Test the client's assumption; do not transcribe it

An assumption handed to you is an input to be challenged, not a fact. Find the
outside benchmark and put the comparison *in the file* as a live formula:

    Assumed exit multiple      7.0x
    Best-in-class comp         5.9x   (Veeva, 13% growth, Apr 2026)
    Premium to best-in-class  +18.6%  <- conditional format red when > 0

That row does more work than a paragraph of caveats, because it stays true
when someone edits the assumption.

## 6. Never invent the data

If the source is unavailable, build the structure and leave unmistakable
placeholders — a yellow input cell, a red DATA NOT AVAILABLE block, a flag
formula that reads `"enter data"` until filled. Deliver the instrument, not
fabricated readings.

Before reporting a data source as unavailable, check whether it is *installed
but switched off* — see `references/environment.md`. "Toggled off in this
chat, enable it here" is actionable; "not available" sends the user away.

## Checklist before delivering

- [ ] Headline number is plausible to a practitioner — or the implausibility is written up as a finding
- [ ] Every input labelled given / sourced / model assumption
- [ ] Requested-but-missing data named explicitly in the file
- [ ] `recalc.py` reports `errors_found: 0`
- [ ] Headline recomputed independently and ties
- [ ] Sensitivity grid ties to the model tab at base-case coordinates
- [ ] Client's key assumption benchmarked against outside evidence, in-file
- [ ] Client's literal case still reproducible from a documented setting

## References

- `references/environment.md` — toolchain failures seen in this container and how to diagnose them
- `references/worked-example.md` — the MediTech build end to end
