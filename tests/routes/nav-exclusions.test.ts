import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("footer nav exclusions — withheld secondary routes", () => {
  it("keeps trainers, transformations, and blog out of footer promotion", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "components", "layout", "SiteChrome.tsx"),
      "utf8",
    );
    expect(source).toMatch(
      /FOOTER_EXCLUDE_PATHS\s*=\s*new Set\(\s*\["\/trainers",\s*"\/transformations",\s*"\/blog"\]\s*\)/,
    );
    expect(source).toMatch(/\/privacy-policy/);
    expect(source).toMatch(/\/terms/);
  });

  it("primary navigation content does not list withheld routes", () => {
    const nav = readFileSync(
      join(process.cwd(), "src", "content", "mock", "navigation.ts"),
      "utf8",
    );
    // Primary placements must not include these paths
    expect(nav).not.toMatch(/path: "\/trainers",\s*placement: "primary"/);
    expect(nav).not.toMatch(/path: "\/transformations",\s*placement: "primary"/);
    expect(nav).not.toMatch(/path: "\/blog",\s*placement: "primary"/);
  });
});
