import Image from "next/image";
import Link from "next/link";
import { MaskedLines } from "@/components/motion";
import { PulseCta } from "./pulse/PulseMotion";
import styles from "./pulse/pulse-home.module.css";

export type HeroProps = {
  brandName: string;
  title: string;
  titleLines?: string[];
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

/**
 * Homepage hero — H1 leads; copy/CTA follow after headline is readable.
 * Choreography is CSS-timed (motion-pending → motion-ready) so hierarchy
 * does not depend on Motion child stagger wrapping the H1.
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
      <div className={styles.heroCopy}>
        <div className={`hero-brand-motion ${styles.heroBrand}`}>
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

        <div className={`hero-support ${styles.heroSupport}`}>
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

        <span
          className={`hero-accent-motion ${styles.heroAccent}`}
          aria-hidden
        />
      </div>
    </section>
  );
}
