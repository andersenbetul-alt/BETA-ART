# Agent stack — wiring

```
Claude Code ──► OmniRoute ──► Headroom ──► provider
      ▲
      ├── Claude-Mem     (plugin hooks + background worker)
      └── Task Observer  (skill, loaded into context)
```

Only the first row is a network path. Claude-Mem hooks into the session
lifecycle, and Task Observer is instructions the model reads — neither is a hop
between Headroom and the provider, even though the original sketch drew all
four in a line.

## Order of setup

Bring the layers up one at a time and confirm each before adding the next. Four
transforming layers make an unexplained result very hard to attribute, so being
able to answer "is it this one?" is worth the extra few minutes.

**1. Baseline.** Run Claude Code with nothing in front of it. This is what
"working" looks like.

**2. OmniRoute alone.** Upstream straight to Anthropic.

```bash
cd omniroute && npm install && npm run build
OMNIROUTE_MODELS="claude-sonnet-5" npm start
ANTHROPIC_BASE_URL=http://127.0.0.1:8790 claude
```

Check `curl -s localhost:8790/healthz`, and confirm `x-omniroute-model` appears
on responses.

**3. Headroom behind it.**

```bash
pip install "headroom-ai[proxy]"
HEADROOM_TELEMETRY=off headroom proxy --port 8787 --no-telemetry
```

Restart OmniRoute with `OMNIROUTE_UPSTREAM=http://127.0.0.1:8787`. Compare
answers against the baseline — compression is lossy by design, so this is the
step where quality regressions show up if they are going to.

**4. Claude-Mem.** Runs on the local machine, not through the proxies:

```bash
npx claude-mem install
```

**5. Task Observer.** Already at `.claude/skills/task-observer/`. Nothing to
start.

## Bypass switches

Every layer needs one, and this is why:

| Layer | Disable with |
|---|---|
| OmniRoute | `OMNIROUTE_BYPASS=1`, or unset `ANTHROPIC_BASE_URL` |
| Headroom | point `OMNIROUTE_UPSTREAM` back at `https://api.anthropic.com` |
| Claude-Mem | remove the plugin, or stop the worker |
| Task Observer | it is a skill; it only acts when it triggers |

When output looks wrong, bisect: disable the top half, retest, narrow.

## Two things that need a decision

**Double compression.** The sketch gives OmniRoute a "Compression" role while
Headroom is also a compressor. Running both means the second operates on the
first's lossy output. OmniRoute as built does not compress — that role is left
to Headroom. If compression is added to the routing layer later, turn one of
them off.

**Everything is plaintext in transit through these layers.** Three
intermediaries now see full prompts and responses. Both proxies run locally and
are open source, so this is auditable rather than opaque — but it is worth
deciding deliberately rather than by default.

## Where this was run

OmniRoute was built and exercised in a remote sandbox. The other three layers
were not, and cannot be: Headroom and Claude-Mem take effect on the machine
where Claude Code runs, which is your local machine, not the container this
repository was built in. Steps 3 and 4 above are for that machine.
