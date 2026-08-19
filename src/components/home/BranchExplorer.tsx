import Link from "next/link";
import { SectionReveal } from "@/components/motion";
import styles from "./pulse/pulse-home.module.css";

export type BranchExplorerProps = {
  locations: Array<{
    name: string;
    href: string;
    locality?: string;
    openingYear?: number;
    landmarkHint?: string;
    hoursLabel?: string;
    mapsUrl?: string;
  }>;
};

const DEFAULT_HOURS = "Open daily · 6:00 AM–10:00 PM";

/**
 * Homepage branch index — numbered editorial rows on elevated charcoal.
 */
export function BranchExplorer({ locations }: BranchExplorerProps) {
  return (
    <section
      id="locations"
      className={`${styles.paperBand} ${styles.band}`}
      data-discovery="branch-index"
      aria-labelledby="home-branches-title"
    >
      <SectionReveal pattern="A">
        <h2 id="home-branches-title" className={styles.bandTitle}>
          Find your nearest studio
        </h2>
        <p className={styles.bandLede}>
          Four neighbourhood studios across Airoli, Ghansoli and Thane. Open in Maps or message us on
          WhatsApp to book a trial.
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
                <h3 className={styles.branchName}>{placeLine}</h3>
                {location.openingYear ? (
                  <p className={styles.branchMeta}>Since {location.openingYear}</p>
                ) : null}
                {location.landmarkHint ? (
                  <p className={styles.branchPlace}>{location.landmarkHint}</p>
                ) : null}
                <p className={styles.branchHours}>{hours}</p>
                <div className={styles.branchActions}>
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
                  <Link href={location.href} className={styles.branchLink}>
                    Studio page
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
