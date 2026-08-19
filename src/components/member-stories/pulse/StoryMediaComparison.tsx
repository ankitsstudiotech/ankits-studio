import type { MediaAsset } from "@/content/schema";
import styles from "./member-stories.module.css";

type StoryMediaComparisonProps = {
  before?: MediaAsset;
  after?: MediaAsset;
  disclosure?: string;
};

/**
 * Side-by-side stills only — never a draggable before/after slider.
 * Call only when both media assets and permissions are publishable.
 */
export function StoryMediaComparison({ before, after, disclosure }: StoryMediaComparisonProps) {
  if (!before && !after) return null;
  return (
    <figure className={styles.mediaCompare}>
      <div className={styles.mediaCompareGrid}>
        {before ? (
          // eslint-disable-next-line @next/next/no-img-element -- consented member media; next/image when pipeline ready
          <img src={before.src} alt={before.alt} width={before.width} height={before.height} />
        ) : null}
        {after ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={after.src} alt={after.alt} width={after.width} height={after.height} />
        ) : null}
      </div>
      {disclosure ? <figcaption className={styles.provenance}>{disclosure}</figcaption> : null}
    </figure>
  );
}
