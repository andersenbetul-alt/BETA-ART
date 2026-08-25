---
name: performance-review
description: Walk a manager through a performance review end to end — gathering input, scoring against the organisation's own competency framework, and drafting the review in the organisation's template. Use this whenever a manager mentions writing a performance review, a medarbeidersamtale, an annual or mid-year review, scoring someone against competencies, or drafting review feedback for a report — even if they only ask to "write up a review" without naming a process. The skill quotes the organisation's rating definitions verbatim from files and refuses to run without them; it never invents competencies, ratings, or template sections.
---

# Performance Review

Walks a manager from raw input to a drafted review in three passes: gather,
score, draft. The one rule that governs everything: **the framework files are
the only source of criteria.** Nothing in this skill, and nothing in the
model's general knowledge, may add a competency, a rating level, or a template
section that is not in those files. A review scored against invented criteria
is worse than no review — it tells the employee they were measured against
rules nobody agreed to.

## Step 0 — The gate. Run this first, always.

```bash
node .claude/skills/performance-review/scripts/check-framework.mjs
```

The framework lives in `.claude/skills/performance-review/framework/`:

| File | Holds |
|---|---|
| `competencies.md` | The competencies, one `##` heading each, with the organisation's own description under each |
| `ratings.md` | The rating scale — every level with its verbatim definition |
| `template.md` | The review template — the exact section headings the final draft must use |

If the script exits non-zero, **stop**. Tell the manager exactly which files
are missing or empty, show the table above, and offer to help them capture
their real framework into these files. Do not proceed with a "generic"
framework, do not offer example competencies, do not draft anything. The
skill's value is fidelity to *their* framework; without it there is nothing
to be faithful to.

If the gate passes, read all three files now — not from memory of a previous
run, from the files — and keep them open as the only source of truth for the
rest of the session.

## Step 1 — Intake

Collect from the manager, asking only for what is missing:

- Who is being reviewed, their role, and the review period
- Which review type the template covers (annual, mid-year, probation) if the
  template distinguishes them
- What input already exists: self-review, peer feedback, prior goals, work
  artifacts, one-on-one notes
- What has NOT been gathered — name the gaps out loud before scoring

Push back where the manager is vague. "They did fine" is not input. For each
competency in `competencies.md`, ask for at least one concrete piece of
evidence — a shipped thing, a dated incident, a peer's sentence, a metric.
The review will only be as specific as this step.

**Privacy:** review material is personal data about a named employee. Keep it
in this workspace; do not paste it into external tools or web services, and
remind the manager of the same if they suggest it.

## Step 2 — Score

For each competency in `competencies.md`, in the file's order:

1. List the evidence gathered for it.
2. Propose a rating **from `ratings.md` only**, and quote that rating's
   definition verbatim — in quotation marks, unedited — next to the proposal,
   so the manager sees the words they are signing up to.
3. Show the reasoning: which evidence maps to which phrase of the definition.
4. Where evidence is thin, say **"insufficient evidence — not scored"** and
   list what would settle it. Never score on vibes; an unsupported middle
   rating is the most common review failure and the easiest to avoid.

Two bias checks before moving on, stated to the manager in one line each:
does any score rest only on the last six weeks (recency), and does any score
on one competency merely echo another (halo)?

If the manager proposes a rating or criterion that is not in the files,
decline it by pointing at the file: "that level/competency isn't in the
framework — if it should be, edit `framework/` first, then we re-run."

## Step 3 — Draft

Produce the review using `template.md`'s structure **exactly** — same
sections, same order, same headings. Do not add sections the template lacks
(no bonus "areas of opportunity" if the template has none), and do not drop
sections it has; where a template section demands something not gathered,
leave a clearly marked `[MISSING: …]` rather than filling it with plausible
text.

Inside each section: evidence-backed sentences, the employee's actual work
named specifically, ratings stated with their verbatim definitions where the
template calls for them. Write in the organisation's language as found in the
framework files — do not translate the framework's terms.

End by listing, for the manager: every `[MISSING: …]`, every "insufficient
evidence" competency, and the two bias-check answers. The draft is theirs to
finish; the gaps list is what makes finishing it honest.

## What this skill never does

- Invent, merge, rename, or reinterpret competencies, ratings, or sections
- Quote a definition from memory instead of from the file
- Score without evidence, or fill a template gap with plausible filler
- Compare the employee to other named employees
- Send anything anywhere — the output is a local draft for the manager
