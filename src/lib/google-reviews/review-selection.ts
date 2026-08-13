import type { PlacesPlaceDetails, PlacesReview } from "./types";

export function reviewText(review: PlacesReview): string {
  return review.text?.text?.trim() || "";
}

export function isUsableTextReview(review: PlacesReview): boolean {
  return (
    reviewText(review).length > 0 &&
    Boolean(review.googleMapsUri?.trim()) &&
    Boolean(review.authorAttribution?.displayName?.trim()) &&
    typeof review.rating === "number" &&
    Number.isFinite(review.rating)
  );
}

/**
 * Google returns reviews relevance-sorted by default.
 * Take the first usable text review — do not re-rank by stars or keywords.
 */
export function selectFirstUsableReview(
  reviews: readonly PlacesReview[] | undefined,
): PlacesReview | null {
  if (!reviews || reviews.length === 0) return null;
  return reviews.find(isUsableTextReview) ?? null;
}

export function toLiveReviewId(place: PlacesPlaceDetails, review: PlacesReview): string {
  if (review.name?.trim()) return review.name.trim();
  const placeId = place.id ?? "place";
  const author = review.authorAttribution?.displayName ?? "author";
  const published = review.publishTime ?? review.relativePublishTimeDescription ?? "undated";
  return `${placeId}:${author}:${published}`;
}
