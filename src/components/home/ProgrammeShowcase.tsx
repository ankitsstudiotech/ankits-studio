import { ServiceLane, type ServiceTempo } from "./pulse/PulseMotion";
import styles from "./pulse/pulse-home.module.css";

export type ProgrammeAccent = ServiceTempo;

export type ProgrammeShowcaseProps = {
  programmes: Array<{
    name: string;
    href: string;
    shortDescription: string;
    tempo: ServiceTempo;
    meta?: string;
  }>;
  audienceNote?: string;
};

export function ProgrammeShowcase({ programmes, audienceNote }: ProgrammeShowcaseProps) {
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
        Confirmed studio services — each with its own pace. Ask which batch fits you when you book
        a trial.
      </p>
      <div className={styles.lanes}>
        {programmes.map((programme) => (
          <ServiceLane
            key={programme.href}
            tempo={programme.tempo}
            name={programme.name}
            description={programme.shortDescription}
            href={programme.href}
            meta={programme.meta}
          />
        ))}
      </div>
      {audienceNote ? <p className={styles.audienceNote}>{audienceNote}</p> : null}
    </section>
  );
}
