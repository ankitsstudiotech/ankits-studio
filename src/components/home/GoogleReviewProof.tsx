import type { GoogleReviewProofItem } from "@/content/schema/google-review-proof";

export type GoogleReviewProofProps = {
  reviews?: readonly GoogleReviewProofItem[];
};

/**
 * Homepage Google Reviews chapter — renders nothing until approved reviews exist.
 * Intended placement: after Branches, before Founder (when populated).
 */
export function GoogleReviewProof({ reviews = [] }: GoogleReviewProofProps) {
  if (reviews.length === 0) {
    return null;
  }

  // Populated UI ships with the Google Reviews integration prompt.
  return null;
}
