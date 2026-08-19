import { afterEach, describe, expect, it, vi } from "vitest";
import { isConceptPreview, isConceptPreviewEnv } from "@/lib/concept-preview";
import { canAcceptSyntheticMedia, resolveSlotMedia } from "@/content/media";

describe("isConceptPreview", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is false unless both flags are true", () => {
    vi.stubEnv("ANKITS_CONCEPT_PREVIEW", "true");
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "false");
    expect(isConceptPreviewEnv()).toBe(true);
    expect(isConceptPreview()).toBe(false);

    vi.stubEnv("ANKITS_CONCEPT_PREVIEW", "false");
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "true");
    expect(isConceptPreview()).toBe(false);
  });

  it("is true only when both flags are exactly true", () => {
    vi.stubEnv("ANKITS_CONCEPT_PREVIEW", "true");
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "true");
    expect(isConceptPreview()).toBe(true);
  });
});

describe("concept preview SEO gates", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("forces noindex/nofollow and empty sitemap when concept env is set", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "false");
    vi.stubEnv("ANKITS_CONCEPT_PREVIEW", "true");
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "true");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://ankits-studio.vercel.app");

    const { shouldNoIndex } = await import("@/content/content-mode");
    const { buildPageMetadata } = await import("@/lib/seo/metadata");
    const { buildSitemapEntries } = await import("@/lib/seo/sitemap");
    const { buildRobotsRules } = await import("@/lib/seo/robots");

    expect(shouldNoIndex()).toBe(true);

    const metadata = buildPageMetadata({
      title: "Home",
      description: "Concept preview metadata.",
      path: "/",
    });
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
    expect(String(metadata.alternates?.canonical)).toBe("https://ankits-studio.vercel.app/");

    expect(buildSitemapEntries()).toEqual([]);
    const robots = buildRobotsRules();
    expect(robots.rules).toMatchObject({ disallow: "/" });
    expect(robots).not.toHaveProperty("sitemap");
  });

  it("blocks concept preview on a real production release gate", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ANKITS_PRODUCTION_RELEASE", "true");
    vi.stubEnv("ANKITS_CONCEPT_PREVIEW", "true");
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "false");
    const { assertProductionReleaseSafe } = await import("@/content/content-mode");
    expect(() => assertProductionReleaseSafe()).toThrow(/ANKITS_CONCEPT_PREVIEW/);
  });
});

describe("concept preview does not relax real-only slots", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("still rejects founder and branch heroes when both concept flags are on", () => {
    vi.stubEnv("ANKITS_CONCEPT_PREVIEW", "true");
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "true");
    expect(canAcceptSyntheticMedia("about.founder")).toBe(false);
    expect(canAcceptSyntheticMedia("trainers.portrait")).toBe(false);
    expect(canAcceptSyntheticMedia("location.thane.hero")).toBe(false);
    expect(canAcceptSyntheticMedia("transformations.before")).toBe(false);
    expect(canAcceptSyntheticMedia("reviews.author")).toBe(false);
    expect(canAcceptSyntheticMedia("credentials.certification")).toBe(false);
    expect(resolveSlotMedia("about.founder")).toBeNull();
    expect(resolveSlotMedia("location.airoli-sector-19.hero")).toBeNull();
  });

  it("still resolves allowed illustrative slots when concept flags are on", () => {
    vi.stubEnv("ANKITS_CONCEPT_PREVIEW", "true");
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "true");
    expect(resolveSlotMedia("home.hero")?.status).toBe("illustrative-ai");
    expect(resolveSlotMedia("locations.atmosphere")?.status).toBe("illustrative-ai");
  });
});
