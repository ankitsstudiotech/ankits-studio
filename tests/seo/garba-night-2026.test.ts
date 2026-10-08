import { describe, expect, it } from "vitest";
import {
  GARBA_WHATSAPP_PREFILL,
  getGarbaNight2026,
  getSeasonalEvents,
} from "@/content";
import { getGarbaBookingAction, getGarbaDirectionsUrl } from "@/lib/events";
import { buildCanonicalUrl } from "@/lib/seo/canonical";
import { buildSitemapEntries } from "@/lib/seo/sitemap";
import { buildGarbaNightEventJsonLd } from "@/lib/seo/structured-data";
import { buildPageMetadata } from "@/lib/seo/metadata";

describe("Garba Night 2026 event", () => {
  const event = getGarbaNight2026();

  it("exposes the canonical event route and verified facts", () => {
    expect(event.path).toBe("/events/garba-night-2026");
    expect(event.dataStatus).toBe("verified");
    expect(event.startDateIso).toBe("2026-10-17T19:00:00+05:30");
    expect(event.endDateIso).toBe("2026-10-18T00:00:00+05:30");
    expect(event.memberPriceInr).toBe(599);
    expect(event.guestPriceInr).toBe(699);
    expect(event.venueName).toMatch(/VIBGYOR/i);
    expect(event.capacityLabel).toMatch(/500/);
    expect(event.refreshmentsNote).toMatch(/not included/i);
  });

  it("builds Event JSON-LD with dates, venue, and both offers", () => {
    const jsonLd = buildGarbaNightEventJsonLd(event);
    expect(jsonLd).toBeTruthy();
    expect(jsonLd?.["@type"]).toBe("Event");
    expect(jsonLd?.startDate).toBe("2026-10-17T19:00:00+05:30");
    expect(jsonLd?.endDate).toBe("2026-10-18T00:00:00+05:30");
    expect(jsonLd?.location.name).toMatch(/VIBGYOR/i);
    expect(jsonLd?.location.address.postalCode).toBe("400701");
    expect(jsonLd?.offers).toHaveLength(2);
    expect(jsonLd?.offers.map((o) => o.price).sort()).toEqual(["599", "699"]);
    expect(jsonLd?.offers.every((o) => o.url === buildCanonicalUrl(event.path))).toBe(true);
    expect(jsonLd?.url).toBe(buildCanonicalUrl(event.path));
  });

  it("resolves WhatsApp booking CTA without payment language", () => {
    const action = getGarbaBookingAction("hero");
    expect(action.mode).toBe("whatsapp");
    expect(action.label).toMatch(/Reserve on WhatsApp/i);
    expect(action.label).not.toMatch(/pay now|buy online|book & pay/i);
    expect(action.href).toContain("https://wa.me/919372402074?text=");
    expect(decodeURIComponent(action.href)).toContain("Garba Night — 5th Edition");
    expect(GARBA_WHATSAPP_PREFILL).toMatch(/Member passes:/);
    expect(GARBA_WHATSAPP_PREFILL).toMatch(/Guest passes:/);
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

  it("publishes unique metadata with event OG path", () => {
    const meta = buildPageMetadata({
      title: event.seoTitle,
      description: event.seoDescription,
      path: event.path,
      ogImagePath: `${event.path}/opengraph-image`,
    });
    expect(meta.alternates?.canonical).toBe(buildCanonicalUrl(event.path));
    expect(meta.openGraph?.images).toEqual([
      { url: "/events/garba-night-2026/opengraph-image" },
    ]);
    expect(String(meta.description)).toMatch(/₹599/);
    expect(String(meta.description)).toMatch(/₹699/);
  });

  it("labels previous-edition media as Garba Night 4.0, not 2026 footage", () => {
    expect(event.media.previousEdition.label).toMatch(/4\.0/);
    expect(event.media.previousEdition.label).not.toMatch(/2026 footage/i);
    expect(event.media.previousEdition.caption).toMatch(/previous Garba Night/i);
    expect(event.media.previousEdition.src).toBe("/events/garba-night-2026/previous-edition.mp4");
    expect(event.media.promoTeaser.src).toBe("/events/garba-night-2026/teaser.mp4");
    expect(event.media.poster).toBe("/events/garba-night-2026/poster.webp");
  });

  it("keeps prize and stall tags as structured data for nested UI modules", () => {
    expect(event.prizeCategories).toEqual(["Best Dress", "Best Couple", "Best Group"]);
    expect(event.stallKinds).toEqual(["Food", "Fashion", "Jewellery", "More stalls"]);
    expect(event.highlights.map((h) => h.id)).toEqual([
      "live-dj",
      "prizes",
      "photo-zones",
      "garba-street",
      "refreshments",
    ]);
  });

  it("rejects fabricated Stitch event claims in truth content", () => {
    const blob = JSON.stringify(event);
    expect(blob).not.toMatch(/400\+/i);
    expect(blob).not.toMatch(/RFID|UPI|Aarti|Sanedo|Dandiya Raas|percussion|Dholak/i);
    expect(blob).not.toMatch(/Ground Arena|Ankit Gupta|sold out|0:45|4K/i);
    expect(blob).not.toMatch(/gift hamper|one-month|1-month|cashless|walk-ins/i);
  });

  it("resolves campaign analytics booking sources", () => {
    expect(getGarbaBookingAction("homepage-billboard").source).toBe("homepage-billboard");
    expect(getGarbaBookingAction("campaign-ribbon").source).toBe("campaign-ribbon");
    expect(getGarbaBookingAction("homepage-billboard").href).toContain("wa.me/919372402074");
  });

  it("serves optimized public derivatives, not media-source raw files", () => {
    expect(event.media.promoTeaser.src).not.toMatch(/media-source|\.mov$/i);
    expect(event.media.previousEdition.src).not.toMatch(/media-source/i);
  });

  it("lists the seasonal event for promotion accessors", () => {
    expect(getSeasonalEvents().map((e) => e.slug)).toContain("garba-night-2026");
  });
});
