# Naviar Care

**Describe what is wrong in your own language, find out which specialist you
need, and reach a doctor who understands you — instead of waiting in a queue
for the wrong department.**

Most people who are seriously unwell do not go straight to the specialist who
can treat them. They wait, because getting an appointment is hard. They guess,
because nobody told them which specialty handles their symptom. Or they stay
silent, because explaining what hurts in a language they are still learning
feels impossible. Naviar Care exists to remove all three.

This repository is a working demonstration. The clinician roster and
availability are sample data; no consultation is booked and no payment is
taken. See [`COMPLIANCE.md`](COMPLIANCE.md) for what has to be true before it
can run for real.

---

## What it does

**Prepares you before you go.** A symptom check that runs entirely in your
browser, then writes up everything a doctor asks in the first two minutes —
medicines, allergies, existing conditions, what makes it better or worse, and
the questions you want answered. Print it and hand it over, whether you consult
here or walk into your own hospital.

**Sends you to the right specialty.** 73 complaints mapped across 28
specialties, weighted by age, duration and severity. The ranking is shown to
you rather than hidden, because a routing tool that will not explain itself is
not trustworthy.

**Stops when it should.** Red-flag questions catch emergencies and say plainly
to contact emergency services, rather than offering an appointment. The
threshold for "emergency" is deliberately hard to reach without one, so that
the warning still means something when it appears.

**Works in your language.** 113 consultation languages. Where a doctor speaks
yours, you talk to them directly; where none is free, a medical interpreter
joins the same call. The interface itself is translated into English, Turkish,
Spanish and Arabic, with right-to-left support.

**Reaches any doctor, anywhere.** Medical licensure follows the patient, so a
doctor may only diagnose and prescribe where *you* are. Naviar Care never uses
that to hide a clinician from you: every doctor is reachable from every
country, and what changes is the session — a full consultation where they are
licensed, a second opinion where they are not. You are told which before you
pay.

**Pays doctors properly.** The clinician sets their fee and keeps all of it.
The platform fee is a separate flat amount, never a percentage of clinical
revenue — sharing in a doctor's professional fee is unlawful fee-splitting in
several jurisdictions, and it gives a commercial party an interest in clinical
decisions.

---

## Running it

It is a static site with no build step.

```bash
npm run serve      # http://localhost:8000
npm test           # engine, source and dictionary checks
node tests/e2e/smoke.js   # browser tests (needs Chromium)
```

---

## How it is put together

```
index.html            home
triage.html           symptom check and pre-visit summary
booking.html          doctor directory, profiles, booking and payment
consultation.html     end-to-end encrypted consultation room
join.html             clinician registration (an application, not a sign-up)
languages.html        every language covered, and how
feedback.html         post-consultation feedback, both sides
legal.html            what we may do, and how long records are kept
about.html            why this exists, safety, privacy, contact
COMPLIANCE.md         the regulatory review behind the design

assets/js/
  triage-engine.js    symptom -> specialty routing        (pure, tested)
  booking-engine.js   matching, session mode, pricing     (pure, tested)
  i18n.js             language detection, loading, RTL
  config.js           per-market pricing and video config
  data-*.js           specialties, symptoms, languages, countries,
                      clinicians, statutory retention
  *-ui.js             one controller per page
  i18n/<lang>.js      one dictionary per language
```

The two engines hold no DOM references, so they run under Node for the test
suite and in the browser unchanged.

### Decisions worth knowing about

**The routing engine is rules-based, not machine learning.** That is
deliberate. Emergency patient triage is explicitly high-risk under the EU AI
Act, so replacing the weighting table with a model pulls the product into a
second regulatory regime on top of medical devices. Keep it deterministic
unless you mean to take that on.

**The symptom check never leaves the device.** Nothing is transmitted while a
patient answers — the highest-volume, most sensitive interaction generates no
server-side record at all. Preserve that as the architecture grows.

**Video defaults to self-hosted and end-to-end encrypted.** With self-hosting
no third party holds patient audio or video. The consultation page states
plainly when the configured server is a public one and therefore unfit for real
patients, rather than reassuring you falsely. Whereby and Daily are supported
by the same adapter.

**Retention is a duty, not a promise.** Medical records law sets minimum
retention periods that override a patient's right to erasure. `data-retention.js`
holds a per-country schedule with a separate rule for children, and the legal
page explains why a deletion request may have to be refused.

---

## Tests

```
tests/triage.test.js    31  routing, urgency thresholds, multilingual search
tests/booking.test.js   47  matching, session modes, pricing, retention
tests/lint.test.js      16  chrome drift, links, dictionary parity
tests/e2e/smoke.js      34  the real pages in Chromium
```

Two are worth calling out. One asserts that **every clinician stays reachable
from every country** — the founding requirement, encoded so it cannot be
quietly regressed. Another checks that **`{placeholders}` survive translation**,
so a dropped variable fails the build instead of rendering a sentence with a
hole in it.

---

## Adding a language

1. Copy `assets/js/i18n/en.js` and translate the values.
2. Add the code to `UI_LANGUAGES` in `assets/js/i18n.js`.
3. For a right-to-left language, add it to `RTL_LANGS` in the same file.
4. Run `npm test` — the dictionary checks will name anything missing.

Missing keys fall back to English rather than showing a raw key, so a partial
translation degrades gracefully. The tests require completeness before a
language ships.

---

## Before this could serve a real patient

Summarised from [`COMPLIANCE.md`](COMPLIANCE.md):

- A written device-classification opinion for each launch market. Patient-facing
  triage is likely a regulated medical device in both the EU and the US, and
  this decision gates everything else.
- An operating structure per country. Türkiye requires remote consultations to
  run through a licensed health facility, not an individual doctor.
- Licence verification against the relevant medical registers, and re-checks.
- A DPIA, a DPO, and processor agreements that reach the interpreters.
- A licensed payment provider with marketplace split payments.
- Clinical governance: a named responsible clinician, an incident procedure,
  and practising clinicians reviewing the routing table.

Every figure and legal claim in that document is cited, and none of it is a
substitute for a qualified healthcare regulatory lawyer.
