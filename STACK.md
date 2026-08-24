# Agent Tooling Stack — verification notes

The proposed chain:

```
Claude Code → OmniRoute → Headroom → Claude-Mem → Task Observer
```

All four were installed and exercised here on 2026-08-22. This records what
was **observed**, separated from what was not — the environment is an
ephemeral container behind an egress allowlist (GitHub, npm, PyPI only), so
several layers cannot be fully tested here regardless of design.

## Arrow 1 — Claude Code → OmniRoute · VERIFIED

Claude Code speaks Anthropic's protocol (`/v1/messages`), not OpenAI's.
OmniRoute advertises `/v1` as OpenAI-compatible, leaving it open whether
Claude Code could point at it at all. It can:

```
POST /v1/messages                 → 500   routed, dispatched, upstream failed
POST /v1/chat/completions         → 500   same
POST /v1/definitely-not-a-route   → 404   ← control
GET  /v1/nonsense                 → 404   ← control
```

The controls carry the result: 404s on invented routes prove the router
discriminates, so the 500 on `/v1/messages` means the route exists and the
request reached an upstream. The error body confirms it — `poolSize: 11`,
`attempted: 1`, provider `felo/felo-chat`, `fetch failed`. It died at egress,
not at the protocol. `omniroute translator` makes cross-format routing a
first-class feature.

**Conclusion:** `ANTHROPIC_BASE_URL=http://localhost:20128/v1` is correct.
Blocked here only by network.

## Arrow 2 — Headroom · WORKS, WITH CAVEATS

Compression is real but did not engage until every default protection was
turned off:

| Configuration | Result |
| ------------- | ------ |
| Defaults, small messages | 0 tokens saved |
| Defaults, 18k-char blobs, limit 4000 | 0 saved — all 17 messages `router:protected` |
| `protect_recent=0`, `protect_analysis_context=False`, `min_tokens_to_compress=50` | **8,192 saved of 42,100 — 19.5%**, via `router:code_aware` |

Two things worth knowing before relying on it:

1. **`pip install headroom-ai[ml]` is not sufficient.** `embedding_available()`
   stayed False until `fastembed` was installed by hand — the `[ml]` extra
   pulled `transformers` and `tokenizers` but not the dependency the check
   actually tests for. `onnxruntime` was also missing.
2. **19.5% is not 60–95%.** The measured figure here is on synthetic
   code-like output with an aggressive config. The headline range was not
   reproduced; it may need the Kompress-base model, which requires a model
   download this environment blocks.

## Arrow 3 — Claude-Mem · NOT RUNNABLE HERE

Installs and reports success. Its own installer states the constraints:
*"Worker autostart skipped"*, *"Memory injection starts on your second
session"*, *"Everything stays in `~/.claude-mem` on this machine."* There is
no second session and the container is ephemeral. Not a defect — a mismatch
with this environment.

## Arrow 4 — Task Observer · WORKING

The only layer fully operational here, and only because it was moved from a
user-level install into the repo (`.claude/skills/task-observer/`), where git
carries it across sessions. Six observations logged; one skill
(`evidence-discipline`) created from the first three, which then caught two
build defects on its first use.

## Summary

| Layer | Status here | Blocker |
| ----- | ----------- | ------- |
| OmniRoute | Protocol verified, routes nothing | Egress allowlist |
| Headroom | 19.5% measured, undocumented deps | Headline figure unreproduced |
| Claude-Mem | Installed, inert | No persistence |
| Task Observer | Working | — |

Three of four need egress or persistence this container lacks. The designs
are sound; the environment is the constraint — except Headroom's headline
compression figure, which is a genuine open question independent of it.
