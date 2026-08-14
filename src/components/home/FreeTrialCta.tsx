import Link from "next/link";
import { PulseCta } from "./pulse/PulseMotion";
import styles from "./pulse/pulse-home.module.css";

export type FreeTrialCtaProps = {
  title?: string;
  body?: string;
  href: string;
  label: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  variant?: "field" | "accent";
};

export function FreeTrialCta({
  title = "Book a free trial",
  body = "Message Ankit’s Studio on WhatsApp to book a free trial.",
  href,
  label,
  secondaryHref,
  secondaryLabel,
  variant = "accent",
}: FreeTrialCtaProps) {
  const bandClass =
    variant === "accent" ? `${styles.ctaBand} ${styles.ctaBandAccent}` : styles.ctaBand;

  return (
    <section id="trial" className={bandClass} aria-labelledby="home-trial-title">
      <div className={styles.ctaBandInner}>
        <div className={styles.ctaCopy}>
          <h2 id="home-trial-title">{title}</h2>
          <p>{body}</p>
        </div>
        <div className={styles.ctaActions}>
          <PulseCta href={href}>{label}</PulseCta>
          <p className={styles.ctaNote}>
            Free trial class. One-time registration fee is ₹300 after you join.
          </p>
          {secondaryHref && secondaryLabel ? (
            <div className={styles.ctaSecondaryRow}>
              <Link href={secondaryHref} className={styles.ctaGhost}>
                {secondaryLabel}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
