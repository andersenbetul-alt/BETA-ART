# Role specs — three products, in the order the work dictates

**Prepared:** 2026-08-24 · **Requested:** intake for a new role, all products and
all roles, separately, in order.

Format follows `docs/10-team.md`: a role is held against **the work that
exists**, not against a wish. A spec that does not say what is already built is
a spec the candidate cannot judge.

## The evidence is not equal across the three, and that changes what I can write

| Product | What I have | Spec quality |
|---|---|---|
| **BETA ART** | The repository. 102 pages, 14 correctness gates green, 7 pages with a form, **4 empty `ENDPOINT` constants, 0 analytics installed**, 97 commits | **Grounded.** Every claim below is checked |
| **NAVIAR marka hattı** | `NAVIAR_LOGO_SKILLS_AND_CLEARANCE_STACK_v1.0.md`, uploaded. Gates, sources, stop conditions all specified | **Grounded in the standard**, not in built work |
| **Naviar Care** | Two sentences in conversation: elderly people, family members and service providers on one platform | **⚠ Thin. Recruit against this at your own risk** — see §3 |

---

# 1 · BETA ART

Order taken from `docs/10-team.md:174–186` and re-checked against the repo today.

## 1.0 — Before any hire: a Norwegian lawyer, a few hours

**Not a role. A purchase.** `launch.py` lists it under `who: a Norwegian
lawyer`, and `docs/09-photograph-policy.md:186–188` prices it:

> "A review of this document and the licence terms together costs a few
> thousand kroner. It is the cheapest insurance in the project, and the only
> item on this list that cannot be closed from a keyboard."

Brief is written: `docs/21-research-memo-104-gdpr.md`. Hand it over as-is.
**This gates every commercial sale of a photograph showing a person.** Hiring a
backend before this is building the machine that sells the thing nobody has
confirmed you may sell.

## 1.1 — Backend Developer · **the first hire**

**Owns.** Every form that currently promises nothing and stores nothing. The
consent record. Payments, when the company exists.

**Why first, in one number:** 7 pages carry a form, 4 carry an empty `ENDPOINT`
constant, and **not one enquiry reaches anyone**. `docs/10-team.md` puts it
plainly:

> "One backend, and five roles unblock at once. Nothing else on this list has
> that ratio."

The forms were fixed this week so they no longer *lie* about it — they say
nothing was sent and hand the visitor their text. That is honest, not
finished.

| | |
|---|---|
| **Level** | Mid–senior. Must be able to decide architecture alone; there is nobody to escalate to |
| **Reports to** | Betül (Product) |
| **Employment** | **Consultant, day rate.** See §4 — Brønnøysund registration is "after the project", so there is no organisation number, and without one there is no Norwegian employment contract, no payroll, no legal invoice |

**Must have**
- A backend that stores a record and proves it stored it — this is a **consent
  record**, not a contact form. `beta-art/release.html` collects four separate
  questions because GDPR consent must be specific.
- GDPR-aware data handling: retention, erasure, export. Not as a checkbox.
- Comfortable shipping into a repository with **no build step and no
  framework**, and leaving it that way. `CLAUDE.md`: *"a dependency added here
  is a dependency in perpetuity."*
- Reads a gate before arguing with it. There are 14 and they all exit zero.

**Nice to have**
- Stripe, for when the org number arrives.
- Norwegian, for Datatilsynet correspondence.
- Static-first instincts (edge functions over a server).

**Explicitly not required:** frontend. It is done and it is not theirs.

**What good looks like at 90 days**
- Day 30 — one form posts, stores, and survives a redeploy. `forms.py` still
  green with the `ENDPOINT` filled and the success sentence inside `.then`.
- Day 60 — all 7 forms. The model release produces a **retrievable record with
  a timestamp**, because a release that cannot be produced on demand is not a
  release.
- Day 90 — retention and erasure implemented and *tested by deleting something*;
  the privacy notice updated the same day to match what actually runs.

**The failure mode to screen for:** someone who ships a form endpoint in a
week and calls it done. The record is the product here, not the POST.

## 1.2 — UX Researcher · **can start today, blocked by nothing**

**Owns.** Finding out whether anyone will pay. `docs/10-team.md` on why this
one is different:

