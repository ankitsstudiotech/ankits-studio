import { afterEach, describe, expect, it, vi } from "vitest";
import { getGoogleSocialProof } from "@/lib/google-reviews";
import type { PlacesFetch } from "@/lib/google-reviews/places-provider";
import type { VerifiedGooglePlace } from "@/lib/google-reviews/types";

const PLACES: readonly VerifiedGooglePlace[] = [
  {
    branchSlug: "airoli-sector-19",
    branchLocality: "Airoli Sector 19",
    placeId: "ChIJ-test-airoli-19",
    displayName: "Ankit's Studio — Airoli Sector 19",
    formattedAddress: "Sector 19, Airoli",
    googleMapsUri: "https://maps.google.com/?cid=19",
    confidence: "high",
    matchStatus: "verified",
  },
];

afterEach(() => {
  vi.restoreAllMocks();
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

  it("falls back silently when Place Details fails", async () => {
    const fetchImpl = vi.fn(async () => new Response("quota", { status: 429 }));
    const proof = await getGoogleSocialProof({
      apiKey: "test-key",
      verifiedPlaces: PLACES,
      fetchImpl,
    });
    expect(proof.mode).toBe("external-links");
    if (proof.mode !== "external-links") return;
    expect(proof.branches.length).toBe(4);
  });

  it("selects one usable review per verified branch without star filtering", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify({
          id: "ChIJ-test-airoli-19",
          displayName: { text: "Ankit's Studio — Airoli Sector 19" },
          rating: 4.6,
          userRatingCount: 80,
          googleMapsUri: "https://maps.google.com/?cid=19",
          reviews: [
            {
              name: "places/ChIJ-test-airoli-19/reviews/abc",
              rating: 4,
              text: { text: "First relevant Google review." },
              relativePublishTimeDescription: "2 weeks ago",
              googleMapsUri: "https://maps.google.com/?cid=review-abc",
              authorAttribution: {
                displayName: "Alex M",
                uri: "https://www.google.com/maps/contrib/1",
                photoUri: "https://lh3.googleusercontent.com/a/example",
              },
            },
            {
              rating: 5,
              text: { text: "Later five-star review." },
              googleMapsUri: "https://maps.google.com/?cid=review-xyz",
              authorAttribution: { displayName: "Priya K" },
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const proof = await getGoogleSocialProof({
      apiKey: "test-key",
      verifiedPlaces: PLACES,
      fetchImpl,
    });

    expect(proof.mode).toBe("live-google-reviews");
    if (proof.mode !== "live-google-reviews") return;
    expect(proof.reviews).toHaveLength(1);
    expect(proof.reviews[0]?.text).toBe("First relevant Google review.");
    expect(proof.reviews[0]?.rating).toBe(4);
    expect(proof.reviews[0]?.author.displayName).toBe("Alex M");
    expect(proof.reviews[0]?.googleMapsReviewUri).toBe(
      "https://maps.google.com/?cid=review-abc",
    );
    expect(proof.disclosure).toMatch(/relevance-sorted/i);
    expect(JSON.stringify(proof)).not.toMatch(/Later five-star review/);
  });

  it("does not send the API key as a query string", async () => {
    const fetchImpl = vi.fn<PlacesFetch>(async (input, init) => {
      expect(String(input)).not.toMatch(/key=/i);
      expect((init?.headers as Record<string, string>)["X-Goog-Api-Key"]).toBe("test-key");
      expect((init?.headers as Record<string, string>)["X-Goog-FieldMask"]).toMatch(/reviews/);
      expect((init?.headers as Record<string, string>)["X-Goog-FieldMask"]).not.toMatch(/\*/);
      return new Response("no", { status: 403 });
    });
    await getGoogleSocialProof({
      apiKey: "test-key",
      verifiedPlaces: PLACES,
      fetchImpl,
    });
    expect(fetchImpl).toHaveBeenCalled();
  });
});
