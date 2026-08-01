"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Purpose: state-only feedback for interactive system rows (emil: high-frequency).
 * Trigger: hover / focus-within. Properties: background-color only.
 * Duration: 160ms ease-out. No scroll reveals. Interruptible.
 * Reduced-motion: instant state swap (duration 0).
 */
export function SystemRow({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={href}
      className={className}
      initial={false}
      whileHover={
        reduce ? undefined : { backgroundColor: "rgba(20, 24, 28, 0.06)" }
      }
      whileFocus={
        reduce ? undefined : { backgroundColor: "rgba(20, 24, 28, 0.08)" }
      }
      transition={{ duration: reduce ? 0 : 0.16, ease: "easeOut" }}
    >
      {children}
    </motion.a>
  );
}

/**
 * Purpose: confirm press on utility CTA without theatrical bounce.
 * Duration ~150ms. Reduced: no scale.
 */
export function UtilityCta({
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
      className="rc-cta"
      whileTap={reduce ? undefined : { scale: 0.98 }}
      transition={{ duration: reduce ? 0 : 0.15, ease: "easeOut" }}
    >
      {children}
    </motion.a>
  );
}
