import Link from "next/link";
import { ClosingBand } from "@/components/conversion/ClosingBand";
import { FREE_TRIAL_REGISTRATION_NOTE } from "@/lib/conversion";
import { PulseCta } from "./pulse/PulseMotion";
import styles from "./pulse/pulse-home.module.css";

export type FreeTrialCtaProps = {
  id?: string;
  titleId?: string;
  title?: string;
  body?: string;
  note?: string;
  href: string;
  label: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  variant?: "field" | "accent";
};

export function FreeTrialCta({
  id = "trial",
  titleId = "home-trial-title",
  title = "Book a free trial",
  body = "Message Ankit’s Studio on WhatsApp to book a free trial.",
  note = FREE_TRIAL_REGISTRATION_NOTE,
  href,
  label,
  secondaryHref,
  secondaryLabel,
  variant = "accent",
}: FreeTrialCtaProps) {
  return (
    <ClosingBand
      id={id}
      titleId={titleId}
      title={title}
      body={body}
      note={note || undefined}
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
