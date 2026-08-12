"use client";

import { motion, useReducedMotion } from "motion/react";
import styles from "./programme-row.module.css";
import { DURATION, EASE, type MotionTone, toneFromProgrammeSlug } from "@/components/motion/tokens";

export type ProgrammeCluster = "train" | "move" | "celebrate" | "teams";
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
  /** Explicit motion personality — never inferred from display casing. */
  motionTone?: MotionTone;
  /** Derive tone from programme slug when motionTone omitted. */
  programmeSlug?: string;
  /** Heading level for the programme name (default h3). */
  titleAs?: "h3" | "h4";
};

/**
 * Shared programme discovery row — one family, cluster + tone personalities.
 * Cue uses scaleX (compositor-friendly), never width.
 */
export function ProgrammeRow({
  name,
  description,
  href,
  meta,
  emphasis,
  cluster,
  energy = "standard",
  motionTone,
  programmeSlug,
  titleAs: TitleTag = "h3",
}: ProgrammeRowProps) {
  const reduce = useReducedMotion();
  const tone =
    motionTone ??
    (programmeSlug ? toneFromProgrammeSlug(programmeSlug) : clusterTone(cluster, energy));

  return (
    <motion.a
      href={href}
      className={styles.row}
      data-cluster={cluster}
      data-emphasis={emphasis}
      data-energy={energy}
      data-motion-tone={tone}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={{ duration: DURATION.fast, ease: EASE.exit }}
    >
      <TitleTag className={styles.name}>{name}</TitleTag>
      <p className={styles.description}>{description}</p>
      {meta ? <p className={styles.meta}>{meta}</p> : null}
      <span className={styles.cueTrack} aria-hidden>
        <span className={styles.cue} data-motion-cue />
        {tone === "fluid" || tone === "expressive" ? (
          <>
            <span className={styles.cueSeg} data-motion-cue data-seg="2" />
            <span className={styles.cueSeg} data-motion-cue data-seg="3" />
          </>
        ) : null}
        {tone === "ceremonial" ? (
          <span className={styles.cueFine} data-motion-cue />
        ) : null}
      </span>
    </motion.a>
  );
}

function clusterTone(
  cluster: ProgrammeCluster | undefined,
  energy: ProgrammeEnergy,
): MotionTone {
  if (cluster === "celebrate") return "ceremonial";
  if (cluster === "teams") return "direct";
  if (cluster === "train") return energy === "calm" ? "direct" : "structured";
  if (energy === "calm") return "calm";
  if (energy === "high") return "fluid";
  return "expressive";
}
