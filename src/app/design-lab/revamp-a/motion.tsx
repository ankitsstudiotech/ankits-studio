"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Purpose: establish editorial voice once on load — not a scroll reveal parade.
 * Trigger: mount. Properties: opacity + translateX. Duration 0.55s.
 * Easing: [0.16, 1, 0.3, 1]. Interruptible (Motion default).
 * Reduced-motion: no entrance offset.
 * Accessibility: never start below ~0.95 opacity so SSR/no-JS stays readable
 * (emil + existing ScrollReveal pattern).
 */
export function EditorialHeroTitle({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.h1
      initial={reduce ? false : { opacity: 0.96, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.h1>
  );
}

export function UnderlineLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={className} data-ra-link>
      {children}
    </a>
  );
}