> "it is the only role that can invalidate the other nineteen. Every claim on
> 100 pages is currently a hypothesis written carefully. Careful is not the
> same as tested."

| | |
|---|---|
| **Level** | Any, if they can get strangers to talk. Ten conversations, not a panel |
| **Reports to** | Betül |
| **Employment** | **Can be you.** If not: short contract or student project |

**Must have** — recruiting participants without a budget; interviewing without
leading; writing up what contradicts the plan.
**Nice to have** — Norwegian; small-business or photo-buyer network.

**90 days** — Day 30: ten conversations booked. Day 60: held and transcribed.
Day 90: a written answer to *"which of the 25 services would anyone actually
pay for, and at what price"* — with the ones nobody wants named.

**⚠ Sequencing conflict, stated honestly:** `docs/10` orders research *before*
backend. The backend spec above is written as the first hire because it
unblocks five roles. **These two can run in parallel** — research needs no
code and costs almost nothing. If you must pick one: research first, because
it can tell you not to build the backend at all.

## 1.3 — Service Designer · **after there is one real order**

**Owns.** The gap between *"the page says 48 hours"* and *"someone answered in
48 hours."* That sentence is on 31 pages and `claims.py` enforces it against
the legal notice — but nothing enforces it against reality.

| | |
|---|---|
| **Level** | Senior. This is judgement, not production |
| **Reports to** | Betül |
| **Employment** | Part-time or consultant |

**Must have** — designing a service, not a screen; comfortable with an
operation of one or two people.
**Nice to have** — Norwegian SMB market.

**90 days** — Day 30: the current enquiry→delivery path mapped as it *actually*
runs. Day 60: the 48-hour promise either operationally real or removed from
all 31 pages. Day 90: an intake that can be handed to someone else.

**Do not hire before 1.1 ships.** There is no order to design around.

## 1.4 — Analytics · the day the backend ships, not before

0 analytics installed today — verified. The notice already says so:

> "We do not run third-party analytics, advertising pixels, social trackers or
> fingerprinting on any Beta Art site." — `legal.html`, *Privacy worldwide*

**If analytics is installed, that sentence becomes false the same hour.** This
is a `claims.py` matter before it is a data matter. Not a hire — a decision
plus a day of work, and a notice edit in the same commit.

## 1.5 — Growth / SEO · **later than the instinct says**

> "Traffic to a site that cannot take money is a cost." — `docs/10-team.md`

SEO is already done and measured — sitemaps, canonicals, hreflang, structured
data. Do not hire this until 1.1 and 1.4 exist.

---

# 2 · NAVIAR marka hattı (NAVIAR-001 … 026)

Grounded in the uploaded standard v1.0.

## 2.1 — Trademark Clearance Analyst · **the only role the standard cannot run without**

**Owns.** §3–§5 of the standard: Patentstyret, EUIPO/TMview, TMclass, WIPO
Global Brand Database, Vienna codes — and the evidence record for **every**
hit: date, class, record number, owner, risk rating, reviewer, rationale.

**Why this and not a designer:** the standard's own rule is that no file may
be marked `TESCİLE HAZIR` until every gate is evidenced. **The gate is the
search, not the drawing.** 26 projects × identity + variants + services +
three registries is not a designer's side task.

| | |
|---|---|
| **Level** | Mid. IP paralegal or trademark searcher, not an attorney |
| **Reports to** | Betül; escalates to an IP attorney on high-risk hits |
| **Employment** | **Consultant, per project or per batch.** 26 projects is a defined scope, not a permanent seat |

**Must have** — Patentstyret, TMview and WIPO GBD in practice; Nice
classification via TMclass; Vienna classification for figurative elements;
**dated, reproducible evidence records**; and understanding that word marks and
figurative marks are separate applications (§3 Norway, rule 5).

**Nice to have** — Norwegian; Vienna Assistant; the difference between a
clearance search and a registrability opinion.

**90 days** — Day 30: evidence template live, first 5 projects cleared through
all three registries. Day 60: 15 cleared, high-risk hits escalated. Day 90: all
26 have a dated status — `CLEARED`, `REVISE`, or `FILING HOLD` — **and none is
marked ready without every gate evidenced.**

