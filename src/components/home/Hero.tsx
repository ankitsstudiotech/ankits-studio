import Image from "next/image";
import Link from "next/link";
import { PulseCta } from "./pulse/PulseMotion";
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
 * Copy is server-rendered at full opacity. Text-led; no media plate.
 * Full brand lockup is header-primary on small screens (hero brand softens).
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
          <PulseCta id="home-hero-primary-cta" href={primaryCta.href}>
            {primaryCta.label}
          </PulseCta>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className={styles.heroSecondary}>
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
