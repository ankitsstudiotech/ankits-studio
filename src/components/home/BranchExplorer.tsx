"use client";

import Link from "next/link";
import { SectionReveal } from "@/components/motion";
import styles from "./pulse/pulse-home.module.css";

export type BranchExplorerProps = {
  locations: Array<{
    name: string;
    href: string;
    locality?: string;
    address?: string | null;
    hoursLabel?: string;
    mapsUrl?: string;
    addressPending?: boolean;
  }>;
};

const DEFAULT_HOURS = "Open daily · 6:00 AM–10:00 PM";

/**
 * Homepage branch index — physical/local interaction, not bouncing pins.
 */
export function BranchExplorer({ locations }: BranchExplorerProps) {
  return (
    <section
      id="locations"
      className={`${styles.field} ${styles.band}`}
      aria-labelledby="home-branches-title"
    >
      <SectionReveal pattern="A">
        <h2 id="home-branches-title" className={styles.bandTitle}>
          Find your nearest studio
        </h2>
        <p className={styles.bandLede}>
          Four neighbourhood studios across Airoli, Ghansoli, and Thane. Trial enquiries use our
          central WhatsApp number.
        </p>
      </SectionReveal>
      <div className={styles.branchList}>
        {locations.map((location) => {
          const placeLine = location.locality?.trim() || location.name;
          const hours = location.hoursLabel ?? DEFAULT_HOURS;

          return (
            <article key={location.href} className={styles.branchCard}>
              <h3 className={styles.branchName}>{location.name}</h3>
              {placeLine !== location.name ? <p>{placeLine}</p> : null}
              <p className={styles.branchHours}>{hours}</p>
              <span className={styles.branchCue} data-motion-cue aria-hidden />
              <div className={styles.branchActions}>
                <Link href={location.href} className={styles.branchLink}>
                  Studio page
                </Link>
                {location.mapsUrl ? (
                  <a
                    href={location.mapsUrl}
                    className={styles.branchLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Maps
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
