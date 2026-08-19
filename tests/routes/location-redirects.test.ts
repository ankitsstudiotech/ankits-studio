import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LEGACY_AIROLI_SECTOR_19_SLUG } from "@/content/schema/slugs";

describe("location route migration redirects", () => {
  it("permanently redirects legacy /locations/airoli to /locations/airoli-sector-19", () => {
    const config = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");
    expect(config).toMatch(/source:\s*"\/locations\/airoli"/);
    expect(config).toMatch(/destination:\s*"\/locations\/airoli-sector-19"/);
    expect(config).toMatch(/permanent:\s*true/);
    expect(LEGACY_AIROLI_SECTOR_19_SLUG).toBe("airoli");
  });
});
