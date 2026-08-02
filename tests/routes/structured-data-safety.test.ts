import { describe, expect, it } from "vitest";
import { getBranches, getProgrammes } from "@/content";
import { buildCourseJsonLd, buildLocalBusinessJsonLd } from "@/lib/seo/structured-data";

describe("route-level structured-data safety", () => {
  it("Course JSON-LD is omitted for every programme (ADR-017 — not educational Courses)", () => {
    for (const programme of getProgrammes()) {
      expect(buildCourseJsonLd(programme)).toBeNull();
    }
  });

  it("LocalBusiness JSON-LD is omitted for every current branch (none are verified yet)", () => {
    for (const branch of getBranches()) {
      expect(branch.dataStatus).not.toBe("verified");
      expect(buildLocalBusinessJsonLd(branch)).toBeNull();
    }
  });

  it("no branch's mock address/phone ever appears in a non-null structured-data payload", () => {
    for (const branch of getBranches()) {
      const result = buildLocalBusinessJsonLd(branch);
      // Omitted entirely (see docs/DECISIONS.md ADR-011) — never a partial object.
      expect(result).toBeNull();
    }
  });
});
