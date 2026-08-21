# Data Broker Removal — Working Reference

Compiled 2026-08-21. Opt-out URLs change frequently; re-verify any link that 404s.

## Step 0 — Do this first if you are a California resident

California's **DROP** (Delete Request and Opt-out Platform) replaces most of the manual
work below. One verified request is transmitted to every broker on the state registry
(~600 companies as of January 2026).

- Portal: <https://cppa.ca.gov/data_brokers/> (CalPrivacy / CPPA)
- Live to consumers since 2026-01-01.
- **Since 2026-08-01, brokers are legally required** to poll DROP at least every 45 days,
  delete matching records including derived inferences, and report status back.
- The request **re-runs every 45 days automatically**, so newly re-collected data gets
  deleted again without you resubmitting. This is the recurring enforcement loop.
- Non-registration fines were doubled by SB 361 to $200 per consumer per day.

DROP requires proof of California residency. If you are not a CA resident, skip to the
manual list; the statutory auto-recheck is not available to you and the per-site opt-outs
plus periodic manual re-checks are the realistic path.

## Tier 1 — Upstream aggregators

Removing yourself here can starve downstream people-search sites, which license from them.
Do these before the retail sites.

| Broker | Opt-out URL | Notes |
|---|---|---|
| LexisNexis | <https://optout.lexisnexis.com/> | "Information Suppression" request |
| LexisNexis Risk | <https://consumer.risk.lexisnexis.com/optrequest> | Separate from the above; do both |
| Acxiom | <https://www.acxiom.com/optout/> | Form at isapps.acxiom.com/optout/optout.aspx |
| Epsilon | <https://legal.epsilon.com/dsr/> | Also us.epsilon.com/privacy-policy/optout |

## Tier 2 — People-search sites

| Site | Opt-out URL | Verification |
|---|---|---|
| Whitepages | <https://www.whitepages.com/suppression-requests> | Automated phone call, 4-digit code. 1–2 business days |
| Spokeo | <https://www.spokeo.com/optout> | Email confirmation. 24–72 hours |
| BeenVerified | <https://www.beenverified.com/app/optout/search> | Email confirmation |
| PeopleConnect | <https://suppression.peopleconnect.us/login> | Covers Intelius, TruthFinder, Instant Checkmate, US Search in one request |
| Radaris | <https://radaris.com/control/privacy> | Account or phone verification |
| MyLife | <https://www.mylife.com/privacyrequest> | Often needs a follow-up email |
| PeopleFinders | <https://www.peoplefinders.com/opt-out> | Page is unlinked from site nav |
| FastPeopleSearch | <https://www.fastpeoplesearch.com/optout> | Email confirmation |
| TruePeopleSearch | <https://www.truepeoplesearch.com/removal> | Email confirmation |

Each broker is independent. Opting out of one has no effect on any other.

## Tier 3 — Marketing and credit prescreen

| Program | URL | Notes |
|---|---|---|
| Credit prescreen | <https://www.optoutprescreen.com/> | Or 1-888-567-8688. Five years online; permanent requires a signed mailed form |
| DMAchoice | <https://www.dmachoice.org/> | Direct mail, ~10 year term |

## Known limitations

- Records typically **reappear within 3–6 months** on manually opted-out sites. Outside
  California's DROP, opt-out is recurring maintenance, not a one-time task.
- The lists above are the major brokers, not all of them. Public directories track 500+.
- Most opt-out flows terminate in an email or SMS verification link sent to you. A request
  that is submitted but never verified does nothing, and the site will not tell you.

## Tracking

Log each submission: site, date submitted, verification completed y/n, date confirmed,
date last re-checked. Set a calendar reminder at 90 days for every Tier 2 site.
