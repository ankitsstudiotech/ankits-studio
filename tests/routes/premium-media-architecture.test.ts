import { afterEach, describe, expect, it, vi } from "vitest";
import {
  canAcceptSyntheticMedia,
  isVerifiedRealOnlySlot,
  programmeHeroSlotKey,
  resolveSlotMedia,
  VERIFIED_REAL_ONLY_SLOTS,
} from "@/content/media";
import { isSyntheticMediaEnabled } from "@/lib/media/feature-flag";

describe("synthetic media feature flag", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("defaults to disabled when unset", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", undefined);
    expect(isSyntheticMediaEnabled()).toBe(false);
  });

  it("is disabled when explicitly false", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "false");
    expect(isSyntheticMediaEnabled()).toBe(false);
  });

  it("is enabled only when exactly true", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "true");
    expect(isSyntheticMediaEnabled()).toBe(true);
  });
});

describe("real-only slot protection", () => {
  it("marks founder and branch heroes as verified-real-only", () => {
    expect(isVerifiedRealOnlySlot("about.founder")).toBe(true);
    expect(isVerifiedRealOnlySlot("location.airoli-sector-19.hero")).toBe(true);
    expect(isVerifiedRealOnlySlot("location.thane.hero")).toBe(true);
    expect(isVerifiedRealOnlySlot("trainers.portrait")).toBe(true);
    expect(VERIFIED_REAL_ONLY_SLOTS).toContain("about.founder");
  });

  it("allows illustrative media on home.hero and locations.atmosphere", () => {
    expect(canAcceptSyntheticMedia("home.hero")).toBe(true);
    expect(canAcceptSyntheticMedia("locations.atmosphere")).toBe(true);
    expect(canAcceptSyntheticMedia("about.community")).toBe(true);
  });

  it("rejects illustrative media on about.founder", () => {
    expect(canAcceptSyntheticMedia("about.founder")).toBe(false);
  });
});

describe("resolveSlotMedia status gates", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns owner-approved illustrative-ai in production without the synthetic flag", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "false");
    const hero = resolveSlotMedia("home.hero");
    expect(hero?.status).toBe("illustrative-ai");
    expect(hero?.source).toBe("ai-generated-illustration");
    expect(hero?.src).toBe("/media/synthetic-preview/home-hero-ai-concept.webp");
    expect(hero?.consentStatus).toBe("not-applicable-ai");
    expect(hero?.replacementStatus).toBe("replace-after-owner-photoshoot");
    expect(hero?.focalPoint).toBeDefined();
  });

  it("returns null for geometry when synthetic flag is off and no illustrative asset exists", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "false");
    expect(resolveSlotMedia("programme.corporate-wellness.hero")).toBeNull();
  });

  it("registers all twelve approved illustrative slots with file sources", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "false");
    const slots = [
      "home.hero",
      "home.community",
      "programme.functional.hero",
      "programme.functional.action",
      "programme.zumba.hero",
      "programme.yoga.hero",
      "programme.dance.hero",
      "programme.wedding.hero",
      "programme.home-pt.hero",
      "programme.online.hero",
      "about.community",
      "locations.atmosphere",
    ] as const;
    for (const slot of slots) {
      const item = resolveSlotMedia(slot);
      expect(item?.src, slot).toMatch(/^\/media\/synthetic-preview\//);
      expect(item?.status).toBe("illustrative-ai");
    }
  });

  it("never returns illustrative or synthetic media for founder or branch location heroes", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "false");
    expect(resolveSlotMedia("about.founder")).toBeNull();
    expect(resolveSlotMedia("location.ghansoli.hero")).toBeNull();
    expect(resolveSlotMedia("location.airoli-sector-8.hero")).toBeNull();
  });

  it("maps programme slugs to premium hero slots including corporate wellness", () => {
    expect(programmeHeroSlotKey("functional-training")).toBe("programme.functional.hero");
    expect(programmeHeroSlotKey("wedding-choreography")).toBe("programme.wedding.hero");
    expect(programmeHeroSlotKey("corporate-wellness")).toBe("programme.corporate-wellness.hero");
  });
});
