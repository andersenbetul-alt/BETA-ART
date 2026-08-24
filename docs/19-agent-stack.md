# The agent stack — what is real, and where

```
CLAUDE CODE
    │
    ▼   OmniRoute      model routing · auto-fallback
    │
    ▼   Headroom       context compression
    │
    ▼   Claude-Mem     persistent memory
    │
    ▼   Task Observer  observation → gate
```

All four were installed and exercised on 2026-08-24. This document records what
each one actually did **when run**, not what its README claims, and gives the
setup that works on a personal machine.

The measurements below are from this repository's own data. Where a layer could
not run here, the reason is stated rather than smoothed over.

---

## Layer 4 · Task Observer — works, and is the only one that produced output

Already running, already versioned. `.claude/skills/task-observer/` holds the
Beta Art adaptation, `skill-observations/log.md` holds eleven observations, and
four of them became gates.

The local adaptation is the point: **upstream an observation becomes a skill;
here it becomes a gate.** A skill can be skipped. A gate breaks the build.

| Observation | Became |
|---|---|
| 2 · a token block silently redefined `--ease` | `tools/tokens.py` |
| 6 · a class travelled between properties, its rule did not | `tools/classes.py` |
| 7 · a generator held a host the site had left | `qc.py check_generator_hosts` |
| 11 · the translation reached the body and stopped at the head | `qc.py check_translated_meta` |

Method credit: Eoghan Henn, *Task Observer / "One Skill to Rule Them All"*,
CC BY 4.0 — [rebelytics.com](https://rebelytics.com).

No setup required. It is in the repository.

---

## Layer 1 · OmniRoute — installs, runs, needs keys

`npm install -g omniroute` · v3.8.49 · MIT · [omniroute.online](https://omniroute.online)

Verified here:

```
doctor    5 OK, 0 failures (better-sqlite3 repaired via `omniroute runtime repair`)
serve     healthy, uptime confirmed
endpoint  http://localhost:20128/v1
providers 0 configured
```

**It cannot route a Claude Code session running in Anthropic's managed remote
environment.** Model routing there belongs to the harness, not to a local
environment variable. `omniroute launch` starts a *new* Claude Code process
pointed at the local proxy — useful on your own machine, irrelevant to a
session already running elsewhere.

### On your own machine

```bash
npm install -g omniroute
omniroute runtime repair          # builds the native sqlite binding
omniroute setup                   # interactive: add provider API keys
omniroute serve                   # starts on :20128
omniroute setup-claude            # writes ~/.claude/profiles/<model>/ per model
omniroute launch                  # Claude Code pointed at the router
```

Check it is doing something before trusting it:

```bash
omniroute simulate "your prompt"  # dry run — shows which provider would win
omniroute providers test-all
omniroute cost --output table
```

### Worth deciding before you switch it on

Routing an agent through a third-party router means the conversation and the
code pass through that router. Beta Art's own legal notice makes commitments
about where customer material goes; asking the same question of your own
toolchain is consistent rather than paranoid. `omniroute` is MIT and
self-hosted, so the answer can be "my own machine" — but it should be an
answer, not an assumption.

---

## Layer 2 · Headroom — installs, runs, compressed nothing here

`pip install "headroom-ai[all]"` · v0.36.5 · Apache 2.0

Measured against this repository, with the base install and then with `[ml]`:

| Source | Before | After | Saved |
|---|---:|---:|---:|
| `legal.html` | 51 368 | 51 368 | 0% |
| `beta-art-business/index.html` | 56 974 | 56 974 | 0% |
| `tools/generators/data.py` | 49 020 | 49 020 | 0% |
| `git log -60 --stat` | 193 117 | 193 117 | 0% |

Three hypotheses were tested and rejected: wrong message shape (it was correct),
`compress_user_messages` defaulting off (turning it on changed nothing), and
compression only triggering near the context limit (`model_limit=8000` on a
461 KB conversation still returned 0%).

Installing `[ml]` — which pulls torch and about 2 GB of CUDA — produced the
actual reason, from the tool itself:

> `Kompress model not ready; requests will not be compressed. Check HuggingFace
> connectivity`

**The tool is not broken; this sandbox blocks the model download host.** On a
machine with open network the model downloads on first run and the published
figures become testable.

### On your own machine

```bash
pip install "headroom-ai[all]"
headroom doctor                    # checks proxy + client routing
headroom wrap claude               # durable wrap for Claude Code
headroom savings                   # measured savings over time
headroom inspect                   # original vs compressed, recent requests
```

Do not accept the README's 47–92% on faith. `headroom inspect` shows what was
actually removed from a real request — read one before relying on it, because
compression that drops the wrong line is a correctness problem, not a cost
problem.

---

## Layer 3 · Claude-Mem — installs, runs, stored nothing here

`npx claude-mem install` · v13.15.3

Verified here:

```
doctor    Bun 1.3.11 OK · uv 0.8.17 OK · plugin installed OK
worker    running, PID 14993, port 37700
database  /root/.claude-mem/claude-mem.db
          observations 0 · sessions 0 · summaries 0 · first: null
```

The worker refused to start until a stale `~/.claude-mem/spawn.lock` from a
previous attempt was removed — worth knowing, because the failure message is
just `Failed to start worker` and the reason is only in
`~/.claude-mem/logs/`.

**Zero observations, and that is expected.** Claude-Mem collects through Claude
Code's hooks, which are not active in this managed environment, and its own
installer says memory injection begins on the *second* session in a project.

This matters for a specific reason: asked to "retrieve context from previous
sessions" about an authentication system, the honest answer came from querying
the database — 0 rows — not from guessing. A memory layer that is empty must
report empty. Inventing recalled context is worse than having no memory at all.

### On your own machine

```bash
npx claude-mem install
npx claude-mem start
npx claude-mem status              # confirm PID and port before trusting it
npx claude-mem doctor              # bun, uv, worker
# in Claude Code, optionally:  /learn-codebase   (~5 min, ingests the repo)
```

Everything stays in `~/.claude-mem`. Telemetry is on by default:
`npx claude-mem telemetry disable`.

---

## How the four relate

They are not competitors and only one pair actually overlaps.

| Layer | Decides |
|---|---|
| OmniRoute | **which model** the request goes to |
| Headroom | **how much context** goes with it |
| Claude-Mem | **what is remembered** between sessions |
| Task Observer | **what is learned** from the work |

OmniRoute also advertises compression (RTK/Caveman), which overlaps Headroom.
Running both means two systems rewriting the same context with no shared view
of what the other removed. Pick one compression layer.

## The honest summary

Three of the four could not do their job in this environment, for three
different and verifiable reasons: no provider keys, a blocked model host, and
inactive hooks. None of that is a criticism of the tools — it is a fact about
where they were run, and it is written down here so nobody later mistakes
"measured 0%" for "does not work".

The fourth needed no network, no keys and no daemon, and it has produced four
gates that break the build when a known mistake recurs. That asymmetry is worth
noticing before adding more layers.
