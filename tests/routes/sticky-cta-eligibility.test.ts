import { describe, expect, it } from "vitest";
import { isStickyCtaEligiblePath } from "@/components/layout/stickyCtaEligibility";

describe("sticky CTA route eligibility", () => {
  it("allows browse journeys where sticky assists conversion", () => {
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
    ]) {
      expect(isStickyCtaEligiblePath(path), path).toBe(true);
    }
  });

  it("hard-excludes trial and contact conversion destinations", () => {
    for (const path of ["/trial", "/trial/extra", "/contact", "/book-a-free-trial"]) {
      expect(isStickyCtaEligiblePath(path), path).toBe(false);
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
    ]) {
      expect(isStickyCtaEligiblePath(path), path).toBe(false);
    }
  });
});
