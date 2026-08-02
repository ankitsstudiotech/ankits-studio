import { describe, expect, it } from "vitest";
import { getFaqs, getPubliclyListedBranches } from "@/content";

describe("programme/location-specific FAQ support", () => {
  it("returns the yoga-specific FAQ when filtering by programmeSlug", () => {
    const faqs = getFaqs({ programmeSlug: "yoga" });
    expect(faqs.length).toBeGreaterThan(0);
    expect(faqs.every((faq) => faq.programmeSlug === "yoga")).toBe(true);
  });

  it("returns the Airoli Sector 19 FAQ when filtering by branchSlug", () => {
    const faqs = getFaqs({ branchSlug: "airoli-sector-19" });
    expect(faqs.length).toBeGreaterThan(0);
    expect(faqs.every((faq) => faq.branchSlug === "airoli-sector-19")).toBe(true);
  });

  it("returns no programme-specific FAQ for a programme with none associated", () => {
    const faqs = getFaqs({ programmeSlug: "kids-dance" });
    expect(faqs).toEqual([]);
  });
});

describe("internal links between programmes and available locations", () => {
  it("includes all four owner-confirmed open branches in public listings", () => {
    const publicBranches = getPubliclyListedBranches();
    const slugs = publicBranches.map((branch) => branch.slug).sort();
    expect(slugs).toEqual(["airoli-sector-19", "airoli-sector-8", "ghansoli", "thane"]);
  });

  it("every publicly-listed branch is reachable and distinct", () => {
    const slugs = getPubliclyListedBranches().map((branch) => branch.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.length).toBe(4);
  });
});
