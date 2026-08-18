import Link from "next/link";
import type { Programme } from "@/content";
import { FreeTrialCta } from "@/components/home/FreeTrialCta";
import { PulseMedia } from "@/components/media";
import { HeroReveal } from "@/components/motion";
import { programmeHeroSlotKey, resolveSlotMedia } from "@/content/media";
import styles from "./programme-pulse.module.css";

const CLUSTER_COPY = {
  train: {
    title: "Train",
    lede: "Coach-led fitness — in studio, at home, or online.",
  },
  move: {
    title: "Move",
    lede: "Group energy, breath work, and studio dance.",
  },
  celebrate: {
    title: "Celebrate",
    lede: "Personal choreography for wedding moments.",
  },
  teams: {
    title: "For Teams",
    lede: "Workplace and online fitness and wellness programmes for organisations.",
  },
} as const;

const PROGRAMME_ORDER = [
  "functional-training",
  "home-personal-training",
  "online-training",
  "zumba",
  "yoga",
  "adult-dance",
  "wedding-choreography",
  "corporate-wellness",
] as const;

function deliveryMeta(programme: Programme): string | undefined {
  if (programme.deliveryMode === "home") {
    return "Training at your location · message us with your locality";
  }
  if (programme.deliveryMode === "online") {
    return "Remote sessions via Zoom · enquire for timing";
  }
  if (programme.slug === "corporate-wellness") {
    return "Workplace or online · tailored corporate programmes";
  }
  if (programme.slug === "functional-training") {
    return "Studio classes · all branches";
  }
  return "Studio classes · enquire for batch fit";
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
 * Magazine programme index — paired media/type chapters, not a Home matrix clone.
 */
export function ProgrammeDiscovery({
  programmes,
  trialHref,
  trialLabel,
  corporateNote,
}: ProgrammeDiscoveryProps) {
  const ordered = [...programmes].sort(
    (a, b) => PROGRAMME_ORDER.indexOf(a.slug as (typeof PROGRAMME_ORDER)[number]) -
      PROGRAMME_ORDER.indexOf(b.slug as (typeof PROGRAMME_ORDER)[number]),
  );

  const pairs: Programme[][] = [];
  for (let i = 0; i < ordered.length; i += 2) {
    pairs.push(ordered.slice(i, i + 2));
  }

  return (
    <>
    <section
      className={`${styles.field} ${styles.band}`}
      data-discovery="programme-index"
      aria-labelledby="programmes-index-title"
    >
      <HeroReveal>
        <header className={styles.indexIntro}>
          <h1 id="programmes-index-title" className={styles.bandTitle}>
            Choose how you want to move
          </h1>
          <p className={styles.bandLede}>
            Choose from fitness, movement and training options. Machine-free, coach-led sessions —
            choose the format that fits your goals and routine. Ask which batch fits when you book a free
            trial.
          </p>
        </header>
      </HeroReveal>

      <div className={styles.pairSequence} data-programme-pairs>
        {pairs.map((pair, pairIndex) => (
          <div
            key={pair.map((item) => item.slug).join("-")}
            className={styles.pairBand}
            data-flip={pairIndex % 2 === 1 ? "true" : "false"}
          >
            {pair.map((programme, itemIndex) => {
              const globalIndex = pairIndex * 2 + itemIndex;
              const cluster = programme.serviceCluster ?? "train";
              const copy = CLUSTER_COPY[cluster];
              const slot = programmeHeroSlotKey(programme.slug);
              const media = slot ? resolveSlotMedia(slot) : null;
              const mediaDominant = pairIndex % 2 === 0 ? itemIndex === 0 : itemIndex === 1;

              return (
                <article
                  key={programme.slug}
                  className={styles.pairModule}
                  data-dominant={mediaDominant ? "media" : "type"}
                  data-cluster={cluster}
                >
                  <p className={styles.pairChapter}>
                    {String(globalIndex + 1).padStart(2, "0")} / {copy.title}
                  </p>
                  <p className={styles.pairClusterLede}>{copy.lede}</p>
                  {media ? (
                    <div
                      className={`${styles.pairMedia} ${keepColour(programme.slug) ? "" : "editorial-mono"}`}
                    >
                      <PulseMedia item={media} sizes="(max-width: 900px) 100vw, 50vw" />
                    </div>
                  ) : null}
                  <div className={styles.pairCopy}>
                    <h2 className={styles.pairName}>
                      <Link href={`/programs/${programme.slug}`}>{programme.name}</Link>
                    </h2>
                    <p className={styles.pairDescription}>{programme.shortDescription}</p>
                    {deliveryMeta(programme) ? (
                      <p className={styles.pairMeta}>{deliveryMeta(programme)}</p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ))}
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
