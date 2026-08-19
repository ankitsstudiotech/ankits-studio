"use client";

import { PulseMedia } from "@/components/media";
import { GroupReveal, SectionReveal } from "@/components/motion";
import { resolveSlotMedia } from "@/content/media";
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

/**
 * Machine-free / coach-led — Pattern B paired reveal + principle group.
 * Optional `home.community` strengthens the existing narrative (no new section).
 */
export function WhyStudio({ title, body, points = [] }: WhyStudioProps) {
  const communityMedia = resolveSlotMedia("home.community");

  return (
    <section
      id="studio"
      className={`${styles.field} ${styles.band} ${styles.diffBand}`}
      aria-labelledby="home-diff-title"
    >
      <div
        className={[
          styles.diffGrid,
          communityMedia ? styles.diffGridWithMedia : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <SectionReveal pattern="B" side="left" className={styles.diffCopy}>
          <span className="motion-accent-line" aria-hidden data-drawn="true" />
          <h2 id="home-diff-title">{title}</h2>
          <p>{body}</p>
        </SectionReveal>
        {communityMedia ? (
          <div className={styles.diffMedia}>
            <PulseMedia
              item={communityMedia}
              sizes="(max-width: 767px) 100vw, 42vw"
            />
          </div>
        ) : null}
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
