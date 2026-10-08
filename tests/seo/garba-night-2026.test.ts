import { describe, expect, it } from "vitest";
import {
  GARBA_KAIZEN_BOOKING_URL,
  GARBA_WHATSAPP_PREFILL,
  HOME_SEASONAL_CAMPAIGN,
  getGarbaNight2026,
  getSeasonalEvents,
} from "@/content";
import {
  getGarbaBookingAction,
  getGarbaDirectionsUrl,
  getGarbaWhatsAppSupportAction,
} from "@/lib/events";
import { buildCanonicalUrl } from "@/lib/seo/canonical";
import { buildSitemapEntries } from "@/lib/seo/sitemap";
import { buildGarbaNightEventJsonLd } from "@/lib/seo/structured-data";
import { buildPageMetadata } from "@/lib/seo/metadata";

describe("Garba Night 2026 event", () => {
  const event = getGarbaNight2026();
  const kaizen = GARBA_KAIZEN_BOOKING_URL;
  const activeCopy = JSON.stringify({
    ...event,
    // Exclude binary/media paths from pricing string assertions.
    media: undefined,
  });

  it("exposes the canonical event route and verified facts", () => {
    expect(event.path).toBe("/events/garba-night-2026");
    expect(event.dataStatus).toBe("verified");
    expect(event.startDateIso).toBe("2026-10-17T19:00:00+05:30");
    expect(event.endDateIso).toBe("2026-10-18T00:00:00+05:30");
    expect(event.venueName).toMatch(/VIBGYOR/i);
    expect(event.capacityLabel).toMatch(/500/);
    expect(event.refreshmentsNote).toMatch(/not included/i);
  });

  it("uses Kaizen final pass prices and age bands", () => {
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
    expect(event.passProducts.map((p) => p.id)).toEqual([
      "members",
      "guests",
      "kids",
      "group-of-10",
    ]);
    expect(activeCopy).not.toMatch(/₹599|₹699|\b599\b|\b699\b/);
    expect(activeCopy).not.toMatch(/open to all ages|all ages/i);
  });

  it("uses external Kaizen booking as the single primary destination", () => {
    expect(event.bookingMode).toBe("external");
    expect(event.bookingProvider).toBe("kaizen");
    expect(event.bookingUrl).toBe(kaizen);

    for (const source of [
      "hero",
      "pricing",
      "sticky-mobile",
      "closing-cta",
      "homepage-hero",
      "campaign-ribbon",
    ] as const) {
      const action = getGarbaBookingAction(source);
      expect(action.mode).toBe("external");
      expect(action.label).toBe("Book Passes");
      expect(action.href).toBe(kaizen);
      expect(action.analyticsEvent).toBe("garba_booking_click");
      expect(action.destination).toBe("kaizen");
    }
  });

  it("keeps WhatsApp as support-only, not primary booking", () => {
    const support = getGarbaWhatsAppSupportAction();
    expect(support.label).toMatch(/Questions\? WhatsApp/i);
    expect(support.href).toContain("wa.me/919372402074");
    expect(GARBA_WHATSAPP_PREFILL).toMatch(/Member passes:/);
  });

  it("builds Event JSON-LD with Member/Guest/Kids offers and omits group schema", () => {
    const jsonLd = buildGarbaNightEventJsonLd(event);
    expect(jsonLd).toBeTruthy();
    expect(jsonLd?.["@type"]).toBe("Event");
    expect(jsonLd?.offers).toHaveLength(3);
    expect(jsonLd?.offers.map((o) => o.price).sort()).toEqual(["500", "600", "700"]);
    expect(jsonLd?.offers.every((o) => o.url === kaizen)).toBe(true);
    expect(jsonLd?.offers.some((o) => o.price === "650")).toBe(false);
    expect(jsonLd?.offers.some((o) => o.price === "599" || o.price === "699")).toBe(
      false,
    );
    expect(jsonLd?.url).toBe(buildCanonicalUrl(event.path));
  });

  it("builds a Maps directions URL for VIBGYOR High", () => {
    const url = getGarbaDirectionsUrl();
    expect(url).toContain("google.com/maps/dir");
    expect(url).toMatch(/VIBGYOR|Airoli|400701/);
  });

  it("includes the event in the sitemap when indexable", () => {
    const urls = buildSitemapEntries().map((entry) => entry.url);
    if (urls.length === 0) {
      expect(urls).toEqual([]);
      return;
    }
    expect(urls).toContain(buildCanonicalUrl("/events/garba-night-2026"));
  });

  it("publishes unique metadata without legacy 599/699 pricing", () => {
    const meta = buildPageMetadata({
      title: event.seoTitle,
      description: event.seoDescription,
      path: event.path,
      ogImagePath: `${event.path}/opengraph-image`,
    });
    expect(meta.alternates?.canonical).toBe(buildCanonicalUrl(event.path));
    expect(String(meta.description)).toMatch(/₹500/);
    expect(String(meta.description)).not.toMatch(/₹599|₹699/);
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

  it("enables temporary Home Garba hero via HOME_SEASONAL_CAMPAIGN", () => {
    expect(HOME_SEASONAL_CAMPAIGN).toBe("garba-night-2026");
  });

  it("labels previous-edition media as Garba Night 4.0, not 2026 footage", () => {
    expect(event.media.previousEdition.label).toMatch(/4\.0/);
    expect(event.media.promoTeaser.src).toBe("/events/garba-night-2026/teaser.mp4");
    expect(event.media.poster).toBe("/events/garba-night-2026/poster.webp");
  });

  it("rejects fabricated Stitch event claims in truth content", () => {
    expect(activeCopy).not.toMatch(/400\+/i);
    expect(activeCopy).not.toMatch(/RFID|UPI|Aarti|Sanedo|Dandiya Raas/i);
    expect(activeCopy).not.toMatch(/Ground Arena|Ankit Gupta|sold out/i);
  });

  it("lists the seasonal event for promotion accessors", () => {
    expect(getSeasonalEvents().map((e) => e.slug)).toContain("garba-night-2026");
  });

  it("FAQ matches Kaizen pricing and child age bands", () => {
    const prices = event.faqs.find((f) => f.id === "prices");
    const who = event.faqs.find((f) => f.id === "who");
    expect(prices?.answer).toMatch(/₹600/);
    expect(prices?.answer).toMatch(/₹700/);
    expect(prices?.answer).toMatch(/₹500/);
    expect(prices?.answer).toMatch(/₹650/);
    expect(who?.question).toMatch(/children/i);
    expect(who?.answer).toMatch(/3–10|3-10/);
    expect(who?.answer).toMatch(/11\+/);
    expect(who?.answer).not.toMatch(/all ages/i);
  });
});
