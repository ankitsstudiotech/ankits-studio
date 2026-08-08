"use client";

import {
  Children,
  type CSSProperties,
  type ReactNode,
  useEffect,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import { DISTANCE, DURATION, EASE } from "./tokens";

/**
 * Only animate when the user explicitly prefers motion.
 * null (SSR / first hook frame) and true (reduce) → final state, no entrance.
 */
export function useMotionAllowed(): boolean {
  return useReducedMotion() === false;
}

/** Marks document for CSS-enhanced motion after hydration. */
export function MotionReady() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");
    root.classList.remove("motion-pending");
    return () => {
      root.classList.remove("motion-ready");
    };
  }, []);
  return null;
}

export type HeroRevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Generic route opening stagger — brand pages that are not the homepage hero.
 * Homepage uses CSS-timed HeroOpening instead so H1 leads copy/CTA.
 */
export function HeroReveal({ children, className = "" }: HeroRevealProps) {
  const allow = useMotionAllowed();
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, index) => (
        <motion.div
          key={index}
          initial={allow ? { opacity: 1, y: DISTANCE.copy } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={
            allow
              ? {
                  duration: DURATION.slow,
                  delay: Math.min(index * 0.05, 0.2),
                  ease: EASE.enter,
                }
              : { duration: 0 }
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
 * Editorial line mask — overflow clip + whole-line rise.
 * Visibility is CSS-owned (prm / reduce / no-JS = final state at first paint).
 */
export function MaskedLines({
  lines,
  as: Tag = "h1",
  id,
  className = "",
}: MaskedLinesProps) {
  return (
    <Tag id={id} className={["hero-masked-title", className].filter(Boolean).join(" ")}>
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className="motion-mask-line"
          style={{ "--line-index": index } as CSSProperties}
        >
          <span className="motion-mask-inner">{line}</span>
        </span>
      ))}
    </Tag>
  );
}

export type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  pattern?: "A" | "B" | "C";
  side?: "left" | "right";
};

/**
 * Level 2 — section choreography (Patterns A/B/C).
 * Trigger earlier in viewport so motion is perceptible without AOS spam.
 */
export function SectionReveal({
  children,
  className = "",
  delay = 0,
  pattern = "A",
  side = "left",
}: SectionRevealProps) {
  const allow = useMotionAllowed();

  const initial = !allow
    ? false
    : pattern === "B"
      ? { opacity: 1, x: side === "left" ? -DISTANCE.pair : DISTANCE.pair, y: 0 }
      : { opacity: 0.92, y: 20, x: 0 };

  return (
    <motion.div
      className={className}
      data-section-reveal={pattern}
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -6% 0px" }}
      transition={
        allow
          ? { duration: DURATION.section, delay, ease: EASE.enter }
          : { duration: 0 }
      }
    >
      {children}
    </motion.div>
  );
}

export type GroupRevealProps = {
  children: ReactNode;
  className?: string;
  withAccent?: boolean;
};

export function GroupReveal({
  children,
  className = "",
  withAccent = false,
}: GroupRevealProps) {
  const allow = useMotionAllowed();

  return (
    <motion.div
      className={className}
      data-section-reveal="C"
      initial={allow ? { opacity: 0.92, y: 18 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -6% 0px" }}
      transition={allow ? { duration: DURATION.section, ease: EASE.enter } : { duration: 0 }}
    >
      {withAccent ? (
        <motion.span
          className="motion-accent-line"
          aria-hidden
          initial={allow ? { scaleX: 0.28 } : false}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={
            allow
              ? { duration: DURATION.base, delay: 0.1, ease: EASE.emphasis }
              : { duration: 0 }
          }
          style={{ marginBottom: "1rem", transformOrigin: "left center" }}
        />
      ) : null}
      {children}
    </motion.div>
  );
}
