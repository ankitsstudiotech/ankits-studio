import Link from "next/link";
import styles from "./pulse/pulse-home.module.css";

export type BranchExplorerProps = {
  locations: Array<{
    name: string;
    href: string;
    detail: string;
    mapsUrl?: string;
    addressPending?: boolean;
  }>;
};

export function BranchExplorer({ locations }: BranchExplorerProps) {
  return (
    <section
      id="locations"
      className={`${styles.field} ${styles.band}`}
      aria-labelledby="home-branches-title"
    >
      <h2 id="home-branches-title" className={styles.bandTitle}>
        Find your nearest studio
      </h2>
      <p className={styles.bandLede}>
        Four neighbourhood studios across Airoli, Ghansoli, and Thane. Trial enquiries use our
        central WhatsApp number.
      </p>
      <div className={styles.branchList}>
        {locations.map((location) => (
          <article key={location.href} className={styles.branchCard}>
            {location.addressPending ? (
              <span className={styles.pendingFlag}>Map &amp; address updating</span>
            ) : null}
            <h3>{location.name}</h3>
            <p>{location.detail}</p>
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
        ))}
      </div>
    </section>
  );
}
