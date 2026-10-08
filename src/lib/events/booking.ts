/**
 * Event booking abstraction — WhatsApp / external hosted registration / future
 * in-app payment without redesigning event page sections (ADR-025 / ADR-026).
 */

import {
  GARBA_NIGHT_2026,
  GARBA_WHATSAPP_PREFILL,
  type EventBookingMode,
  type GarbaNight2026,
} from "@/content/events/garba-night-2026";

export type EventBookingSource =
  | "hero"
  | "pricing"
  | "sticky-mobile"
  | "closing-cta"
  | "home-promo"
  | "homepage-billboard"
  | "homepage-hero"
  | "campaign-ribbon"
  | "internal-promo";

export type EventBookingAnalyticsEvent =
  | "garba_booking_click"
  | "garba_whatsapp_reserve_click"
  | "garba_checkout_started";

export type EventBookingAction = {
  mode: EventBookingMode;
  href: string;
  label: string;
  external: boolean;
  /** Analytics event name for the primary conversion click. */
  analyticsEvent: EventBookingAnalyticsEvent;
  source: EventBookingSource;
  /** Provider slug for analytics (e.g. kaizen). */
  destination: string | null;
};

function buildWhatsAppUrl(digits: string, prefill: string): string {
  return `https://wa.me/${digits}?text=${encodeURIComponent(prefill)}`;
}

/**
 * Resolve the primary booking CTA for Garba Night 2026.
 * External (Kaizen) is the live conversion path; WhatsApp remains support-only.
 */
export function getGarbaBookingAction(
  source: EventBookingSource,
  event: GarbaNight2026 = GARBA_NIGHT_2026,
): EventBookingAction {
  if (event.lifecycle === "concluded") {
    return {
      mode: event.bookingMode,
      href: "/contact",
      label: "Contact for future events",
      external: false,
      analyticsEvent: "garba_booking_click",
      source,
      destination: null,
    };
  }

  if (event.bookingMode === "external" && event.bookingUrl) {
    return {
      mode: "external",
      href: event.bookingUrl,
      label: "Book Passes",
      external: true,
      analyticsEvent: "garba_booking_click",
      source,
      destination: event.bookingProvider ?? "external",
    };
  }

  if (event.bookingMode === "payment" && event.paymentCheckoutUrl) {
    return {
      mode: "payment",
      href: event.paymentCheckoutUrl,
      label: "Book Passes",
      external: true,
      analyticsEvent: "garba_checkout_started",
      source,
      destination: "payment",
    };
  }

  return {
    mode: "whatsapp",
    href: buildWhatsAppUrl(event.whatsappDigits, GARBA_WHATSAPP_PREFILL),
    label: "Reserve on WhatsApp",
    external: true,
    analyticsEvent: "garba_whatsapp_reserve_click",
    source,
    destination: "whatsapp",
  };
}

/** Support-only WhatsApp contact for Garba questions (not ticket conversion). */
export function getGarbaWhatsAppSupportAction(
  event: GarbaNight2026 = GARBA_NIGHT_2026,
): { href: string; label: string } {
  return {
    href: buildWhatsAppUrl(
      event.whatsappDigits,
      `Hi Ankit's Studio — I have a question about Garba Night — 5th Edition.`,
    ),
    label: "Questions? WhatsApp us",
  };
}

export function getGarbaDirectionsUrl(
  event: GarbaNight2026 = GARBA_NIGHT_2026,
): string {
  return event.mapsDirectionsUrl;
}
