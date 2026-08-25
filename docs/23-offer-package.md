# Offer package — fields for your review

**Prepared:** 2026-08-24 · **Fields filled:** 2026-08-25

Every field below is either **filled** — from the repository (✓) or **derived
from sourced market data with the arithmetic shown** (◆) — or **empty because
it cannot be derived** (⬜). Nothing is guessed. A number invented here becomes
a number said out loud to a person on a call, and then it is a promise.

> **What changed on 25 August.** The first version of this document left every
> field blank and told you to decide. That was under-delivering: eleven of the
> thirteen fields *could* be settled from evidence, and the one I had called
> impossible — the rate — was reachable through search even though the Norwegian
> statistical sources are egress-blocked from this environment. §1.2 shows the
> derivation. Two fields are still blank, and they are blank because they need a
> human being who has met a candidate.

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
| Name | ⬜ | **Not derivable.** No candidate has ever been named |
| Role offered | ✓ **Backend Developer** | Decided — see §1.1 |
| Which spec applies | ✓ `docs/22-role-specs.md` §1.1 | Follows from the role |
| Product | ✓ **BETA ART** — the archive and the desk | Follows from the role |

### 1.1 The role — now decided

`docs/22-role-specs.md` recommended Backend Developer on stated evidence and I
left the decision open. Reopening it changes nothing, so it is taken:
**Backend Developer, BETA ART.** The reasoning, unchanged:

- Seven pages carry a form. Four carry an empty `ENDPOINT` constant. **Not one
  enquiry reaches anybody.** This is the only gap that blocks revenue on all
  four properties at once.
- The model release is a legal document with retention and erasure obligations
  attached. It is the highest-consequence unbuilt thing in the project.
- Everything else on the twenty-role list is either done, or waiting on the
  company registration, or waiting on a lawyer. This one is waiting on a person.

NAVIAR's Trademark Clearance Analyst is the right *second* hire and is not this
offer.

### 1.2 Terms

| Field | Value | Source |
|---|---|---|
| Engagement type | ✓ **Consultant — invoices from own company** | The only form executable without an organisation number |
| Day rate | ◆ **NOK 8 000 / day** (7,5 t · kr 1 067/t) | Derived below |
| Currency | ✓ NOK | Norwegian entity, Norwegian market |
| Hours | ◆ **3 days a week** | The 90-day plan in `docs/22` §1.1 is three deliverables in three months, not a full-time backlog |
| Initial term | ◆ **13 weeks · 39 days · NOK 312 000** | Matches the 90-day definition of done |
| Start date | ◆ **On signature of the IP assignment** | Corrected: the open lawyer review concerns the *licence terms*, which do not touch this work. `docs/22` §1.0 tied the start to it; that was over-cautious |
| Notice period | ◆ **Two weeks, either side, during the initial term** | Symmetric and short, because neither side has worked with the other |
| Equity | ⬜ | **Not available, and not a decision.** A sole enterprise has no shares to grant. Becoming an AS is a prior and separate decision |

**How the rate was derived.** No band exists in this repository, and SSB, Tekna,
NITO and NAV are all egress-blocked from this environment. Web search reaches
secondary sources, which is weaker than a statistical office but is not nothing,
and two independent readings agree:

| Input | Value | Source |
|---|---|---|
| Employed backend developer, mid-level (3–5 yr) | NOK 900 000 – 1 250 000 | Market aggregators, 2026 |
| Employed backend developer, senior (5+ yr) | NOK 1 250 000 – 1 800 000 | Same |
| Employer load — arbeidsgiveravgift 14,1 % (Oslo sone 1) + OTP 2 % + feriepenger 12 % | **×1,281** | Statutory rates |
| Billable hours a consultant actually sells in a year | 1 500, not 1 950 | No paid holiday, no sick pay, sales and admin unbilled |

That gives a fully-loaded cost of NOK 1 153 000 – 1 601 000 at mid-level, and
dividing by 1 500 billable hours:

```
mid-level    NOK   769 – 1 068 /hr    →   NOK  5 765 –  8 006 / 7,5h day
senior       NOK 1 068 – 1 537 /hr    →   NOK  8 006 – 11 529 / 7,5h day
```

**NOK 8 000/day is NOK 1 067/hour**, which sits exactly at the top of mid-level
and the floor of senior. It is independently corroborated: reported Oslo senior
developer rates average ~NOK 1 200/hour, and general Norwegian IT consulting
rates run NOK 1 000–2 500/hour. So the number is defensible from two directions
and it is at the *lower* end of both — appropriate for a 39-day engagement on a
project with no revenue, and honest to say so on the call.

