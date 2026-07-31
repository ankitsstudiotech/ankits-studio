import path from "node:path";
import { defineConfig } from "vitest/config";

/**
 * Scoped Vitest config for SEO-layer tests. This task's file ownership
 * grants `tests/seo/**` but not the root `vitest.config.mts`, so these
 * tests are not picked up by `npm run test`'s `include` glob. Run them
 * explicitly:
 *
 *   npx vitest run --config tests/seo/vitest.config.ts
 *
 * See docs/HANDOFF-SEO.md for the follow-up note (whoever owns
 * package.json/vitest.config.mts next could add a `test:seo` script and/or
 * fold `tests/seo/**` into the root config's `include`).
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "../../src"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/seo/**/*.test.ts"],
  },
});
