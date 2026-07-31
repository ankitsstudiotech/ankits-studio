import { beforeEach, describe, expect, it, vi } from "vitest";

describe("content-mode", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("reports unverified content present, given the current mock data set", async () => {
    const { siteHasUnverifiedContent } = await import("./content-mode");
    expect(siteHasUnverifiedContent).toBe(true);
  });

  it("noindexes a production build with unverified content and no override", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "false");
    const { shouldNoIndex } = await import("./content-mode");
    expect(shouldNoIndex()).toBe(true);
  });

  it("throws when building for production with unverified content and no override", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "false");
    const { assertMockContentSafeForBuild } = await import("./content-mode");
    expect(() => assertMockContentSafeForBuild()).toThrow(/Production build blocked/);
  });

  it("does not throw when ALLOW_MOCK_PUBLISH=true, but still noindexes", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "true");
    const { assertMockContentSafeForBuild, shouldNoIndex } = await import("./content-mode");
    expect(() => assertMockContentSafeForBuild()).not.toThrow();
    expect(shouldNoIndex()).toBe(true);
  });

  it("does not throw in development regardless of ALLOW_MOCK_PUBLISH", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "false");
    const { assertMockContentSafeForBuild } = await import("./content-mode");
    expect(() => assertMockContentSafeForBuild()).not.toThrow();
  });
});
