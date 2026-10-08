"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import styles from "./garba-night.module.css";

export type GarbaCampaignMediaProps = {
  posterSrc: string;
  posterAlt: string;
  teaserSrc?: string;
  teaserPoster?: string;
  teaserLabel?: string;
};

/**
 * Hero campaign-media panel: poster is the LCP-safe default;
 * user activates the 2026 teaser inside the same frame.
 */
export function GarbaCampaignMedia({
  posterSrc,
  posterAlt,
  teaserSrc,
  teaserPoster,
  teaserLabel = "Garba Night 2026 teaser",
}: GarbaCampaignMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const trackedRef = useRef(false);

  const startTeaser = () => {
    if (!teaserSrc) return;
    setPlaying(true);
    requestAnimationFrame(() => {
      const video = videoRef.current;
      if (!video) return;
      void video.play().catch(() => {
        /* user can use native controls */
      });
    });
  };

  return (
    <div className={styles.campaignMedia} data-playing={playing ? "true" : "false"}>
      <p className={styles.campaignMediaLabel}>Campaign visual</p>

      {!playing ? (
        <div className={styles.campaignPoster}>
          <Image
            src={posterSrc}
            alt={posterAlt}
            fill
            priority
            sizes="(max-width: 959px) 100vw, 42vw"
            className={styles.campaignPosterImage}
          />
          {teaserSrc ? (
            <button
              type="button"
              className={styles.teaserTrigger}
              onClick={startTeaser}
            >
              Play 2026 teaser
            </button>
          ) : null}
        </div>
      ) : (
        <div className={styles.campaignTeaser}>
          <video
            ref={videoRef}
            className={styles.campaignTeaserVideo}
            poster={teaserPoster}
            controls
            playsInline
            muted
            preload="metadata"
            aria-label={teaserLabel}
            onPlay={() => {
              if (trackedRef.current) return;
              trackedRef.current = true;
              trackEvent("garba_promo_video_play", { source: "hero-campaign" });
            }}
          >
            <source src={teaserSrc} type="video/mp4" />
          </video>
          <button
            type="button"
            className={styles.teaserBack}
            onClick={() => {
              const video = videoRef.current;
              if (video) {
                video.pause();
                video.currentTime = 0;
              }
              setPlaying(false);
            }}
          >
            Show poster
          </button>
        </div>
      )}
    </div>
  );
}
