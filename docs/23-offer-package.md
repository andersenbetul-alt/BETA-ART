# Offer package — fields for your review

**Prepared:** 2026-08-24

Every field below is either **filled from the repository** (marked ✓ with its
source) or **empty because nobody has decided it** (marked ⬜). Nothing is
guessed. A number invented here becomes a number said out loud to a person on
a call, and then it is a promise.

---

## ⛔ Read this before filling anything in

**A Norwegian employment offer cannot be signed right now.**

`tools/launch.py` records the company decision:

> "register the company — who: Brønnøysund — decided: **after the project**.
> Until then there is no organisation number, so no Stripe account, no legal
> invoice and no VAT registration — and the site must keep saying so."

Without an organisation number there is no employment contract, no payroll, no
tax withholding and no OTP pension. **Consultant is the only form that can be
signed today** (they invoice from their own company). A full-time offer can be
*made and dated*, not *executed*.

If the finalist is expecting employment, say so on the call rather than after.

---

## 1 · Offer fields

### The candidate

| Field | Value | Source |
|---|---|---|
| Name | ⬜ | not given |
| Role offered | ⬜ | **not chosen** — see below |
| Which spec applies | ⬜ | `docs/22-role-specs.md` §1.1 / §1.2 / §1.3 / §2.1 / §2.2 |
| Product | ⬜ | BETA ART / NAVIAR marka / Naviar Care |

> **The role was never selected.** Asked which role this hire is for, the answer
> was "do them all". That produced five specs, not one decision. An offer needs
> one. `docs/22-role-specs.md` recommends **Backend Developer** for BETA ART
> and **Trademark Clearance Analyst** for NAVIAR, on stated evidence.

### Terms

| Field | Value | Source |
|---|---|---|
| Engagement type | ⬜ | Only **consultant** is executable today |
| Day rate / salary | ⬜ | **No band exists anywhere in this repository.** Not in `docs/05`, not in `data.py`, nowhere |
| Currency | ✓ NOK | Norwegian entity, Norwegian market |
| Hours / FTE | ⬜ | §1.3 and §1.2 are written part-time; §1.1 is not scoped |
| Start date | ⬜ | Should follow the lawyer review, not a calendar — `docs/22` §1.0 |
| Initial term | ⬜ | NAVIAR §2.1 is a defined scope (26 projects); BETA ART §1.1 is not |
| Notice period | ⬜ | |
| Equity | ⬜ | **Not available.** A sole enterprise has no shares. Becoming an AS is a prior decision |

### Non-negotiables — these are already decided

| Field | Value | Source |
|---|---|---|
| IP assignment | ✓ **Required, written, before first commit** | NAVIAR standard §4 rule 9 (designer assignment); a photography archive needs the same |
| Working language | ✓ English in the repo | `CLAUDE.md`, every doc and gate |
| Reports to | ✓ Betül Öner | `docs/10-team.md` — role 1 is filled |
| Remote/on-site | ⬜ | **Not decided. Halves or doubles the pool** |
| Trial task | ⬜ | If used, **paid**. The honest candidates ask |

### Role-specific, if Backend Developer (`docs/22` §1.1)

| Field | Value | Source |
|---|---|---|
| First deliverable | ✓ One form that posts, stores and survives a redeploy | §1.1, day 30 |
| Definition of done, 90d | ✓ All 7 forms; model release produces a **retrievable timestamped record**; retention and erasure tested by deleting something | §1.1 |
| Constraint they must accept | ✓ No build step, no framework, and leave it that way | `CLAUDE.md` |
| Gate they inherit | ✓ 14 correctness gates, all currently green | `tools/check.py` |

---

## 2 · Email to the candidate — draft

Warm, short, sets up the call. **Brackets are yours to fill.** Do not send with
a bracket left in it.

> **Subject:** Beta Art — let's talk about the offer
>
> Hi [NAME],
>
> Thank you for the time you've put into this. I've made my decision and I'd
> like to offer you the [ROLE].
>
> I'd rather walk you through it than send a document cold, so could we find
> [30 minutes] this week? I'll cover what the role owns, the numbers, and where
> the project honestly stands — including the parts that aren't finished,
> because you'd find them in week one anyway.
>
> Two things I want to be straight about before the call, so nothing is a
> surprise:
>
> [IF CONSULTANT] Beta Art is not yet registered as a company — that's a
> deliberate sequencing decision, not a delay. So this starts as a consulting
> engagement and you'd invoice from your own company. I'll explain the
> timeline on the call.
>
> [IF THE LAWYER REVIEW IS STILL OPEN] There's one legal review outstanding on
> the archive's licence terms. It doesn't affect your work, but it affects what
> we can sell, and you should know it exists.
>
> Would [DAY] at [TIME] work? Happy to fit around you.
>
> Best,
> Betül

**Notes on the draft, so you can change it knowingly:**

- It names an unfinished thing on purpose. A candidate who finds out in week
  one that no form stores anything, after an offer call that didn't mention it,
  has been mis-sold. `forms.py` exists in this repository because of exactly
  that principle applied to visitors.
- It does not say "excited to have you on board" before they've accepted. That
  reads as pressure.
- No salary figure. Numbers go on the call, where they can ask.

---

## 3 · The presentation

`docs/offer-call-deck.html` — six slides, self-contained, on-brand
(`/on-brand`: paper ground, Fraunces/Inter/JetBrains Mono, hairline rules, no
shadows). Open it in a browser and screenshare.

**Every unset value renders as a loud red `NOT SET` block.** That is
deliberate: a deck with a plausible-looking salary in it is one accidental
screenshare away from being a real offer nobody made.

**It is a local file, not a published link, and that is on purpose.** The
finished version contains a named person's compensation. That should not live
at a URL.

Fill the `FIELDS` object at the top of the file. Nothing else needs editing.

---

## 4 · Still open before this call can happen

**Blocking:**

1. **Which role, and which candidate.** Neither has been stated.
2. **The number.** No band exists. This cannot be improvised on a call.
3. **Employment form** — and if it is not consultant, the candidate has to be
   told the contract cannot be signed yet.

**Before an offer is accepted:**

4. Remote or Oslo.
5. IP assignment wording, reviewed once by the same lawyer already engaged for
   `docs/09` — it is a small addition to a review that is already happening.
6. Start date tied to the lawyer review.
7. Whether a trial task was used, and whether it was paid.
