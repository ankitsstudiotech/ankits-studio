import { Badge } from "@/components/ui/Badge";
import { Caption, Heading } from "@/components/ui/Typography";
import { MockDisclaimer } from "./MockDisclaimer";
import styles from "./pulse/pulse-home.module.css";

export type TransformationStoryItem = {
  slug: string;
  summary: string;
  programmeLabel: string;
  mockDisclaimer: string;
};

export type TransformationStoriesProps = {
  items: TransformationStoryItem[];
};

/** Honest evidence placeholders — community tempo, not fake stats. */
export function TransformationStories({ items }: TransformationStoriesProps) {
  return (
    <section
      id="transformations"
      className={styles.communityBand}
      aria-labelledby="home-evidence-title"
    >
      <h2 id="home-evidence-title" className={styles.bandTitle}>
        HONEST EVIDENCE
      </h2>
      <p className={styles.disclaimer} style={{ marginBottom: "1.25rem", maxWidth: "48ch" }}>
        Illustrative programme journeys only — no fabricated before/after photography,
        percentages, or member identities.
      </p>
      <div className={styles.evidenceList}>
        {items.slice(0, 3).map((item) => (
          <article key={item.slug} className={styles.evidenceItem}>
            <Badge accent="neutral">Illustrative</Badge>
            <Caption className="mt-2 text-[var(--color-muted-on-field)]">
              {item.programmeLabel}
            </Caption>
            <Heading as="h3" className="mt-2 text-ink-inverse">
              Example journey
            </Heading>
            <p>{item.summary}</p>
            <MockDisclaimer className="mt-3">{item.mockDisclaimer}</MockDisclaimer>
          </article>
        ))}
      </div>
    </section>
  );
}
