import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    // Route/SEO *.test.ts suites read source via node:fs — named node:* imports break under jsdom.
    // Keep *.test.tsx on jsdom (React Testing Library).
    environmentMatchGlobs: [
      ["tests/routes/**/*.test.ts", "node"],
      ["tests/seo/**/*.test.ts", "node"],
    ],
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "tests/seo/**/*.test.ts", "tests/routes/**/*.test.{ts,tsx}"],
    exclude: ["e2e/**", "node_modules/**"],
    // Dynamic import + module reset suites need headroom under full parallel load.
    testTimeout: 15_000,
  },
});
