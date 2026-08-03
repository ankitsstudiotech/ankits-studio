"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import styles from "./pulse-home.module.css";

/** Homepage service tempos — retained for content mapping; not used for motion forks. */
export type ServiceTempo =
  | "functional"
  | "yoga"
  | "zumba"
  | "dance"
  | "wedding"
  | "home"
  | "online";

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
      transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
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