**Screen hard for this:** the standard says WIPO *"is not a complete real-time
display of every global mark"* and requires national registers to be searched
separately. A candidate who treats one WIPO search as clearance has failed the
interview.

## 2.2 — Vector/Brand Production Designer · after clearance, not before

Owns the deterministic vector master: closed paths, outlined wording, no
external dependencies. Figma/Canva/Adobe for demonstration only — the filing
master stays vector-controlled.

**Employment:** consultant, per project. **Do not start before 2.1 clears the
name** — designing 26 marks and then discovering a conflict is the expensive
order.

---

# 3 · Naviar Care

## ⚠ I cannot write a hiring spec for this yet, and here is exactly why

Everything I know is two sentences from conversation. `docs/10-team.md:140–147`
already flagged this and the answer never came:

> "A care-coordination platform is a different risk profile, a different
> regulatory position (health-adjacent data, vulnerable users, duty of care)
> and a different team shape. So: is that a fourth Beta Art property, a
> separate company, or was it an example?"

What I can say without inventing anything: **the hiring order inverts.** For a
photography archive, Trust & Safety and Accessibility come carefully but late.
For a platform where an elderly person is matched with a stranger who comes to
their home, they come **first** — before a designer, before growth, arguably
before a backend.

**Before a recruiter is briefed, these must be answered:**

1. Is this a Beta Art property, a separate company, or an idea?
2. Does it handle health data? The answer decides whether GDPR Art. 9 applies
   and changes every technical requirement.
3. Is there a duty of care to the elderly user, and who carries it — the
   platform or the provider?
4. Are providers vetted? By whom, against what, and who is liable when the
   vetting misses something?
5. Which market first? Norway alone is a different build from Norway + EU.

**Questions 3 and 4 are not product questions.** They decide whether you are
running a marketplace or a care service, and those have different regulators.
A role spec written before they are answered will describe the wrong job.

---

# 4 · Employment forms, taken separately

You asked for all four. **The same constraint applies to all of them** and it
is not a technicality:

`launch.py` records the company as *"decided: after the project. Until then
there is no organisation number, so no Stripe account, no legal invoice and no
VAT registration — and the site must keep saying so."*

| Form | Works before Brønnøysund? | Notes |
|---|---|---|
| **Consultant / day rate** | **Yes** | The only one that starts now. They invoice *their* company. **Written IP assignment is mandatory** — the standard requires designer assignment on file (§4 rule 9), and a photography archive needs it too |
| **Full-time employee** | **No** | Needs an org number for the contract, payroll, tax withholding and OTP pension. Can be *offered* and dated, cannot be signed |
| **Partner / equity** | **Not yet** | Needs the entity to exist to have shares. A sole enterprise (*enkeltpersonforetak*) has none — becoming an AS is a prior decision, not a hiring one |
| **Intern / student project** | **Yes, with a limit** | Cheapest and slowest. **Must not touch the model release or the consent record** — those are legal records and an unsupervised student is the wrong custodian |

**Recommendation:** consultant for 1.1, 1.3, 2.1 and 2.2. Research (1.2) is
yours. Revisit employment when the org number exists.

---

# 5 · Still open for the recruiter

**Blocking — no sourcing until answered:**

1. **Budget.** No day rate or salary band is set anywhere in this repository.
   Nothing can be advertised without one.
2. **Naviar Care's five questions** (§3) — if that product is in scope.
3. **Remote or Oslo?** Not decided. It halves or doubles the pool.
4. **Who conducts the technical interview?** There is no engineer to run one.
   Budget a paid trial task or an external reviewer.

**Non-blocking but needed before an offer:**

5. Start date, tied to the lawyer review (§1.0) rather than to a calendar.
6. Working language — the repository is English, the market is Norwegian, the
   owner writes Turkish. Say which is required and which is a bonus.
7. IP assignment wording, for every consultant.
8. Whether the trial task is paid. It should be; the honest ones ask.

**What the recruiter can be given today, as-is:**
`docs/10-team.md` (twenty roles against real work) · this file ·
`docs/21-research-memo-104-gdpr.md` (for the lawyer, not the recruiter) ·
`.claude/skills/run-beta-art/SKILL.md` (a candidate can have the site running
in one command, which is a better screen than a CV).
