import { describe, expect, it } from "vitest";
import {
  isUsableTextReview,
  selectFirstUsableReview,
} from "@/lib/google-reviews/review-selection";
import type { PlacesReview } from "@/lib/google-reviews/types";

const review = (overrides: Partial<PlacesReview>): PlacesReview => ({
  rating: 4,
  text: { text: "Coach-led sessions that feel welcoming." },
  googleMapsUri: "https://maps.google.com/?cid=review-1",
  authorAttribution: { displayName: "Alex M" },
  ...overrides,
});

describe("Google review selection", () => {
  it("takes the first usable relevance-sorted review, not the highest star", () => {
    const selected = selectFirstUsableReview([
      review({ rating: 4, text: { text: "First relevant review." } }),
      review({
        rating: 5,
        text: { text: "Flattering five star later in the list." },
        googleMapsUri: "https://maps.google.com/?cid=review-2",
        authorAttribution: { displayName: "Priya K" },
      }),
    ]);
    expect(selected?.text?.text).toBe("First relevant review.");
    expect(selected?.rating).toBe(4);
  });

  it("skips reviews with no usable text instead of substituting copy", () => {
    const selected = selectFirstUsableReview([
      review({ text: { text: "   " }, rating: 5 }),
      review({
        text: { text: "Usable second review." },
        googleMapsUri: "https://maps.google.com/?cid=review-3",
        authorAttribution: { displayName: "Sam R" },
      }),
    ]);
    expect(selected?.text?.text).toBe("Usable second review.");
  });

  it("rejects reviews missing author or Maps URI", () => {
    expect(
      isUsableTextReview(
        review({ authorAttribution: { displayName: "" }, googleMapsUri: "https://maps.google.com/?cid=x" }),
      ),
    ).toBe(false);
    expect(
      isUsableTextReview(review({ googleMapsUri: undefined })),
    ).toBe(false);
  });

  it("returns null when Google provides no usable text reviews", () => {
    expect(selectFirstUsableReview([review({ text: { text: "" } })])).toBeNull();
    expect(selectFirstUsableReview([])).toBeNull();
  });
});
