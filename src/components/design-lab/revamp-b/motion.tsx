"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ProgrammeAccentFamily } from "@/content/schema";
import type { CSSProperties, ReactNode } from "react";

const TEMPO: Record<
  ProgrammeAccentFamily,
  { duration: number; label: string; color: string }
> = {
  strength: { duration: 0.35, label: "HIT", color: "#ff4d2e" },
  calm: { duration: 1.1, label: "HOLD", color: "#5eead4" },
  "high-energy": { duration: 0.55, label: "GROOVE", color: "#c8ff3d" },
};

/**
 * Purpose: show programme tempo as structural motion, not decoration.
 * Trigger: mount + hover. Properties: scaleX on beat bars.
 * Duration: family-specific. Easing: easeOut. Interruptible.
 * Reduced-motion: static filled bars, no scale animation.
 */
export function TempoLane({
  family,
  name,
  description,
  href,
}: {
  family: ProgrammeAccentFamily;
  name: string;
  description: string;
  href: string;
}) {
  const reduce = useReducedMotion();
  const tempo = TEMPO[family];

  return (
    <motion.a
      href={href}
      className="rb-lane"
      data-family={family}
      style={
        {
          "--rb-lane-accent": tempo.color,
        } as CSSProperties
      }
      whileHover={reduce ? undefined : { x: 6 }}
      whileTap={reduce ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      <div className="rb-lane-meta">
        <span className="rb-tempo">{tempo.label}</span>
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
      <div className="rb-beats" aria-hidden>
        {[0.55, 0.85, 0.4, 1, 0.7].map((amp, i) => (
          <motion.span
            key={i}
            className="rb-beat"
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
 * Purpose: immediate press feedback on primary conversion.
 * Trigger: pointer/keyboard press. Spring — interruptible.
 * Reduced-motion: opacity flash only via CSS :active.
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
      className="rb-cta"
      whileTap={
        reduce
          ? undefined
          : { scale: 0.94 }
      }
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
    >
      {children}
    </motion.a>
  );
}

export function BeatStrip() {
  const reduce = useReducedMotion();
  return (
    <div className="rb-beat-strip" aria-hidden>
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
