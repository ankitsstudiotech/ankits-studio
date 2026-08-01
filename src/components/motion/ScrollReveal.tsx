"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Opt-in client island. Content stays readable without JS (opacity never
 * starts at 0). Only a short translateY enhance when in view.
 * See docs/MOTION-SYSTEM.md / ADR-009.
 *
 * Always renders the same `<motion.div>` element regardless of `reduce` —
 * only the `initial`/`transition` prop *values* differ (matches the
 * already-safe pattern in `TextReveal.tsx`/`FadeIn`). Conditionally
 * returning a plain `<div>` vs. `<motion.div>` based on a hook whose value
 * can differ between the server render and the client's first render is a
 * hydration-mismatch source — see docs/DECISIONS.md ADR-013 (VIS-005).
 */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: ScrollRevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { y: 14, opacity: 0.97 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -8% 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
