import type { Config } from "./config.js";

export interface Attempt {
  model: string;
  index: number;
  isLast: boolean;
}

/**
 * Build the ordered list of models to try.
 *
 * The model the caller asked for always goes first — routing should not
 * silently override an explicit choice. Configured models follow as fallbacks,
 * minus any duplicate of the requested one.
 */
export function buildChain(cfg: Config, requestedModel: string): string[] {
  if (cfg.bypass) return [requestedModel];

  const chain = [requestedModel];
  for (const m of cfg.models) {
    if (!chain.includes(m)) chain.push(m);
  }
  return chain;
}

export function attempts(chain: string[]): Attempt[] {
  return chain.map((model, index) => ({
    model,
    index,
    isLast: index === chain.length - 1,
  }));
}

/**
 * Whether a failed response is worth retrying on the next model.
 *
 * Deliberately narrow. A 400 means the request is malformed and every model
 * will reject it identically; retrying turns one clear error into three and
 * hides the real cause.
 */
export function shouldFallback(cfg: Config, status: number): boolean {
  return cfg.retryStatuses.has(status);
}
