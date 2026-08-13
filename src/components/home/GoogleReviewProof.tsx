import { GroupReveal, SectionReveal } from "@/components/motion";
import type { GoogleSocialProof } from "@/lib/google-reviews";
import styles from "./pulse/pulse-home.module.css";

export type GoogleReviewProofProps = {
  proof: GoogleSocialProof;
};

function GoogleMapsAttribution() {
  return (
    <p className={styles.gmpAttribution} translate="no">
      Google Maps
    </p>
  );
}

function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  const clamped = Math.min(5, Math.max(0, rounded));
  return (
    <p className={styles.reviewRating}>
      <span className="sr-only">{`${rating} out of 5 stars`}</span>
      <span aria-hidden="true">{`${"★".repeat(clamped)}${"☆".repeat(5 - clamped)}`}</span>
    </p>
  );
}

function LiveReviews({ proof }: { proof: Extract<GoogleSocialProof, { mode: "live-google-reviews" }> }) {
  return (
    <section
      id="google-reviews"
      className={`${styles.paperBand} ${styles.band} ${styles.googleProof}`}
      aria-labelledby="google-reviews-title"
      data-google-proof-mode="live-google-reviews"
    >
      <div className={styles.googleProofLayout}>
        <SectionReveal pattern="A">
          <p className={styles.googleProofKicker}>Google Reviews</p>
          <h2 id="google-reviews-title" className={styles.bandTitle}>
            What members say
          </h2>
          <p className={styles.bandLede}>{proof.disclosure}</p>
          <GoogleMapsAttribution />
        </SectionReveal>
        <GroupReveal>
          <ul className={styles.googleProofList}>
            {proof.reviews.map((review) => (
              <li key={review.id} className={styles.googleProofLiveItem}>
                <StarRating rating={review.rating} />
                <blockquote cite={review.googleMapsReviewUri} className={styles.googleProofQuote}>
                  <p>{review.text}</p>
                </blockquote>
                {review.translated ? (
                  <p className={styles.googleProofNote}>Translated from the original Google review.</p>
                ) : null}
                <footer className={styles.googleProofAuthor}>
                  {review.author.photoUri ? (
                    // Google-provided avatar only — not next/image, not generated.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={review.author.photoUri}
                      alt={`${review.author.displayName}’s Google profile photo`}
                      width={40}
                      height={40}
                      className={styles.googleProofAvatar}
                      referrerPolicy="no-referrer"
                    />
                  ) : null}
                  <div className={styles.googleProofAuthorCopy}>
                    {review.author.profileUri ? (
                      <a
                        href={review.author.profileUri}
                        className={styles.googleProofAuthorName}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {review.author.displayName}
                      </a>
                    ) : (
                      <p className={styles.googleProofAuthorName}>{review.author.displayName}</p>
                    )}
                    <p className={styles.googleProofMeta}>
                      {review.branchLocality}
                      {review.relativePublishTime ? ` · ${review.relativePublishTime}` : ""}
                    </p>
                  </div>
                </footer>
                <a
                  href={review.googleMapsReviewUri}
                  className={styles.googleProofAction}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Google Maps
                </a>
              </li>
            ))}
          </ul>
        </GroupReveal>
      </div>
    </section>
  );
}

function ExternalLinks({
  proof,
}: {
  proof: Extract<GoogleSocialProof, { mode: "external-links" }>;
}) {
  return (
    <section
      id="google-reviews"
      className={`${styles.paperBand} ${styles.band} ${styles.googleProof}`}
      aria-labelledby="google-reviews-title"
      data-google-proof-mode="external-links"
    >
      <div className={styles.googleProofLayout}>
        <SectionReveal pattern="A">
          <p className={styles.googleProofKicker}>Google Reviews</p>
          <h2 id="google-reviews-title" className={styles.bandTitle}>
            Reviews on Google
          </h2>
          <p className={styles.bandLede}>
            Explore Google feedback for each of our four studios.
          </p>
        </SectionReveal>
        <GroupReveal>
          <ul className={styles.googleProofList}>
            {proof.branches.map((branch) => (
              <li key={branch.slug} className={styles.googleProofRow}>
                <h3 className={styles.googleProofBranch}>{branch.locality}</h3>
                <a
                  href={branch.mapsUrl}
                  className={styles.googleProofAction}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Google
                </a>
              </li>
            ))}
          </ul>
        </GroupReveal>
      </div>
    </section>
  );
}

/**
 * Homepage Google social proof — after Branches, before Founder.
 * Live Places reviews when credentials + verified Place IDs exist;
 * otherwise a premium outbound Google Maps chapter (never an error shell).
 */
export function GoogleReviewProof({ proof }: GoogleReviewProofProps) {
  if (proof.mode === "unavailable") {
    return null;
  }

  if (proof.mode === "live-google-reviews") {
    return <LiveReviews proof={proof} />;
  }

  return <ExternalLinks proof={proof} />;
}
