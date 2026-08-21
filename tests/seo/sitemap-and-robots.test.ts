import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Production mock-data protections at the SEO layer — extends the
 * content-mode gate (src/content/content-mode.test.ts) to sitemap/robots
 * behavior specifically. Uses the same vi.stubEnv + vi.resetModules()
 * pattern, since siteHasUnverifiedContent/isProductionBuild are computed
 * once at module-load time.
 */
describe("sitemap/robots mock-mode behavior", () => {
  // Module reset + dynamic import is slower under full-suite load on Windows.
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it(
    "sitemap stays empty on ALLOW_MOCK_PUBLISH preview builds",
    async () => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("ALLOW_MOCK_PUBLISH", "true");
      const { buildSitemapEntries } = await import("@/lib/seo/sitemap");
      expect(buildSitemapEntries()).toEqual([]);
    },
    15_000,
  );

  it(
    "sitemap includes launch routes in real production when launch-critical content is verified",
    async () => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("ALLOW_MOCK_PUBLISH", "false");
      const { buildSitemapEntries } = await import("@/lib/seo/sitemap");
      const { buildCanonicalUrl } = await import("@/lib/seo/canonical");
      const urls = buildSitemapEntries().map((e) => e.url);
      expect(urls).toContain(buildCanonicalUrl("/"));
      expect(urls).toContain(buildCanonicalUrl("/programs"));
      expect(urls).toContain(buildCanonicalUrl("/locations"));
      expect(urls).toContain(buildCanonicalUrl("/trial"));
      expect(urls).toContain(buildCanonicalUrl("/guides"));
      expect(urls).toContain(buildCanonicalUrl("/guides/zumba-for-beginners"));
      expect(urls).not.toContain(buildCanonicalUrl("/blog"));
      expect(urls).not.toContain(buildCanonicalUrl("/trainers"));
      expect(urls).not.toContain(buildCanonicalUrl("/transformations"));
    },
    15_000,
  );

  it(
    "sitemap is empty in development",
    async () => {
      vi.stubEnv("NODE_ENV", "development");
      const { buildSitemapEntries } = await import("@/lib/seo/sitemap");
      expect(buildSitemapEntries()).toEqual([]);
    },
    15_000,
  );

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
        { slug: "yoga", dataStatus: "verified", taxonomyStatus: "confirmed" },
        { slug: "strength-training", dataStatus: "verified", taxonomyStatus: "migration-pending" },
        { slug: "unverified-programme", dataStatus: "mock", mockDisclaimer: "x" },
      ],
      getPubliclyListedBranches: () => [{ slug: "airoli-sector-19", dataStatus: "verified" }],
      getPublishableTrainers: () => [],
      shouldIndexTrainersRoute: () => false,
      shouldIndexMemberStoriesRoute: () => false,
      getBlogPosts: () => [{ slug: "real-post", dataStatus: "verified" }],
      getGuides: () => [{ slug: "zumba-for-beginners", dataStatus: "verified" }],
    }));

    const { buildSitemapEntries } = await import("@/lib/seo/sitemap");
    const { buildCanonicalUrl } = await import("@/lib/seo/canonical");
    const entries = buildSitemapEntries();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(buildCanonicalUrl("/"));
    expect(urls).toContain(buildCanonicalUrl("/guides"));
    expect(urls).toContain(buildCanonicalUrl("/guides/zumba-for-beginners"));
    expect(urls).toContain(buildCanonicalUrl("/programs/yoga"));
    expect(urls).not.toContain(buildCanonicalUrl("/programs/strength-training"));
    expect(urls).toContain(buildCanonicalUrl("/locations/airoli-sector-19"));
    expect(urls).toContain(buildCanonicalUrl("/blog/real-post"));
    expect(urls).not.toContain(buildCanonicalUrl("/programs/unverified-programme"));
    expect(urls).not.toContain(buildCanonicalUrl("/trainers"));
    expect(urls).not.toContain(buildCanonicalUrl("/trainers/unverified-trainer"));
    expect(urls).not.toContain(buildCanonicalUrl("/transformations"));
    expect(urls.every((url) => !url.includes("/design-lab"))).toBe(true);

    vi.doUnmock("@/content/content-mode");
    vi.doUnmock("@/content");
  });

  it("includes /trainers and publishable trainer slugs only when indexing threshold is met", async () => {
    vi.doMock("@/content/content-mode", () => ({ shouldNoIndex: () => false }));
    vi.doMock("@/content", () => ({
      getProgrammes: () => [],
      getPubliclyListedBranches: () => [],
      getPublishableTrainers: () => [
        { slug: "coach-a" },
        { slug: "coach-b" },
        { slug: "coach-c" },
      ],
      shouldIndexTrainersRoute: () => true,
      shouldIndexMemberStoriesRoute: () => true,
      getBlogPosts: () => [],
      getGuides: () => [],
    }));

    const { buildSitemapEntries } = await import("@/lib/seo/sitemap");
    const { buildCanonicalUrl } = await import("@/lib/seo/canonical");
    const urls = buildSitemapEntries().map((entry) => entry.url);

    expect(urls).toContain(buildCanonicalUrl("/trainers"));
    expect(urls).toContain(buildCanonicalUrl("/trainers/coach-a"));
    expect(urls).toContain(buildCanonicalUrl("/trainers/coach-c"));
    expect(urls).toContain(buildCanonicalUrl("/transformations"));

    vi.doUnmock("@/content/content-mode");
    vi.doUnmock("@/content");
  });
});
