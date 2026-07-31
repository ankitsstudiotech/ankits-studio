import { beforeEach, describe, expect, it, vi } from "vitest";

describe("env", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("loads successfully with valid values", async () => {
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "true");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    const { env } = await import("./env");
    expect(env.ALLOW_MOCK_PUBLISH).toBe("true");
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://example.com");
  });

  it("throws when NEXT_PUBLIC_SITE_URL is not a valid URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "not-a-url");
    await expect(import("./env")).rejects.toThrow();
  });

  it("throws when ALLOW_MOCK_PUBLISH is set to an unexpected value", async () => {
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "yes-please");
    await expect(import("./env")).rejects.toThrow();
  });
});
