import {
  getBranchMapsUrl,
  getPubliclyListedBranches,
} from "@/content";
import { getGooglePlacesApiKey } from "./credentials";
import { VERIFIED_GOOGLE_PLACE_IDS } from "./place-ids";
import { fetchPlaceDetails, type PlacesFetch } from "./places-provider";
import { reviewText, selectUsableReviews, toLiveReviewId } from "./review-selection";
import { logGoogleReviewsDiagnostic } from "./log";
import type {
  GoogleBranchRating,
  GoogleExternalBranchLink,
  GoogleLiveReview,
  GoogleSocialProof,
  VerifiedGooglePlace,
} from "./types";
import {
  GOOGLE_REVIEW_DISCLOSURE,
  MAX_HOMEPAGE_REVIEWS,
  MAX_PLACE_DETAILS_REQUESTS,
  MAX_REVIEWS_PER_BRANCH,
} from "./types";

function externalBranchLinks(): GoogleExternalBranchLink[] {
  const links: GoogleExternalBranchLink[] = [];
  for (const branch of getPubliclyListedBranches()) {
    const mapsUrl = getBranchMapsUrl(branch);
    if (!mapsUrl) continue;
    links.push({
      slug: branch.slug,
      locality: branch.locality,
      mapsUrl,
    });
  }
  return links;
}

function fallbackProof(): GoogleSocialProof {
  const branches = externalBranchLinks();
  if (branches.length === 0) {
    return { mode: "unavailable" };
  }
  return { mode: "external-links", branches };
}

function mapsUrlForPlace(place: VerifiedGooglePlace): string | undefined {
  return (
    externalBranchLinks().find((branch) => branch.slug === place.branchSlug)?.mapsUrl ??
    place.googleMapsUri
  );
}

export type GoogleSocialProofOptions = {
  apiKey?: string | null;
  fetchImpl?: PlacesFetch;
  verifiedPlaces?: readonly VerifiedGooglePlace[];
};

/**
 * Runtime Google social proof. Never persists review PII.
 * Missing credentials, unresolved Place IDs, or total API failure → external-links.
 * One failed branch does not drop reviews from the others.
 */
export async function getGoogleSocialProof(
  options: GoogleSocialProofOptions = {},
): Promise<GoogleSocialProof> {
  const fallback = fallbackProof();
  const apiKey =
    options.apiKey === undefined ? getGooglePlacesApiKey() : options.apiKey;
  const verifiedPlaces = (options.verifiedPlaces ?? VERIFIED_GOOGLE_PLACE_IDS).slice(
    0,
    MAX_PLACE_DETAILS_REQUESTS,
  );

  if (!apiKey) {
    return fallback;
  }

  if (verifiedPlaces.length === 0) {
    logGoogleReviewsDiagnostic("Places key present but no verified Place IDs");
    return fallback;
  }

  try {
    const detailsByPlace = await Promise.all(
      verifiedPlaces.map(async (place) => ({
        place,
        details: await fetchPlaceDetails({
          placeId: place.placeId,
          apiKey,
          fetchImpl: options.fetchImpl,
        }),
      })),
    );

    const reviews: GoogleLiveReview[] = [];
    const branchRatings: GoogleBranchRating[] = [];
    const fallbackBranches: GoogleExternalBranchLink[] = [];

    for (const { place, details } of detailsByPlace) {
      if (!details) {
        const mapsUrl = mapsUrlForPlace(place);
        if (mapsUrl) {
          fallbackBranches.push({
            slug: place.branchSlug,
            locality: place.branchLocality,
            mapsUrl,
          });
        }
        continue;
      }

      if (
        typeof details.rating === "number" &&
        typeof details.userRatingCount === "number"
      ) {
        branchRatings.push({
          branchSlug: place.branchSlug,
          branchLocality: place.branchLocality,
          rating: details.rating,
          userRatingCount: details.userRatingCount,
          googleMapsUri: details.googleMapsUri,
        });
      }

      const selected = selectUsableReviews(details.reviews, MAX_REVIEWS_PER_BRANCH);
      if (selected.length === 0) {
        const mapsUrl = mapsUrlForPlace(place);
        if (mapsUrl) {
          fallbackBranches.push({
            slug: place.branchSlug,
            locality: place.branchLocality,
            mapsUrl,
          });
        }
        continue;
      }

      for (const review of selected) {
        if (reviews.length >= MAX_HOMEPAGE_REVIEWS) break;
        const original = review.originalText?.text?.trim();
        const displayed = reviewText(review);
        reviews.push({
          id: toLiveReviewId(details, review),
          branchSlug: place.branchSlug,
          branchLocality: place.branchLocality,
          author: {
            displayName: review.authorAttribution!.displayName!.trim(),
            profileUri: review.authorAttribution?.uri?.trim() || undefined,
            photoUri: review.authorAttribution?.photoUri?.trim() || undefined,
          },
          rating: typeof review.rating === "number" ? review.rating : undefined,
          relativePublishTime: review.relativePublishTimeDescription,
          text: displayed,
          googleMapsReviewUri: review.googleMapsUri!.trim(),
          flagContentUri: review.flagContentUri?.trim() || undefined,
          originalLanguage: review.originalText?.languageCode,
          translated: Boolean(original && original !== displayed),
        });
      }
    }

    if (reviews.length === 0) {
      logGoogleReviewsDiagnostic("No usable text reviews returned");
      return fallback;
    }

    return {
      mode: "live-google-reviews",
      reviews: reviews.slice(0, MAX_HOMEPAGE_REVIEWS),
      disclosure: GOOGLE_REVIEW_DISCLOSURE,
      branchRatings,
      fallbackBranches,
    };
  } catch {
    logGoogleReviewsDiagnostic("Live review assembly failed");
    return fallback;
  }
}
