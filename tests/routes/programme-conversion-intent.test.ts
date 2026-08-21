import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getProgrammeBySlug } from "@/content";
import {
  buildWhatsAppCorporateWellnessMessage,
  getProgrammeConversionHref,
  getProgrammeConversionIntent,
  getProgrammeConversionLabel,
  isServiceEnquiryProgramme,
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

describe("programme conversion intent", () => {
  it("defaults consumer programmes to free-trial intent", () => {
    for (const slug of CONSUMER_PROGRAMMES) {
      const programme = getProgrammeBySlug(slug);
      expect(programme).toBeTruthy();
      expect(getProgrammeConversionIntent(programme!)).toBe("free-trial");
      expect(isServiceEnquiryProgramme(programme!)).toBe(false);
      expect(getProgrammeConversionLabel(programme!)).toMatch(/free trial/i);
    }
  });

  it("marks Corporate Wellness as service-enquiry", () => {
    const corporate = getProgrammeBySlug("corporate-wellness");
    expect(corporate?.conversionIntent).toBe("service-enquiry");
    expect(getProgrammeConversionLabel(corporate!)).toBe("Enquire about Corporate Wellness");
  });

  it("uses a corporate-specific WhatsApp prefill", () => {
    const corporate = getProgrammeBySlug("corporate-wellness")!;
    const href = getProgrammeConversionHref(corporate);
    expect(href).toMatch(/^https:\/\/wa\.me\//);
    expect(href).toContain(
      encodeURIComponent(buildWhatsAppCorporateWellnessMessage()),
    );
    expect(buildWhatsAppCorporateWellnessMessage()).toMatch(/Corporate Wellness/i);
    expect(buildWhatsAppCorporateWellnessMessage()).not.toMatch(/free trial/i);
  });
});

describe("Corporate Wellness detail semantics", () => {
  const detailView = readFileSync(
    join(
      process.cwd(),
      "src",
      "components",
      "programs",
      "pulse",
      "ProgrammeDetailView.tsx",
    ),
    "utf8",
  );

  it("uses planning and availability copy for service-enquiry programmes", () => {
    expect(detailView).toMatch(/Planning & availability/);
    expect(detailView).toMatch(/Planning fitness sessions for your team\?/);
    expect(detailView).toMatch(/isServiceEnquiryProgramme/);
  });

  it("does not expose consumer trial meta facts for service-enquiry programmes", () => {
    expect(detailView).toMatch(/buildMetaFacts/);
    expect(detailView).toMatch(/Shared on enquiry/);
    expect(detailView).toMatch(/Workplace or online/);
  });
});
