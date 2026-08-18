import type { ReactNode } from "react";
import { SectionReveal } from "@/components/motion";
import styles from "./closing-band.module.css";

export type ClosingBandVariant = "accent" | "field" | "compact";

export type ClosingBandProps = {
  id?: string;
  titleId: string;
  title: string;
  body: string;
  note?: string;
  variant?: ClosingBandVariant;
  children: ReactNode;
  secondary?: ReactNode;
};

/**
 * Shared editorial close: copy mass left, action mass right.
 * Accent = Home purple trial band. Field = quieter programme/branch/readiness close.
 */
export function ClosingBand({
  id,
  titleId,
  title,
  body,
  note,
  variant = "field",
  children,
  secondary,
}: ClosingBandProps) {
  const isAccentFreeTrial = variant === "accent" && id === "trial";
  const rootTone =
    variant === "accent" ? styles.accent : variant === "compact" ? styles.compact : styles.field;

  const splitFreeTrialTitle =
    isAccentFreeTrial && title.trim().toLowerCase() === "book a free trial";

  const renderedTitle = splitFreeTrialTitle ? (
    <>
      <span className={styles.freeTrialTitleLine}>Book a</span>
      <span className={styles.freeTrialTitleLine}>Free trial</span>
    </>
  ) : (
    title
  );

  return (
    <section
      id={id}
      className={`${styles.root} ${rootTone}`}
      aria-labelledby={titleId}
      data-compose="closing-band"
      data-cta-variant={variant}
    >
      {isAccentFreeTrial ? (
        <div className={styles.freeTrialInner}>
          <div className={styles.freeTrialProposition}>
            <SectionReveal>
              <h2 id={titleId} className={styles.freeTrialTitle}>
                {renderedTitle}
              </h2>
            </SectionReveal>
          </div>

          <div className={styles.freeTrialProcess}>
            <p className={styles.body}>{body}</p>
          </div>

          <div className={styles.freeTrialTrialFact}>
            {note ? <p className={styles.note}>{note}</p> : null}
          </div>

          <div className={styles.freeTrialAction}>
            <div className={styles.actionPrimary}>{children}</div>
            {secondary ? <div className={styles.actionSecondary}>{secondary}</div> : null}
          </div>
        </div>
      ) : variant === "compact" ? (
        <div className={`${styles.inner} ${styles.compactInner}`}>
          <div className={styles.compactProposition}>
            <SectionReveal>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            </SectionReveal>
          </div>
          <div className={styles.compactContext}>
            <p className={styles.body}>{body}</p>
            {note ? <p className={styles.note}>{note}</p> : null}
            <div className={styles.action}>
              <div className={styles.actionPrimary}>{children}</div>
              {secondary ? <div className={styles.actionSecondary}>{secondary}</div> : null}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.inner}>
          <div className={styles.copy}>
            <SectionReveal>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            </SectionReveal>
            <p className={styles.body}>{body}</p>
            {note ? <p className={styles.note}>{note}</p> : null}
          </div>
          <div className={styles.action}>
            <div className={styles.actionPrimary}>{children}</div>
            {secondary ? <div className={styles.actionSecondary}>{secondary}</div> : null}
          </div>
        </div>
      )}
    </section>
  );
}
