# Naviar Care — regulatory review

**Status: research summary, not legal advice.** This document was compiled from public
regulatory sources to identify which laws govern the service and which product decisions
they constrain. Every jurisdiction you launch in needs sign-off from a qualified
healthcare regulatory lawyer before you take a single real patient. Sources are listed
at the end.

---

## 1. The finding that shapes the whole product

**A symptom checker that tells a patient how urgent their problem is, or which
specialty they need, is very likely a regulated medical device — in both the EU and
the US.** This is not a disclaimer problem. It is a market-access problem, and it
determines your cost, timeline and launch order.

| Framework | Position | Consequence |
|---|---|---|
| **EU MDR, Rule 11** | Software providing information used to take decisions with a diagnostic or therapeutic purpose is **Class IIa**. It rises to **Class IIb** if a wrong output could cause serious deterioration, and **Class III** if it could cause death or irreversible harm. | Notified Body involvement, ISO 13485 quality system, IEC 62304 software lifecycle, clinical evaluation, post-market surveillance. Typically 12–24 months and six figures. |
| **FDA (US)** | The 21st Century Cures Act "non-device CDS" exemption applies **only to software intended for healthcare professionals**. Software giving recommendations directly to patients or carers does **not** qualify and is generally a device. | A patient-facing triage tool is regulated. Expect a 510(k) or De Novo pathway. |
| **EU AI Act, Annex III 5(d)** | "Emergency healthcare patient triage systems" are explicitly **high-risk**. | If any part of the routing becomes AI/ML-based, high-risk obligations apply *in addition* to MDR. Obligations for standalone Annex III systems now apply from **2 December 2027**. |
| **UK** | Post-Brexit UKCA marking under the UK MDR 2002, MHRA oversight. | A separate conformity route from the EU. |

**Note on the current engine.** Naviar Care's router is a deterministic, rules-based
weighting table — it is *not* machine learning. That keeps it outside the AI Act's
high-risk regime today, and that is a property worth protecting deliberately. Replacing
the rules engine with an ML model is not a purely technical decision; it pulls the
product into a second regulatory regime.

### The positioning choice you actually have

The regulatory burden turns almost entirely on **what the output claims to be**:

- **Clinical triage** — "this is urgent, you need cardiology." Highest value to the
  patient, and squarely a medical device.
- **Preparation and navigation** — "here is your symptom history written up for your
  appointment, and here is which department usually handles this." Far weaker device
  argument, because the tool organises information rather than directing care.

Your stated purpose — *taking people out of hospital queues and preparing their
information before they see a doctor* — sits in the second category. **That is a
genuine regulatory advantage and the product should be built to stay in it.**

**Recommendation.** Ship the preparation-and-navigation product first. It reaches
patients while the device pathway for clinical triage runs in parallel. Keep the two
functions separable in the codebase so the regulated component can be certified,
versioned and audited on its own.

### Emergency safety-netting is the exception — keep it

Warning-sign checks that say "stop and call emergency services" should stay in the
product regardless of positioning. Withholding a safety net to reduce regulatory
exposure is the wrong trade, and general safety signposting is a far weaker device
argument than a differential diagnosis. Keep it conservative and non-diagnostic:
it should say *"this needs urgent attention"*, never *"you are having a heart attack."*

---

## 2. Who is allowed to treat whom

**The governing rule in cross-border telemedicine is the location of the patient.** A
clinician must generally be licensed in the jurisdiction where the patient is *at the
time of the consultation* — not where the clinician sits, and not where the company is
incorporated.

### Reconciling this with worldwide access to any doctor

The product requirement is that **any person can reach any doctor they choose, anywhere
in the world.** That requirement and the licensure rule are compatible, because the rule
constrains what a clinician may *do*, not who they may *talk to*.

The distinction that matters is **treatment versus information**:

