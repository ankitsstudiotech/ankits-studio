import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getConfirmedProgrammes, getHomepageIntent, getProgrammeBySlug } from "@/content";
import { composeFamilyFromSlug } from "@/components/programs/pulse/ProgrammeDetailView";

describe("final owner homepage and discovery taxonomy", () => {
  it("records owner top-three priority as programmes, branches, google reviews", () => {
    const intent = getHomepageIntent();
    expect(intent.topThree).toEqual(["programmes", "branches", "google-reviews"]);
  });

  it("places Corporate Wellness in teams discovery cluster, not celebrate", () => {
    const corporate = getProgrammeBySlug("corporate-wellness");
    expect(corporate?.serviceCluster).toBe("teams");
    expect(getConfirmedProgrammes().filter((p) => p.serviceCluster === "celebrate")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ slug: "wedding-choreography" }),
      ]),
    );
    expect(
      getConfirmedProgrammes().filter((p) => p.serviceCluster === "celebrate").map((p) => p.slug),
    ).toEqual(["wedding-choreography"]);
  });

  it("keeps Corporate Wellness on service composition family for detail page", () => {
    expect(composeFamilyFromSlug("corporate-wellness")).toBe("service");
    expect(composeFamilyFromSlug("wedding-choreography")).toBe("service");
  });

  it("homepage architecture removes standalone machine-free and trust rail", () => {
    const home = readFileSync(
      join(process.cwd(), "src", "app", "(marketing)", "page.tsx"),
      "utf8",
    );
    expect(home).toMatch(/FounderHomeMoment/);
    expect(home).toMatch(/GoogleReviewProof/);
    expect(home).not.toMatch(/WhyStudio|PulseTrustRail/);
    expect(home).toMatch(/BranchExplorer/);
    expect(home).toMatch(/teams/);
    const branchIdx = home.indexOf("<BranchExplorer");
    const reviewIdx = home.indexOf("<GoogleReviewProof");
    expect(branchIdx).toBeLessThan(reviewIdx);
  });

  it("programs discovery includes For Teams cluster", () => {
    const discovery = readFileSync(
      join(process.cwd(), "src", "components", "programs", "pulse", "ProgrammeDiscovery.tsx"),
      "utf8",
    );
    expect(discovery).toMatch(/For Teams/);
    expect(discovery).toMatch(/teams/);
    expect(discovery).not.toMatch(/Celebrate & serve/);
  });
});
