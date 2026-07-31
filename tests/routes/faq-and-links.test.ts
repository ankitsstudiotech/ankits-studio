import { describe, expect, it } from "vitest";
import { getFaqs, getPubliclyListedBranches } from "@/content";

describe("programme/location-specific FAQ support", () => {
  it("returns the yoga-specific FAQ when filtering by programmeSlug", () => {
    const faqs = getFaqs({ programmeSlug: "yoga" });
    expect(faqs.length).toBeGreaterThan(0);
    expect(faqs.every((faq) => faq.programmeSlug === "yoga")).toBe(true);
  });

  it("returns the Airoli-specific FAQ when filtering by branchSlug", () => {
    const faqs = getFaqs({ branchSlug: "airoli" });
    expect(faqs.length).toBeGreaterThan(0);
    expect(faqs.every((faq) => faq.branchSlug === "airoli")).toBe(true);
  });

  it("returns no programme-specific FAQ for a programme with none associated", () => {
    const faqs = getFaqs({ programmeSlug: "kids-dance" });
    expect(faqs).toEqual([]);
  });
});

describe("internal links between programmes and available locations", () => {
  it("Thane is never among the publicly-listed branches used for programme→branch links", () => {
    const publicBranches = getPubliclyListedBranches();
    expect(publicBranches.some((branch) => branch.slug === "thane")).toBe(false);
  });

  it("every publicly-listed branch is reachable and distinct", () => {
    const slugs = getPubliclyListedBranches().map((branch) => branch.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.length).toBeGreaterThan(0);
  });
});
