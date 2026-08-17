import Link from "next/link";
import { ClosingBand } from "@/components/conversion/ClosingBand";
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
  return (
    <ClosingBand
      id="trial"
      titleId="home-trial-title"
      title={title}
      body={body}
      note="Free trial class. One-time registration fee is ₹300 after you join."
      variant={variant === "accent" ? "accent" : "field"}
      secondary={
        secondaryHref && secondaryLabel ? (
          <Link href={secondaryHref} className={styles.ctaGhost}>
            {secondaryLabel}
          </Link>
        ) : null
      }
    >
      <PulseCta href={href}>{label}</PulseCta>
    </ClosingBand>
  );
}
