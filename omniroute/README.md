# OmniRoute

Model routing and auto-fallback in front of Claude Code. Speaks the Anthropic
Messages API, so Claude Code reaches it by pointing `ANTHROPIC_BASE_URL` at it.

Zero runtime dependencies — Node 20+ only.

```
Claude Code ──► OmniRoute ──► Headroom ──► provider
```

## Run

```bash
npm install && npm run build

OMNIROUTE_UPSTREAM=http://127.0.0.1:8787 \
OMNIROUTE_MODELS="claude-sonnet-5,claude-haiku-4-5-20251001" \
npm start

# then, in another shell
ANTHROPIC_BASE_URL=http://127.0.0.1:8790 claude
```

`OMNIROUTE_UPSTREAM` is where requests go next. Point it at Headroom for the
full stack, or leave it unset to talk to Anthropic directly.

## Configuration

| Variable | Default | Meaning |
|---|---|---|
| `OMNIROUTE_PORT` | `8790` | Listen port |
| `OMNIROUTE_HOST` | `127.0.0.1` | Listen address — keep it loopback |
| `OMNIROUTE_UPSTREAM` | `https://api.anthropic.com` | Next hop |
| `OMNIROUTE_MODELS` | *(empty)* | Fallback chain, in order |
| `OMNIROUTE_BYPASS` | *(off)* | `1` disables routing and fallback |
| `OMNIROUTE_TIMEOUT_MS` | `600000` | Upstream timeout |
| `OMNIROUTE_LOG` | `info` | `silent` · `info` · `debug` |

`GET /healthz` reports the live configuration.

## How routing decides

The model the caller asked for is always tried first — routing does not
silently override an explicit choice. `OMNIROUTE_MODELS` supplies the fallbacks
after it.

Fallback fires on transport failures and on 408, 409, 429, 500, 502, 503, 504
and 529. It deliberately does not fire on 400, 401, 403 or 404: those mean the
request itself is wrong, every model will reject it identically, and retrying
turns one clear error into three while hiding the cause.

The response carries `x-omniroute-model` naming the model that actually served
it, and every log line carries a request id. With four layers in the stack,
lining up logs is the only way to answer "which layer did that?".

## Known limitations

**Fallback cannot rescue a stream that fails midway.** Once the status line is
on the wire the response has begun, and there is no way to retract it. Fallback
therefore only covers failures that happen before the first byte. This is
inherent to proxying a streaming API.

**Routing sees uncompressed context.** In the diagrammed order OmniRoute runs
ahead of Headroom, so any decision based on payload size measures the request
before compression. If you add size-based routing later, that is the thing to
watch: a request Headroom would shrink below a threshold may still be routed as
though it were large. Putting Headroom first would fix it, at the cost of
compressing requests that get rerouted anyway.

**Fallback and prefix caching pull against each other.** Provider KV caches are
per-model. Every fallback lands on a cold cache, and Headroom's CacheAligner
work upstream is wasted for that request. Fallbacks are worth it when the
alternative is a failed request; they are not free.

## Verified

Driven end to end against a mock provider: health endpoint, routing to the
requested model, fallback on 529 to the next model in the chain, no fallback on
400, and streaming passthrough with the body intact.

Not yet exercised against a live provider or with Headroom downstream.