| | Clinician licensed where the patient is | Clinician not licensed there |
|---|---|---|
| **What they may do** | Full consultation: assess, diagnose, treat, prescribe where local law allows | Medical information, second opinion, explaining test results, and preparing the patient for their own doctor |
| **What it is called** | A consultation | An informational or second-opinion session |
| **Reach** | Worldwide | Worldwide |

So the platform should **never block a patient from reaching a doctor**. It should set
the **mode of the session** correctly, disclose it plainly before booking, and hold the
clinician to it. This is how established international second-opinion services already
operate, and it preserves the founding goal: a patient in any country can reach the
specific doctor they want, in their own language.

Consequences for the build:

- Capture the **patient's country** at intake — to *label the session*, never to hide
  clinicians from them.
- Store each clinician's **licence number, issuing authority and jurisdictions of
  practice**, and verify them against the relevant medical register before activation.
- Re-verify on a schedule; licences lapse and are suspended.
- Derive the session mode from patient country against clinician jurisdictions, show it
  on the clinician card **before** booking, and record the patient's acknowledgement.
- Bind prescribing and sick notes to the full-consultation mode only.
- Make second-opinion mode a first-class product, not an apology: for a patient stuck in
  a hospital queue, an informed second opinion from the right specialist is often exactly
  what they came for.

### Türkiye specifically

Türkiye's *Uzaktan Sağlık Hizmetlerinin Sunumu Hakkında Yönetmelik* (Official Gazette,
10 February 2022) is strict on structure:

- Remote health services may only be provided by **health facilities holding a distance
  health service activity permit from the Ministry of Health**. A platform cannot simply
  let independent doctors sign up and start consulting — the *facility* is the licensed
  entity.
- A facility may not provide remote services in a field it is not authorised for.
- **No audio or video recording without the explicit consent of both parties**, and no
  photographs during the consultation.
- If a third party can see or hear the consultation — **including an interpreter** —
  both sides must be informed. Build interpreter presence into the consent flow, not
  into the small print.
- Foreign physicians face separate restrictions on practising in Türkiye.

**This means the clinician self-registration flow cannot be an open door.** It is an
*application*, gated on licence verification and on the operating entity holding the
right permit.

---

## 3. Health data

Symptom data is health data, which is special-category data nearly everywhere.

**GDPR (EU/EEA)**
- Article 9 special category: you need an Article 6 lawful basis **and** an Article 9
  condition — for a commercial platform, usually **explicit consent**, which must be a
  clear affirmative act, specific, informed, documented and withdrawable. A pre-ticked
  box or buried terms link does not qualify.
- A **DPIA is mandatory** here: large-scale health data, and data used to determine
  access to a service.
- Data processing agreements must name the special-category nature of the data and pass
  equivalent safeguards down the chain — **including to interpreters**.
- International transfers need a valid mechanism; a global clinician roster means
  transfers by design, not by accident.

**KVKK (Türkiye)** treats health data as special-category with its own rules, and
localisation expectations differ from the GDPR. Do not assume GDPR compliance satisfies
KVKK.

**HIPAA (US)** applies where the platform acts as a covered entity or business
associate — largely a function of how billing and provider relationships are arranged.

### What this repository already does well

The symptom intake runs **entirely client-side**. Nothing is transmitted while the
patient answers. That is a real privacy property, not a marketing line, and it is worth
keeping as the architecture grows: it means the highest-volume, most sensitive
interaction generates no server-side health record at all. Preserve it.

---

## 4. Taking a commission on consultations

The intended model is that the patient pays the doctor for the consultation and Naviar
Care takes a **percentage commission**. This is the ordinary marketplace model, and in
healthcare it runs into a specific prohibition that catches many digital-health startups.

### Fee-splitting is the problem, not the commission itself

Many jurisdictions — including a large number of US states — prohibit a physician from
sharing their professional fee with anyone who did not take part in delivering the care.
The prohibition exists to stop a non-clinician's commercial interest from influencing
clinical judgement.

