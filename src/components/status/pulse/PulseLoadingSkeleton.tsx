import styles from "./status.module.css";

/** Minimal Pulse dark loading skeleton — no spinner. */
export function PulseLoadingSkeleton() {
  return (
    <div
      className={`${styles.page} ${styles.skeleton}`}
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className={`${styles.skelBar} ${styles.skelBarWide}`} />
      <div className={`${styles.skelBar} ${styles.skelBarMid}`} />
      <div className={`${styles.skelBar} ${styles.skelBarShort}`} />
      <div className={styles.skelBar} />
    </div>
  );
}
