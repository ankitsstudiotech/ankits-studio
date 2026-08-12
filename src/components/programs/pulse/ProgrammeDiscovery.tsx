import Link from "next/link";
import type { Programme } from "@/content";
import { HeroReveal } from "@/components/motion";
import { ProgrammeRow } from "@/components/programs/ProgrammeRow";
import { ProgrammePulseCta } from "./ProgrammePulseMotion";
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
    title: "Celebrate & serve",
    lede: "Wedding choreography and corporate wellness programmes.",
  },
} as const;

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

function energyFromSlug(slug: string): "calm" | "standard" | "high" {
  if (slug === "yoga" || slug === "home-personal-training" || slug === "online-training") {
    return "calm";
  }
  if (slug === "zumba" || slug === "adult-dance") return "high";
  return "standard";
}

export type ProgrammeDiscoveryProps = {
  programmes: Programme[];
  trialHref: string;
  trialLabel: string;
  /** Enquiry-only corporate note; rendered as restrained closing copy, not a programme row. */
  corporateNote?: string;
};

/**
 * Editorial programme index — Train / Move / Celebrate.
 * Confirmed services only; SSR names + crawlable ProgrammeRow anchors.
 */
export function ProgrammeDiscovery({
  programmes,
  trialHref,
  trialLabel,
  corporateNote,
}: ProgrammeDiscoveryProps) {
  const byCluster = {
    train: programmes.filter((p) => p.serviceCluster === "train"),
    move: programmes.filter((p) => p.serviceCluster === "move"),
    celebrate: programmes.filter((p) => p.serviceCluster === "celebrate"),
  };

  // Stable commercial order within Train
  byCluster.train.sort((a, b) => {
    const order = ["functional-training", "home-personal-training", "online-training"];
    return order.indexOf(a.slug) - order.indexOf(b.slug);
  });
  byCluster.move.sort((a, b) => {
    const order = ["zumba", "yoga", "adult-dance"];
    return order.indexOf(a.slug) - order.indexOf(b.slug);
  });
  byCluster.celebrate.sort((a, b) => {
    const order = ["wedding-choreography", "corporate-wellness"];
    return order.indexOf(a.slug) - order.indexOf(b.slug);
  });

  return (
    <section className={`${styles.field} ${styles.band}`} aria-labelledby="programmes-index-title">
      <HeroReveal>
        <h1 id="programmes-index-title" className={styles.bandTitle}>
          Choose how you want to move
        </h1>
        <p className={styles.bandLede}>
          Choose from fitness, movement and training options. Machine-free, coach-led sessions —
          choose the format that fits your goals and routine. Ask which batch fits when you book a free
          trial.
        </p>
      </HeroReveal>

      <div className={styles.clusters}>
        {(["train", "move", "celebrate"] as const).map((clusterId) => {
          const items = byCluster[clusterId];
          if (items.length === 0) return null;
          const copy = CLUSTER_COPY[clusterId];
          return (
            <section
              key={clusterId}
              className={styles.cluster}
              data-cluster={clusterId}
              aria-labelledby={`programmes-cluster-${clusterId}`}
            >
              <header className={styles.clusterHeader}>
                <h2 id={`programmes-cluster-${clusterId}`} className={styles.clusterTitle}>
                  {copy.title}
                </h2>
                <p className={styles.clusterLede}>{copy.lede}</p>
              </header>
              <div className={styles.lanes}>
                {items.map((programme) => (
                  <ProgrammeRow
                    key={programme.slug}
                    href={`/programs/${programme.slug}`}
                    name={programme.name}
                    description={programme.shortDescription}
                    meta={deliveryMeta(programme)}
                    cluster={clusterId}
                    energy={energyFromSlug(programme.slug)}
                    programmeSlug={programme.slug}
                    emphasis={programme.slug === "functional-training" ? "primary" : undefined}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className={styles.closing}>
        <div className={styles.ctaRow}>
          <ProgrammePulseCta href={trialHref}>{trialLabel}</ProgrammePulseCta>
          <p className={styles.ctaNote}>Free trial · ₹300 registration after you join.</p>
        </div>
        <p className={styles.closingBranch}>
          Looking for a branch instead?{" "}
          <Link href="/locations">Browse locations</Link>.
        </p>
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
      </div>
    </section>
  );
}