The distinction regulators draw is blunt and consistent:

- A **flat fee for administrative services actually provided** is generally acceptable.
- A **percentage of clinical revenue** is treated as payment for referrals, and is a
  classic fee-splitting violation. One state medical board has treated a 20% sweep of
  gross collections as exactly that.

Related exposure: anti-kickback and patient-brokering rules, which in some places carry
criminal penalties for paying for patient referrals.

Consequences of getting it wrong are not limited to the platform — they reach the
doctors, whose licences are at risk, which makes it a recruitment problem as well as a
legal one.

### Structures that are normally used instead

1. **Flat per-consultation platform fee.** The simplest fix. The patient pays the doctor;
   Naviar Care charges a fixed amount per completed consultation for scheduling,
   interpretation, hosting and support. Set it at fair market value and be able to show
   the working.
2. **Subscription for clinicians.** A monthly platform fee, independent of consultation
   volume. Cleanest of all, but harder to sell to clinicians early on.
3. **MSO / friendly-PC structure.** The standard US arrangement: a professional entity
   owned by licensed clinicians employs the doctors and bills the patients, while Naviar
   Care provides management services under an agreement at fair market value. Widely used
   and well understood, but it needs to be set up properly by counsel.
4. **Patient-side fee.** Charge the patient a booking or interpretation fee that is
   separate from the clinical fee, and take nothing out of the doctor's payment.

**Recommendation.** Keep percentage commission for markets where you have confirmed it
is lawful, and default to a **flat per-consultation fee** — with an interpretation fee
charged to the patient side where an interpreter is used, since that is a genuine
platform cost and not clinical revenue. Make the commercial model a **per-market
configuration value**, not a hard-coded percentage: this will differ by country and
you will not want a code change each time.

### Payments, tax and invoicing

- **Handling other people's money makes you a payment intermediary.** Either obtain the
  relevant licence or, far more practically, use a licensed provider with marketplace
  split-payment support so funds never rest in your accounts.
- **VAT.** Healthcare services are VAT-exempt in many countries; **platform commission
  usually is not**. The two halves of the transaction may be taxed differently, and
  cross-border supply rules decide where the tax is due.
- **Who invoices the patient** — the doctor or the platform — follows from the structure
  chosen above, and changes both the tax treatment and who carries clinical liability.
- **Refunds and no-shows.** Write the policy before launch; a patient charged for a
  consultation that never happened is a complaint to a medical board, not just a
  chargeback.
- **Price transparency.** The fee, the platform charge and anything added for
  interpretation must be visible before the patient confirms. Several of the markets
  named here require it, and it is the right thing to do regardless.

---

## 5. Retention: how long records must be kept

Retention runs in two directions at once, and both are legal duties.

- **Health law says keep it.** Medical records carry statutory minimum retention
  periods, set nationally. Türkiye's rules on personal health data require health
  service providers to hold health data for at least 20 years. The UK reaches 20 years
  or longer for many record types. The Netherlands requires 20 years from the last
  visit. Ireland is nearer 8. HIPAA itself sets no retention period for patient records
  — it mandates 6 years for compliance documentation and leaves records to state law,
  which ranges from about 3 to over 20 years.
- **Data protection law says do not keep it longer than necessary.** Storage limitation
  under the GDPR, and the equivalent under KVKK.

**The important interaction:** a statutory retention duty *overrides* a patient's
right to erasure. When a patient asks you to delete a consultation record, the lawful
answer in most markets is that you cannot until the retention period expires — and you
must be able to say which law requires it. A system that simply honours delete requests
is not more privacy-friendly; it is unlawful.

**Children's records run longer.** The clock typically extends to adulthood plus the
limitation period — commonly to age 25 or 26 — because a child cannot bring a claim
until they can act for themselves. Paediatric routing therefore changes the retention
class of the record.

