import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { GARBA_NIGHT_2026 } from "@/content/events/garba-night-2026";
import { trackGarbaBookingClick } from "@/lib/analytics";
import {
  getGarbaBookingAction,
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
  ];

describe("Garba booking analytics (archive mode)", () => {
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

  it("keeps historical helper event name garba_booking_click", () => {
    trackGarbaBookingClick({ cta_location: "homepage-hero" });
    expect(gtagCalls[0]?.[1]).toBe("garba_booking_click");
    const params = gtagCalls[0]?.[2] as Record<string, unknown>;
    expect(params.cta_location).toBe("homepage-hero");
    expect(params).not.toHaveProperty("source");
  });

  it("maps CTA sources to controlled cta_location vocabulary", () => {
    for (const { source, location } of CTA_SURFACES) {
      expect(resolveGarbaCtaLocation(source)).toBe(location);
    }
  });

  it("does not expose live Kaizen booking actions while concluded", () => {
    expect(GARBA_NIGHT_2026.lifecycle).toBe("concluded");
    for (const { source } of CTA_SURFACES) {
      const action = getGarbaBookingAction(source);
      expect(action.href).not.toContain("kaizenevents.live");
      expect(action.analyticsEvent).not.toBe("garba_booking_click");
    }
  });

  it("EventBookingCTA renders nothing for every surface while concluded", () => {
    for (const { source } of CTA_SURFACES) {
      const { container } = render(<EventBookingCTA source={source} />);
      expect(container).toBeEmptyDOMElement();
    }
    expect(screen.queryByRole("link", { name: /book passes/i })).toBeNull();
  });
});
