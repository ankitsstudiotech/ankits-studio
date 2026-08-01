import Link from "next/link";
import styles from "./pulse/pulse-home.module.css";

export type BranchExplorerProps = {
  locations: Array<{
    name: string;
    href: string;
    areaLabel: string;
    programmeCountLabel: string;
    mockDisclaimer?: string;
    dataStatus?: string;
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
        BRANCH NODES
      </h2>
      <div className={styles.nodes}>
        {locations.length === 0 ? (
          <div className={styles.node}>
            <h3>NONE</h3>
            <p>No publicly listed branches in this content mode.</p>
          </div>
        ) : (
          locations.map((location) => (
            <Link key={location.href} href={location.href} className={styles.node}>
              {location.dataStatus && location.dataStatus !== "verified" ? (
                <span className={styles.flag}>{location.dataStatus}</span>
              ) : null}
              <h3>{location.name.toUpperCase()}</h3>
              <p>{location.areaLabel}</p>
              <p>{location.programmeCountLabel}</p>
              {location.mockDisclaimer ? (
                <p className={styles.disclaimer}>{location.mockDisclaimer}</p>
              ) : null}
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
