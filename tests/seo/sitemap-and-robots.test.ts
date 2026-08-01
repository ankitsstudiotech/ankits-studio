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

  it("robots omits the sitemap URL while unverified content exists", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { buildRobotsRules } = await import("@/lib/seo/robots");
    const rules = buildRobotsRules();
    expect(rules.sitemap).toBeUndefined();
  });

  it("robots includes a sitemap reference only once the site is indexable", async () => {
    vi.doMock("@/content/content-mode", () => ({ shouldNoIndex: () => false }));
    const { buildRobotsRules } = await import("@/lib/seo/robots");
    const rules = buildRobotsRules();
    expect(rules.sitemap).toContain("/sitemap.xml");
    vi.doUnmock("@/content/content-mode");
  });

  it("robots permanently disallows /design-lab when the site is otherwise indexable", async () => {
    vi.doMock("@/content/content-mode", () => ({ shouldNoIndex: () => false }));
    const { buildRobotsRules, DESIGN_LAB_DISALLOW_PATHS } = await import("@/lib/seo/robots");
    const rules = buildRobotsRules();
    const ruleSet = Array.isArray(rules.rules) ? rules.rules[0] : rules.rules;
    expect(ruleSet?.disallow).toEqual(expect.arrayContaining([...DESIGN_LAB_DISALLOW_PATHS]));
    vi.doUnmock("@/content/content-mode");
  });
});
/**
 * Covers the populated branch of `buildSitemapEntries()`, added for SEO-001
 * (docs/DECISIONS.md ADR-013) — the tests above only ever exercise the `[]`
 * short-circuit. Mocks `@/content/content-mode` and `@/content` directly
 * rather than relying on real mock data reaching a verified state, since
 * `shouldNoIndex()`/`siteHasUnverifiedContent` are computed once at
 * module-load time from the actual content domain.
 */
describe("buildSitemapEntries once the site is indexable", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("includes every static route plus only the verified dynamic records", async () => {
    vi.doMock("@/content/content-mode", () => ({ shouldNoIndex: () => false }));
    vi.doMock("@/content", () => ({
      getProgrammes: () => [
        { slug: "yoga", dataStatus: "verified" },
        { slug: "unverified-programme", dataStatus: "mock", mockDisclaimer: "x" },
      ],
      getPubliclyListedBranches: () => [{ slug: "airoli", dataStatus: "verified" }],
      getTrainers: () => [{ slug: "unverified-trainer", dataStatus: "mock", mockDisclaimer: "x" }],
      getBlogPosts: () => [{ slug: "real-post", dataStatus: "verified" }],
    }));

    const { buildSitemapEntries } = await import("@/lib/seo/sitemap");
    const { buildCanonicalUrl } = await import("@/lib/seo/canonical");
    const entries = buildSitemapEntries();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(buildCanonicalUrl("/"));
    expect(urls).toContain(buildCanonicalUrl("/programs/yoga"));
    expect(urls).toContain(buildCanonicalUrl("/locations/airoli"));
    expect(urls).toContain(buildCanonicalUrl("/blog/real-post"));
    expect(urls).not.toContain(buildCanonicalUrl("/programs/unverified-programme"));
    expect(urls).not.toContain(buildCanonicalUrl("/trainers/unverified-trainer"));
    expect(urls.every((url) => !url.includes("/design-lab"))).toBe(true);

    vi.doUnmock("@/content/content-mode");
    vi.doUnmock("@/content");
  });
});
