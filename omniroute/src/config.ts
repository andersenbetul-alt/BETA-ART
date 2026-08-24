/** Configuration, all from the environment so the proxy stays stateless. */

export interface Config {
  port: number;
  host: string;
  /** Where requests go next. In the full stack this is Headroom. */
  upstream: string;
  /** Model chain: first is primary, the rest are fallbacks in order. */
  models: string[];
  /** Pass requests through untouched — no rerouting, no fallback. */
  bypass: boolean;
  /** HTTP statuses worth retrying on the next model in the chain. */
  retryStatuses: Set<number>;
  requestTimeoutMs: number;
  logLevel: "silent" | "info" | "debug";
}

function num(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${name} must be a number, got ${JSON.stringify(raw)}`);
  }
  return parsed;
}

function list(name: string): string[] {
  return (process.env[name] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function loadConfig(): Config {
  const models = list("OMNIROUTE_MODELS");

  return {
    port: num("OMNIROUTE_PORT", 8790),
    host: process.env.OMNIROUTE_HOST ?? "127.0.0.1",
    // Default is Anthropic directly. Point this at Headroom to get the full
    // chain: Claude Code -> OmniRoute -> Headroom -> provider.
    upstream: (
      process.env.OMNIROUTE_UPSTREAM ?? "https://api.anthropic.com"
    ).replace(/\/+$/, ""),
    models,
    bypass: process.env.OMNIROUTE_BYPASS === "1",
    // 408 request timeout, 409 conflict, 429 rate limit, 5xx server side.
    // 400/401/403/404 are the caller's fault and identical on every model, so
    // retrying them just multiplies the same error.
    retryStatuses: new Set([408, 409, 429, 500, 502, 503, 504, 529]),
    requestTimeoutMs: num("OMNIROUTE_TIMEOUT_MS", 600_000),
    logLevel: (process.env.OMNIROUTE_LOG ?? "info") as Config["logLevel"],
  };
}
