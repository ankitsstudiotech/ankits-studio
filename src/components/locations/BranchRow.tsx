"use client";

import { motion, useReducedMotion } from "motion/react";
import styles from "./branch-row.module.css";

export type BranchRowProps = {
  name: string;
  href: string;
  hoursLabel?: string;
  address?: string | null;
  mapsUrl?: string | null;
  /** When true (or mapsUrl missing), Maps action shows a muted pending state. */
  pending?: boolean;
  /** Heading level for the branch name (default h2). */
  titleAs?: "h2" | "h3";
};

const DEFAULT_HOURS = "Open daily · 6:00 AM–10:00 PM";

/**
 * Shared branch discovery row — equal interaction to ProgrammeRow.
 * Studio page + Maps actions; CSS uppercase for locality names.
 */
export function BranchRow({
  name,
  href,
  hoursLabel = DEFAULT_HOURS,
  address,
  mapsUrl,
  pending,
  titleAs: TitleTag = "h2",
}: BranchRowProps) {
  const reduce = useReducedMotion();
  const mapsPending = pending || !mapsUrl;

  return (
    <motion.div
      className={styles.row}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
    >
      <a href={href} className={styles.primary}>
        <TitleTag className={styles.name}>{name}</TitleTag>
        <p className={styles.hours}>{hoursLabel}</p>
        {address ? <p className={styles.address}>{address}</p> : null}
        <span className={styles.cue} aria-hidden />
      </a>
      <div className={styles.actions}>
        <a href={href} className={styles.action}>
          Studio page
        </a>
        {mapsPending ? (
          <span className={styles.actionMuted}>Maps updating</span>
        ) : (
          <a
            href={mapsUrl!}
            className={styles.action}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Google Maps
          </a>
        )}
      </div>
    </motion.div>
  );
}
