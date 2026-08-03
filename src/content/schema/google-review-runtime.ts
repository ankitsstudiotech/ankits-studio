/**
 * Runtime Google review display contract — for a future Places-backed UI.
 * Do not persist review text, ratings, or author PII as CMS records in this
 * phase. Place IDs are not added here. See ADR-021 / ADR-022 and
 * docs/revamp/29-google-reviews-and-member-stories-readiness.md.
 */

export type GoogleReviewTranslationStatus = "original" | "translated" | "unknown";

export type GoogleReviewModerationStatus =
  | "pending"
  | "approved_for_display"
  | "withheld"
  | "removed_at_source";

export type GoogleReviewHealthClaimRisk = "none" | "low" | "elevated" | "blocked";

/**
 * Shape only — populated at runtime from Places API responses later.
 * Never treat as a content-domain mock/verified record.
 */
export type GoogleReviewRuntime = {
  sourceBranchSlug: string;
  placeId: string;
  authorDisplayName: string;
  authorAvatarUri?: string;
  authorProfileUri?: string;
  rating?: number;
  exactReviewText: string;
  originalLanguage?: string;
  translationStatus: GoogleReviewTranslationStatus;
  publishedDateLabel?: string;
  googleMapsReviewUri: string;
  googleAttributionRequired: true;
  retrievalTimestamp: string;
  moderationStatus: GoogleReviewModerationStatus;
  healthClaimRisk: GoogleReviewHealthClaimRisk;
};
