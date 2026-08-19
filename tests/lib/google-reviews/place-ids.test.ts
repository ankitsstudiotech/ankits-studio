import { describe, expect, it } from "vitest";
import { getPubliclyListedBranches } from "@/content";
import { VERIFIED_GOOGLE_PLACE_IDS } from "@/lib/google-reviews";
import { OWNER_MAPS_PLACE_LISTING_HREFS } from "@/content/maps-place-listing";

function cid(url: string): string {
  return new URL(url).searchParams.get("cid") ?? "";
}

describe("verified Google Place IDs", () => {
  it("stores four Place IDs that match branch config and production CID listings", () => {
    const branches = getPubliclyListedBranches();
    expect(VERIFIED_GOOGLE_PLACE_IDS).toHaveLength(4);
    for (const place of VERIFIED_GOOGLE_PLACE_IDS) {
      const branch = branches.find((item) => item.slug === place.branchSlug);
      expect(branch?.googlePlaceId).toBe(place.placeId);
      expect(place.placeId.startsWith("ChIJ")).toBe(true);
      const listing =
        OWNER_MAPS_PLACE_LISTING_HREFS[place.branchSlug as keyof typeof OWNER_MAPS_PLACE_LISTING_HREFS];
      expect(cid(place.googleMapsUri)).toBe(cid(listing));
    }
  });
});
