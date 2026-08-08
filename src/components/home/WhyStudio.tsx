"use client";

import { GroupReveal, SectionReveal } from "@/components/motion";
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

/** Machine-free / coach-led — Pattern B paired reveal + principle group. */
export function WhyStudio({ title, body, points = [] }: WhyStudioProps) {
  return (
    <section
      id="studio"
      className={`${styles.field} ${styles.band} ${styles.diffBand}`}
      aria-labelledby="home-diff-title"
    >
      <div className={styles.diffGrid}>
        <SectionReveal pattern="B" side="left" className={styles.diffCopy}>
          <span className="motion-accent-line" aria-hidden data-drawn="true" />
          <h2 id="home-diff-title">{title}</h2>
          <p>{body}</p>
        </SectionReveal>
        {points.length > 0 ? (
          <GroupReveal withAccent className={styles.diffListWrap}>
            <ul className={styles.diffList}>
              {points.map((point) => (
                <li key={point.id}>
                  <strong>{point.title}</strong>
                  <span>{point.body}</span>
                </li>
              ))}
            </ul>
          </GroupReveal>
        ) : null}
      </div>
    </section>
  );
}
