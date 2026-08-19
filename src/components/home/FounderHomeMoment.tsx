import Link from "next/link";
import { SectionReveal } from "@/components/motion";
import styles from "./pulse/pulse-home.module.css";

export type FounderChronologyItem = {
  year: number;
  place: string;
};

export type FounderHomeMomentProps = {
  name?: string;
  foundedLabel?: string;
  copy: string;
  aboutHref?: string;
  chronology?: FounderChronologyItem[];
};

/**
 * Editorial homepage founder chapter — typography-led; full story lives on /about.
 */
export function FounderHomeMoment({
  name = "Ankit Nalawade",
  foundedLabel = "Founded in Airoli",
  copy,
  aboutHref = "/about",
  chronology = [],
}: FounderHomeMomentProps) {
  const anchorYear = chronology[0]?.year ?? 2019;

  return (
    <section
      id="founder"
      className={`${styles.field} ${styles.band} ${styles.founderBand}`}
      aria-labelledby="home-founder-title"
      data-compose="founder-opening"
    >
      <div className={styles.founderGrid}>
        <SectionReveal pattern="B" side="left">
          <h2 id="home-founder-title" className={styles.founderName}>
            {name}
          </h2>
          <p className={styles.founderKicker}>
            Founder · since {anchorYear}
          </p>
          <p className={styles.founderAnchor}>{foundedLabel}</p>
        </SectionReveal>
        <SectionReveal pattern="B" side="right">
          <p className={styles.founderCopy}>{copy}</p>
          {chronology.length > 0 ? (
            <ol className={styles.founderChronology} aria-label="Studio growth">
              {chronology.map((item) => (
                <li key={`${item.year}-${item.place}`}>
                  <span className={styles.founderChronologyYear}>{item.year}</span>
                  <span className={styles.founderChronologyPlace}>{item.place}</span>
                </li>
              ))}
            </ol>
          ) : null}
          <Link href={aboutHref} className={styles.founderLink}>
            Read our story
          </Link>
        </SectionReveal>
      </div>
    </section>
  );
}
