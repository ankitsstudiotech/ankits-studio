import Link from "next/link";
import type { Programme } from "@/content";
import { FreeTrialCta } from "@/components/home/FreeTrialCta";
import { PulseMedia } from "@/components/media";
import { HeroReveal } from "@/components/motion";
import { programmeHeroSlotKey, resolveSlotMedia } from "@/content/media";
import styles from "./programme-pulse.module.css";

function bySlug(programmes: Programme[], slug: string): Programme | undefined {
  return programmes.find((programme) => programme.slug === slug);
}

function keepColour(slug: string): boolean {
  return slug === "yoga" || slug === "zumba" || slug === "adult-dance";
}

export type ProgrammeDiscoveryProps = {
  programmes: Programme[];
  trialHref: string;
  trialLabel: string;
  /** Enquiry-only corporate note; rendered as restrained closing copy, not a programme row. */
  corporateNote?: string;
};

/**
 * Category-led programme index — Concept B geometry, application copy and assets.
 */
export function ProgrammeDiscovery({
  programmes,
  trialHref,
  trialLabel,
  corporateNote,
}: ProgrammeDiscoveryProps) {
  const functional = bySlug(programmes, "functional-training");
  const homePt = bySlug(programmes, "home-personal-training");
  const online = bySlug(programmes, "online-training");
  const zumba = bySlug(programmes, "zumba");
  const yoga = bySlug(programmes, "yoga");
  const dance = bySlug(programmes, "adult-dance");
  const corporate = bySlug(programmes, "corporate-wellness");
  const wedding = bySlug(programmes, "wedding-choreography");

  return (
    <>
      <section
        className={styles.discovery}
        data-discovery="programme-index"
        aria-labelledby="programmes-index-title"
      >
        <HeroReveal>
          <header className={styles.hero}>
            <div className={styles.heroInner}>
              <h1 id="programmes-index-title" className={styles.heroTitle}>
                <span className={styles.heroLine}>Choose how you</span>
                <span className={styles.heroAccent}>Want to move</span>
              </h1>
              <p className={styles.heroLede}>
                Choose from fitness, movement and training options. Machine-free, coach-led sessions —
                choose the format that fits your goals and routine. Ask which batch fits when you book a free
                trial.
              </p>
            </div>
          </header>
        </HeroReveal>

        <div className={styles.chapters} data-programme-pairs>
          {functional ? (
            <section className={styles.chapter} data-chapter="train" aria-labelledby="chapter-train">
              <p className={styles.spine}>Train</p>
              <div className={styles.chapterBody}>
                <div className={styles.splitTrain}>
                  <FeaturedProgramme
                    programme={functional}
                    categoryId="chapter-train"
                    categoryTitle="Train"
                    ratio="wide"
                  />
                  <CompactIndex
                    label="Train programmes"
                    items={[homePt, online].filter((item): item is Programme => Boolean(item))}
                  />
                </div>
              </div>
            </section>
          ) : null}

          {zumba ? (
            <section className={styles.chapter} data-chapter="move" aria-labelledby="chapter-move">
              <p className={styles.spine}>Move</p>
              <div className={styles.chapterBody}>
                <div className={styles.splitMove}>
                  <FeaturedProgramme
                    programme={zumba}
                    categoryId="chapter-move"
                    categoryTitle="Move"
                    ratio="wide"
                  />
                  <CompactIndex
                    label="Move programmes"
                    items={[yoga, dance].filter((item): item is Programme => Boolean(item))}
                  />
                </div>
              </div>
            </section>
          ) : null}

          {corporate || wedding ? (
            <section
              className={styles.chapter}
              data-chapter="teams-celebrate"
              aria-labelledby="chapter-teams"
            >
              <p className={styles.spine}>For Teams / Celebrate</p>
              <div className={styles.chapterBody}>
                <div className={styles.closingPair}>
                  {corporate ? (
                    <FeaturedProgramme
                      programme={corporate}
                      categoryId="chapter-teams"
                      categoryTitle="For Teams"
                      ratio="square"
                    />
                  ) : null}
                  {wedding ? (
                    <FeaturedProgramme
                      programme={wedding}
                      categoryId="chapter-celebrate"
                      categoryTitle="Celebrate"
                      ratio="square"
                    />
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </section>

      <FreeTrialCta
        id="programmes-trial"
        titleId="programmes-trial-title"
        href={trialHref}
        label={trialLabel}
        secondaryHref="/locations"
        secondaryLabel="Browse locations"
      />
      {corporateNote ? (
        <p className={styles.corporateNote}>
          {corporateNote}{" "}
          <a
            href={trialHref}
            {...(trialHref.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            Enquire on WhatsApp
          </a>
          .
        </p>
      ) : null}
    </>
  );
}

function FeaturedProgramme({
  programme,
  categoryId,
  categoryTitle,
  ratio,
}: {
  programme: Programme;
  categoryId: string;
  categoryTitle: string;
  ratio: "wide" | "square";
}) {
  const slot = programmeHeroSlotKey(programme.slug);
  const media = slot ? resolveSlotMedia(slot) : null;

  return (
    <div className={styles.feature}>
      <h2 id={categoryId} className={styles.chapterTitle}>
        <Link href={`/programs/${programme.slug}`}>
          {categoryTitle}
          <span className={styles.chapterArrow} aria-hidden="true">
            →
          </span>
        </Link>
      </h2>
      <Link
        href={`/programs/${programme.slug}`}
        className={`${styles.featureHit} ${keepColour(programme.slug) ? "" : "editorial-mono"}`}
        data-ratio={ratio}
      >
        {media ? (
          <PulseMedia item={media} sizes="(max-width: 1023px) 100vw, 50vw" />
        ) : null}
        <span className={styles.featureLabel}>{programme.name}</span>
      </Link>
    </div>
  );
}

function CompactIndex({ items, label }: { items: Programme[]; label: string }) {
  if (items.length === 0) return null;

  return (
    <nav className={styles.compactIndex} aria-label={label}>
      {items.map((item) => (
        <Link key={item.slug} href={`/programs/${item.slug}`} className={styles.compactRow}>
          <span className={styles.compactName}>{item.name}</span>
          <span className={styles.compactArrow} aria-hidden="true">
            ↗
          </span>
        </Link>
      ))}
    </nav>
  );
}
