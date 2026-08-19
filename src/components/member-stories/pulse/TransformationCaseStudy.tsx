import type { Transformation } from "@/content";
import styles from "./member-stories.module.css";

/**
 * Future case-study layout for a publishable Transformation.
 * Never use with fictional fixtures. No before/after slider.
 */
export function TransformationCaseStudy({ item }: { item: Transformation }) {
  return (
    <article className={styles.storyArticle}>
      <h3 className={styles.storyName}>{item.memberDisplayName}</h3>
      <p className={styles.kicker}>{item.timeframeLabel}</p>
      <p className={styles.body}>
        <strong>Starting point:</strong> {item.statedStartingPoint}
      </p>
      <p className={styles.body}>
        <strong>Outcome:</strong> {item.memberDescribedOutcome}
      </p>
      {item.measurableOutcome ? (
        <p className={styles.body}>
          <strong>Measurement:</strong> {item.measurableOutcome}
          {item.measurementSource ? ` (${item.measurementSource})` : null}
        </p>
      ) : null}
      {item.imageTreatmentDisclosure ? (
        <p className={styles.provenance}>{item.imageTreatmentDisclosure}</p>
      ) : null}
      <p className={styles.provenance}>
        Individual experiences vary. This story does not guarantee the same result for others.
      </p>
    </article>
  );
}
