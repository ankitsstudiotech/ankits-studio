import { describe, expect, it } from "vitest";
import {
  getBranchMapsOwnerUrl,
  getBranchMapsUrl,
  getPubliclyListedBranches,
  isMapsDirectionsHref,
  OWNER_CONFIRMED_MAPS_SHORT_URLS,
  OWNER_MAPS_PLACE_LISTING_HREFS,
  toMapsPlaceListingHref,
} from "@/content";

describe("Maps destination semantics — Bug Batch 03", () => {
  it("keeps owner short URLs in content and public hrefs as place listings", () => {
    const branches = getPubliclyListedBranches();
    expect(branches).toHaveLength(4);

    for (const branch of branches) {
      const slug = branch.slug as keyof typeof OWNER_CONFIRMED_MAPS_SHORT_URLS;
      const owner = getBranchMapsOwnerUrl(branch);
      const href = getBranchMapsUrl(branch);

      expect(owner).toBe(OWNER_CONFIRMED_MAPS_SHORT_URLS[slug]);
      expect(href).toBe(OWNER_MAPS_PLACE_LISTING_HREFS[slug]);
      expect(href).toMatch(/^https:\/\/www\.google\.com\/maps\?cid=\d+$/);
      expect(isMapsDirectionsHref(href!)).toBe(false);
      expect(href).not.toMatch(/maps\.app\.goo\.gl/);
    }
  });

  it("rewrites owner short URLs to the same listing’s place href", () => {
    expect(toMapsPlaceListingHref(OWNER_CONFIRMED_MAPS_SHORT_URLS.ghansoli)).toBe(
      OWNER_MAPS_PLACE_LISTING_HREFS.ghansoli,
    );
    expect(
      isMapsDirectionsHref(
        "https://www.google.com/maps/dir//Ankit's+Studio/@19.16,72.99,17z",
      ),
    ).toBe(true);
    expect(isMapsDirectionsHref("https://www.google.com/maps?cid=1")).toBe(false);
  });

  it("does not resurrect older intake short URLs", () => {
    const blob = JSON.stringify(OWNER_CONFIRMED_MAPS_SHORT_URLS);
    expect(blob).not.toMatch(/JowoDwXZUVqiFfWC6|7zLudwn1c6RUZZWUA|fvGjyZ51AtHBBQAT7|bzzHhBbu5qg5J1pHA/);
    expect(blob).not.toMatch(/NWrGtXKKYwr5xXwbA|WzhJUEhAvC67eMgR8|bvzahC17HkciT6QQ6/);
  });
});
