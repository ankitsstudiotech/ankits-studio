import { ProgrammeRow } from "@/components/programs/ProgrammeRow";
import { SectionReveal } from "@/components/motion";
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

const TAXONOMY: Record<ServiceCluster["id"], string> = {
  train: "Train",
  move: "Move",
  celebrate: "Celebrate",
  teams: "For Teams",
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
 * Editorial programme matrix — eight numbered modules on one framed field.
 * Taxonomy labels remain TRAIN / MOVE / CELEBRATE / FOR TEAMS.
 */
export function ProgrammeShowcase({ clusters, audienceNote }: ProgrammeShowcaseProps) {
  const modules = clusters.flatMap((cluster) =>
    cluster.programmes.map((programme) => ({
      ...programme,
      cluster: cluster.id,
      taxonomy: TAXONOMY[cluster.id],
    })),
  );

  return (
    <section
      id="services"
      className={`${styles.field} ${styles.band}`}
      data-discovery="programme-matrix"
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

      <ul className={styles.clusterKey} aria-label="Programme groups">
        {clusters.map((cluster) => (
          <li key={cluster.id} className={styles.clusterKeyItem} data-cluster={cluster.id}>
            <p className={styles.clusterKeyTitle}>{TAXONOMY[cluster.id]}</p>
            <p className={styles.clusterKeyLede}>{cluster.lede}</p>
          </li>
        ))}
      </ul>

      <div className={styles.moduleMatrix} data-matrix="editorial">
        {modules.map((programme, index) => {
          const slug = programme.slug ?? slugFromHref(programme.href);
          return (
            <ProgrammeRow
              key={programme.href}
              name={programme.name}
              description={programme.shortDescription}
              href={programme.href}
              meta={programme.meta}
              emphasis={programme.emphasis}
              cluster={programme.cluster}
              energy={energyFromTempo(programme.tempo)}
              motionTone={slug === "corporate-wellness" ? "direct" : toneFromProgrammeSlug(slug)}
              programmeSlug={slug}
              titleAs="h3"
              layout="module"
              index={String(index + 1).padStart(2, "0")}
              taxonomy={programme.taxonomy}
            />
          );
        })}
      </div>

      {audienceNote ? <p className={styles.audienceNote}>{audienceNote}</p> : null}
    </section>
  );
}
