import Link from "next/link";
import { BeatStrip, PulseCta, PulseMediaPlate } from "./pulse/PulseMotion";
import styles from "./pulse/pulse-home.module.css";

export type HeroProps = {
  title: string;
  description: string;
  mockDisclaimer?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

/**
 * Studio Pulse hero — layered media + tempo strip.
 * Heading is always in the DOM at full opacity (no entrance hide).
 */
export function Hero({
  title,
  description,
  mockDisclaimer,
  primaryCta,
  secondaryCta,
}: HeroProps) {
  return (
    <section className={`${styles.field} ${styles.hero}`} aria-labelledby="home-hero-title">
      <div className={styles.heroCopy}>
        <h1 id="home-hero-title">{title}</h1>
        <p>{description}</p>
        {mockDisclaimer ? <p className={styles.disclaimer}>{mockDisclaimer}</p> : null}
        <BeatStrip />
        <div className={styles.heroActions}>
          <PulseCta href={primaryCta.href}>{primaryCta.label}</PulseCta>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className={styles.heroSecondary}>
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
      <div className={styles.heroStack}>
        <div className={styles.layerA}>
          <PulseMediaPlate family="high-energy" label="Community energy" aspect="4/5" />
        </div>
        <div className={styles.layerB}>
          <PulseMediaPlate family="strength" label="Floor tension" aspect="4/5" />
        </div>
      </div>
    </section>
  );
}
