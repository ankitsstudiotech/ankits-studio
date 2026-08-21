import Link from "next/link";
import type { Guide } from "@/content";
import { SectionReveal } from "@/components/motion";
import styles from "./guides.module.css";

export type GuidesIndexViewProps = {
  clusters: Array<{
    label: string;
    guides: Guide[];
  }>;
};

export function GuidesIndexView({ clusters }: GuidesIndexViewProps) {
  return (
    <>
      <section className={styles.band} aria-labelledby="guides-title">
        <div className={styles.openMeasure}>
          <p className={styles.kicker}>Guides</p>
          <h1 id="guides-title" className={styles.title}>
            Practical guides
          </h1>
          <p className={styles.lede}>
            Clear answers on Zumba, training formats, wedding choreography and home coaching —
            written to help you choose the right programme at Ankit’s Studio.
          </p>
        </div>
      </section>

      <section className={styles.band} aria-label="Guide topics">
        {clusters.map((cluster) => (
          <div key={cluster.label} className={styles.hubCluster}>
            <SectionReveal>
              <p className={styles.clusterLabel}>{cluster.label}</p>
              <ul className={styles.linkList}>
                {cluster.guides.map((guide) => (
                  <li key={guide.slug}>
                    <Link href={`/guides/${guide.slug}`}>
                      <span className={styles.linkTitle}>{guide.title}</span>
                      <span className={styles.linkMeta}>{guide.excerpt}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </SectionReveal>
          </div>
        ))}
      </section>
    </>
  );
}
