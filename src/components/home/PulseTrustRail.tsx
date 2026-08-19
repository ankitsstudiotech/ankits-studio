import styles from "./pulse/pulse-home.module.css";

export type TrustFact = {
  id: string;
  label: string;
  value: string;
};

export type PulseTrustRailProps = {
  facts: TrustFact[];
};

/**
 * Compact typographic trust rail — verified business facts only.
 * No counters, shields, or bordered badge walls.
 */
export function PulseTrustRail({ facts }: PulseTrustRailProps) {
  if (facts.length === 0) return null;

  return (
    <section
      className={`${styles.field} ${styles.band} ${styles.trustBand}`}
      aria-label="Studio facts"
    >
      <ul className={styles.trustRail}>
        {facts.map((fact) => (
          <li key={fact.id} className={styles.trustFact}>
            <span className={styles.trustLabel}>{fact.label}</span>
            <span className={styles.trustValue}>{fact.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
