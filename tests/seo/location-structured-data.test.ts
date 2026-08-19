import { describe, expect, it } from "vitest";
import {
  getBranchMapsUrl,
  getBranchPhysicalProgrammes,
  getBranches,
  getPubliclyListedBranches,
} from "@/content";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildLocalBusinessJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/structured-data";
import { serializeJsonLd } from "@/lib/seo/serialize";

const FORBIDDEN =
  /"(@type"\s*:\s*"(Offer|Event|Course|AggregateRating|Review)"|"(aggregateRating|review|geo|priceRange|hasCourseInstance)")/i;

describe("location structured data — ADR-018", () => {
  it("emits ExerciseGym for every verified branch with owner-confirmed address", () => {
    for (const branch of getBranches()) {
      const jsonLd = buildLocalBusinessJsonLd(branch);
      expect(jsonLd).not.toBeNull();
      expect(jsonLd?.["@type"]).toBe("ExerciseGym");
      expect(jsonLd?.address?.streetAddress).toBe(branch.address);
      expect(jsonLd?.address?.addressLocality).toBe(branch.locality);
      expect(jsonLd?.address?.postalCode).toBe(branch.pinCode);
      expect(jsonLd?.address?.addressRegion).toBe("Maharashtra");
      expect(jsonLd?.address?.addressCountry).toBe("IN");
      expect(jsonLd?.telephone).toBe(branch.phone);
      expect(jsonLd?.openingHoursSpecification).toHaveLength(7);
      expect(jsonLd?.hasMap).toMatch(/^https:\/\/www\.google\.com\/maps\?cid=\d+$/);
      expect(jsonLd?.hasMap).not.toMatch(/\/maps\/dir\/|destination=/);
      expect(jsonLd?.parentOrganization?.name).toMatch(/Ankit/);
      const blob = serializeJsonLd(jsonLd!);
      expect(blob).not.toMatch(FORBIDDEN);
      expect(blob).not.toMatch(/geo|aggregateRating|amenityFeature|priceRange/i);
    }
  });

  it("emits WebPage with only visible name/description/url for each branch", () => {
    for (const branch of getBranches()) {
      const page = buildWebPageJsonLd({
        name: branch.name,
        description: branch.seoDescription,
        path: `/locations/${branch.slug}`,
      });
      expect(page["@type"]).toBe("WebPage");
      const blob = serializeJsonLd(page);
      expect(blob).not.toMatch(FORBIDDEN);
      expect(blob).not.toMatch(/PostalAddress|streetAddress/);
      expect(Object.keys(page).sort()).toEqual(
        ["@context", "@type", "description", "name", "url"].sort(),
      );
    }
  });

  it("never puts Home PT or Online Training inside physical branch programme lists", () => {
    for (const branch of getBranches()) {
      const physical = getBranchPhysicalProgrammes(branch);
      expect(physical.every((p) => p.slug !== "home-personal-training" && p.slug !== "online-training")).toBe(
        true,
      );
      expect(physical.some((p) => p.deliveryMode === "home" || p.deliveryMode === "online")).toBe(false);
    }
  });

  it("exposes owner-confirmed Maps URLs for all four branches", () => {
    expect(getBranches()).toHaveLength(4);
    for (const branch of getBranches()) {
      const url = getBranchMapsUrl(branch);
      expect(url).toMatch(/^https:\/\/www\.google\.com\/maps\?cid=\d+$/);
      expect(url).not.toMatch(/\/maps\/dir\/|destination=/);
    }
  });

  it("/locations CollectionPage stays minimal", () => {
    const collection = buildCollectionPageJsonLd({
      name: "Locations",
      description: "Four branches",
      path: "/locations",
    });
    expect(collection["@type"]).toBe("CollectionPage");
    expect(serializeJsonLd(collection)).not.toMatch(/ExerciseGym|LocalBusiness|ItemList/);
  });

  it("breadcrumbs stay accurate for public branches", () => {
    for (const branch of getPubliclyListedBranches()) {
      const crumbs = buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Locations", path: "/locations" },
        { name: branch.locality, path: `/locations/${branch.slug}` },
      ]);
      expect(crumbs.itemListElement[2]?.item).toContain(`/locations/${branch.slug}`);
    }
  });
});
