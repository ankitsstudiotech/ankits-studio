"use client";

import { Children, type ReactNode, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { DISTANCE, DURATION, EASE } from "./tokens";

/** Marks document for CSS-enhanced motion after hydration (SSR text stays visible). */
export function MotionReady() {
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    return () => {
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);
  return null;
}

export type HeroRevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Level 1 — brand/page opening.
 * Sequences eyebrow → H1 → copy → CTA. Content stays readable without JS.
 */
export function HeroReveal({ children, className = "" }: HeroRevealProps) {
  const reduce = useReducedMotion();
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, index) => (
        <motion.div
          key={index}
          initial={reduce ? false : { opacity: 1, y: DISTANCE.copy }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  duration: DURATION.slow,
                  delay: Math.min(index * 0.06, 0.24),
                  ease: EASE.enter,
                }
          }
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

export type MaskedLinesProps = {
  lines: string[];
  as?: "h1" | "h2";
  id?: string;
  className?: string;
};

/**
 * Cinematic line mask for Bebas headlines — not character scramble.
 * SSR: full text in DOM. Motion: lines rise from a baseline mask.
 */
export function MaskedLines({
  lines,
  as: Tag = "h1",
  id,
  className = "",
}: MaskedLinesProps) {
  const reduce = useReducedMotion();

  return (
    <Tag id={id} className={className}>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`} className="motion-mask-line">
          <motion.span
            initial={reduce ? false : { y: "105%" }}
            animate={{ y: "0%" }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    duration: DURATION.hero * 0.85,
                    delay: 0.08 + index * 0.1,
                    ease: EASE.enter,
                  }
            }
            style={{ display: "block" }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Pattern A default; B = opposing X for paired columns; C = group + accent */
  pattern?: "A" | "B" | "C";
  /** For pattern B — which side */
  side?: "left" | "right";
};

/**
 * Level 2 — section choreography.
 * At most three patterns globally. Never fade ordinary paragraphs alone.
 */
export function SectionReveal({
  children,
  className = "",
  delay = 0,
  pattern = "A",
  side = "left",
}: SectionRevealProps) {
  const reduce = useReducedMotion();

  const initial =
    reduce
      ? false
      : pattern === "B"
        ? { opacity: 1, x: side === "left" ? -DISTANCE.pair : DISTANCE.pair, y: 0 }
        : { opacity: 0.98, y: DISTANCE.copy, x: 0 };

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.22, margin: "0px 0px -8% 0px" }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: DURATION.section, delay, ease: EASE.enter }
      }
    >
      {children}
    </motion.div>
  );
}

export type GroupRevealProps = {
  children: ReactNode;
  className?: string;
  /** Draw accent line after group settles */
  withAccent?: boolean;
};

/** Pattern C — coordinated group + optional accent line. */
export function GroupReveal({
  children,
  className = "",
  withAccent = false,
}: GroupRevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0.98, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={reduce ? { duration: 0 } : { duration: DURATION.section, ease: EASE.enter }}
    >
      {withAccent ? (
        <motion.span
          className="motion-accent-line"
          aria-hidden
          initial={reduce ? false : { scaleX: 0.35 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: DURATION.base, delay: 0.12, ease: EASE.emphasis }
          }
          style={{ marginBottom: "1rem" }}
        />
      ) : null}
      {children}
    </motion.div>
  );
}
