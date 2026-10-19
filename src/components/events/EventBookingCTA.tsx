"use client";

import { GARBA_NIGHT_2026 } from "@/content/events/garba-night-2026";
import { trackEvent, trackGarbaBookingClick } from "@/lib/analytics";
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
 * Shared primary booking CTA for live ticket sales.
 * Returns null when Garba Night is concluded (ADR-029) so no Kaizen /
 * BOOK PASSES surface remains in the DOM.
 */
export function EventBookingCTA({
  source,
  className,
  variant = "primary",
}: EventBookingCTAProps) {
  if (GARBA_NIGHT_2026.lifecycle === "concluded") {
    return null;
  }

  const action = getGarbaBookingAction(source);

  return (
    <a
      href={action.href}
      className={className}
      data-booking-mode={action.mode}
      data-cta-location={action.ctaLocation}
      data-cta-variant={variant}
      {...(action.external && action.mode === "whatsapp"
        ? { target: "_blank", rel: "noopener noreferrer" }
        : action.external
          ? { rel: "noopener noreferrer" }
          : {})}
      onClick={() => {
        if (action.analyticsEvent === "garba_booking_click") {
          trackGarbaBookingClick({
            cta_location: action.ctaLocation,
            booking_provider: action.bookingProvider ?? "kaizen",
          });
          return;
        }
        trackEvent(action.analyticsEvent, {
          cta_location: action.ctaLocation,
        });
      }}
    >
      {action.label}
    </a>
  );
}
