import styles from "./programme-row.module.css";
import { type MotionTone, toneFromProgrammeSlug } from "@/components/motion/tokens";

export type ProgrammeCluster = "train" | "move" | "celebrate" | "teams";
export type ProgrammeEnergy = "calm" | "standard" | "high";
/** Visual composition only — data fields stay shared. */
export type ProgrammeRowLayout = "featured" | "cell" | "index";

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
  /** Contextual visual variant. Never stretch sparse copy through the page track. */
  layout?: ProgrammeRowLayout;
};

/**
 * Shared programme discovery data row.
 * Visual anatomy is layout-specific: featured editorial, matrix cell, or dense index.
 * Hover/press cues are CSS (scaleX / transform). No motion/react on the row
 * so homepage discovery does not hydrate eight Motion islands on first load.
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
  layout = "index",
}: ProgrammeRowProps) {
  const tone =
    motionTone ??
    (programmeSlug ? toneFromProgrammeSlug(programmeSlug) : clusterTone(cluster, energy));
  const splitSupport = layout === "featured" || layout === "index";

  return (
    <a
      href={href}
      className={styles.row}
      data-cluster={cluster}
      data-emphasis={emphasis}
      data-energy={energy}
      data-layout={layout}
      data-motion-tone={tone}
    >
      <div className={styles.copy}>
        <TitleTag className={styles.name}>{name}</TitleTag>
        {splitSupport ? null : <p className={styles.description}>{description}</p>}
        <span className={styles.cueTrack} aria-hidden>
          <span className={`programme-cue ${styles.cue}`} data-motion-cue />
        </span>
      </div>
      {splitSupport ? (
        <div className={styles.support}>
          <p className={styles.description}>{description}</p>
          {meta ? <p className={styles.meta}>{meta}</p> : null}
        </div>
      ) : meta ? (
        <p className={styles.meta}>{meta}</p>
      ) : null}
    </a>
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
