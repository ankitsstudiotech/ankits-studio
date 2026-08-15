"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import styles from "./programme-pulse.module.css";

export type ProgrammeTempo =
  | "functional"
  | "yoga"
  | "zumba"
  | "dance"
  | "wedding"
  | "home"
  | "online"
  | "corporate";

const HOVER_X: Record<ProgrammeTempo, number> = {
  functional: 4,
  yoga: 0,
  zumba: 6,
  dance: 5,
  wedding: 3,
  home: 0,
  online: 0,
  corporate: 0,
};

/** Index discovery link — works without hover; reduced-motion static. */
export function ProgrammeLaneLink({
  href,
  name,
  description,
  meta,
  tempo,
  emphasis,
}: {
  href: string;
  name: string;
  description: string;
  meta?: string;
  tempo: ProgrammeTempo;
  emphasis?: "primary";
}) {
  const reduce = useReducedMotion();
  const hoverX = HOVER_X[tempo];

  return (
    <motion.a
      href={href}
      className={styles.lane}
      data-tempo={tempo}
      data-emphasis={emphasis}
      whileHover={reduce || hoverX === 0 ? undefined : { x: hoverX }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
    >
      <h3 className={styles.laneName}>{name}</h3>
      <p className={styles.laneDesc}>{description}</p>
      {meta ? <p className={styles.laneMeta}>{meta}</p> : null}
      <span className={`programme-cue ${styles.cue}`} aria-hidden />
    </motion.a>
  );
}

export function ProgrammePulseCta({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={styles.cta}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
