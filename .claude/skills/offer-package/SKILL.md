---
name: offer-package
description: Assemble a complete job-offer package for a chosen candidate — the offer fields laid out for the hiring owner's review, a warm scheduling email to the candidate, and a screenshare-ready HTML presentation for the offer call. Use this whenever someone mentions making an offer, an offer letter or package, an offer call, "our finalist", closing a candidate, or presenting terms to a hire — even if they only ask for one of the three pieces. The skill never invents names, compensation numbers, or personalized praise: whatever the user has not supplied becomes a visibly marked fill-in field, not a plausible-looking guess.
---

# Offer Package

Three deliverables from one pass: an **offer-fields table** for the owner's
review, a **warm scheduling email**, and a **screenshare HTML deck** for the
offer call. One rule governs all three: **facts come from the user or from an
existing role document — never from imagination.** A fabricated salary in an
offer deck is not a draft, it is a misquote waiting to be screenshared; an
invented "why we loved you" bullet is worse, because the candidate can tell.

## Step 0 — Take stock of what actually exists

Before writing anything, collect what is real:

- **A role definition** — a role spec, job description, or the duties as the
  user states them. Quote duties and working conditions from it. If none
  exists, ask for the role's core duties in one line; do not pad a thin role
  with invented responsibilities.
- **The variables only the user has:** candidate name · compensation numbers ·
  2–3 specific reasons from the interview/CV · proposed call time · sender
  name. Ask for them once, together. Whatever is still missing when you
  build, render as a fill-in token.
- **Legal or approval blockers** on the engagement (contract form unsettled,
  comp band unapproved). These are stated honestly in the deck ("final terms
  follow in the written agreement — nothing is signed today"), never hidden
  and never resolved by assumption.

## The placeholder discipline

Every missing fact becomes a **visually unmistakable token**: dashed border,
distinct background, monospace, bracketed ALL-CAPS label naming exactly what
goes there — `[FIRST NAME]`, `[NOK ___ per session]`, `[SPECIFIC REASON 1 —
from the interview]`. The token must be impossible to mistake for content and
impossible to ship by accident. Never fill a gap with a realistic-looking
value "as an example" — a realistic example is indistinguishable from a
decision. End the run by listing every token you emitted, counted, so the
owner has a literal fill-in checklist.

## Deliverable 1 — Offer fields for review

A table, one row per term, three columns: field, value, status. Status is one
of: **filled from source** (cite which document), **owner to fill** (token),
**blocked** (name the blocker — e.g. "no signature until counsel confirms
contractor classification"). Include at minimum: role, engagement form,
compensation per unit, payment timing, expected volume (stated honestly if
low), exclusivity/notice, and what happens after a yes. Do not include
internal-only economics (margin splits, comp bands) in anything the
candidate will see.

## Deliverable 2 — The warm email

In the candidate's language. Short: thanks with **one specific moment from
the interview** (token if unknown), the news that an offer conversation is
wanted, what the call covers, an explicit "no decision needed on the call",
and a proposed time (token). **No numbers in the email** — numbers belong on
the call and in writing afterwards; this is both good practice and keeps an
unfilled fee token from blocking the send.

## Deliverable 3 — The offer-call deck

A single scrolling HTML page of full-viewport slides, large type, built to be
screenshared. Use the organisation's design system if one exists in the
project; otherwise a quiet, typographically careful default. Slide order,
each earning its place:

1. **Opening** — the candidate's name in the headline. This is a page about
   them, not about the company.
2. **The role** — real duties from the role source, with what makes the work
   well-defined (written scope, support, tools).
3. **Honest constraints as a selling point** — the boundaries, review
   processes, or guardrails of the role framed as protection for the person
   in it, when they genuinely are. Skip this slide if the role has none.
4. **The numbers** — engagement form, fee/comp rows (tokens where unset),
   payment timing, honest volume expectation, binding terms. If the contract
   is not final, say on the slide that nothing is signed today.
5. **Why you** — 2–3 slots for specific observed reasons. Tokens if the user
   has not supplied them; never generic praise, which reads as exactly what
   it is.
6. **Next steps** — numbered, unhurried, ending with the written agreement.

Deliver the deck as a rendered page (artifact or file per the environment),
plus the email text and fields table in the reply. Offer to re-issue final
versions once the tokens are filled.

## Templates

`templates/deck.html` — the deck with generic tokens and the fill-token CSS.
Adapt its content to the actual role; keep the token styling.
`templates/email.md` — the email skeleton.

## What this skill never does

- Invent a name, a number, a benefit, a title, or a compliment
- Present a "realistic example" value where a decision was not made
- Put internal economics or unapproved terms in candidate-facing material
- Hide a legal blocker to make the package look finished
- Send anything — every output is a draft for the owner
