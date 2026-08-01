import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

/**
 * @testing-library/react normally auto-registers this via a global
 * `afterEach` if the test runner exposes one, but this project's Vitest
 * config doesn't set `test.globals: true` (deliberately — explicit imports
 * are clearer), so that auto-registration silently no-ops. Without this,
 * multiple `render()` calls across tests in the same file accumulate in
 * the jsdom document instead of unmounting between tests, causing
 * "multiple elements found" failures whenever more than one test in a file
 * renders visible content — found while extending MockModeIndicator.test.tsx
 * (see docs/DECISIONS.md ADR-013).
 */
afterEach(() => {
  cleanup();
});
