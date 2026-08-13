import Link from "next/link";
import { SectionReveal } from "@/components/motion";
import styles from "./pulse/pulse-home.module.css";

export type FounderHomeMomentProps = {
  name?: string;
  foundedLabel?: string;
  copy: string;
  aboutHref?: string;
};

/**
 * Compact homepage founder chapter — full story lives on /about.
 */
export function FounderHomeMoment({
  name = "Ankit Nalawade",
  foundedLabel = "Founded in Airoli · 2019",
  copy,
  aboutHref = "/about",
}: FounderHomeMomentProps) {
  return (
    <section
      id="founder"
      className={`${styles.field} ${styles.band} ${styles.founderBand}`}
      aria-labelledby="home-founder-title"
    >
      <SectionReveal pattern="B" side="left">
        <p className={styles.founderKicker}>Founder</p>
        <h2 id="home-founder-title" className={styles.founderName}>
          {name}
        </h2>
        <p className={styles.founderAnchor}>{foundedLabel}</p>
        <p className={styles.founderCopy}>{copy}</p>
        <Link href={aboutHref} className={styles.founderLink}>
          Read our story
        </Link>
      </SectionReveal>
    </section>
  );
}
