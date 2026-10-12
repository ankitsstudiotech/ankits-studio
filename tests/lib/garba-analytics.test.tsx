import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { GARBA_KAIZEN_BOOKING_URL } from "@/content";
import { trackGarbaBookingClick } from "@/lib/analytics";
import {
  getGarbaBookingAction,
  getGarbaBookingUrl,
  resolveGarbaCtaLocation,
  type GarbaCtaLocation,
  type EventBookingSource,
} from "@/lib/events";
import { EventBookingCTA } from "@/components/events/EventBookingCTA";

const CTA_SURFACES: { source: EventBookingSource; location: GarbaCtaLocation }[] =
  [
    { source: "homepage-hero", location: "homepage-hero" },
    { source: "campaign-ribbon", location: "campaign-ribbon" },
    { source: "event-hero", location: "event-hero" },
    { source: "event-passes", location: "event-passes" },
    { source: "event-sticky-mobile", location: "event-sticky-mobile" },
    { source: "event-closing", location: "event-closing" },
    { source: "hero", location: "event-hero" },
    { source: "pricing", location: "event-passes" },
    { source: "sticky-mobile", location: "event-sticky-mobile" },
    { source: "closing-cta", location: "event-closing" },
  ];

describe("Garba booking analytics hotfix", () => {
  let gtagCalls: unknown[][];

  beforeEach(() => {
    gtagCalls = [];
    vi.stubGlobal("gtag", (...args: unknown[]) => {
      gtagCalls.push(args);
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps event name garba_booking_click", () => {
    trackGarbaBookingClick({ cta_location: "homepage-hero" });
    expect(gtagCalls[0]?.[0]).toBe("event");
    expect(gtagCalls[0]?.[1]).toBe("garba_booking_click");
  });

  it("emits cta_location and never source/medium/campaign CTA pollution", () => {
    trackGarbaBookingClick({ cta_location: "homepage-hero" });
    const params = gtagCalls[0]?.[2] as Record<string, unknown>;
    expect(params.cta_location).toBe("homepage-hero");
    expect(params.booking_provider).toBe("kaizen");
    expect(params.destination_host).toBe("kaizenevents.live");
    expect(params.destination_type).toBe("external-booking");
    expect(params.campaign_id).toBe("garba-night-2026");
    expect(params).not.toHaveProperty("source");
    expect(params).not.toHaveProperty("medium");
    expect(params).not.toHaveProperty("campaign");
    expect(params).not.toHaveProperty("destination");
    expect(params).not.toHaveProperty("booking_mode");
  });

  it("maps CTA sources to controlled cta_location vocabulary", () => {
    for (const { source, location } of CTA_SURFACES) {
      expect(resolveGarbaCtaLocation(source)).toBe(location);
      expect(getGarbaBookingAction(source).ctaLocation).toBe(location);
    }
  });

  it("builds Kaizen URLs with approved UTMs and no internal-site UTM pattern", () => {
    for (const location of [
      "homepage-hero",
      "event-passes",
      "event-hero",
      "campaign-ribbon",
      "event-sticky-mobile",
      "event-closing",
    ] as const) {
      const href = getGarbaBookingUrl(location);
      const url = new URL(href);
      expect(url.origin + url.pathname).toBe(
        new URL(GARBA_KAIZEN_BOOKING_URL).origin +
          new URL(GARBA_KAIZEN_BOOKING_URL).pathname,
      );
      expect(url.searchParams.get("utm_source")).toBe("ankitsstudio.com");
      expect(url.searchParams.get("utm_medium")).toBe("website");
      expect(url.searchParams.get("utm_campaign")).toBe("garba_night_2026");
      expect(url.searchParams.get("utm_content")).toBe(location);
    }
  });

  it("booking actions use UTM href while schema base URL stays clean", () => {
    const action = getGarbaBookingAction("homepage-hero");
    expect(action.href).toContain("utm_content=homepage-hero");
    expect(action.href).toContain("kaizenevents.live");
    expect(action.analyticsEvent).toBe("garba_booking_click");
    expect(action.bookingProvider).toBe("kaizen");
    expect(GARBA_KAIZEN_BOOKING_URL).not.toContain("utm_");
  });

  it.each([
    ["homepage-hero", "homepage-hero"],
    ["event-hero", "event-hero"],
    ["event-passes", "event-passes"],
    ["event-closing", "event-closing"],
    ["campaign-ribbon", "campaign-ribbon"],
    ["event-sticky-mobile", "event-sticky-mobile"],
  ] as const)(
    "EventBookingCTA %s emits exactly one garba_booking_click with cta_location=%s",
    (source, location) => {
      const { getByRole } = render(<EventBookingCTA source={source} />);
      const link = getByRole("link", { name: /book passes/i });
      // Prevent jsdom from attempting real navigation on external href.
      link.addEventListener("click", (e) => e.preventDefault());
      fireEvent.click(link);

      const bookingEvents = gtagCalls.filter(
        (c) => c[0] === "event" && c[1] === "garba_booking_click",
      );
      expect(bookingEvents).toHaveLength(1);
      const params = bookingEvents[0]?.[2] as Record<string, unknown>;
      expect(params.cta_location).toBe(location);
      expect(params.booking_provider).toBe("kaizen");
      expect(params.destination_host).toBe("kaizenevents.live");
      expect(params.campaign_id).toBe("garba-night-2026");
      expect(params).not.toHaveProperty("source");
      expect(params).not.toHaveProperty("medium");
      expect(params).not.toHaveProperty("campaign");
      expect(link.getAttribute("href")).toContain(`utm_content=${location}`);
      expect(link.getAttribute("href")).not.toMatch(/ankitsstudio\.com\?utm_/);
    },
  );
});
