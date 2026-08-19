import { describe, expect, it } from "vitest";
import { getProgrammeBySlug } from "@/content";
import {
  buildWhatsAppCorporateWellnessMessage,
  getProgrammeConversionHref,
  getStickyCtaPresentation,
} from "@/lib/conversion";

const CONSUMER_PROGRAMMES = [
  "functional-training",
  "zumba",
  "yoga",
  "adult-dance",
  "wedding-choreography",
  "home-personal-training",
  "online-training",
] as const;

describe("sticky CTA conversion presentation", () => {
  it("keeps trial semantics for consumer programme pages", () => {
    for (const slug of CONSUMER_PROGRAMMES) {
      const presentation = getStickyCtaPresentation(`/programs/${slug}`);
      expect(presentation.intent, slug).toBe("free-trial");
      expect(presentation.supportingText, slug).toBe("Free trial");
      expect(presentation.label, slug).toBe("WhatsApp trial");
      expect(presentation.label, slug).toMatch(/trial/i);
    }
  });

  it("uses enquiry semantics for Corporate Wellness without trial language", () => {
    const presentation = getStickyCtaPresentation("/programs/corporate-wellness");
    const corporate = getProgrammeBySlug("corporate-wellness")!;
    expect(presentation.intent).toBe("service-enquiry");
    expect(presentation.supportingText).toBe("For teams");
    expect(presentation.label).toBe("Enquire on WhatsApp");
    expect(presentation.supportingText).not.toMatch(/trial/i);
    expect(presentation.label).not.toMatch(/trial/i);
    expect(presentation.href).toBe(getProgrammeConversionHref(corporate));
    expect(presentation.href).toContain(
      encodeURIComponent(buildWhatsAppCorporateWellnessMessage()),
    );
  });

  it("keeps consumer trial copy on site-wide browse routes", () => {
    for (const path of ["/", "/programs", "/locations", "/about", "/pricing"]) {
      const presentation = getStickyCtaPresentation(path);
      expect(presentation.intent, path).toBe("free-trial");
      expect(presentation.label, path).toBe("WhatsApp trial");
    }
  });
});
