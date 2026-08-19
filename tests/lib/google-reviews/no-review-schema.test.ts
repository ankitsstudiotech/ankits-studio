import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildLocalBusinessJsonLd, buildOrganizationJsonLd } from "@/lib/seo/structured-data";
import { getBusinessIdentity, getPubliclyListedBranches } from "@/content";
import { serializeJsonLd } from "@/lib/seo/serialize";

function read(...parts: string[]) {
  return readFileSync(join(process.cwd(), ...parts), "utf8");
}

describe("no Review / AggregateRating structured data from Google social proof", () => {
  it("does not emit Review or AggregateRating on Organization or LocalBusiness", () => {
    const org = serializeJsonLd(buildOrganizationJsonLd(getBusinessIdentity()) ?? {});
    expect(org).not.toMatch(/"@type":"Review"|AggregateRating/);
    for (const branch of getPubliclyListedBranches()) {
      const json = serializeJsonLd(buildLocalBusinessJsonLd(branch));
      expect(json, branch.slug).not.toMatch(/"@type":"Review"/);
      expect(json, branch.slug).not.toMatch(/AggregateRating/);
    }
  });

  it("does not add review schema builders or homepage JSON-LD for Google reviews", () => {
    const structured = read("src", "lib", "seo", "structured-data.ts");
    const home = read("src", "app", "(marketing)", "page.tsx");
    const proof = read("src", "components", "home", "GoogleReviewProof.tsx");
    expect(structured).not.toMatch(/AggregateRating|"Review"/);
    expect(home).not.toMatch(/application\/ld\+json/);
    expect(proof).not.toMatch(/application\/ld\+json|AggregateRating/);
  });
});
