import Image from "next/image";
import Link from "next/link";
import { MaskedLines } from "@/components/motion";
import { PulseMedia } from "@/components/media";
import { resolveSlotMedia } from "@/content/media";
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
 * Optional editorial media when synthetic flag enables a resolvable slot
 * (Stage 4A geometry or later verified/synthetic assets). Flag false = text-led.
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
  const media = resolveSlotMedia("home.hero");
  const withMedia = Boolean(media);

  return (
    <section
      className={[styles.field, styles.hero, withMedia ? styles.heroWithMedia : ""]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby="home-hero-title"
      data-media-layout={withMedia ? "editorial-split" : "text-led"}
    >
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

        <span className={`hero-accent-motion ${styles.heroAccent}`} aria-hidden />
      </div>

      {media ? (
        <div className={styles.heroMedia}>
          <PulseMedia
            item={media}
            overlay
            priority
            sizes="(max-width: 1023px) 100vw, 55vw"
          />
        </div>
      ) : null}
    </section>
  );
}
