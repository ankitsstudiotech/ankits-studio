import { PulseCta } from "./pulse/PulseMotion";
import styles from "./pulse/pulse-home.module.css";

export type FreeTrialCtaProps = {
  title?: string;
  href?: string;
  label?: string;
};

export function FreeTrialCta({
  title = "BOOK THE TRIAL. KEEP THE PULSE.",
  href = "/trial",
  label = "Book free trial",
}: FreeTrialCtaProps) {
  return (
    <section id="trial" className={styles.ctaBand} aria-labelledby="home-trial-title">
      <h2 id="home-trial-title">{title}</h2>
      <PulseCta href={href}>{label}</PulseCta>
    </section>
  );
}
