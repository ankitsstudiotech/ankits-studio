import { describe, expect, it } from "vitest";
import {
  isUsableTextReview,
  selectFirstUsableReview,
  selectUsableReviews,
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
  it("takes the first usable relevance-sorted reviews, not the highest star", () => {
    const selected = selectUsableReviews(
      [
        review({ rating: 4, text: { text: "First relevant review." } }),
        review({
          rating: 5,
          text: { text: "Flattering five star later in the list." },
          googleMapsUri: "https://maps.google.com/?cid=review-2",
          authorAttribution: { displayName: "Priya K" },
        }),
        review({
          rating: 5,
          text: { text: "Third five star should not be taken." },
          googleMapsUri: "https://maps.google.com/?cid=review-3",
          authorAttribution: { displayName: "Sam R" },
        }),
      ],
      2,
    );
    expect(selected.map((item) => item.text?.text)).toEqual([
      "First relevant review.",
      "Flattering five star later in the list.",
    ]);
    expect(selected[0]?.rating).toBe(4);
  });

  it("does not inspect rating when deciding usability", () => {
    expect(
      isUsableTextReview(
        review({
          rating: undefined,
          text: { text: "No star attached." },
        }),
      ),
    ).toBe(true);
    const selected = selectFirstUsableReview([
      review({ rating: 2, text: { text: "Two stars, still first." } }),
      review({
        rating: 5,
        text: { text: "Five stars later." },
        googleMapsUri: "https://maps.google.com/?cid=review-2",
      }),
    ]);
    expect(selected?.text?.text).toBe("Two stars, still first.");
  });

  it("skips reviews with no usable text instead of substituting copy", () => {
    const selected = selectUsableReviews(
      [
        review({ text: { text: "   " }, rating: 5 }),
        review({
          text: { text: "Usable second review." },
          googleMapsUri: "https://maps.google.com/?cid=review-3",
          authorAttribution: { displayName: "Sam R" },
        }),
      ],
      2,
    );
    expect(selected).toHaveLength(1);
    expect(selected[0]?.text?.text).toBe("Usable second review.");
  });

  it("rejects reviews missing author or Maps URI", () => {
    expect(
      isUsableTextReview(
        review({ authorAttribution: { displayName: "" }, googleMapsUri: "https://maps.google.com/?cid=x" }),
      ),
    ).toBe(false);
    expect(isUsableTextReview(review({ googleMapsUri: undefined }))).toBe(false);
  });

  it("returns empty when Google provides no usable text reviews", () => {
    expect(selectUsableReviews([review({ text: { text: "" } })], 2)).toEqual([]);
    expect(selectFirstUsableReview([])).toBeNull();
  });
});
