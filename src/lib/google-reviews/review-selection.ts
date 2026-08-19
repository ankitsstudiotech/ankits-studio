import type { PlacesPlaceDetails, PlacesReview } from "./types";

export function reviewText(review: PlacesReview): string {
  return review.text?.text?.trim() || "";
}

/**
 * Usable = non-empty text, author display name, and an individual Maps URI.
 * Rating is display data only and must not be inspected here.
 */
export function isUsableTextReview(review: PlacesReview): boolean {
  return (
    reviewText(review).length > 0 &&
    Boolean(review.googleMapsUri?.trim()) &&
    Boolean(review.authorAttribution?.displayName?.trim())
  );
}

/**
 * Google returns reviews relevance-sorted by default.
 * Take the first N usable text reviews in that order — do not re-rank by stars.
 */
export function selectUsableReviews(
  reviews: readonly PlacesReview[] | undefined,
  limit: number,
): PlacesReview[] {
  if (!reviews || reviews.length === 0 || limit <= 0) return [];
  const selected: PlacesReview[] = [];
  for (const review of reviews) {
    if (selected.length >= limit) break;
    if (isUsableTextReview(review)) selected.push(review);
  }
  return selected;
}

export function selectFirstUsableReview(
  reviews: readonly PlacesReview[] | undefined,
): PlacesReview | null {
  return selectUsableReviews(reviews, 1)[0] ?? null;
}

export function toLiveReviewId(place: PlacesPlaceDetails, review: PlacesReview): string {
  if (review.name?.trim()) return review.name.trim();
  const placeId = place.id ?? "place";
  const author = review.authorAttribution?.displayName ?? "author";
  const published = review.publishTime ?? review.relativePublishTimeDescription ?? "undated";
  return `${placeId}:${author}:${published}`;
}
