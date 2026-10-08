import Link from "next/link";
import { MaskedLines } from "@/components/motion";
import { PulseMedia } from "@/components/media";
import { resolveSlotMedia } from "@/content/media";
import { PulseCta } from "./pulse/PulseMotion";
import styles from "./pulse/pulse-home.module.css";

export type HeroProps = {
  title: string;
  titleLines?: string[];
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /**
   * Document heading level. Defaults to H1. When a seasonal campaign owns the
   * page H1 (e.g. Garba Home hero), pass `"h2"` so hierarchy stays valid.
   */
  titleAs?: "h1" | "h2";
  /** When false, skip LCP priority on hero media (seasonal campaign is LCP). */
  mediaPriority?: boolean;
};

/**
 * Homepage coach-led fitness surface. Normally the page hero (H1); may demote
 * to H2 while a temporary seasonal campaign owns the first viewport.
 * Header already carries brand; this surface does not repeat the lockup.
 * Optional editorial media when an owner-approved illustrative slot resolves.
 */
export function Hero({
  title,
  titleLines,
  description,
  primaryCta,
  secondaryCta,
  titleAs = "h1",
  mediaPriority = true,
}: HeroProps) {
  const lines = titleLines?.length ? titleLines : [title];
  const media = resolveSlotMedia("home.hero");
  const withMedia = Boolean(media);

  return (
    <section
      className={[
        styles.field,
        styles.hero,
        withMedia ? styles.heroWithMedia : "",
        styles.heroGuides,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby="home-hero-title"
      data-media-layout={withMedia ? "editorial-blend" : "text-led"}
      data-home-surface={titleAs === "h1" ? "hero" : "secondary"}
    >
      <div className={styles.heroCopy}>
        <MaskedLines
          id="home-hero-title"
          as={titleAs}
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

        <span className={`hero-accent-motion programme-cue ${styles.heroAccent}`} aria-hidden />
      </div>

      {media ? (
        <div className={styles.heroMedia}>
          <PulseMedia
            item={media}
            overlay={false}
            priority={mediaPriority}
            reveal={false}
            sizes="(max-width: 1023px) 100vw, 55vw"
          />
        </div>
      ) : null}
    </section>
  );
}
