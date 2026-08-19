import { afterEach, describe, expect, it, vi } from "vitest";
import { getGoogleSocialProof } from "@/lib/google-reviews";
import {
  getPlaceDetailsRequestCount,
  resetPlaceDetailsRequestCount,
  type PlacesFetch,
} from "@/lib/google-reviews/places-provider";
import { PLACES_DETAILS_FIELD_MASK, type VerifiedGooglePlace } from "@/lib/google-reviews/types";

function place(slug: string, locality: string, id: string): VerifiedGooglePlace {
  return {
    branchSlug: slug,
    branchLocality: locality,
    placeId: id,
    displayName: `Ankit's Studio — ${locality}`,
    formattedAddress: locality,
    googleMapsUri: `https://maps.google.com/?cid=${slug}`,
    confidence: "high",
    matchStatus: "verified",
  };
}

const FOUR_PLACES: readonly VerifiedGooglePlace[] = [
  place("airoli-sector-19", "Airoli Sector 19", "ChIJ-test-airoli-19"),
  place("airoli-sector-8", "Airoli Sector 8", "ChIJ-test-airoli-8"),
  place("ghansoli", "Ghansoli", "ChIJ-test-ghansoli"),
  place("thane", "Thane", "ChIJ-test-thane"),
];

function livePayload(id: string, reviews: unknown[], extras: Record<string, unknown> = {}) {
  return {
    id,
    displayName: { text: "Ankit's Studio" },
    rating: 4.6,
    userRatingCount: 80,
    googleMapsUri: `https://maps.google.com/?cid=${id}`,
    reviews,
    ...extras,
  };
}

function usableReview(name: string, text: string, rating: number) {
  return {
    name: `places/${name}`,
    rating,
    text: { text },
    relativePublishTimeDescription: "2 weeks ago",
    googleMapsUri: `https://maps.google.com/?cid=review-${name}`,
    authorAttribution: {
      displayName: name,
      uri: "https://www.google.com/maps/contrib/1",
      photoUri: "https://lh3.googleusercontent.com/a/example",
    },
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  resetPlaceDetailsRequestCount();
});

