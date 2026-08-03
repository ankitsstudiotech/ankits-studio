"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import styles from "./pulse-home.module.css";

/** Homepage service tempos — internal only; never shown as HIT/HOLD/GROOVE. */
export type ServiceTempo =
  | "functional"
  | "yoga"
  | "zumba"
  | "dance"
  | "wedding"
  | "home"
  | "online";

const TEMPO_MOTION: Record<
  ServiceTempo,
  { duration: number; showBeats: boolean; hoverX: number }
> = {
  functional: { duration: 0.35, showBeats: false, hoverX: 4 },
  yoga: { duration: 0, showBeats: false, hoverX: 0 },
  zumba: { duration: 0.5, showBeats: true, hoverX: 6 },
  dance: { duration: 0.45, showBeats: true, hoverX: 5 },
  wedding: { duration: 0.3, showBeats: false, hoverX: 3 },
  home: { duration: 0, showBeats: false, hoverX: 0 },
  online: { duration: 0, showBeats: false, hoverX: 0 },
};

/**
 * Programme discovery link with tempo-specific motion.
 * Keyboard / no-hover: full link always works. Reduced-motion: static.
 * Desktop may show selective beat bars; mobile relies on typography/spacing/cues.
 */
export function ServiceLane({
  tempo,
  name,
  description,
  href,
  meta,
  emphasis,
}: {
  tempo: ServiceTempo;
  name: string;
  description: string;
  href: string;
  meta?: string;
  emphasis?: "primary";
}) {
  const reduce = useReducedMotion();
  const config = TEMPO_MOTION[tempo];
  const sentenceTitle =
    tempo === "yoga" || tempo === "home" || tempo === "online" || tempo === "wedding";

  return (
    <motion.a
      href={href}
      className={styles.lane}
      data-tempo={tempo}
      data-emphasis={emphasis ?? undefined}
      whileHover={reduce || config.hoverX === 0 ? undefined : { x: config.hoverX }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
    >
      <div className={styles.laneMeta}>
        <h4 className={sentenceTitle ? styles.laneTitleSentence : undefined}>{name}</h4>
        <p>{description}</p>
        {meta ? <p className={styles.laneTags}>{meta}</p> : null}
      </div>
      {/* Mobile tempo cue — always present; not equalizer gadgetry */}
      <div className={styles.laneCue} aria-hidden data-tempo={tempo} />
      {config.showBeats && !reduce ? (
        <div className={styles.beats} aria-hidden>
          {[0.55, 0.85, 0.4, 1, 0.7].map((amp, i) => (
            <motion.span
              key={i}
              className={styles.beat}
              initial={{ scaleX: 0.2 }}
              animate={{ scaleX: amp }}
              transition={{
                duration: config.duration,
                delay: i * 0.04,
                ease: "easeOut",
              }}
              style={{ transformOrigin: "left center" }}
            />
          ))}
        </div>
      ) : config.showBeats ? (
        <div className={styles.beats} aria-hidden>
          {[0.55, 0.85, 0.4, 1, 0.7].map((amp, i) => (
            <span
              key={i}
              className={styles.beat}
              style={{ transform: `scaleX(${amp})`, transformOrigin: "left center" }}
            />
          ))}
        </div>
      ) : (
        <div className={styles.laneMark} aria-hidden />
      )}
    </motion.a>
  );
}

/** Conversion press feedback only — interruptible. Supports wa.me links. */
export function PulseCta({
  href,
  children,
  external,
  id,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  id?: string;
}) {
  const reduce = useReducedMotion();
  const isExternal = external ?? href.startsWith("http");
  return (
    <motion.a
      id={id}
      href={href}
      className={styles.cta}
      whileTap={reduce ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 24 }}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </motion.a>
  );
}

/**
 * Replaceable media fallback plate.
 * Real assets swap in via docs/media/STUDIO-MEDIA-REQUIREMENTS.md — do not treat
 * gradients as permanent proof of place.
 */
export function PulseMediaPlate({
  family,
  label,
  aspect = "4/5",
  className = "",
  slotKey,
  compact = false,
}: {
  family: "strength" | "calm" | "high-energy" | "warm";
  label: string;
  aspect?: "3/4" | "4/5" | "16/9" | "1/1" | "21/9";
  className?: string;
  /** Stable content key from STUDIO-MEDIA-REQUIREMENTS.md */
  slotKey?: string;
  /** Shorter strip — use on detail heroes until real photography ships */
  compact?: boolean;
}) {
  return (
    <div
      data-media-slot={slotKey}
      data-media-status="fallback"
      data-mock-media="true"
      data-mock-media-family={family}
      className={[
        styles.mediaPlate,
        styles.mediaFallback,
        compact ? styles.mediaPlateCompact : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={compact ? undefined : { aspectRatio: aspect.replace("/", " / ") }}
      role="img"
      aria-label={label}
    />
  );
}
