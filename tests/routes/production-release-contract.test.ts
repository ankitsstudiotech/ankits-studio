import { beforeEach, describe, expect, it, vi } from "vitest";

describe("production release contract", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("hides the preview banner in production without ALLOW_MOCK_PUBLISH", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "");
    vi.stubEnv("ANKITS_CONCEPT_PREVIEW", "");
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "");
    const { shouldShowMockPreviewBanner, shouldNoIndex } = await import(
      "@/content/content-mode"
    );
    expect(shouldShowMockPreviewBanner()).toBe(false);
    expect(shouldNoIndex()).toBe(false);
  });

  it("blocks real production release when mock-publish is set", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ANKITS_PRODUCTION_RELEASE", "true");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "true");
    const { assertProductionReleaseSafe } = await import("@/content/content-mode");
    expect(() => assertProductionReleaseSafe()).toThrow(/ALLOW_MOCK_PUBLISH/);
  });

  it("allows a real production release with illustrative-ai and no synthetic flag", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ANKITS_PRODUCTION_RELEASE", "true");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "");
    vi.stubEnv("ANKITS_CONCEPT_PREVIEW", "");
    vi.stubEnv("NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA", "");
    const { assertProductionReleaseSafe, assertMockContentSafeForBuild } = await import(
      "@/content/content-mode"
    );
    expect(() => assertProductionReleaseSafe()).not.toThrow();
    expect(() => assertMockContentSafeForBuild()).not.toThrow();
  });
});
