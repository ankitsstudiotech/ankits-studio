"use client";

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
 * Shared primary booking CTA. Resolves from event booking config
 * (external Kaizen today; WhatsApp / in-app payment seams retained).
 *
 * Emits exactly one custom analytics event per click via the shared helper.
 * Automatic GA4 enhanced-measurement outbound `click` may also fire — keep it.
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
