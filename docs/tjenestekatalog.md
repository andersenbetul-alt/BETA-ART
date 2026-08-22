# Service backlog

Everything NAVIAR *could* sell inside its risk boundary, and is not selling
yet. The live catalogue is six career services (see `tjenestemodell.md` §3);
this file is what gets added to it, and only when somebody asks.

**Why it is a backlog and not a menu.** Low risk is not a reason to sell
everything at once. A customer has to be able to tell what NAVIAR does at a
glance, and a narrow line is one that can actually be delivered well twenty
times running. Every entry here has been through the same boundary check as the
live six — none of it is deferred because it is dangerous.

**Adding one back.** Add it to `services` in `assets/js/config.js`, add its
translation to `catalog` in all ten locale files, write its scope in
`leveranser/karriere/tjenester/`, and check the data tests still pass. The
deliverable test will fail if you sell something with no file behind it.

---

## 1. Career and job search

| Service | Delivery | Price |
|---|---|---|
| CV language and layout check | Spelling, structure, readability | 390 |
| Application text check | Feedback against one advert | 390 |
| **CV + application package** | One CV and one application reviewed | **790 — live** |
| **Mock interview** | 45 min interview practice | **590 — live** |
| **LinkedIn profile check** | Headline, About, experience | **390 — live** |
| Skills map | Transferable skills drawn out of past work | 290 |
| Job search plan | A personal 30-day plan | 290 |
| Employer research summary | A company summary from public sources | 249 |
| STAR answer pack | Five interview answers prepared | 390 |
| **Digital job-search setup** | Finn, LinkedIn and job alerts | **390 — live** |

Low risk for as long as the customer sends every application themselves. An AI
system that improves a candidate's own CV is not the same thing as a
recruitment system deciding on an employer's behalf, and the two are treated
differently.

## 2. Language and communication — 290–590

Norwegian interview practice · working vocabulary · help writing an email ·
preparing for a phone call · questions to take into a meeting · plain-language
rewriting of the customer's own text · everyday Norwegian–English–Turkish
support · presentation practice.

**Never sold as official interpreting.** Where a public body, health service or
legal meeting needs a qualified interpreter, the customer is referred to the
body, which assesses the need and orders one.

## 3. Digital and administrative support — 249–590

| Service | The safe scope |
|---|---|
| Finding the official web page | Showing the correct link, nothing more |
| Digital appointment guide | The customer completes it themselves |
| Document organisation | File naming and folder structure |
| PDF and scanning help | Technical help |
| Email draft | The customer checks it and sends it |
| Form preparation list | Organising what information may be needed |
| Digital account training | Without seeing a password or BankID |
| Meeting question list | Neutral, practical questions |
| Weekly task plan | An administrative to-do list |
| Official contact-channel guide | Finding the body's own published details |

NAVIAR never logs into a customer's BankID, never takes a password, never
submits a form, and never acts for the customer towards a public body.

Praktisk veiviser — the shelved 590 service — is this category. Its
translations are still in the locale files under `shelved`.

## 4. AI training and digital products

The scalable end, and the lowest risk of anything here.

A mini course on using AI to look for work · a safe-AI-use guide · CV prompt
pack · interview prompt pack · job tracker · application tracking sheet · STAR
workbook · LinkedIn profile templates · Norwegian job-search vocabulary pack ·
"the 30-day job search system".

| | Price |
|---|---|
| Single template | 49–99 |
| Small pack | 149 |
| **Full Career Kit** | **299 — live** |
| Video course + templates | 490 |

Most of the Career Kit's contents already exist in `leveranser/karriere/kit/`.
Selling any of them separately is repackaging, not new work.

## 5. Small business — phase two

Tidying meeting notes · writing down business processes · standard email
templates · a simple customer tracking sheet · a social-media content plan ·
competitor research from public sources · presentation and proposal documents ·
AI training · a document and folder system.

**Never:** accounting, tax, legal, HR decisions, financial advice.

This is a different customer, a different sales motion and a different support
load from everything above. It should not be started until the career line is
running.

---

## Data minimisation applies to every row

Collect only what the service actually needs. A CV and contact details are
taken only to the extent the service requires, and never in the first form.
