import { PulseMediaPlate } from "./pulse/PulseMotion";
import styles from "./pulse/pulse-home.module.css";

export type WhyPoint = {
  id: string;
  title: string;
  body: string;
};

export type WhyStudioProps = {
  points: WhyPoint[];
  disclaimer?: string;
};

export function WhyStudio({ points, disclaimer }: WhyStudioProps) {
  return (
    <section
      id="studio"
      className={`${styles.field} ${styles.band}`}
      aria-labelledby="home-community-title"
    >
      <h2 id="home-community-title" className={styles.bandTitle}>
        COMMUNITY PULSE
      </h2>
      <div className={styles.story}>
        <PulseMediaPlate family="high-energy" label="Shared floor · class energy" aspect="16/9" />
        <div className={styles.storyCopy}>
          {points.map((point) => (
            <div key={point.id}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.6rem",
                  letterSpacing: "0.03em",
                  margin: "0 0 0.35rem",
                }}
              >
                {point.title}
              </p>
              <p>{point.body}</p>
            </div>
          ))}
          {disclaimer ? <p className={styles.disclaimer}>{disclaimer}</p> : null}
        </div>
      </div>
    </section>
  );
}
