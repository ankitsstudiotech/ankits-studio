import type { ReactNode } from "react";
import { SectionReveal } from "@/components/motion";
import styles from "./closing-band.module.css";

export type ClosingBandVariant = "accent" | "field";

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
  return (
    <section
      id={id}
      className={`${styles.root} ${variant === "accent" ? styles.accent : styles.field}`}
      aria-labelledby={titleId}
      data-compose="closing-band"
      data-cta-variant={variant}
    >
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
    </section>
  );
}
