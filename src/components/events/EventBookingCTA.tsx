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
 * Shared primary booking CTA. Resolves from event booking config
 * (external Kaizen today; WhatsApp / in-app payment seams retained).
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
      {...(action.external && action.mode === "whatsapp"
        ? { target: "_blank", rel: "noopener noreferrer" }
        : action.external
          ? { rel: "noopener noreferrer" }
          : {})}
      onClick={() => {
        if (action.analyticsEvent === "garba_booking_click") {
          trackEvent("garba_booking_click", {
            source: action.source,
            destination: action.destination ?? "external",
            booking_mode: action.mode,
          });
          return;
        }
        trackEvent(action.analyticsEvent, { source: action.source });
      }}
    >
      {action.label}
    </a>
  );
}
