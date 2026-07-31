"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export type TextRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
};

/**
 * Same DOM on server and client (avoids hydration mismatch). Motion only
 * enhances transform/opacity; text is never removed or replaced.
 */
export function TextReveal({
  text,
  as: Tag = "p",
  className = "",
}: TextRevealProps) {
  const reduce = useReducedMotion();

  return (
    <Tag className={className}>
      <motion.span
        className="inline-block"
        initial={reduce ? false : { opacity: 0.96, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduce
            ? { duration: 0 }
            : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
        }
      >
        {text}
      </motion.span>
    </Tag>
  );
}

export type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Soft opacity/transform fade for non-LCP chrome only. */
export function FadeIn({ children, className = "", delay = 0 }: FadeInProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0.92, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
