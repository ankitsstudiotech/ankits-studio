"use client";

import { Children, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const EASE_OUT_STRONG: [number, number, number, number] = [0.23, 1, 0.32, 1];
const REVEAL_DURATION = 0.42;

export type HeroRevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Sequences homepage hero children (eyebrow/brand, heading, body, CTAs).
 * Opacity + small translateY; short staggered delays; ease-out.
 * Reduced-motion: final state immediately (same element tree — no hydration fork).
 */
export function HeroReveal({ children, className = "" }: HeroRevealProps) {
  const reduce = useReducedMotion();
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, index) => (
        <motion.div
          key={index}
          initial={reduce ? false : { opacity: 1, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  duration: REVEAL_DURATION,
                  delay: index * 0.07,
                  ease: EASE_OUT_STRONG,
                }
          }
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

export type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Optional once-in-view reveal for section intros.
 * Content stays near-visible without JS (opacity never starts at 0).
 */
export function SectionReveal({
  children,
  className = "",
  delay = 0,
}: SectionRevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0.97, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -6% 0px" }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: REVEAL_DURATION, delay, ease: EASE_OUT_STRONG }
      }
    >
      {children}
    </motion.div>
  );
}
