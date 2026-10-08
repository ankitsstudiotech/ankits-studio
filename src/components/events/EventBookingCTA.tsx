"use client";

import { trackEvent } from "@/lib/analytics";
import {
  getGarbaBookingAction,
  type EventBookingSource,
} from "@/lib/events";

export type EventBookingCTAProps = {
  source: EventBookingSource;
  className?: string;
  /** Optional visual variant for sticky / secondary surfaces. */
  variant?: "primary" | "sticky";
};

/**
 * Shared primary booking CTA. Today resolves to WhatsApp reservation;
 * when bookingMode flips to payment, label/href update from one config.
 */
export function EventBookingCTA({
  source,
  className,
  variant = "primary",
}: EventBookingCTAProps) {
  const action = getGarbaBookingAction(source);

  return (
    <a
      href={action.href}
      className={className}
      data-booking-mode={action.mode}
      data-booking-source={source}
      data-cta-variant={variant}
      {...(action.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      onClick={() => {
        trackEvent(action.analyticsEvent, { source });
      }}
    >
      {action.label}
    </a>
  );
}
