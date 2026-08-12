"use client";

import { ProgrammeRow } from "@/components/programs/ProgrammeRow";
import { SectionReveal, GroupReveal } from "@/components/motion";
import type { ServiceTempo } from "./pulse/PulseMotion";
import { toneFromProgrammeSlug } from "@/components/motion/tokens";
import styles from "./pulse/pulse-home.module.css";

export type ProgrammeAccent = ServiceTempo;

export type ShowcaseProgramme = {
  name: string;
  href: string;
  shortDescription: string;
  tempo: ServiceTempo;
  meta?: string;
  emphasis?: "primary";
  slug?: string;
};

export type ServiceCluster = {
  id: "train" | "move" | "celebrate" | "teams";
  title: string;
  lede: string;
  programmes: ShowcaseProgramme[];
};

export type ProgrammeShowcaseProps = {
  clusters: ServiceCluster[];
  audienceNote?: string;
};

function energyFromTempo(tempo: ServiceTempo): "calm" | "standard" | "high" {
  if (tempo === "yoga" || tempo === "home" || tempo === "online") return "calm";
  if (tempo === "zumba" || tempo === "dance") return "high";
  return "standard";
}

function slugFromHref(href: string): string {
  const parts = href.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

/**
 * Editorial service discovery — Train / Move / Celebrate.
 * Section header uses Pattern A; rows carry cluster personalities.
 */
export function ProgrammeShowcase({ clusters, audienceNote }: ProgrammeShowcaseProps) {
  return (
    <section
      id="services"
      className={`${styles.field} ${styles.band}`}
      aria-labelledby="home-services-title"
    >
      <SectionReveal pattern="A">
        <h2 id="home-services-title" className={styles.bandTitle}>
          Choose how you want to move
        </h2>
        <p className={styles.bandLede}>
          Studio services, grouped by how most people start. Ask which batch fits you when you book a
          trial.
        </p>
      </SectionReveal>

      <div className={styles.clusters}>
        {clusters.map((cluster) => (
          <section
            key={cluster.id}
            className={styles.cluster}
            data-cluster={cluster.id}
            aria-labelledby={`home-cluster-${cluster.id}`}
          >
            <GroupReveal>
              <header className={styles.clusterHeader}>
                <h3 id={`home-cluster-${cluster.id}`} className={styles.clusterTitle}>
                  {cluster.title}
                </h3>
                <p className={styles.clusterLede}>{cluster.lede}</p>
              </header>
            </GroupReveal>
            <div className={styles.lanes}>
              {cluster.programmes.map((programme) => {
                const slug = programme.slug ?? slugFromHref(programme.href);
                return (
                  <ProgrammeRow
                    key={programme.href}
                    name={programme.name}
                    description={programme.shortDescription}
                    href={programme.href}
                    meta={programme.meta}
                    emphasis={programme.emphasis}
                    cluster={cluster.id}
                    energy={energyFromTempo(programme.tempo)}
                    motionTone={
                      slug === "corporate-wellness" ? "direct" : toneFromProgrammeSlug(slug)
                    }
                    programmeSlug={slug}
                    titleAs="h4"
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {audienceNote ? <p className={styles.audienceNote}>{audienceNote}</p> : null}
    </section>
  );
}
