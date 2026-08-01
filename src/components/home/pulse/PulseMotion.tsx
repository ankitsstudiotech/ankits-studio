"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ProgrammeAccentFamily } from "@/content/schema";
import type { CSSProperties, ReactNode } from "react";
import styles from "./pulse-home.module.css";

const TEMPO: Record<
  ProgrammeAccentFamily,
  { duration: number; label: string; color: string }
> = {
  strength: { duration: 0.35, label: "HIT", color: "var(--color-accent-strength)" },
  calm: { duration: 1.1, label: "HOLD", color: "var(--color-accent-calm)" },
  "high-energy": { duration: 0.55, label: "GROOVE", color: "var(--color-accent-high-energy)" },
};

/**
 * Purpose: hero tempo metaphor. Trigger: mount. Props: scaleY.
 * Reduced-motion: static bars.
 */
export function BeatStrip() {
  const reduce = useReducedMotion();
  return (
    <div className={styles.beatStrip} aria-hidden>
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.i
          key={i}
          initial={reduce ? false : { scaleY: 0.2 }}
          animate={{ scaleY: 0.35 + ((i * 37) % 65) / 100 }}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  duration: 0.4 + (i % 5) * 0.08,
                  delay: (i % 8) * 0.03,
                  ease: "easeOut",
                }
          }
          style={{ transformOrigin: "bottom center" }}
        />
      ))}
    </div>
  );
}

/**
 * Purpose: programme discovery by tempo family. Trigger: mount + hover/focus.
 * Reduced-motion: static beats; still a full link without hover.
 */
export function TempoLane({
  family,
  name,
  description,
  href,
  tags,
}: {
  family: ProgrammeAccentFamily;
  name: string;
  description: string;
  href: string;
  tags?: string[];
}) {
  const reduce = useReducedMotion();
  const tempo = TEMPO[family];

  return (
    <motion.a
      href={href}
      className={styles.lane}
      data-family={family}
      style={{ "--lane-accent": tempo.color } as CSSProperties}
      whileHover={reduce ? undefined : { x: 6 }}
      whileTap={reduce ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      <div className={styles.laneMeta}>
        <span className={styles.tempo}>{tempo.label}</span>
        <h3>{name}</h3>
        <p>{description}</p>
        {tags && tags.length > 0 ? (
          <p className={styles.laneTags}>{tags.join(" · ")}</p>
        ) : null}
      </div>
      <div className={styles.beats} aria-hidden>
        {[0.55, 0.85, 0.4, 1, 0.7].map((amp, i) => (
          <motion.span
            key={i}
            className={styles.beat}
            initial={reduce ? false : { scaleX: 0.15 }}
            animate={{ scaleX: amp }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    duration: tempo.duration,
                    delay: i * 0.04,
                    ease: "easeOut",
                  }
            }
            style={{ transformOrigin: "left center" }}
          />
        ))}
      </div>
    </motion.a>
  );
}

/**
 * Purpose: conversion press feedback. Interruptible spring.
 */
export function PulseCta({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={href}
      className={styles.cta}
      whileTap={reduce ? undefined : { scale: 0.94 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
    >
      {children}
    </motion.a>
  );
}

export function PulseMediaPlate({
  family,
  label,
  aspect = "4/5",
  className = "",
}: {
  family: ProgrammeAccentFamily;
  label: string;
  aspect?: "3/4" | "4/5" | "16/9" | "1/1";
  className?: string;
}) {
  return (
    <div
      data-mock-media="true"
      data-mock-media-family={family}
      className={[styles.mediaPlate, className].filter(Boolean).join(" ")}
      style={{ aspectRatio: aspect.replace("/", " / ") }}
      role="img"
      aria-label={`Replaceable studio media: ${label}`}
    >
      <span className={styles.mediaLabel}>REPLACE · {label}</span>
    </div>
  );
}
