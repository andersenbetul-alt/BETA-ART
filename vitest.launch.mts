import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Yalnızca yayın kapısı testleri. Günlük `npm run check` bunları koşmaz —
 * kalıcı kırmızı bir paket sinyali öldürür. Canlıya çıkmadan önce
 * `npm run check:launch` yeşil olmalı.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/launch-guard.test.ts"],
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
