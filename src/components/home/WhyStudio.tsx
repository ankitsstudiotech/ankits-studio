import styles from "./pulse/pulse-home.module.css";

export type WhyPoint = {
  id: string;
  title: string;
  body: string;
};

export type WhyStudioProps = {
  title: string;
  body: string;
  points?: WhyPoint[];
};

/** Machine-free / needs-adapted differentiator — no slogan triad. */
export function WhyStudio({ title, body, points = [] }: WhyStudioProps) {
  return (
    <section
      id="studio"
      className={`${styles.field} ${styles.band} ${styles.diffBand}`}
      aria-labelledby="home-diff-title"
    >
      <div className={styles.diffCopy}>
        <h2 id="home-diff-title">{title}</h2>
        <p>{body}</p>
        {points.length > 0 ? (
          <ul className={styles.diffList}>
            {points.map((point) => (
              <li key={point.id}>
                <strong>{point.title}</strong> — {point.body}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