Implemented in `assets/js/data-retention.js`: a per-country schedule with a
conservative default, a separate rule for minors, and a function returning the exact
date a record becomes eligible for deletion. The figures are compiled from public
sources and need confirmation by local counsel per market.

What still has to be built server-side, once there is a server:
- Retention metadata stamped on every record at creation, not applied later in a sweep.
- Automatic deletion at expiry, with an audit trail of what was deleted and under which rule.
- A legal-hold flag that suspends deletion during a complaint, claim or investigation.
- Consent records retained on their own clock — you must be able to prove consent for as
  long as you rely on it, and afterwards for the limitation period.

---

## 6. The rest of the legal register

These apply to the platform as a business, beyond the clinical questions above.

**Platform and content**
- **EU Digital Services Act.** Naviar Care hosts clinician-authored profiles and
  patient reviews, which makes it an intermediary with notice-and-action, transparency
  and complaint-handling duties.
- **Reviews and ratings.** Under the Omnibus Directive amendments to the Unfair
  Commercial Practices Directive, fake reviews are prohibited outright, and so is
  manipulation such as publishing only favourable reviews or removing unfavourable ones
  without justification. Labels like "verified" must be backed by an actual verification
  mechanism, and you must disclose how ratings are aggregated. **This bites directly:
  the star ratings on the clinician cards must come from real, verified consultations,
  and the aggregation method must be stated.** The two-sided feedback flow is what makes
  that possible.
- **Advertising health services.** Restricted in many markets and notably strict in
  Türkiye. Efficacy and speed claims need substantiation and local review.

**Security**
- **NIS2.** The health sector is an *essential entity* under NIS2, with the highest
  level of scrutiny — risk management measures, incident reporting, supply-chain
  security, and **personal liability for management**, including possible suspension.
  Penalties reach €10 million or 2% of global turnover. Digital health service providers
  are explicitly in scope. Member States transposed it from October 2024.
- Encryption in transit and at rest, access control, audit logging, and penetration
  testing are table stakes, not differentiators.

**Consumers, employment, access**
- **Consumer law.** Distance-selling information duties and cancellation rights, with
  the usual carve-outs for services already performed.
- **Clinician status.** Whether the doctors are contractors or employees is a
  misclassification risk with tax and employment consequences, and it interacts with the
  fee-splitting structures in §4.
- **Professional indemnity.** Cover must be valid for telemedicine and for the patient's
  jurisdiction. Verify at registration.
- **Accessibility.** The European Accessibility Act applies to consumer digital
  services; WCAG 2.2 AA is the practical target. For a service whose stated purpose is
  reaching people who are already poorly served, this is core, not cosmetic.
- **Children.** GDPR Article 8 on children's data, plus parental consent for paediatric
  consultations, with rules that vary by country.

---

## 7. Everything else that will come up

- **Prescribing.** Cross-border prescriptions are frequently not recognised, and
  controlled substances are heavily restricted almost everywhere. Never promise
  prescriptions in marketing copy; let the clinician state what is possible in that
  patient's country, during the consultation.
- **Professional indemnity.** Clinicians need cover valid for telemedicine *and* for
  the patient's jurisdiction. Verify at registration, not after a claim.
- **Advertising health services.** Türkiye in particular restricts advertising of health
  services. Claims such as "the right specialist, first time" and any success or speed
  statistic must be substantiated and reviewed locally.
- **Medical records.** Retention periods are set nationally and vary widely. The patient's
  right to their own notes is close to universal.
- **Interpreters.** Bind them by the same confidentiality duty as clinicians, contractually
  and in the consent flow. Machine translation of clinical content is a patient-safety
  risk, not a cost saving.
- **Accessibility.** The European Accessibility Act applies to consumer digital services;
  WCAG 2.2 AA is the practical target. This is also a fair-access issue given the
  service's stated purpose.
