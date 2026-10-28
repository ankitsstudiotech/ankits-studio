import { describe, expect, it } from "vitest";
import {
  GARBA_KAIZEN_BOOKING_URL,
  GARBA_WHATSAPP_PREFILL,
  HOME_SEASONAL_CAMPAIGN,
  getActiveSeasonalPromos,
  getGarbaNight2026,
  getSeasonalEvents,
} from "@/content";
import {
  getGarbaBookingAction,
  getGarbaBookingUrl,
  getGarbaDirectionsUrl,
  getGarbaWhatsAppSupportAction,
} from "@/lib/events";
import { buildCanonicalUrl } from "@/lib/seo/canonical";
import { buildSitemapEntries } from "@/lib/seo/sitemap";
import { buildGarbaNightEventJsonLd } from "@/lib/seo/structured-data";
import { buildPageMetadata } from "@/lib/seo/metadata";

describe("Garba Night 2026 event archive", () => {
  const event = getGarbaNight2026();
  const activeCopy = JSON.stringify({
    ...event,
    media: undefined,
  });

  it("exposes the canonical event route and verified facts", () => {
    expect(event.path).toBe("/events/garba-night-2026");
    expect(event.dataStatus).toBe("verified");
    expect(event.startDateIso).toBe("2026-10-17T19:00:00+05:30");
    expect(event.endDateIso).toBe("2026-10-18T00:00:00+05:30");
    expect(event.dateLabel).toBe("17 October 2026");
    expect(event.venueName).toMatch(/VIBGYOR/i);
    expect(event.capacityLabel).toMatch(/500/);
    expect(event.refreshmentsNote).toMatch(/not included/i);
  });

  it("is concluded with no live booking destination", () => {
    expect(event.lifecycle).toBe("concluded");
    expect(event.bookingUrl).toBeNull();
    expect(event.bookingProvider).toBeNull();
    expect(HOME_SEASONAL_CAMPAIGN).toBeNull();
    expect(getActiveSeasonalPromos()).toHaveLength(0);
  });

  it("keeps historical Kaizen base URL constant but unused for live booking", () => {
    expect(GARBA_KAIZEN_BOOKING_URL).toContain("kaizenevents.live");
    expect(event.bookingUrl).not.toBe(GARBA_KAIZEN_BOOKING_URL);
  });

  it("retains historical pass prices without Sold Out claims", () => {
    expect(event.memberPriceInr).toBe(600);
    expect(event.guestPriceInr).toBe(700);
    expect(event.kidsPriceInr).toBe(500);
    expect(event.groupMemberPriceInr).toBe(650);
    expect(event.memberPriceLabel).toBe("₹600");
    expect(event.guestPriceLabel).toBe("₹700");
    expect(event.kidsPriceLabel).toBe("₹500");
    expect(event.groupMemberPriceLabel).toBe("₹650");
    expect(event.memberAgeLabel).toBe("Age 11+");
    expect(event.guestAgeLabel).toBe("Age 11+");
    expect(event.kidsAgeLabel).toBe("Age 3–10");
    expect(activeCopy).not.toMatch(/sold out/i);
    expect(activeCopy).not.toMatch(/open to all ages|all ages/i);
  });

  it("booking helper does not return a Kaizen URL while concluded", () => {
    for (const source of [
      "event-hero",
      "event-passes",
      "event-sticky-mobile",
      "event-closing",
      "homepage-hero",
      "campaign-ribbon",
    ] as const) {
      const action = getGarbaBookingAction(source);
      expect(action.href).not.toContain("kaizenevents.live");
      expect(action.label).not.toMatch(/book passes|book now|register now/i);
      expect(action.analyticsEvent).not.toBe("garba_booking_click");
    }
    // URL builder still produces UTM URLs from the constant base, but UI must not use it.
    expect(getGarbaBookingUrl("homepage-hero")).toContain("kaizenevents.live");
  });

  it("keeps WhatsApp support helper available without implying live sales", () => {
    const support = getGarbaWhatsAppSupportAction();
    expect(support.href).toContain("wa.me/919372402074");
    expect(GARBA_WHATSAPP_PREFILL).toMatch(/Member passes:/);
  });

  it("builds Event JSON-LD without active purchase offers", () => {
    const jsonLd = buildGarbaNightEventJsonLd(event);
    expect(jsonLd).toBeTruthy();
    expect(jsonLd?.["@type"]).toBe("Event");
    expect(jsonLd?.eventStatus).toBe("https://schema.org/EventScheduled");
    expect(jsonLd?.eventStatus).not.toMatch(/Cancelled|Postponed/);
    expect(jsonLd?.offers).toBeUndefined();
    expect(jsonLd?.url).toBe(buildCanonicalUrl(event.path));
    expect(jsonLd?.startDate).toBe("2026-10-17T19:00:00+05:30");
    expect(jsonLd?.image?.[0]).toContain("garba-night-2026-hero.webp");
  });

  it("builds a Maps directions URL for VIBGYOR High", () => {
    const url = getGarbaDirectionsUrl();
    expect(url).toContain("google.com/maps/dir");
    expect(url).toMatch(/VIBGYOR|Airoli|400701/);
  });

  it("includes the event archive URL in the sitemap when indexable", () => {
    const urls = buildSitemapEntries().map((entry) => entry.url);
    if (urls.length === 0) {
      expect(urls).toEqual([]);
      return;
    }
    expect(urls).toContain(buildCanonicalUrl("/events/garba-night-2026"));
  });

  it("publishes archive metadata without purchase urgency", () => {
    const meta = buildPageMetadata({
      title: event.seoTitle,
      description: event.seoDescription,
      path: event.path,
      ogImagePath: `${event.path}/opengraph-image`,
    });
    expect(meta.alternates?.canonical).toBe(buildCanonicalUrl(event.path));
    expect(String(meta.description)).not.toMatch(/book passes now|register now/i);
    expect(String(meta.description)).toMatch(/17 October 2026|17 Oct/);
  });

  it("keeps homepage metadata on the studio identity, not the event route", () => {
    const home = buildPageMetadata({
      title: "Coach-led dance & fitness in Navi Mumbai",
      description:
        "Ankit’s Studio offers coach-led functional training, yoga, Zumba and dance across four neighbourhood studios in Airoli, Ghansoli and Thane. Book a free trial on WhatsApp.",
      path: "/",
    });
    expect(home.alternates?.canonical).toBe(buildCanonicalUrl("/"));
  });

  it("restores permanent Home hero by clearing HOME_SEASONAL_CAMPAIGN", () => {
    expect(HOME_SEASONAL_CAMPAIGN).toBeNull();
  });

  it("labels previous-edition media as Garba Night 4.0, not 2026 footage", () => {
    expect(event.media.previousEdition.label).toMatch(/4\.0/);
    expect(event.media.previousEdition.src).toContain("previous-edition");
    expect(event.media.promoTeaser.src).toBe("/events/garba-night-2026/teaser.mp4");
    expect(event.media.poster).toBe("/events/garba-night-2026/poster.webp");
  });

  it("exposes typed current-edition 2026 highlights media", () => {
    const current = event.media.currentEdition;
    expect(current.hero).toBe(
      "/events/garba-night-2026/2026-highlights/garba-night-2026-hero.webp",
    );
    expect(current.highlightsVideo.src).toBe(
      "/events/garba-night-2026/2026-highlights/garba-night-2026-highlights.mp4",
    );
    expect(current.highlightsVideo.poster).toContain("highlights-poster");
    expect(current.gallery).toHaveLength(7);
    expect(current.gallery.map((g) => g.id)).toEqual([
      "crowd-wide",
      "dance-close",
      "group-dance",
      "photo-zone-candid",
      "photo-zone-group",
      "prizes",
      "dance-floor",
    ]);
    expect(current.gallery.every((g) => g.src.includes("2026-highlights"))).toBe(
      true,
    );
    expect(current.gallery.every((g) => !g.src.includes("previous-edition"))).toBe(
      true,
    );
  });

  it("does not leave coming-soon copy or fabricated winner claims", () => {
    expect(JSON.stringify(event)).not.toMatch(/coming soon/i);
    expect(activeCopy).not.toMatch(/sold out|attendance of|winner was/i);
  });

  it("rejects fabricated Stitch event claims in truth content", () => {
    expect(activeCopy).not.toMatch(/400\+/i);
    expect(activeCopy).not.toMatch(/RFID|UPI|Aarti|Sanedo|Dandiya Raas/i);
    expect(activeCopy).not.toMatch(/Ground Arena|Ankit Gupta|sold out/i);
  });

  it("lists the seasonal event for promotion accessors", () => {
    expect(getSeasonalEvents().map((e) => e.slug)).toContain("garba-night-2026");
  });

  it("FAQ matches historical pricing and closed registration", () => {
    const prices = event.faqs.find((f) => f.id === "prices");
    const who = event.faqs.find((f) => f.id === "who");
    const reserve = event.faqs.find((f) => f.id === "reserve");
    expect(prices?.answer).toMatch(/₹600/);
    expect(prices?.answer).toMatch(/₹700/);
    expect(prices?.answer).toMatch(/₹500/);
    expect(prices?.answer).toMatch(/₹650/);
    expect(who?.answer).toMatch(/3–10|3-10/);
    expect(who?.answer).toMatch(/11\+/);
    expect(reserve?.answer).toMatch(/concluded|closed/i);
    expect(reserve?.answer).not.toMatch(/Kaizen|Book Passes/i);
  });
});
