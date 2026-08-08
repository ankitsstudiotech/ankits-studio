"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useMotionAllowed } from "@/components/motion";
import { DURATION, EASE } from "@/components/motion/tokens";
import type { MediaMotionTreatment } from "@/content/media";
import styles from "./pulse-media.module.css";

export type MediaRevealProps = {
  children: ReactNode;
  treatment?: MediaMotionTreatment;
  className?: string;
};

/**
 * Stage 3-aligned media entrance — hero/section once; no Ken Burns loops.
 */
export function MediaReveal({
  children,
  treatment = "section-reveal",
  className = "",
}: MediaRevealProps) {
  const allow = useMotionAllowed();
  const isHero = treatment === "hero-reveal";
  const isStatic = treatment === "static" || treatment === "hover-crop";

  if (!allow || isStatic) {
    return <div className={[styles.reveal, className].filter(Boolean).join(" ")}>{children}</div>;
  }

  return (
    <motion.div
      className={[styles.reveal, className].filter(Boolean).join(" ")}
      initial={isHero ? { opacity: 0.94, scale: 1.015 } : { opacity: 0.94, y: 14 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: isHero ? DURATION.slow : DURATION.section,
        delay: isHero ? 0.04 : 0,
        ease: EASE.enter,
      }}
    >
      {children}
    </motion.div>
  );
}
