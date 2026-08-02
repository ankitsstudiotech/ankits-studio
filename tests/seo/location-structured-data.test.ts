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
  it("omits ExerciseGym for every current branch (addresses pending)", () => {
    for (const branch of getBranches()) {
      expect(buildLocalBusinessJsonLd(branch)).toBeNull();
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

  it("does not invent Maps URLs for Sector 8", () => {
    const sector8 = getBranches().find((b) => b.slug === "airoli-sector-8");
    expect(sector8).toBeDefined();
    expect(getBranchMapsUrl(sector8!)).toBeNull();
  });

  it("exposes owner-confirmed Maps URLs without requiring full branch verification", () => {
    const withMaps = getBranches().filter((b) => b.slug !== "airoli-sector-8");
    expect(withMaps).toHaveLength(3);
    for (const branch of withMaps) {
      const url = getBranchMapsUrl(branch);
      expect(url).toMatch(/^https:\/\/maps\.app\.goo\.gl\//);
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
