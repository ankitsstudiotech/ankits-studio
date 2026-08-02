"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import styles from "./location-pulse.module.css";

/**
 * Restrained press feedback for location CTAs (emil-design-eng).
 * No hover-required motion; reduced-motion → static.
 */
export function LocationPulseCta({
  href,
  children,
  external,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const reduce = useReducedMotion();
  const props = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <motion.a
      href={href}
      className={styles.ctaPrimary}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 32 }}
      {...props}
    >
      {children}
    </motion.a>
  );
}
