import { describe, expect, it } from "vitest";
import { isStickyCtaEligiblePath } from "@/components/layout/stickyCtaEligibility";

describe("sticky CTA route eligibility", () => {
  it("allows primary conversion and marketing journeys", () => {
    for (const path of [
      "/",
      "/about",
      "/programs",
      "/programs/functional-training",
      "/programs/yoga",
      "/locations",
      "/locations/airoli-sector-19",
      "/timetable",
      "/pricing",
      "/contact",
      "/trial",
    ]) {
      expect(isStickyCtaEligiblePath(path), path).toBe(true);
    }
  });

  it("excludes secondary, legal, withheld, legacy, and design-lab routes", () => {
    for (const path of [
      "/privacy-policy",
      "/terms",
      "/trainers",
      "/transformations",
      "/blog",
      "/blog/sample-starting-with-strength",
      "/programs/strength-training",
      "/programs/personal-training",
      "/programs/kids-dance",
      "/programs/weight-loss-fitness",
      "/design-lab",
      "/design-lab/revamp-a",
      "/this-page-does-not-exist",
      "/book-a-free-trial",
    ]) {
      expect(isStickyCtaEligiblePath(path), path).toBe(false);
    }
  });
});
