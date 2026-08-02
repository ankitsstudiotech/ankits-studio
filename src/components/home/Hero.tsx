import Image from "next/image";
import Link from "next/link";
import { PulseCta, PulseMediaPlate } from "./pulse/PulseMotion";
import styles from "./pulse/pulse-home.module.css";

export type HeroProps = {
  brandName: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

/**
 * Studio Pulse hero — brand, offering, places, WhatsApp trial.
 * Copy is server-rendered at full opacity. Media deferred below copy on mobile.
 */
export function Hero({
  brandName,
  title,
  description,
  primaryCta,
  secondaryCta,
}: HeroProps) {
  return (
    <section className={`${styles.field} ${styles.hero}`} aria-labelledby="home-hero-title">
      <div className={styles.heroCopy}>
        <div className={styles.heroBrand}>
          <span className={styles.heroLogoPlate}>
            <Image
              src="/brand/ankits-studio-symbol.png"
              alt=""
              width={48}
              height={48}
              className={styles.heroLogo}
              priority
            />
          </span>
          <p className={styles.heroBrandName}>{brandName}</p>
        </div>
        <h1 id="home-hero-title">{title}</h1>
        <p>{description}</p>
        <div className={styles.heroActions}>
          <PulseCta href={primaryCta.href}>{primaryCta.label}</PulseCta>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className={styles.heroSecondary}>
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
      <div className={styles.heroStack} aria-hidden>
        <div className={styles.layerA}>
          <PulseMediaPlate family="strength" label="Studio atmosphere placeholder" aspect="16/9" />
        </div>
      </div>
    </section>
  );
}
