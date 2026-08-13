import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getProgrammeBySlug } from "@/content";
import { getPremiumSlot, resolveSlotMedia } from "@/content/media";
import { composeFamilyFromSlug } from "@/components/programs/pulse/ProgrammeDetailView";
import {
  getProgrammeConversionLabel,
  isServiceEnquiryProgramme,
} from "@/lib/conversion";

describe("Corporate Wellness programme media acceptance", () => {
  it("catalogues an illustrative-ai hero with production source and crop metadata", () => {
    const hero = resolveSlotMedia("programme.corporate-wellness.hero");
    const slot = getPremiumSlot("programme.corporate-wellness.hero");
    expect(hero?.status).toBe("illustrative-ai");
    expect(hero?.source).toBe("ai-generated-illustration");
    expect(hero?.consentStatus).toBe("not-applicable-ai");
    expect(hero?.replacementStatus).toBe("replace-after-owner-photoshoot");
    expect(hero?.replacementPriority).toBe("P1");
    expect(hero?.width).toBe(1672);
    expect(hero?.height).toBe(941);
    expect(hero?.aspectRatio).toBe("3/2");
    expect(hero?.mobileAspectRatio).toBe("4/3");
    expect(slot?.desktopAspect).toBe("3/2");
    expect(slot?.mobileAspect).toBe("4/3");
    expect(slot?.verifiedRealOnly).toBe(false);
    expect(hero?.focalPoint).toEqual({ x: 64, y: 48 });
    expect(hero?.tabletFocalPoint).toEqual({ x: 66, y: 46 });
    expect(hero?.mobileFocalPoint).toEqual({ x: 70, y: 42 });
  });

  it("keeps truthful illustrative alt and does not claim a real client event", () => {
    const hero = resolveSlotMedia("programme.corporate-wellness.hero");
    expect(hero?.alt).toBe(
      "Illustrative workplace wellness session with a coach guiding a small group.",
    );
    expect(hero?.alt).not.toMatch(/Ankit’s Studio Corporate Wellness session/i);
    expect(hero?.alt).not.toMatch(/client|Google|review/i);
  });

  it("archives the owner PNG and serves an optimized WebP", () => {
    const original = join(
      process.cwd(),
      "public/media/illustrative-ai/corporate-wellness-hero.png",
    );
    const production = join(
      process.cwd(),
      "public/media/synthetic-preview/programme-corporate-wellness-hero-ai-concept.webp",
    );
    expect(existsSync(original)).toBe(true);
    expect(existsSync(production)).toBe(true);
    expect(statSync(original).size).toBe(2_077_700);
    expect(statSync(production).size).toBeGreaterThan(180_000);
    expect(statSync(production).size).toBeLessThan(400_000);
  });

  it("preserves B2B service-enquiry semantics", () => {
    const programme = getProgrammeBySlug("corporate-wellness");
    expect(programme).toBeTruthy();
    expect(composeFamilyFromSlug("corporate-wellness")).toBe("service");
    expect(isServiceEnquiryProgramme(programme!)).toBe(true);
    expect(programme?.trialAvailable).toBe(false);
    expect(getProgrammeConversionLabel(programme!)).toBe("Enquire about Corporate Wellness");
  });
});
