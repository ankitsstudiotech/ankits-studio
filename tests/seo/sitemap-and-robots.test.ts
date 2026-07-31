import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Production mock-data protections at the SEO layer — extends the
 * content-mode gate (src/content/content-mode.test.ts) to sitemap/robots
 * behavior specifically. Uses the same vi.stubEnv + vi.resetModules()
 * pattern, since siteHasUnverifiedContent/isProductionBuild are computed
 * once at module-load time.
 */
describe("sitemap/robots mock-mode behavior", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("sitemap is empty while unverified content exists, even in an explicitly-allowed production build", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "true");
    const { buildSitemapEntries } = await import("@/lib/seo/sitemap");
    expect(buildSitemapEntries()).toEqual([]);
  });

  it("sitemap is empty in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { buildSitemapEntries } = await import("@/lib/seo/sitemap");
    expect(buildSitemapEntries()).toEqual([]);
  });

  it("robots disallows everything while unverified content exists, even in an explicitly-allowed production build", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "true");
    const { buildRobotsRules } = await import("@/lib/seo/robots");
    const rules = buildRobotsRules();
    const ruleSet = Array.isArray(rules.rules) ? rules.rules[0] : rules.rules;
    expect(ruleSet?.disallow).toBe("/");
    expect(ruleSet?.allow).toBeUndefined();
  });

  it("robots disallows everything in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { buildRobotsRules } = await import("@/lib/seo/robots");
    const rules = buildRobotsRules();
    const ruleSet = Array.isArray(rules.rules) ? rules.rules[0] : rules.rules;
    expect(ruleSet?.disallow).toBe("/");
  });

  it("robots always includes a sitemap reference", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { buildRobotsRules } = await import("@/lib/seo/robots");
    const rules = buildRobotsRules();
    expect(rules.sitemap).toContain("/sitemap.xml");
  });
});
