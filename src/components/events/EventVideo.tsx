"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

export type EventVideoProps = {
  src: string;
  poster: string;
  label: string;
  /** Analytics event fired on first intentional play. */
  playEvent: "garba_promo_video_play" | "garba_previous_event_video_play";
  /**
   * `autoplay` — muted loop when motion is allowed (promo teaser).
   * `manual` — user-initiated only (previous-edition footage).
   */
  mode: "autoplay" | "manual";
  /** Defer network: only set src after intersection / user intent. */
  lazy?: boolean;
  className?: string;
};

/**
 * Native HTML5 video — no player framework.
 * Autoplay is muted + playsInline + respects prefers-reduced-motion.
 */
export function EventVideo({
  src,
  poster,
  label,
  playEvent,
  mode,
  lazy = false,
  className,
}: EventVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const [activeSrc, setActiveSrc] = useState(lazy ? undefined : src);
  const [reducedMotion, setReducedMotion] = useState(false);
  const playedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!lazy || activeSrc) return;
    const node = shellRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setActiveSrc(src);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActiveSrc(src);
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [lazy, activeSrc, src]);

  const canAutoplay = mode === "autoplay" && !reducedMotion;

  return (
    <div ref={shellRef} className={className} data-video-mode={mode}>
      <video
        ref={videoRef}
        poster={poster}
        controls
        playsInline
        preload={lazy ? "none" : canAutoplay ? "metadata" : "none"}
        muted={canAutoplay}
        loop={canAutoplay}
        autoPlay={canAutoplay}
        aria-label={label}
        onPlay={() => {
          if (playedRef.current) return;
          playedRef.current = true;
          trackEvent(playEvent, { source: mode });
        }}
      >
        {activeSrc ? <source src={activeSrc} type="video/mp4" /> : null}
      </video>
    </div>
  );
}
