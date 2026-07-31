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
 */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: ScrollRevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ y: 14, opacity: 0.97 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
