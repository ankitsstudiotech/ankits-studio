import {
  getBranchMapsUrl,
  getPubliclyListedBranches,
} from "@/content";
import { getGooglePlacesApiKey } from "./credentials";
import { VERIFIED_GOOGLE_PLACE_IDS } from "./place-ids";
import { fetchPlaceDetails, type PlacesFetch } from "./places-provider";
import { reviewText, selectFirstUsableReview, toLiveReviewId } from "./review-selection";
import { logGoogleReviewsDiagnostic } from "./log";
import type {
  GoogleBranchRating,
  GoogleExternalBranchLink,
  GoogleLiveReview,
  GoogleSocialProof,
  VerifiedGooglePlace,
} from "./types";
import { MAX_HOMEPAGE_REVIEWS } from "./types";

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

function liveDisclosure(reviewCount: number): string {
  if (reviewCount <= 1) {
    return "This review is from Google’s relevance-sorted results. It is not displayed chronologically.";
  }
  if (reviewCount === 4) {
    return "One text review per studio is shown from Google’s relevance-sorted results.";
  }
  return "Reviews shown are selected from Google’s relevance-sorted results. They are not displayed chronologically.";
}

export type GoogleSocialProofOptions = {
  apiKey?: string | null;
  fetchImpl?: PlacesFetch;
  verifiedPlaces?: readonly VerifiedGooglePlace[];
};

/**
 * Runtime Google social proof. Never persists review PII.
 * Missing credentials, unresolved Place IDs, or API failure → external-links.
 */
export async function getGoogleSocialProof(
  options: GoogleSocialProofOptions = {},
): Promise<GoogleSocialProof> {
  const fallback = fallbackProof();
  const apiKey =
    options.apiKey === undefined ? getGooglePlacesApiKey() : options.apiKey;
  const verifiedPlaces = options.verifiedPlaces ?? VERIFIED_GOOGLE_PLACE_IDS;

  if (!apiKey) {
    return fallback;
  }

  if (verifiedPlaces.length === 0) {
    logGoogleReviewsDiagnostic("Places key present but no verified Place IDs");
    return fallback;
  }

  try {
    const reviews: GoogleLiveReview[] = [];
    const branchRatings: GoogleBranchRating[] = [];

    for (const place of verifiedPlaces) {
      if (reviews.length >= MAX_HOMEPAGE_REVIEWS) break;

      const details = await fetchPlaceDetails({
        placeId: place.placeId,
        apiKey,
        fetchImpl: options.fetchImpl,
      });

      if (!details) continue;

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

      const selected = selectFirstUsableReview(details.reviews);
      if (!selected) continue;

      const original = selected.originalText?.text?.trim();
      const displayed = reviewText(selected);
      reviews.push({
        id: toLiveReviewId(details, selected),
        branchSlug: place.branchSlug,
        branchLocality: place.branchLocality,
        author: {
          displayName: selected.authorAttribution!.displayName!.trim(),
          profileUri: selected.authorAttribution?.uri?.trim() || undefined,
          photoUri: selected.authorAttribution?.photoUri?.trim() || undefined,
        },
        rating: selected.rating!,
        relativePublishTime: selected.relativePublishTimeDescription,
        text: displayed,
        googleMapsReviewUri: selected.googleMapsUri!.trim(),
        originalLanguage: selected.originalText?.languageCode,
        translated: Boolean(original && original !== displayed),
      });
    }

    if (reviews.length === 0) {
      logGoogleReviewsDiagnostic("No usable text reviews returned");
      return fallback;
    }

    return {
      mode: "live-google-reviews",
      reviews: reviews.slice(0, MAX_HOMEPAGE_REVIEWS),
      disclosure: liveDisclosure(Math.min(reviews.length, MAX_HOMEPAGE_REVIEWS)),
      branchRatings,
    };
  } catch {
    logGoogleReviewsDiagnostic("Live review assembly failed");
    return fallback;
  }
}
