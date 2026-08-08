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

  it("allows synthetic on home.hero and locations.atmosphere", () => {
    expect(canAcceptSyntheticMedia("home.hero")).toBe(true);
    expect(canAcceptSyntheticMedia("locations.atmosphere")).toBe(true);
    expect(canAcceptSyntheticMedia("about.community")).toBe(true);
  });

  it("rejects synthetic on about.founder", () => {
    expect(canAcceptSyntheticMedia("about.founder")).toBe(false);
  });
});

describe("resolveSlotMedia status gates", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns null for geometry when synthetic flag is off", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "false");
    expect(resolveSlotMedia("home.hero")).toBeNull();
    expect(resolveSlotMedia("programme.yoga.hero")).toBeNull();
    expect(resolveSlotMedia("locations.atmosphere")).toBeNull();
  });

  it("returns file-backed synthetic-preview when flag is on", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "true");
    const hero = resolveSlotMedia("home.hero");
    expect(hero?.status).toBe("synthetic-preview");
    expect(hero?.source).toBe("ai-concept");
    expect(hero?.src).toBe("/media/synthetic-preview/home-hero-ai-concept.webp");
    expect(hero?.consentStatus).toBe("not-applicable-synthetic");
    expect(hero?.focalPoint).toBeDefined();
    expect(hero?.tabletFocalPoint).toBeDefined();
    expect(hero?.mobileFocalPoint).toBeDefined();
  });

  it("registers all twelve concept slots with file sources", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "true");
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
      expect(item?.status).toBe("synthetic-preview");
    }
  });

  it("never returns synthetic for founder or branch location heroes", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "true");
    expect(resolveSlotMedia("about.founder")).toBeNull();
    expect(resolveSlotMedia("location.ghansoli.hero")).toBeNull();
    expect(resolveSlotMedia("location.airoli-sector-8.hero")).toBeNull();
  });

  it("maps programme slugs to premium hero slots", () => {
    expect(programmeHeroSlotKey("functional-training")).toBe("programme.functional.hero");
    expect(programmeHeroSlotKey("wedding-choreography")).toBe("programme.wedding.hero");
  });
});
