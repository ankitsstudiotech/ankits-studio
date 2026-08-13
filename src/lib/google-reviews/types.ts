export type GoogleSocialProofMode =
  | "unavailable"
  | "external-links"
  | "live-google-reviews";

export type GoogleExternalBranchLink = {
  slug: string;
  locality: string;
  mapsUrl: string;
};

export type GoogleReviewAuthor = {
  displayName: string;
  profileUri?: string;
  photoUri?: string;
};

export type GoogleLiveReview = {
  id: string;
  branchSlug: string;
  branchLocality: string;
  author: GoogleReviewAuthor;
  rating: number;
  relativePublishTime?: string;
  text: string;
  googleMapsReviewUri: string;
  originalLanguage?: string;
  translated?: boolean;
};

export type GoogleBranchRating = {
  branchSlug: string;
  branchLocality: string;
  rating: number;
  userRatingCount: number;
  googleMapsUri?: string;
};

export type GoogleSocialProofUnavailable = {
  mode: "unavailable";
};

export type GoogleSocialProofExternalLinks = {
  mode: "external-links";
  branches: readonly GoogleExternalBranchLink[];
};

export type GoogleSocialProofLive = {
  mode: "live-google-reviews";
  reviews: readonly GoogleLiveReview[];
  disclosure: string;
  branchRatings: readonly GoogleBranchRating[];
};

export type GoogleSocialProof =
  | GoogleSocialProofUnavailable
  | GoogleSocialProofExternalLinks
  | GoogleSocialProofLive;

export type PlacesReviewText = {
  text?: string;
  languageCode?: string;
};

export type PlacesAuthorAttribution = {
  displayName?: string;
  uri?: string;
  photoUri?: string;
};

export type PlacesReview = {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: PlacesReviewText;
  originalText?: PlacesReviewText;
  authorAttribution?: PlacesAuthorAttribution;
  publishTime?: string;
  googleMapsUri?: string;
};

export type PlacesDisplayName = {
  text?: string;
  languageCode?: string;
};

export type PlacesPlaceDetails = {
  id?: string;
  displayName?: PlacesDisplayName;
  formattedAddress?: string;
  googleMapsUri?: string;
  rating?: number;
  userRatingCount?: number;
  reviews?: PlacesReview[];
};

export type VerifiedGooglePlace = {
  branchSlug: string;
  branchLocality: string;
  placeId: string;
  displayName: string;
  formattedAddress: string;
  googleMapsUri: string;
  confidence: "high" | "medium" | "low";
  matchStatus: "verified";
};

export const PLACES_DETAILS_FIELD_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "googleMapsUri",
  "rating",
  "userRatingCount",
  "reviews",
].join(",");

export const MAX_HOMEPAGE_REVIEWS = 4;
export const MAX_REVIEWS_PER_BRANCH = 1;
