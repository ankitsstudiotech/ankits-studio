"use client";

import { motion, useReducedMotion } from "motion/react";
import styles from "./programme-row.module.css";

export type ProgrammeCluster = "train" | "move" | "celebrate";
export type ProgrammeEnergy = "calm" | "standard" | "high";

export type ProgrammeRowProps = {
  name: string;
  description: string;
  href: string;
  meta?: string;
  emphasis?: "primary";
  cluster?: ProgrammeCluster;
  /** Optional density hint — does not change motion or title casing. */
  energy?: ProgrammeEnergy;
  /** Heading level for the programme name (default h3). */
  titleAs?: "h3" | "h4";
};

/**
 * Shared programme discovery row — equal interaction for every programme.
 * Display + CSS uppercase for titles; cue colour from cluster only.
 * Motion is role-based (hover/focus cue + tap), never tempo/casing forks.
 */
export function ProgrammeRow({
  name,
  description,
  href,
  meta,
  emphasis,
  cluster,
  energy = "standard",
  titleAs: TitleTag = "h3",
}: ProgrammeRowProps) {
  const reduce = useReducedMotion();

  return (
    <motion.a
      href={href}
      className={styles.row}
      data-cluster={cluster}
      data-emphasis={emphasis}
      data-energy={energy}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
    >
      <TitleTag className={styles.name}>{name}</TitleTag>
      <p className={styles.description}>{description}</p>
      {meta ? <p className={styles.meta}>{meta}</p> : null}
      <span className={styles.cue} aria-hidden />
    </motion.a>
  );
}
