import type { ProgrammeAccentFamily } from "@/content/schema";
import { TempoLane } from "./pulse/PulseMotion";
import styles from "./pulse/pulse-home.module.css";

export type ProgrammeAccent = ProgrammeAccentFamily;

export type ProgrammeShowcaseProps = {
  programmes: Array<{
    name: string;
    href: string;
    shortDescription: string;
    accent: ProgrammeAccent;
    tags?: string[];
  }>;
};

export function ProgrammeShowcase({ programmes }: ProgrammeShowcaseProps) {
  return (
    <section
      id="programmes"
      className={`${styles.field} ${styles.band}`}
      aria-labelledby="home-programmes-title"
    >
      <h2 id="home-programmes-title" className={styles.bandTitle}>
        TEMPO LANES
      </h2>
      <div className={styles.lanes}>
        {programmes.map((programme) => (
          <TempoLane
            key={programme.href}
            family={programme.accent}
            name={programme.name}
            description={programme.shortDescription}
            href={programme.href}
            tags={programme.tags}
          />
        ))}
      </div>
    </section>
  );
}