- **Minors and capacity.** Paediatric routing means consent from a parent or guardian,
  with its own rules per country.

---

## 8. What was changed in the product as a result

| Change | Why |
|---|---|
| Repositioned as **pre-visit preparation and navigation** | Keeps the launch product out of the heaviest device classification, and matches the stated purpose of reducing hospital queues |
| Added a **pre-visit summary** the patient takes to their appointment | The deliverable of a preparation tool, and useful even where no consultation happens |
| Routing output labelled as **guidance on where to start, never a diagnosis** | Device-scope and patient-safety reasons |
| Emergency red-flag safety-netting **retained** and kept non-diagnostic | Safety, without adding a diagnostic claim |
| **Patient country** captured and used to set the session mode, never to hide clinicians | Location-of-patient licensure rule, without restricting worldwide reach |
| **Session mode** (full consultation vs. second opinion) shown on every clinician card before booking | Patients must know what they are buying; clinicians must stay inside their licence |
| Clinician registration rebuilt as a **verified application** with licence number, issuing authority and jurisdictions | Licensure and the Turkish facility-permit structure |
| **Explicit, unbundled consent** for health data before any booking | GDPR Article 9 |
| **Interpreter presence disclosed** in the consent flow | Turkish third-party disclosure rule, and GDPR transparency |
| Rules-based engine kept **non-ML**, and that documented | Avoids EU AI Act high-risk classification by design |
| Recording stated as **off by default, both parties must consent** | Turkish regulation |
| Consultation **fee, platform fee and total shown before confirming** | Price transparency, and fee-splitting exposure is reduced by charging a stated flat platform fee rather than a silent cut |
| Commercial model held as **configuration, not a hard-coded percentage** | It must vary per market, because percentage commission is unlawful in some of them |
| **Statutory retention schedule** per country, with a separate rule for minors | Medical records law; and erasure requests must be refused lawfully, not silently |
| Video defaults to a **self-hosted, end-to-end encrypted** deployment | No third party holds patient data, removing processor and transfer exposure |
| Ratings shown only from **completed consultations**, with the method stated | Omnibus Directive prohibition on review manipulation |

---

## 9. Before launch — open items for counsel

1. Confirm the intended-purpose statement, and get a written device-classification
   opinion for each launch market. This is the gating decision.
2. Choose the operating structure per country: does Naviar Care become a licensed
   health facility, or partner with one? Türkiye effectively requires the latter.
3. Get the second-opinion / medical-information mode reviewed in each major market.
   The boundary between "information" and "practising medicine" is drawn differently
   from country to country, and this mode is what makes worldwide reach lawful.
4. Complete a DPIA and appoint a DPO.
5. Stand up licence verification against the relevant medical registers.
6. Have local counsel review all marketing claims, especially efficacy and speed.
7. Put clinical governance in place: a named responsible clinician, an incident
   procedure, and scheduled review of the routing table by practising clinicians.
8. Decide the retention schedule per jurisdiction.

---

## Sources

