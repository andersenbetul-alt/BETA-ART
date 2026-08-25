import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // Yayın kapısı günlük koşumun dışında: kalıcı kırmızı bir paket sinyali
    // öldürür. Ayrı komutla çalışır — `npm run check:launch`.
    exclude: ["tests/launch-guard.test.ts", "node_modules/**"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
