/**
 * Event booking abstraction — WhatsApp / external hosted registration / future
 * in-app payment without redesigning event page sections (ADR-025 / ADR-026).
 *
 * Analytics: CTA placement uses `cta_location` only — never GA reserved
 * `source` / `medium` / `campaign` params (ADR-028 analytics hotfix).
 */

import {
  GARBA_KAIZEN_BOOKING_URL,
  GARBA_NIGHT_2026,
  GARBA_WHATSAPP_PREFILL,
  type EventBookingMode,
  type GarbaNight2026,
} from "@/content/events/garba-night-2026";

/** Controlled vocabulary for Garba booking CTA surfaces that exist in UI. */
export type GarbaCtaLocation =
  | "homepage-hero"
  | "campaign-ribbon"
  | "event-hero"
  | "event-passes"
  | "event-sticky-mobile"
  | "event-closing";

/**
 * Accepted call-site identifiers (includes legacy aliases mapped to
 * GarbaCtaLocation for analytics).
 */
export type EventBookingSource =
  | GarbaCtaLocation
  | "hero"
  | "pricing"
  | "sticky-mobile"
  | "closing-cta"
  | "home-promo"
  | "homepage-billboard"
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
  analyticsEvent: EventBookingAnalyticsEvent;
  /** Canonical CTA surface for analytics (never sent as GA `source`). */
  ctaLocation: GarbaCtaLocation;
  bookingProvider: string | null;
};

export function resolveGarbaCtaLocation(
  source: EventBookingSource,
): GarbaCtaLocation {
  switch (source) {
    case "homepage-hero":
    case "homepage-billboard":
    case "home-promo":
      return "homepage-hero";
    case "campaign-ribbon":
    case "internal-promo":
      return "campaign-ribbon";
    case "event-hero":
    case "hero":
      return "event-hero";
    case "event-passes":
    case "pricing":
      return "event-passes";
    case "event-sticky-mobile":
    case "sticky-mobile":
      return "event-sticky-mobile";
    case "event-closing":
    case "closing-cta":
      return "event-closing";
    default: {
      const _exhaustive: never = source;
      return _exhaustive;
    }
  }
}

/**
 * External Kaizen booking URL with fixed website UTMs.
 * Schema / content `bookingUrl` stays the clean canonical base.
 */
export function getGarbaBookingUrl(
  ctaLocation: GarbaCtaLocation,
  event: GarbaNight2026 = GARBA_NIGHT_2026,
): string {
  const base =
    event.bookingMode === "external" && event.bookingUrl
      ? event.bookingUrl
      : GARBA_KAIZEN_BOOKING_URL;

  const url = new URL(base);
  url.searchParams.set("utm_source", "ankitsstudio.com");
  url.searchParams.set("utm_medium", "website");
  url.searchParams.set("utm_campaign", "garba_night_2026");
  url.searchParams.set("utm_content", ctaLocation);
  return url.toString();
}

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
  const ctaLocation = resolveGarbaCtaLocation(source);

  // Concluded: no sales CTA. Callers must not render EventBookingCTA.
  // Keep a non-booking contact fallback for defensive use only — never Kaizen.
  if (event.lifecycle === "concluded") {
    return {
      mode: event.bookingMode,
      href: "/contact",
      label: "Contact Ankit's Studio",
      external: false,
      analyticsEvent: "garba_whatsapp_reserve_click",
      ctaLocation,
      bookingProvider: null,
    };
  }

  if (event.bookingMode === "external" && event.bookingUrl) {
    return {
      mode: "external",
      href: getGarbaBookingUrl(ctaLocation, event),
      label: "Book Passes",
      external: true,
      analyticsEvent: "garba_booking_click",
      ctaLocation,
      bookingProvider: event.bookingProvider ?? "kaizen",
    };
  }

  if (event.bookingMode === "payment" && event.paymentCheckoutUrl) {
    return {
      mode: "payment",
      href: event.paymentCheckoutUrl,
      label: "Book Passes",
      external: true,
      analyticsEvent: "garba_checkout_started",
      ctaLocation,
      bookingProvider: "payment",
    };
  }

  return {
    mode: "whatsapp",
    href: buildWhatsAppUrl(event.whatsappDigits, GARBA_WHATSAPP_PREFILL),
    label: "Reserve on WhatsApp",
    external: true,
    analyticsEvent: "garba_whatsapp_reserve_click",
    ctaLocation,
    bookingProvider: "whatsapp",
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
