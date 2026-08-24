#!/usr/bin/env node
import { createServer } from "node:http";
import { loadConfig } from "./config.js";
import { handle } from "./proxy.js";

const cfg = loadConfig();

const server = createServer((req, res) => {
  handle(req, res, cfg).catch((err) => {
    const message = err instanceof Error ? err.message : String(err);
    if (!res.headersSent) {
      res.writeHead(500, { "content-type": "application/json" });
    }
    res.end(
      JSON.stringify({
        type: "error",
        error: { type: "api_error", message: `omniroute: ${message}` },
      }),
    );
  });
});

// Claude Code holds long streaming responses open; the Node default of two
// minutes would sever them mid-answer.
server.requestTimeout = 0;
server.headersTimeout = 0;

server.listen(cfg.port, cfg.host, () => {
  console.error(
    `[omniroute] listening on http://${cfg.host}:${cfg.port}\n` +
      `[omniroute] upstream  ${cfg.upstream}\n` +
      `[omniroute] fallbacks ${cfg.models.length ? cfg.models.join(" -> ") : "(none configured)"}\n` +
      `[omniroute] bypass    ${cfg.bypass ? "ON — pass-through only" : "off"}\n\n` +
      `  ANTHROPIC_BASE_URL=http://${cfg.host}:${cfg.port} claude`,
  );
});

for (const sig of ["SIGINT", "SIGTERM"] as const) {
  process.on(sig, () => server.close(() => process.exit(0)));
}
