import { describe, expect, it } from "vitest";
import { getBranches, getProgrammes } from "@/content";
import { buildCourseJsonLd, buildLocalBusinessJsonLd } from "@/lib/seo/structured-data";

describe("route-level structured-data safety", () => {
  it("Course JSON-LD is omitted for every programme (ADR-017 — not educational Courses)", () => {
    for (const programme of getProgrammes()) {
      expect(buildCourseJsonLd(programme)).toBeNull();
    }
  });

  it("LocalBusiness JSON-LD emits for verified branches with owner-confirmed addresses", () => {
    for (const branch of getBranches()) {
      expect(branch.dataStatus).toBe("verified");
      expect(branch.address).toBeTruthy();
      expect(branch.fieldProvenance.address).toBe("owner_confirmed");
      const jsonLd = buildLocalBusinessJsonLd(branch);
      expect(jsonLd).not.toBeNull();
      expect(jsonLd?.["@type"]).toBe("ExerciseGym");
      expect(jsonLd?.address?.streetAddress).toBe(branch.address);
      expect(jsonLd?.telephone).toBe("+91 93724 02074");
      expect(jsonLd?.openingHoursSpecification?.[0]?.opens).toBe("06:00");
      expect(jsonLd?.openingHoursSpecification?.[0]?.closes).toBe("22:00");
    }
  });

  it("LocalBusiness JSON-LD does not invent geo, ratings, or amenities", () => {
    for (const branch of getBranches()) {
      const result = buildLocalBusinessJsonLd(branch);
      expect(result).not.toBeNull();
      const blob = JSON.stringify(result);
      expect(blob).not.toMatch(/geo|aggregateRating|review|priceRange|amenityFeature/i);
    }
  });
});
