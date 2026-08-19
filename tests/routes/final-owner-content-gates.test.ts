import { describe, expect, it } from "vitest";
import {
  getBusinessIdentity,
  getConfirmedProgrammes,
  getProgrammeBySlug,
  getPubliclyListedBranches,
  getStudioAbout,
  getStudioCommercial,
} from "@/content";
import { generateMetadata } from "@/app/programs/[slug]/page";

describe("final owner content gates (2026-08-12)", () => {
  it("exposes eight confirmed public programmes including Corporate Wellness", () => {
    const slugs = getConfirmedProgrammes()
      .map((p) => p.slug)
      .sort();
    expect(slugs).toEqual(
      [
        "adult-dance",
        "corporate-wellness",
        "functional-training",
        "home-personal-training",
        "online-training",
        "wedding-choreography",
        "yoga",
        "zumba",
      ].sort(),
    );
  });

  it("keeps confirmed Corporate Wellness programme metadata canonical under site robots gate", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "corporate-wellness" }),
    });
    expect(metadata.alternates?.canonical).toContain("/programs/corporate-wellness");
    expect(metadata.title).toBeTruthy();
  });

  it("does not expose TTEA as a public programme slug", () => {
    const slugs = getConfirmedProgrammes().map((p) => p.slug);
    expect(slugs.some((s) => s.includes("ttea"))).toBe(false);
    expect(getProgrammeBySlug("corporate-wellness")?.name).toBe("Corporate Wellness");
  });

  it("withholds individual certification copy on About", () => {
    const about = getStudioAbout();
    expect(about.credentialsStatus).toBe("withheld");
    expect(about.credentialsSummary).toBeUndefined();
    const publicBlob = JSON.stringify(about);
    expect(publicBlob).not.toMatch(/Ministry of Ayush|government approved|certified expert/i);
  });

  it("does not publish missed-class membership policy", () => {
    const commercial = getStudioCommercial();
    expect(commercial.missedClassesPolicyStatus).toBe("withheld");
    const blob = JSON.stringify(commercial);
    expect(blob).not.toMatch(/missed class/i);
  });

  it("publishes membership policy copy without non-transferable contradiction", () => {
    const copy = getStudioCommercial().membershipPolicyCopy;
    expect(copy?.transfer).toMatch(/transfer/i);
    expect(copy?.refund).toMatch(/non-refundable/i);
    expect(copy?.refund).not.toMatch(/non-transferable/i);
  });

  it("keeps branch batch schedules pending without fake timetable rows", () => {
    for (const branch of getPubliclyListedBranches()) {
      expect(branch.batchScheduleStatus).toBe("pending");
    }
  });

  it("exposes per-branch logistics from final form", () => {
    const s19 = getPubliclyListedBranches().find((b) => b.slug === "airoli-sector-19");
    expect(s19?.mapsUrl).toBe("https://maps.app.goo.gl/75pmKFuezsCSd5JP8");
    expect(s19?.nearestStation).toBe("Airoli Station");
    expect(s19?.facilities).toContain("Parking");
    expect(s19?.openingYear).toBe(2019);
  });

  it("adds social links to business identity", () => {
    const identity = getBusinessIdentity();
    expect(identity.socialLinks?.instagram).toContain("instagram.com");
    expect(identity.socialLinks?.youtube).toContain("youtube.com");
  });

  it("marks corporate fitness as published programme not enquiry-only", () => {
    expect(getStudioCommercial().corporateFitnessStatus).toBe("published");
  });

  it("uses teams service cluster for corporate wellness", () => {
    expect(getProgrammeBySlug("corporate-wellness")?.serviceCluster).toBe("teams");
  });

  it("uses service-enquiry conversion intent for corporate wellness", () => {
    expect(getProgrammeBySlug("corporate-wellness")?.conversionIntent).toBe("service-enquiry");
    expect(getProgrammeBySlug("corporate-wellness")?.trialAvailable).toBe(false);
  });
});
