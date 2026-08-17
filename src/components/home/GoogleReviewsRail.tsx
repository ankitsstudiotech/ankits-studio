"use client";

import { useEffect, useRef, useState } from "react";
import type { GoogleLiveReview } from "@/lib/google-reviews";
import { GoogleReviewText } from "./GoogleReviewText";
import styles from "./pulse/pulse-home.module.css";

function StarRating({ rating }: { rating?: number }) {
  if (typeof rating !== "number" || !Number.isFinite(rating)) return null;
  const clamped = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <p className={styles.reviewRating}>
      <span className="sr-only">{`${rating} out of 5 stars`}</span>
      <span aria-hidden="true">{`${"★".repeat(clamped)}${"☆".repeat(5 - clamped)}`}</span>
    </p>
  );
}

export function GoogleReviewsRail({ reviews }: { reviews: readonly GoogleLiveReview[] }) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;

    const update = () => {
      const max = node.scrollWidth - node.clientWidth;
      setCanPrev(node.scrollLeft > 4);
      setCanNext(max - node.scrollLeft > 4);
    };

    update();
    node.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      node.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [reviews]);

  const scrollByCard = (direction: -1 | 1) => {
    const node = scrollerRef.current;
    if (!node) return;
    const card = node.querySelector<HTMLElement>("li");
    const delta = (card?.offsetWidth ?? node.clientWidth) + 20;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollBy({ left: direction * delta, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className={styles.googleProofRailWrap}>
      <ul
        ref={scrollerRef}
        className={styles.googleProofRail}
        tabIndex={0}
        aria-label="Google reviews"
      >
        {reviews.map((review) => (
          <li key={review.id} className={styles.googleProofLiveItem}>
            <div className={styles.googleProofAuthor}>
              {review.author.photoUri ? (
                // Google-provided avatar only — not next/image, not generated.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={review.author.photoUri}
                  alt={`${review.author.displayName}’s Google profile photo`}
                  width={36}
                  height={36}
                  className={styles.googleProofAvatar}
                  referrerPolicy="no-referrer"
                />
              ) : null}
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
            </div>
            <StarRating rating={review.rating} />
            <p className={styles.googleProofMeta}>
              {review.branchLocality}
              {review.relativePublishTime ? ` · ${review.relativePublishTime}` : ""}
            </p>
            <GoogleReviewText text={review.text} />
            {review.translated ? (
              <p className={styles.googleProofNote}>Translated from the original Google review.</p>
            ) : null}
            <a
              href={review.googleMapsReviewUri}
              className={styles.googleProofAction}
              target="_blank"
              rel="noopener noreferrer"
            >
              View review on Google Maps
            </a>
            {review.flagContentUri ? (
              <a
                href={review.flagContentUri}
                className={styles.googleProofReport}
                target="_blank"
                rel="noopener noreferrer"
              >
                Report review
              </a>
            ) : null}
          </li>
        ))}
      </ul>
      {reviews.length > 1 ? (
        <div className={styles.googleProofRailControls}>
          <button
            type="button"
            className={styles.googleProofRailButton}
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
          >
            Previous reviews
          </button>
          <button
            type="button"
            className={styles.googleProofRailButton}
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
          >
            Next reviews
          </button>
        </div>
      ) : null}
    </div>
  );
}
