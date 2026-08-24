# Promoting an observation to a gate

Load this before writing a new gate. Most of it is one lesson learned the hard
way: **a gate is defined by both halves — what it fails, and what it lets
through.** Testing only the first half ships a gate that is right about the bug
and wrong about the codebase.

## 1 · Does it qualify?

| The observation is… | Then |
|---|---|
| Mechanically checkable from files in the repo | **Write the gate.** |
| A design tension with no correct answer | Leave OPEN. Say in the entry why it cannot be a gate. |
| Blocked on a person — a lawyer, a photograph, a company registration | Leave OPEN. It belongs in `launch.py`, not `check.py`. |
| Already covered by an existing gate | Extend that gate. Do not add a second. |

Worked examples from the log:

- **Observation 2** (a token redefined silently) → checkable. Became
  `tokens.py`.
- **Observation 1** (a 12px floor and a fixed-width header are in direct
  tension) → *not* checkable. There is no right answer; both constraints are
  real. It stays OPEN so the next person meets it before they meet the bug.
- **Observation 5** (the archive's Norwegian page waits on a lawyer) → not a
  gate. A tool that marked it done would be lying about whether the site is
  ready.

## 2 · Where does it go?

Prefer extending an existing gate over creating a file:

| Kind of check | Home |
|---|---|
| HTML structure | `audit.py` |
| CSS custom properties, type scale | `tokens.py` |
| Class names against reachable rules | `classes.py` |
| JS, i18n arrays, prices, hosts, shipped file sizes | `qc.py` |
| A page's promise vs. the legal notice | `claims.py` |
| Norwegian language quality | `klarsprak.py` |
| Catalogue records | `plates.py` |

A new file is right only when the check is a genuinely new *class* of mistake
with its own vocabulary — `classes.py` earned one; `check_generator_hosts` did
not and lives inside `qc.py`.

## 3 · Write the docstring first

Every gate here opens with why it exists, in prose, naming the incident and the
numbers. This is not decoration. Six months from now the docstring is the only
thing standing between a confusing failure and someone deleting the gate.

Follow the existing shape:

    """One line: what must be true.

    This gate exists because of a mistake, which is the only reason any of the
    others exist either.

    <what happened, concretely, with numbers>

    <why nothing caught it>

    <the rule, stated so it generalises>
    """

## 4 · Verify BOTH halves

This is the step that gets skipped, and skipping it is observation 10.

**Half one — it fails on the defect.** Reintroduce the original bug and watch
the gate go red. Do this for every distinct case, not just the first:

```bash
# example: classes.py was verified on two separate reintroductions
python3 tools/classes.py        # clean → exit 0
# remove the .lang-pair rule    → 1 finding, exit 1
# restore, then re-add the .pager-inner wrapper via the generator
#                               → 25 pages, exit 1
```

**Half two — it stays quiet on the legitimate neighbours.** List what sits
closest to the defect and prove each one passes. The usual suspects:

- comments and docstrings
- historical notes, changelogs, migration records
- test fixtures and example files
- deliberate exceptions the project has already decided on

`check_generator_hosts` failed this half. It correctly caught a stale host in a
string — and also failed on a **comment** recording where a property used to
live. Documenting the host migration would have broken the gate that exists
because of the host migration. Fixed by reading Python with `ast` so only
string literals count, docstrings excluded.

`classes.py` passed it: a class referenced only from JavaScript is *not*
reported, and that exemption is load-bearing across the site's twelve JS files.

## 5 · Wire it in

If it is a new file:

1. Add it to `CORRECTNESS` in `tools/check.py`.
2. Add the line to the gate list in `CLAUDE.md`.
3. Add the line to `tools/generators/README.md`.
4. Update the count anywhere a number is stated — or better, state the list and
   let it count itself. `CLAUDE.md` said "the ten gates" after `tokens.py` made
   it eleven.

Then run the whole set, including the browser gate:

```bash
python3 tools/check.py
```

## 6 · Close the observation

Change its status in `skill-observations/log.md`:

    **Status:** ACTIONED (YYYY-MM-DD) — became `tools/x.py`, which fails on
    <the precise condition>.

Name the file and the condition. "Fixed" is not a status; the next person needs
to find the gate from the observation and the observation from the gate.

## The one thing not to do

Do not weaken a gate to get green. A correct new gate frequently exposes an old
compromise — the 12px floor reopened a header-overflow bug and took
`render-check.js` from 0 findings to 83. The gate was right. The fix took the
width out of tracking and padding instead, and came back to 0.

If a gate is genuinely wrong, fix the gate and log *that* as an observation.
