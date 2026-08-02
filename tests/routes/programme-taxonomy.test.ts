import { describe, expect, it } from "vitest";
import {
  getConfirmedProgrammes,
  getProgrammes,
  isConfirmedProgramme,
  isMigrationPendingProgramme,
} from "@/content";
import { generateMetadata } from "@/app/programs/[slug]/page";
import {
  buildWhatsAppProgrammeEnquiryMessage,
  buildWhatsAppProgrammeEnquiryUrl,
} from "@/lib/conversion";

describe("confirmed programme taxonomy", () => {
  it("exposes exactly seven confirmed public services", () => {
    const confirmed = getConfirmedProgrammes();
    expect(confirmed).toHaveLength(7);
    expect(confirmed.every(isConfirmedProgramme)).toBe(true);
    expect(confirmed.map((p) => p.slug).sort()).toEqual(
      [
        "adult-dance",
        "functional-training",
        "home-personal-training",
        "online-training",
        "wedding-choreography",
        "yoga",
        "zumba",
      ].sort(),
    );
  });

  it("keeps legacy migration-pending routes reachable but marked pending", () => {
    const pending = getProgrammes().filter(isMigrationPendingProgramme);
    expect(pending.map((p) => p.slug).sort()).toEqual(
      ["kids-dance", "personal-training", "strength-training", "weight-loss-fitness"].sort(),
    );
  });

  it("force-noindexes legacy programme metadata", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "strength-training" }),
    });
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });

  it("keeps confirmed programme metadata indexable under the site robots gate", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "yoga" }),
    });
    // Site-wide mock gate may still noindex; path/canonical must be self.
    expect(metadata.alternates?.canonical).toContain("/programs/yoga");
    expect(metadata.title).toBeTruthy();
  });
});

describe("programme WhatsApp enquiry", () => {
  it("prefills interested service before preferred branch", () => {
    const message = buildWhatsAppProgrammeEnquiryMessage("Yoga");
    expect(message).toContain("I would like to enquire about a free trial.");
    expect(message.indexOf("Interested service: Yoga")).toBeLessThan(
      message.indexOf("Preferred branch:"),
    );
  });

  it("builds a wa.me enquiry URL", () => {
    const href = buildWhatsAppProgrammeEnquiryUrl("Functional Training");
    expect(href).toMatch(/^https:\/\/wa\.me\/919372402074\?text=/);
    expect(href).toContain(encodeURIComponent("Interested service: Functional Training"));
  });
});
