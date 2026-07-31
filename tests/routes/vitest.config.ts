import path from "node:path";
import { defineConfig } from "vitest/config";

/**
 * Scoped Vitest config for route-architecture tests — mirrors
 * tests/seo/vitest.config.ts (same reasoning: this task's file ownership
 * grants tests/routes/** but not the root vitest.config.mts, so these
 * aren't picked up by `npm run test`'s `include` glob). Run explicitly:
 *
 *   npx vitest run --config tests/routes/vitest.config.ts
 *
 * See docs/HANDOFF-ROUTES.md.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "../../src"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/routes/**/*.test.ts"],
  },
});