describe("Google social proof provider", () => {
  it("falls back to external Maps links when the Places key is missing", async () => {
    const proof = await getGoogleSocialProof({ apiKey: null });
    expect(proof.mode).toBe("external-links");
    if (proof.mode !== "external-links") return;
    expect(proof.branches).toHaveLength(4);
    for (const branch of proof.branches) {
      expect(branch.mapsUrl).toMatch(/^https:\/\/www\.google\.com\/maps\?cid=\d+$/);
      expect(branch.mapsUrl).not.toMatch(/\/maps\/dir\/|destination=/);
    }
  });

  it("falls back to external links when Place IDs are unresolved even with a key", async () => {
    const fetchImpl = vi.fn();
    const proof = await getGoogleSocialProof({
      apiKey: "test-key",
      verifiedPlaces: [],
      fetchImpl,
    });
    expect(proof.mode).toBe("external-links");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("falls back silently when every Place Details call fails", async () => {
    const fetchImpl = vi.fn(async () => new Response("quota", { status: 429 }));
    const proof = await getGoogleSocialProof({
      apiKey: "test-key",
      verifiedPlaces: FOUR_PLACES,
      fetchImpl,
    });
    expect(proof.mode).toBe("external-links");
    if (proof.mode !== "external-links") return;
    expect(proof.branches.length).toBe(4);
  });

  it("keeps reviews from successful branches when one Place Details call fails", async () => {
    const fetchImpl = vi.fn<PlacesFetch>(async (input) => {
      if (String(input).includes("ChIJ-test-thane")) {
        return new Response("timeout", { status: 504 });
      }
      const id = String(input).split("/").pop() ?? "id";
      return new Response(
        JSON.stringify(
          livePayload(id, [usableReview(`${id}-a`, `First relevant ${id}`, 4), usableReview(`${id}-b`, `Second ${id}`, 2)]),
        ),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    });

    const proof = await getGoogleSocialProof({
      apiKey: "test-key",
      verifiedPlaces: FOUR_PLACES,
      fetchImpl,
    });

    expect(proof.mode).toBe("live-google-reviews");
    if (proof.mode !== "live-google-reviews") return;
    expect(proof.reviews).toHaveLength(6);
    expect(proof.reviews.some((item) => item.branchSlug === "thane")).toBe(false);
    expect(proof.fallbackBranches.map((item) => item.slug)).toEqual(["thane"]);
    expect(JSON.stringify(proof)).not.toMatch(/504|timeout|quota/i);
  });

  it("selects two usable reviews per branch without star filtering", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify(
          livePayload("ChIJ-test-airoli-19", [
            usableReview("Alex M", "First relevant Google review.", 4),
            usableReview("Priya K", "Later five-star review.", 5),
            usableReview("Sam R", "Third review must not appear.", 5),
          ]),
        ),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const proof = await getGoogleSocialProof({
      apiKey: "test-key",
      verifiedPlaces: [FOUR_PLACES[0]!],
      fetchImpl,
    });

    expect(proof.mode).toBe("live-google-reviews");
    if (proof.mode !== "live-google-reviews") return;
    expect(proof.reviews).toHaveLength(2);
    expect(proof.reviews[0]?.text).toBe("First relevant Google review.");
    expect(proof.reviews[0]?.rating).toBe(4);
    expect(proof.reviews[1]?.text).toBe("Later five-star review.");
    expect(proof.disclosure).toMatch(/relevance order/i);
    expect(JSON.stringify(proof)).not.toMatch(/Third review must not appear/);
  });

  it("still shows a review when rating is missing", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify(
          livePayload("ChIJ-test-airoli-19", [
            {
              ...usableReview("Alex M", "Text only, no star.", 4),
              rating: undefined,
            },
          ]),
        ),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    const proof = await getGoogleSocialProof({
      apiKey: "test-key",
      verifiedPlaces: [FOUR_PLACES[0]!],
      fetchImpl,
    });
    expect(proof.mode).toBe("live-google-reviews");
    if (proof.mode !== "live-google-reviews") return;
    expect(proof.reviews[0]?.text).toBe("Text only, no star.");
    expect(proof.reviews[0]?.rating).toBeUndefined();
  });

  it("skips empty text and missing avatars without inventing content", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify(
          livePayload("ChIJ-test-airoli-19", [
            { ...usableReview("Empty", "   ", 5), text: { text: "   " } },
            {
              ...usableReview("No Photo", "Usable without avatar.", 3),
              authorAttribution: { displayName: "No Photo" },
            },
          ]),
        ),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    const proof = await getGoogleSocialProof({
      apiKey: "test-key",
      verifiedPlaces: [FOUR_PLACES[0]!],
      fetchImpl,
    });
    expect(proof.mode).toBe("live-google-reviews");
    if (proof.mode !== "live-google-reviews") return;
    expect(proof.reviews).toHaveLength(1);
    expect(proof.reviews[0]?.author.displayName).toBe("No Photo");
    expect(proof.reviews[0]?.author.photoUri).toBeUndefined();
    expect(JSON.stringify(proof)).not.toMatch(/John Doe|placeholder reviewer/i);
  });

  it("issues at most four Place Details requests and never puts the key in the URL", async () => {
    resetPlaceDetailsRequestCount();
    const fetchImpl = vi.fn<PlacesFetch>(async (input, init) => {
      expect(String(input)).not.toMatch(/key=/i);
      expect((init?.headers as Record<string, string>)["X-Goog-Api-Key"]).toBe("test-key");
      expect((init?.headers as Record<string, string>)["X-Goog-FieldMask"]).toBe(PLACES_DETAILS_FIELD_MASK);
      expect((init?.headers as Record<string, string>)["X-Goog-FieldMask"]).not.toMatch(/\*/);
      expect(init?.cache).toBe("no-store");
      return new Response("no", { status: 403 });
    });
    await getGoogleSocialProof({
      apiKey: "test-key",
      verifiedPlaces: FOUR_PLACES,
      fetchImpl,
    });
    expect(fetchImpl).toHaveBeenCalledTimes(4);
    expect(getPlaceDetailsRequestCount()).toBe(4);
  });

  it("does not average branch ratings into a fake studio score", async () => {
    const fetchImpl = vi.fn<PlacesFetch>(async (input) => {
      const thane = String(input).includes("thane");
      return new Response(
        JSON.stringify(
          livePayload(
            String(input).split("/").pop() ?? "id",
            [usableReview("Alex M", "A review.", 4)],
            thane ? { rating: 4.1, userRatingCount: 12 } : { rating: 4.9, userRatingCount: 90 },
          ),
        ),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    });
    const proof = await getGoogleSocialProof({
      apiKey: "test-key",
      verifiedPlaces: FOUR_PLACES,
      fetchImpl,
    });
    expect(proof.mode).toBe("live-google-reviews");
    if (proof.mode !== "live-google-reviews") return;
    expect(proof.branchRatings).toHaveLength(4);
    expect(JSON.stringify(proof)).not.toMatch(/across all studios/i);
  });
});
