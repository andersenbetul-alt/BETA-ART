import type { IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import type { Config } from "./config.js";
import { makeLogger } from "./log.js";
import { attempts, buildChain, shouldFallback } from "./router.js";

/** Headers we must not copy verbatim onto the upstream request. */
const STRIP_REQUEST = new Set([
  "host",
  "connection",
  "content-length",
  "accept-encoding",
  "transfer-encoding",
]);

const STRIP_RESPONSE = new Set([
  "content-encoding",
  "content-length",
  "connection",
  "transfer-encoding",
]);

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function forwardHeaders(req: IncomingMessage): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (STRIP_REQUEST.has(key.toLowerCase())) continue;
    headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }
  return headers;
}

export async function handle(
  req: IncomingMessage,
  res: ServerResponse,
  cfg: Config,
): Promise<void> {
  const requestId = randomUUID().slice(0, 8);
  const log = makeLogger(cfg, requestId);
  const path = req.url ?? "/";

  if (path === "/healthz") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        ok: true,
        upstream: cfg.upstream,
        models: cfg.models,
        bypass: cfg.bypass,
      }),
    );
    return;
  }

  const rawBody = await readBody(req);

  // Only /v1/messages carries a model worth routing. Everything else — token
  // counting, model listing — is forwarded untouched.
  const routable = path.startsWith("/v1/messages") && rawBody.length > 0;

  let parsed: Record<string, unknown> | null = null;
  if (routable) {
    try {
      parsed = JSON.parse(rawBody.toString("utf8")) as Record<string, unknown>;
    } catch {
      log.info("body is not JSON, forwarding unrouted");
    }
  }

  const requested =
    parsed && typeof parsed["model"] === "string"
      ? (parsed["model"] as string)
      : null;

  const chain = requested ? buildChain(cfg, requested) : [];
  const stream = parsed?.["stream"] === true;

  if (requested) {
    log.info("routing", { requested, chain, stream, path });
  }

  // No model to route on: single pass-through.
  if (!requested || !parsed) {
    await attemptOnce(req, res, cfg, log, path, rawBody, null, true);
    return;
  }

  for (const attempt of attempts(chain)) {
    const body = Buffer.from(
      JSON.stringify({ ...parsed, model: attempt.model }),
      "utf8",
    );
    const done = await attemptOnce(
      req,
      res,
      cfg,
      log,
      path,
      body,
      attempt.model,
      attempt.isLast,
    );
    if (done) return;
    log.info("falling back", { from: attempt.model });
  }
}

/**
 * Returns true when the response has been handed to the client (success, or a
 * failure we will not retry). Returns false to signal "try the next model".
 */
async function attemptOnce(
  req: IncomingMessage,
  res: ServerResponse,
  cfg: Config,
  log: ReturnType<typeof makeLogger>,
  path: string,
  body: Buffer,
  model: string | null,
  isLast: boolean,
): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), cfg.requestTimeoutMs);

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(`${cfg.upstream}${path}`, {
      method: req.method ?? "POST",
      headers: forwardHeaders(req),
      body: req.method === "GET" || req.method === "HEAD" ? undefined : body,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    const message = err instanceof Error ? err.message : String(err);
    log.info("upstream unreachable", { model, message });

    // A transport failure is exactly what fallback exists for — but only if
    // there is another model left to try.
    if (!isLast) return false;

    res.writeHead(502, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        type: "error",
        error: { type: "api_error", message: `omniroute: ${message}` },
      }),
    );
    return true;
  }

  clearTimeout(timer);

  if (!upstreamRes.ok && !isLast && shouldFallback(cfg, upstreamRes.status)) {
    log.info("retryable failure", { model, status: upstreamRes.status });
    // Drain so the connection can be reused rather than left dangling.
    await upstreamRes.arrayBuffer().catch(() => undefined);
    return false;
  }

  const headers: Record<string, string> = {};
  upstreamRes.headers.forEach((value, key) => {
    if (!STRIP_RESPONSE.has(key.toLowerCase())) headers[key] = value;
  });
  if (model) headers["x-omniroute-model"] = model;

  res.writeHead(upstreamRes.status, headers);

  // Past this point the status line is already on the wire, so no fallback is
  // possible even if the stream fails midway. That is a real limitation of
  // proxying a streaming API, not an oversight.
  if (!upstreamRes.body) {
    res.end();
    return true;
  }

  try {
    for await (const chunk of upstreamRes.body as unknown as AsyncIterable<Uint8Array>) {
      if (!res.write(Buffer.from(chunk))) {
        await new Promise<void>((resolve) => res.once("drain", () => resolve()));
      }
    }
  } catch (err) {
    log.info("stream aborted mid-response", {
      model,
      message: err instanceof Error ? err.message : String(err),
    });
  }

  res.end();
  log.info("completed", { model, status: upstreamRes.status });
  return true;
}