**⚠ Caveat you should hear before you say the number out loud.** These are
secondary aggregators, not Statistisk sentralbyrå. The derivation is sound and
the corroboration is real, but if this hire matters — and it does — one
conversation with somebody who has hired a Norwegian developer this year is
worth more than all of it, and costs nothing.

### Non-negotiables — these are already decided

| Field | Value | Source |
|---|---|---|
| IP assignment | ✓ **Required, written, before first commit** | NAVIAR standard §4 rule 9 (designer assignment); a photography archive needs the same |
| Working language | ✓ English in the repo | `CLAUDE.md`, every doc and gate |
| Reports to | ✓ Betül Öner | `docs/10-team.md` — role 1 is filled |
| Remote/on-site | ◆ **Remote** | Decided. Beta Art has no organisation number, therefore no premises, no office insurance and no address to require attendance at. On-site was never actually available to offer |
| Trial task | ◆ **Yes — paid, ~3 hours**, `docs/24-interview-kit.md` §2 | It is the real day-30 deliverable, so the work is not thrown away either way |

### Role-specific — Backend Developer (`docs/22` §1.1)

| Field | Value | Source |
|---|---|---|
| First deliverable | ✓ One form that posts, stores and survives a redeploy | §1.1, day 30 |
| Definition of done, 90d | ✓ All 7 forms; model release produces a **retrievable timestamped record**; retention and erasure tested by deleting something | §1.1 |
| Constraint they must accept | ✓ No build step, no framework, and leave it that way | `CLAUDE.md` |
| Gate they inherit | ✓ 14 correctness gates, all currently green | `tools/check.py` |

---

## 2 · Email to the candidate — draft

Warm, short, sets up the call. Now that the terms are settled, **three brackets
remain: `[NAME]`, `[DAY]`, `[TIME]`.** Do not send it with a bracket left in it.

> **Subject:** Beta Art — let's talk about the offer
>
> Hi [NAME],
>
> Thank you for the time you've put into this. I've made my decision and I'd
> like to offer you the Backend Developer role.
>
> I'd rather walk you through it than send a document cold, so could we find
> half an hour this week? I'll cover what the role owns, the numbers, and where
> the project honestly stands — including the parts that aren't finished,
> because you'd find them in week one anyway.
>
> Two things I want to be straight about before the call, so nothing is a
> surprise.
>
> Beta Art is not yet registered as a company. That's a deliberate sequencing
> decision rather than a delay, but it has a real consequence: until there's an
> organisation number there's no employment contract, so this starts as a
> consulting engagement and you'd invoice from your own company. I'd rather you
> heard that from me than worked it out.
>
> And there's one legal review still open on the archive's licence terms. It
> doesn't touch your work — it affects what we can sell. You should know it
> exists.
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
- **No number in the email, deliberately** — even though the number now exists.
  A rate in writing before a conversation invites a counter-offer by email
  instead of a discussion, and this one comes with a caveat (§1.2) that needs
  saying out loud.

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

The terms in `FIELDS` are now filled. **Five `NOT SET` blocks remain** — the
candidate's name, which renders on both the first and last slide, and the three
"why you" lines. The tab title reads `⚠ 5 NOT SET` until they are filled, which
is the point. Verified in a real browser, not assumed:

```
1280px  docs/offer-call-deck.html
{"title":"⚠ 5 NOT SET — Offer call","notset":5,
 "rate":"kr 8 000 / day (7,5 t · kr 1 067/t)",
 "role":"Backend Developer","term":"13 weeks · 39 days · reviewed at day 90"}
```

Filling `candidate` alone clears two of the five.

---

## 4 · Still open before this call can happen

**Blocking — and there is now only one:**

1. **Which candidate.** No person has ever been named in this repository. This
   is the whole of what is left, and nothing but you can supply it.

Everything else that was blocking on 24 August is settled: the role is Backend
Developer (§1.1), the rate is NOK 8 000/day with its derivation shown (§1.2),
the engagement is consultant because nothing else is executable, remote is the
only thing there was ever to offer, and the paid work sample already exists in
`docs/24-interview-kit.md`.

**Before an offer is accepted:**

2. **IP assignment wording**, reviewed once by the same lawyer already engaged
   for `docs/09` — a small addition to a review that is already happening, and
   the start date depends on it.
3. **Sanity-check the rate against one human** who has hired a Norwegian
   developer this year. §1.2 says why: the derivation is sound but its inputs
   are secondary aggregators, because SSB, Tekna, NITO and NAV are all
   egress-blocked from this environment.

**Not blocking, but decide before day 90:** whether this engagement converts to
employment once the company is registered, and on what terms. A consultant who
has built your entire backend and is then offered a worse deal as an employee
is a predictable way to lose them.
