/**
 * Event booking abstraction — switch WhatsApp ↔ payment without redesigning
 * event page sections. Payment mode is wired but inactive until the owner
 * confirms a gateway (do not invent checkout).
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
  | "campaign-ribbon"
  | "internal-promo";

export type EventBookingAction = {
  mode: EventBookingMode;
  href: string;
  label: string;
  external: boolean;
  /** Analytics event name for the primary conversion click. */
  analyticsEvent: "garba_whatsapp_reserve_click" | "garba_checkout_started";
  source: EventBookingSource;
};

function buildWhatsAppUrl(digits: string, prefill: string): string {
  return `https://wa.me/${digits}?text=${encodeURIComponent(prefill)}`;
}

/**
 * Resolve the primary booking CTA for Garba Night 2026.
 * When `bookingMode` flips to `"payment"` and `paymentCheckoutUrl` is set,
 * sections using EventBookingCTA pick up the new label/href automatically.
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
      analyticsEvent: "garba_whatsapp_reserve_click",
      source,
    };
  }

  if (event.bookingMode === "payment" && event.paymentCheckoutUrl) {
    return {
      mode: "payment",
      href: event.paymentCheckoutUrl,
      label: "Book Passes",
      external: true,
      // Documented for future gateway work — not fired while mode is whatsapp.
      analyticsEvent: "garba_checkout_started",
      source,
    };
  }

  return {
    mode: "whatsapp",
    href: buildWhatsAppUrl(event.whatsappDigits, GARBA_WHATSAPP_PREFILL),
    label: "Reserve on WhatsApp",
    external: true,
    analyticsEvent: "garba_whatsapp_reserve_click",
    source,
  };
}

export function getGarbaDirectionsUrl(
  event: GarbaNight2026 = GARBA_NIGHT_2026,
): string {
  return event.mapsDirectionsUrl;
}
