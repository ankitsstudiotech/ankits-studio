import { GroupReveal, SectionReveal } from "@/components/motion";
import type { GoogleSocialProof } from "@/lib/google-reviews";
import { GoogleReviewsRail } from "./GoogleReviewsRail";
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

function LiveReviews({ proof }: { proof: Extract<GoogleSocialProof, { mode: "live-google-reviews" }> }) {
  return (
    <section
      id="google-reviews"
      className={`${styles.paperBand} ${styles.band} ${styles.googleProof}`}
      aria-labelledby="google-reviews-title"
      data-google-proof-mode="live-google-reviews"
    >
      <div className={`${styles.googleProofLayout} ${styles.googleProofLiveLayout}`}>
        <SectionReveal pattern="A">
          <p className={styles.googleProofKicker}>Reviews on Google</p>
          <h2 id="google-reviews-title" className={styles.bandTitle}>
            What members are saying
          </h2>
          {proof.branchRatings.length > 0 ? (
            <ul className={styles.googleProofRatings}>
              {proof.branchRatings.map((branch) => (
                <li key={branch.branchSlug}>
                  {branch.googleMapsUri ? (
                    <a
                      href={branch.googleMapsUri}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {branch.branchLocality}
                    </a>
                  ) : (
                    <span>{branch.branchLocality}</span>
                  )}
                  <span>
                    {branch.rating.toFixed(1)} · {branch.userRatingCount} Google reviews
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          <p className={styles.googleProofDisclosure} data-review-disclosure="">
            {proof.disclosure}
          </p>
          <GoogleMapsAttribution />
        </SectionReveal>
        <GroupReveal>
          <GoogleReviewsRail reviews={proof.reviews} />
          {proof.fallbackBranches?.length ? (
            <ul className={styles.googleProofList}>
              {(proof.fallbackBranches ?? []).map((branch) => (
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
          ) : null}
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
