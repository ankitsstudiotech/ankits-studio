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
 * Homepage branch index — numbered editorial rows (not four identical cards).
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
      <ol className={styles.branchRows}>
        {locations.map((location, index) => {
          const placeLine = location.locality?.trim() || location.name;
          const hours = location.hoursLabel ?? DEFAULT_HOURS;
          const num = String(index + 1).padStart(2, "0");

          return (
            <li key={location.href} className={styles.branchRow}>
              <span className={styles.branchIndex} aria-hidden>
                {num}
              </span>
              <div className={styles.branchBody}>
                <h3 className={styles.branchName}>{location.name}</h3>
                {placeLine !== location.name ? (
                  <p className={styles.branchPlace}>{placeLine}</p>
                ) : null}
                <p className={styles.branchHours}>{hours}</p>
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
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
