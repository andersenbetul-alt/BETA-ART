# Interview kit — Backend Developer

**Prepared:** 2026-08-24 · For `docs/22-role-specs.md` §1.1

`docs/22` §5 lists this as blocking: *"Who conducts the technical interview?
There is no engineer to run one."* This solves it. **The work sample replaces
the engineer** — it is drawn from the real repository, and it grades itself,
because 14 gates already say whether the work is correct.

---

## 1 · What we are actually testing

Four competencies, from the spec. Nothing else is scored.

| # | Competency | Why it is on the list |
|---|---|---|
| **C1** | **Treats a record as a record** | The model release is a legal document, not a contact form. Someone who ships a POST and calls it done has failed the job, not the interview |
| **C2** | **Restraint with dependencies** | `CLAUDE.md`: *"a dependency added here is a dependency in perpetuity."* A candidate who reaches for a framework has misread the project |
| **C3** | **Reads before arguing** | 14 gates exist and each came from a real mistake. Disagreeing is fine; disagreeing without reading is not |
| **C4** | **Says what is not done** | This project's whole discipline. `forms.py` exists because three forms claimed a delivery they never made |

---

## 2 · The three stages

### Stage 1 — Conversation, 45 minutes (you)

No technical grilling. You are testing C3 and C4, both of which you can judge
without being an engineer.

**Open:** "This repository has 102 pages, no framework, no build step and zero
backend. What's your first question?"
→ *A good candidate asks what the forms are supposed to do, or who the users
are. A weak one asks which framework we'll use.*

**C3 — reads before arguing.** Send `tools/forms.py` beforehand — the docstring
alone. Then: "This gate fails any 'message received' sentence that sits outside
a `.then()`. Does that seem right to you?"
→ *Good: engages with the actual rule, maybe pushes on an edge case. Weak:
either flat agreement, or a general objection to linting.*

**C4 — says what is not done.** "Tell me about something you shipped that
wasn't finished. What did the user see?"
→ *Listen for whether they told anyone. This is the whole question.*

**C1 — record vs form.** "What's the difference between a contact form and a
consent record?"
→ *Good, unprompted: retrievability, timestamp, immutability, proving it later.
Weak: "you'd store it in a database."*

**C2 — dependencies.** "We have no build step. Would you add one?"
→ *Either answer can be right. Score the reasoning, not the side.*

### Stage 2 — Work sample, paid, ~3 hours

**Paid. Non-negotiable** — `docs/22` §5 item 8.

> **The task.** Clone the repository. Pick one form — `beta-art/release.html`
> is the interesting one. Give it somewhere to post, so that a submitted
> release becomes a record you can retrieve afterwards, with a timestamp.
>
> Constraints:
> - `python3 tools/check.py` must still exit zero. All 14 gates.
> - `tools/forms.py` must stay green. Read its docstring first.
> - No build step. No framework.
>
> Send us the diff and **three or four sentences on what you did not finish.**

**Why this task and not a puzzle:** it is the actual first deliverable from the
spec (§1.1, day 30). Whatever they build is either useful or it tells you they
are not right for it. No throwaway work either way.

### Stage 3 — Walkthrough, 30 minutes

They show you the diff and talk through it. **You do not need to read code** —
ask them to explain each decision, and judge whether the explanation makes
sense.

Two questions that do the work:
- "What would break first if this had a thousand submissions?"
- "If I deleted your endpoint tomorrow, what would the visitor see?"
  → *The second is C4 again. There is a right answer and it is in `forms.py`.*

---

## 3 · Scorecard

Score each 1–4. **A 1 on C1 or C4 ends it** regardless of the total — those two
are the job.

| | 1 · No | 2 · Weak | 3 · Yes | 4 · Strong |
|---|---|---|---|---|
| **C1 Record** | "It's a form" | Stores it, no retrieval story | Retrievable, timestamped | Raised retention or erasure unprompted |
| **C2 Dependencies** | Added a framework | Added a library without saying why | Used what was there | Removed something |
| **C3 Reads first** | Did not read the gate | Read it, no opinion | Read it, engaged | Found a case the gate misses |
| **C4 Says what is missing** | Claimed it was done | Mentioned gaps when asked | Volunteered them | Wrote them down without being asked |

**Gates as an objective check** — no engineer needed:

```bash
python3 tools/check.py          # 14 gates + browser. Exit zero, or it is not done
git diff --stat                 # how much did they touch that they did not need to?
```

A candidate whose diff touches the stylesheets has not understood the brief.

---

## 4 · What this kit does not cover

- **No compensation.** No band exists in this repository and no Norwegian
  salary source was reachable — SSB, Tekna, NITO and NAV are all blocked from
  this environment. `/comp-analysis` cannot be run. Decide the number before
  Stage 1, because it comes up in Stage 1.
- **No reference check.** That is yours.
- **No second technical opinion.** If the work sample is ambiguous, budget one
  external reviewer for one hour rather than guessing.
- **Norwegian language** is not tested. Decide whether it is required (`docs/22`
  §5 item 6) — the repository is English, the market is not.
