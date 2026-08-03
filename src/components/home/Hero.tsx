import Image from "next/image";
import Link from "next/link";
import { HeroReveal } from "@/components/motion";
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
 * Copy is server-rendered; HeroReveal adds opt-in entrance motion.
 * Text-led; no media plate. Transparent symbol (no white plate).
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
      <HeroReveal className={styles.heroCopy}>
        <div className={styles.heroBrand}>
          <Image
            src="/brand/ankits-studio-symbol-transparent.png"
            alt=""
            width={48}
            height={48}
            className={styles.heroLogo}
            priority
          />
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
      </HeroReveal>
    </section>
  );
}
