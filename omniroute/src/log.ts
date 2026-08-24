import type { Config } from "./config.js";

/**
 * Every line carries the request id. With four layers in the stack, the only
 * way to answer "which layer did that?" is to be able to line up their logs.
 */
export function makeLogger(cfg: Config, requestId: string) {
  const enabled = (level: "info" | "debug") =>
    cfg.logLevel === "debug" || (cfg.logLevel === "info" && level === "info");

  const emit = (level: "info" | "debug", msg: string, extra?: unknown) => {
    if (!enabled(level)) return;
    const line = `[omniroute] ${requestId} ${msg}`;
    if (extra === undefined) console.error(line);
    else console.error(line, JSON.stringify(extra));
  };

  return {
    info: (msg: string, extra?: unknown) => emit("info", msg, extra),
    debug: (msg: string, extra?: unknown) => emit("debug", msg, extra),
  };
}
