---
name: on-brand
description: >
  Enforce the Beta Art brand on anything generated — colour tokens, typography,
  spacing, the mark, and the voice rules. Use before writing or editing any
  page, component, stylesheet, screenshot, slide, social post, email, document
  or piece of UI copy for Beta Art, the archive, the business desk or Field
  Notes. Also use to check whether something already written is on-brand, and
  to refuse off-brand patterns with a reason. Covers the banned vocabulary, the
  12px type floor, the two grounds (paper and ink), and what may never be done
  to the seal.
---

# On brand

Beta Art's brand is not a mood board. Almost all of it is already enforced by
gates that exit non-zero, and this skill exists to apply the same rules *while
generating*, before the gates have to.

**Where this skill and a gate disagree, the gate is right.** It runs on the
real files; this is a description. Say so and fix the description.

Values live in `references/tokens.md`, generated from the four stylesheets —
never quote a hex from memory:

```bash
python3 tools/generators/build_on_brand.py   # refresh it after touching any :root
python3 tools/check.py --fast                # the fourteen gates, ~3s
```

## How to refuse

When asked for something off-brand, do not silently comply and do not lecture.
One line, then the alternative:

> **Off-brand: [what].** [Why, in one clause.] Use `[token or pattern]` instead.

Examples, all real rules below:

> **Off-brand: `#8B1A1A` typed into the rule.** A literal hex is invisible to `tokens.py` and survives a palette change. Use `var(--seal)`.

> **Off-brand: a drop shadow on the card.** The site has no shadow anywhere, which is what makes the hairline rules read as deliberate. Use `1px solid var(--rule)`.

> **Off-brand: "unlock your potential".** `copy.py` fails the build on *unlock* by name. Say what the reader gets.

If the request is a deliberate exception rather than an oversight, say what it
costs — which gate goes red, and what has to change for it to stay green.

## Colour

- **Use the token, never the value.** `var(--seal)`, not `#8B1A1A`.
- **The two grounds are separate palettes.** The archive and journal are paper
  (`--paper` / `--ink`); the desk is ink (`--void` / `--text`). There is no
  `--paper` on the desk and no `--void` on the archive. **Never carry a token
  across** — that is observation 6, and it is the most common defect in this
  repository's history.
- **One accent, and it is red.** `--seal`. There is no second accent, no
  gradient, no blue Beta Art.
- `--seal-bright` exists **on dark grounds only** — it is the same colour lifted
  so it survives ink, not a new one. `references/tokens.md` records that the
  name currently points at two different values; read it before using it.
- **Contrast is AA, and it is checked.** `render-check.js` measures resolved
  colours on 102 pages at four widths. 4.5:1 for body, 3:1 for large.

## Typography

Three faces, and each has one job:

| Token | Face | Used for |
|---|---|---|
| `--f-display` | Fraunces | headlines, figures, prices set large |
| `--f-body` | Inter | running text (**except the journal**, where the body face is Fraunces) |
| `--f-mono` | JetBrains Mono | labels, accession numbers, prices, the wordmark |

- **A fourth face is off-brand.** No exceptions, including in a slide or a
  social graphic.
- **The floor is 12px** — `--mono-sm`. `tokens.py` fails anything below it.
  Small type here is legal and navigation text; below 12px it stops being
  readable, which was the whole point of the scale.
- Small type has **three steps**, not nine: `--mono-sm` / `--mono-md` /
  `--mono-lg`. If a fourth size seems needed, the hierarchy is wrong.
- Mono is **letterspaced and uppercase** for labels. That is the catalogue
  voice; it is why prices and accession numbers look like records.
- **Never shrink text to make something fit.** Reclaim the space from tracking,
  padding and gaps. Shrinking reopens the header bug — observation 1.

## Spacing and measure

- `--space-1` … `--space-20` only. An arbitrary `margin: 37px` is off-brand
  because the point of the scale is that the same relationship is spaced the
  same way on every page.
- `--wrap` for the page, `--measure` for the reading column. Text wider than
  the measure is off-brand however much room there is.
- **No shadows, no glows, no gradients, no outlines, anywhere.** Separation is
  a hairline rule or a change of ground. The mark's rules say the same thing
  and for the same reason.
- Motion is `--dur` and `--ease`, or it is nothing.

## The mark

`brand/README.md` is the authority, and it is generated from the geometry the
site actually uses. Seven things may never be done to it, in short:

1. Do not recolour the line — ink or bone.
2. Do not fill the circle; it is a line drawing.
3. Do not add a second accent. One, in the centre, once.
4. Do not stretch, rotate or skew. A compass rose has an up.
5. No shadow, glow, gradient or outline.
6. Do not re-typeset the wordmark — JetBrains Mono at the documented tracking.
7. Do not place it on a busy photograph without the knockout and full clear
   space.

Clear space is **half the circle radius on every side**. Minimum size is
**24px on screen, 8mm in print**; below that the rays close up and it reads as
a dot. Use the 32px file for a favicon, never a scaled-down 512.

## Voice

The rules that already fail a build, from `copy.py`:

- **Fifteen banned words**, by name: *revolutionary, cutting-edge, seamless,
  next-generation, unlock, empower, game-changer, leverage, synergy,
  best-in-class, world-class, state-of-the-art* and their variants.
- **Write to the reader.** A page that says *we/our* more than it says
  *you/your* is a page about the studio. The gate fails below a 0.8 ratio.
- **Every page ends in a next action**, and the button says what happens.
  *Submit*, *Learn more*, *Get started*, *Click here*, *Send* all fail — they
  tell the reader nothing.
- **Sentences average under about 25 words.** Above that people stop scanning.
- **A headline is a claim, not a label.** Three words with no lead under it
  fails; so does a fourteen-word headline, which reads as a paragraph.

And the rules that are convictions rather than counts:

- **A claim on a page must be an undertaking in the legal notice.** Not
  mentioned there — undertaken. `claims.py` fails a page that promises what the
  notice only describes. This applies to a pitch, a slide and an email too: a
  sentence is a promise whether or not it sits in HTML.
- **An interface promise is still a promise.** `forms.py` fails a form that
  answers a submit with a receipt when there is nowhere for the message to
  arrive. A comment in the source saying "no backend yet" is addressed to us;
  the sentence on screen is addressed to the visitor.
- **Machine-written is not a warning, it is not-yet-done.** Say it as progress
  remaining, never as a caution badge.
- **Blanks stay blank.** Organisation number, registered address, the archive's
  real size, the photographer's city. Invent none of them, in any medium.
- **Norwegian is written, not translated.** `data_no.py` holds its own copy.
  `klarsprak.py` applies Språkrådet's rules: kansellistil, abbreviations,
  substantivsjuke and «man» are *feil* and fail; passive voice and long
  sentences are advisory.

The line, in the three languages the project writes in:

| | |
|---|---|
| EN | Made by a human. Verified at the source. |
| NO | Laget av et menneske. Verifisert ved kilden. |
| TR | Bir insan yaptı. Kaynağında doğrulandı. |

`docs/15-slagord.md` holds the rest, and the same rule governs it: a line may
only claim what the notice undertakes.

## After generating

Anything that touched a page, a stylesheet or copy:

```bash
python3 tools/check.py            # 14 gates + the browser gate (~82s)
python3 tools/check.py --fast     # skip the browser (~3s)
```

**Never hand-edit a generated page** — 86 of the 102 pages are output. Edit the
data table in `tools/generators/`, re-run its builder, then re-run the gates.
`run-beta-art` covers running and screenshotting; `tools/generators/README.md`
says which builder writes what.
