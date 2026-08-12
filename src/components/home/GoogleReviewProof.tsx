import type { GoogleReviewProofItem } from "@/content/schema/google-review-proof";
import styles from "./pulse/pulse-home.module.css";

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

  return (
    <section
      id="google-reviews"
      className={`${styles.paperBand} ${styles.band}`}
      aria-labelledby="google-reviews-title"
    >
      <h2 id="google-reviews-title" className={styles.bandTitle}>
        Google Reviews
      </h2>
      <ul className={styles.reviewList}>
        {reviews.map((review) => (
          <li key={review.id} className={styles.reviewItem}>
            <blockquote cite={review.sourceUrl}>
              <p>{review.excerpt}</p>
            </blockquote>
            <footer>
              <cite>{review.authorDisplayName}</cite>
            </footer>
          </li>
        ))}
      </ul>
    </section>
  );
}