- [MDCG 2019-11 — qualification and classification of software (European Commission)](https://health.ec.europa.eu/system/files/2020-09/md_mdcg_2019_11_guidance_en_0.pdf)
- [EU MDR Rule 11 software classification](https://blog.johner-institute.com/regulatory-affairs/mdr-rule-11/)
- [Is a symptom checker a medical device?](https://qualihq.com/guides/is-a-symptom-checker-a-medical-device)
- [FDA — Clinical Decision Support Software guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software)
- [FDA issues key updates to CDS software guidance (Snell & Wilmer)](https://www.swlaw.com/publication/fda-issues-key-updates-to-cds-software-guidance/)
- [EU AI Act, Annex III — high-risk AI systems](https://artificialintelligenceact.eu/annex/3/)
- [EU draft guidelines on high-risk AI classification for digital health (Osborne Clarke)](https://www.osborneclarke.com/insights/eu-draft-guidelines-sharpen-high-risk-ai-classification-medtech-and-digital-health)
- [Uzaktan Sağlık Hizmetlerinin Sunumu Hakkında Yönetmelik (T.C. Sağlık Bakanlığı)](https://shgmturizmdb.saglik.gov.tr/TR-87377/uzaktan-saglik-hizmetlerinin-sunumu-hakkinda-yonetmelik.html)
- [Turkey publishes the Regulation on the Provision of Distance Health Services (Esin Attorney Partnership)](https://www.esin.av.tr/2022/02/16/turkey-publishes-the-regulation-on-the-provision-of-distance-health-services-and-the-regulation-on-the-cascading-of-health-service-providers/)
- [Healthcare regulation in Türkiye (Gün + Partners)](https://gun.av.tr/insights/guides/healthcare-regulation-2024-in-turkey)
- [Telemedicine across national borders — key regulations](https://doctorshome.com/telemedicine-across-national-borders-key-regulations/)
- [Cross-state licensing and professional requirements (CCHP)](https://www.cchpca.org/topic/cross-state-licensing-professional-requirements/)
- [Cross-border prescribing — legal and logistical challenges](https://securemedical.com/telemedicine/cross-border-prescribing-legal-and-logistical-challenges-in-international-telehealth/)
- [GDPR Article 9 — special categories of data](https://www.legiscope.com/blog/gdpr-article-9-special-categories.html)
- [GDPR compliance for cross-border patient platforms](https://www.patientpartner.com/blog/gdpr-compliance-for-cross-border-patient-platforms)
- [Corporate practice of medicine and fee-splitting (American Bar Association)](https://www.americanbar.org/groups/health_law/resources/health-lawyer/archive/what-corporate-practice-medicine-fee-splitting-fee-splitting-prohibitions/)
- [Corporate practice of medicine and fee splitting — considerations for telehealth ventures (O'Neil Cannon)](https://www.wilaw.com/ochdl-health-law-advisor-corporate-practice-of-medicine-and-fee-splitting-considerations-for-telehealth-ventures/)
- [Unlicensed practice, fee-splitting and other legal hazards (FON Consulting)](https://fonconsulting.com/telemedicine-legal-series-part-7-unlicensed-practice-fee-splitting-other-legal-hazards/)
- [The corporate practice of medicine — 50-state guide (Permit Health)](https://www.permithealth.com/post/the-corporate-practice-of-medicine-50-state-guide)
- [HIPAA retention requirements (HIPAA Journal)](https://www.hipaajournal.com/hipaa-retention-requirements/)
- [Retention of medical records — a short guide (UK)](https://accessrecordsmanagement.co.uk/retention-of-medical-records/)
- [Records retention: Turkey (Gün + Partners / Practical Law)](https://www.gurkaynak.av.tr/docs/cc68a-records-retention-turkey.pdf)
- [Medical records law in Turkey](https://istanbullawyerfirm.com/blog/medical-record-law-turkey)
- [NIS2 Directive — health sector implications](https://nis2directive.eu/health/)
- [The NIS2 Directive — implications for healthcare and medical device manufacturers (Fieldfisher)](https://www.fieldfisher.com/en/insights/the-nis-2-directive-implications-for-the-healthcare-sector-and-manufacturers-of-medical-devices)
- [The legal status of ratings and reviews under EU consumer law](https://key-g.com/blog/legal-status-ratings-reviews-eu-consumer-law)
- [How to make online reviews more reliable (BEUC)](https://www.beuc.eu/sites/default/files/publications/BEUC-X-2025-027_how_to_make_online_reviews_more_reliable.pdf)
- [HIPAA-compliant video conferencing platforms](https://curogram.com/blog/hipaa-compliant-video-conferencing-platforms)
- [Open-source video conferencing for secure telemedicine](https://jitsi.support/comparison/top-open-source-video-conferencing-solutions-secure-telemedicine/)
