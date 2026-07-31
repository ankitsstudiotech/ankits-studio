import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
  ]),
  // Content-domain leak guard (docs/CONTENT-MODEL.md, DECISIONS.md
  // ADR-011): consumers must go through the src/content accessor
  // (`@/content`), never import mock/verified data directly. Scoped to
  // consumer directories only — src/content itself is exempt since it's
  // where these imports legitimately live.
  {
    files: ["src/app/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}", "src/lib/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/content/mock", "**/content/mock/*", "**/content/verified", "**/content/verified/*"],
              message: "Import content through @/content (the accessor), not directly from content/mock or content/verified.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
