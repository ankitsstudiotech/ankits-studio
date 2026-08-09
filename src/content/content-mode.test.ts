import { beforeEach, describe, expect, it, vi } from "vitest";

describe("content-mode", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("reports soft unverified content present while launch-critical content is verified", async () => {
    const { siteHasUnverifiedContent, launchCriticalContentVerified } = await import("./content-mode");
    expect(siteHasUnverifiedContent).toBe(true);
    expect(launchCriticalContentVerified).toBe(true);
  });

  it("indexes a production build when launch-critical content is verified", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "false");
    const { shouldNoIndex, assertMockContentSafeForBuild } = await import("./content-mode");
    expect(shouldNoIndex()).toBe(false);
    expect(() => assertMockContentSafeForBuild()).not.toThrow();
  });

  it("keeps noindex on ALLOW_MOCK_PUBLISH preview builds", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "true");
    const { assertMockContentSafeForBuild, shouldNoIndex, shouldShowMockPreviewBanner } =
      await import("./content-mode");
    expect(() => assertMockContentSafeForBuild()).not.toThrow();
    expect(shouldNoIndex()).toBe(true);
    expect(shouldShowMockPreviewBanner()).toBe(true);
  });

  it("noindexes non-production environments", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { shouldNoIndex, shouldShowMockPreviewBanner } = await import("./content-mode");
    expect(shouldNoIndex()).toBe(true);
    expect(shouldShowMockPreviewBanner()).toBe(true);
  });

  it("hides the preview banner in real production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "false");
    const { shouldShowMockPreviewBanner } = await import("./content-mode");
    expect(shouldShowMockPreviewBanner()).toBe(false);
  });

  it("blocks synthetic media on a real production release gate", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ANKITS_PRODUCTION_RELEASE", "true");
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "true");
    const { assertProductionReleaseSafe } = await import("./content-mode");
    expect(() => assertProductionReleaseSafe()).toThrow(/SYNTHETIC_MEDIA/);
  });

  it("blocks ALLOW_MOCK_PUBLISH on a real production release gate", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ANKITS_PRODUCTION_RELEASE", "true");
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "false");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "true");
    const { assertProductionReleaseSafe } = await import("./content-mode");
    expect(() => assertProductionReleaseSafe()).toThrow(/ALLOW_MOCK_PUBLISH/);
  });

  it("allows local production preview builds without the release gate", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "true");
    vi.stubEnv("ANKITS_PRODUCTION_RELEASE", "false");
    vi.stubEnv("VERCEL_ENV", "preview");
    const { assertProductionReleaseSafe } = await import("./content-mode");
    expect(() => assertProductionReleaseSafe()).not.toThrow();
  });
});
