import Image from "next/image";
import Link from "next/link";
import { HeroReveal, MaskedLines } from "@/components/motion";
import { PulseCta } from "./pulse/PulseMotion";
import styles from "./pulse/pulse-home.module.css";

export type HeroProps = {
  brandName: string;
  title: string;
  /** Optional line breaks for mask reveal — defaults to single-line title. */
  titleLines?: string[];
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

/**
 * Studio Pulse hero — brand, offering, places, WhatsApp trial.
 * Copy is server-rendered; mask + HeroReveal enhance after hydration.
 */
export function Hero({
  brandName,
  title,
  titleLines,
  description,
  primaryCta,
  secondaryCta,
}: HeroProps) {
  const lines = titleLines?.length ? titleLines : [title];

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
        <MaskedLines
          id="home-hero-title"
          as="h1"
          lines={lines}
          className={styles.heroTitle}
        />
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
        <span className={styles.heroAccent} aria-hidden />
      </HeroReveal>
    </section>
  );
}
