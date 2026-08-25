# Worked example — MediTech Solutions IC model

The build the skill was derived from, end to end, including the two wrong
turns. 2026-08-25.

## The brief

$75M growth equity cheque at 3.6x ARR entry, 7.0x exit in year 5. Target:
$50M ARR, 35% growth, 18% EBITDA margin. Wanted: base/upside/downside,
growth x exit-multiple sensitivity, customer concentration risk, comps, in
Excel with real formulas and PE formatting. Data requested from Daloopa, S&P
Global and Box.

## What the data situation actually was

All three connectors were installed on the account and **toggled off for the
session**, so none of their tools loaded. Nothing could be pulled from them.

Rather than stop, the model was built from what could be sourced honestly:
two live web searches produced real trading multiples and real concentration
benchmarks, and everything else was labelled as given-by-client or
model-assumption. The gaps were written into the workbook as a red block, not
left implicit.

Sourced, with citation in-file:

| Company | EV/Revenue | Growth | As of |
| ------- | ---------- | ------ | ----- |
| Veeva Systems | 5.9x | 13% | Apr 2026 |
| Phreesia | 1.1x | 7% | May 2026 |
| Definitive Healthcare | 0.3x | -8% | Jul 2026 |

Plus: single customer >10% of ARR is a SaaS red flag; top-5 >30-40% is
elevated; concentrated revenue takes a 20-30% valuation discount in
diligence.

## Finding 1 — the exit assumption does not clear the comps

7.0x is 18.6% above Veeva, the sector's premium franchise, which earns 5.9x
on 13% growth. Built as a live formula on the Comps tab with conditional
formatting that turns red while the premium is positive, so it stays true if
someone edits the assumption.

## Finding 2 — the assumptions are internally inconsistent

Modelled exactly as stated, holding 35% growth flat for five years:

```
ARR:   50.0 -> 67.5 -> 91.1 -> 123.0 -> 166.1 -> 224.2
Exit EV = 7.0 x 224.2 = 1,569.4
Stake   = 1,569.4 x (75/180) = 653.9
MOIC    = 653.9 / 75 = 8.72x      IRR = 54.2%
```

Arithmetic correct, recalc clean, answer absurd. 8.7x is not a growth-equity
base case. Working backwards, the anomaly is the *entry*: 3.6x ARR for a 35%
grower, when Veeva gets 5.9x at 13%. Nobody sells that asset at that price
unless something is wrong with it or the growth does not last.

**Resolution:** growth decay added as a labelled scenario input (Downside 20%/yr,
Base 15%/yr, Upside 10%/yr), producing a defensible Base of 6.13x / 43.7%.
The decay row is an input the reader can zero out to reproduce the literal
brief, and a red block on the Assumptions tab explains why it exists and what
the literal case returns. Both numbers go to IC.

With a 25% concentration discount applied to the exit multiple, Base falls to
4.60x / 35.7%.

## Consistency trap this created

Adding decay meant four places had to change together:

1. Model tab ARR build — year-by-year `(1 + g x (1-d)^(t-1))`
2. Sensitivity MOIC grid — the `(1+g)^5` shortcut no longer matched
3. Sensitivity IRR grid — same
4. Concentration Risk MOIC — same

Missing any one leaves tabs that disagree while every one of them recalcs
clean. Caught by the cross-grid tie: the sensitivity cell at 35% growth /
7.0x exit reads 6.13, matching Model tab Base at 6.132.

## Verification actually performed

```
recalc.py  ->  {"status": "success", "total_errors": 0, "total_formulas": 151}
```

Then, independently in Python:

```python
arr = 50.0
for t in range(5): arr *= (1 + 0.35 * (0.85 ** t))   # 157.671
moic = (7.0 * arr * (75/180)) / 75                    # 6.132
```

Workbook reads ARR5 = 157.671, MOIC = 6.132. Ties. Sensitivity grid at
base-case coordinates reads 6.13. Ties.

## Final structure

| Tab | Holds |
| --- | ----- |
| Assumptions | Every input, blue/amber, with source note per row; derived entry EV and ownership; scenario table; red DATA NOT AVAILABLE block; red note on why decay is modelled |
| Model | Five-year ARR build per scenario, EBITDA ramp, exit EV, stake, MOIC, IRR |
| Sensitivity | Growth 15-40% x exit 3.0-8.0x, MOIC and IRR, colour-scaled |
| Comps | Three sourced comps, median, and the live premium-to-best-in-class test |
| Concentration Risk | Empty yellow inputs for real customer data, live threshold flags, and the MOIC impact of a 25% discount |
| Sources & Gaps | Every input labelled given / sourced / model assumption, plus what was requested and not obtained |

## Wrong turns worth remembering

**Reported `recalc.py`'s timeout at face value and raised the timeout.** Twice.
The real cause was that LibreOffice Calc was not installed — see
`environment.md`. A one-second failure is not a timeout.

**Nearly presented 8.7x as the answer.** The formulas were verified before the
plausibility of the result was. Check the headline against practitioner
intuition *first*; it is the cheapest test available and it caught the most
important finding in the engagement.
