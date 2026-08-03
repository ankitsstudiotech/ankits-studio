import { ServiceLane, type ServiceTempo } from "./pulse/PulseMotion";
import styles from "./pulse/pulse-home.module.css";

export type ProgrammeAccent = ServiceTempo;

export type ShowcaseProgramme = {
  name: string;
  href: string;
  shortDescription: string;
  tempo: ServiceTempo;
  meta?: string;
  /** Commercial lead — Functional Training. */
  emphasis?: "primary";
};

export type ServiceCluster = {
  id: "train" | "move" | "celebrate";
  title: string;
  lede: string;
  programmes: ShowcaseProgramme[];
};

export type ProgrammeShowcaseProps = {
  clusters: ServiceCluster[];
  audienceNote?: string;
};

/**
 * Editorial service discovery — Train / Move / Celebrate clusters.
 * Every programme remains an explicit crawlable link (SSR).
 */
export function ProgrammeShowcase({ clusters, audienceNote }: ProgrammeShowcaseProps) {
  return (
    <section
      id="services"
      className={`${styles.field} ${styles.band}`}
      aria-labelledby="home-services-title"
    >
      <h2 id="home-services-title" className={styles.bandTitle}>
        Choose how you want to move
      </h2>
      <p className={styles.bandLede}>
        Studio services, grouped by how most people start. Ask which batch fits you when you book a
        trial.
      </p>

      <div className={styles.clusters}>
        {clusters.map((cluster) => (
          <section
            key={cluster.id}
            className={styles.cluster}
            data-cluster={cluster.id}
            aria-labelledby={`home-cluster-${cluster.id}`}
          >
            <header className={styles.clusterHeader}>
              <h3 id={`home-cluster-${cluster.id}`} className={styles.clusterTitle}>
                {cluster.title}
              </h3>
              <p className={styles.clusterLede}>{cluster.lede}</p>
            </header>
            <div className={styles.lanes}>
              {cluster.programmes.map((programme) => (
                <ServiceLane
                  key={programme.href}
                  tempo={programme.tempo}
                  name={programme.name}
                  description={programme.shortDescription}
                  href={programme.href}
                  meta={programme.meta}
                  emphasis={programme.emphasis}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {audienceNote ? <p className={styles.audienceNote}>{audienceNote}</p> : null}
    </section>
  );
}
