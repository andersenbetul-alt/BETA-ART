# Observation format

Each observation is one JSON object per line in `.claude/observations/log.jsonl`.
The script writes it; this file explains what belongs in each field, because the
schema is easy to satisfy and hard to satisfy *well*.

## Fields

| Field | Written by | What it is for |
| --- | --- | --- |
| `id` | script | Stable handle for `resolve` |
| `pattern` | you | One sentence naming the repetition |
| `evidence` | you | Concrete occurrences — commands, paths, quotes |
| `occurrences` | script | Incremented when the same pattern is added again |
| `cost` | you | What the repetition actually costs |
| `proposal` | you | The change you would make |
| `status` | script | `open`, `promoted`, or `dismissed` |
| `first_seen` / `last_seen` | script | Timestamps |
| `note` | you, at resolve time | Where it ended up, or why it was rejected |

## Writing a good `pattern`

Name the behaviour, not the symptom, and keep it recognisable months later.

- Weak: `"build problems"` — unrecognisable later, matches everything.
- Weak: `"npm run build failed on line 40 of page.tsx"` — that is one event, not
  a pattern.
- Strong: `"Bash working directory resets between calls, so relative paths fail"`

The test: could a person who was not there tell whether a new situation is an
instance of this pattern? If not, rewrite it.

## Writing `evidence`

Evidence is what separates a finding from a feeling. Give the actual
occurrences, separated by semicolons, each one specific enough to look up:

```
"cd auth-app && npm run build → ENOENT; same in the tsc call; same in git commit"
```

For a repeated correction from the user, quote them:

```
"user: 'saati sil' then later 'saat kartlari çıksın' — twice asked to remove the clock"
```

## Writing `cost`

Quantify if you can, estimate if you cannot, and say which:

- `"3 retries, ~2 min"`
- `"~4k tokens re-reading the same files"`
- `"one shipped bug, caught in review"`
- `"unknown — annoying but fast"`

An observation with no cost recorded tends to be either trivial or unexamined.

## Writing `proposal`

Say what you would change, specifically enough to act on without rethinking it:

- Weak: `"be more careful with paths"`
- Strong: `"CLAUDE.md line: use absolute paths in Bash; cwd is not preserved"`
- Strong: `"new skill: deploy-checks — the lint/typecheck/build sequence run before every push"`

## Worked example

```json
{
  "id": 4,
  "pattern": "Chromium screenshots clip content when the wrapper sets an explicit body height",
  "evidence": "lockup PNG cut at 'CARE'; repeated with --force-device-scale-factor; fixed by removing html,body{height}",
  "occurrences": 3,
  "cost": "4 wasted renders, ~10 min",
  "proposal": "script: scripts/svg-to-png.sh with the known-good wrapper",
  "status": "open",
  "first_seen": "2026-08-22T15:34:00Z",
  "last_seen": "2026-08-22T15:41:00Z"
}
```

This one is promotable: named behaviour, three occurrences, a real cost, and a
proposal that removes the cost entirely.
