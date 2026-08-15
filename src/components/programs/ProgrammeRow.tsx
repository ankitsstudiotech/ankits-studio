import styles from "./programme-row.module.css";
import { type MotionTone, toneFromProgrammeSlug } from "@/components/motion/tokens";

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
 * Shared programme discovery row — one family.
 * Programme identity is composition/content/media, not cue colour or segments.
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
}: ProgrammeRowProps) {
  const tone =
    motionTone ??
    (programmeSlug ? toneFromProgrammeSlug(programmeSlug) : clusterTone(cluster, energy));

  return (
    <a
      href={href}
      className={styles.row}
      data-cluster={cluster}
      data-emphasis={emphasis}
      data-energy={energy}
      data-motion-tone={tone}
    >
      <div className={styles.copy}>
        <TitleTag className={styles.name}>{name}</TitleTag>
        <p className={styles.description}>{description}</p>
        <span className={styles.cueTrack} aria-hidden>
          <span className={`programme-cue ${styles.cue}`} data-motion-cue />
        </span>
      </div>
      {meta ? <p className={styles.meta}>{meta}</p> : null}
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
