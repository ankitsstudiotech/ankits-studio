import { describe, expect, it } from "vitest";
import {
  isLocalOrLoopbackHost,
  resolveSiteOrigin,
  organizationId,
  branchBusinessId,
  programmeServiceId,
  cleanProfileUrl,
} from "@/lib/seo/site-origin";

describe("resolveSiteOrigin — production localhost regression guard", () => {
  it("allows localhost fallback in development when unset", () => {
    expect(
      resolveSiteOrigin({ configured: undefined, nodeEnv: "development" }),
    ).toBe("http://localhost:3000");
  });

  it("allows localhost fallback under Vitest even when NODE_ENV is production", () => {
    expect(
      resolveSiteOrigin({
        configured: undefined,
        nodeEnv: "production",
        isVitest: true,
      }),
    ).toBe("http://localhost:3000");
  });

  it("throws in production when SITE_URL is missing", () => {
    expect(() =>
      resolveSiteOrigin({ configured: undefined, nodeEnv: "production", isVitest: false }),
    ).toThrow(/NEXT_PUBLIC_SITE_URL is required/);
  });

  it("throws in production when SITE_URL is localhost", () => {
    expect(() =>
      resolveSiteOrigin({
        configured: "http://localhost:3000",
        nodeEnv: "production",
        isVitest: false,
      }),
    ).toThrow(/must not be a localhost/);
  });

  it("throws in production when SITE_URL is 127.0.0.1", () => {
    expect(() =>
      resolveSiteOrigin({
        configured: "http://127.0.0.1:3000",
        nodeEnv: "production",
        isVitest: false,
      }),
    ).toThrow(/must not be a localhost/);
  });

  it("accepts a public production origin", () => {
    expect(
      resolveSiteOrigin({
        configured: "https://ankits-studio-eight.vercel.app/",
        nodeEnv: "production",
        isVitest: false,
      }),
    ).toBe("https://ankits-studio-eight.vercel.app");
  });

  it("uses VERCEL_URL on preview when SITE_URL is unset", () => {
    expect(
      resolveSiteOrigin({
        configured: undefined,
        nodeEnv: "production",
        isVitest: false,
        vercelEnv: "preview",
        vercelUrl: "ankits-studio-preview.vercel.app",
      }),
    ).toBe("https://ankits-studio-preview.vercel.app");
  });
});

describe("isLocalOrLoopbackHost", () => {
  it("detects localhost and loopback hosts", () => {
    expect(isLocalOrLoopbackHost("http://localhost:3000")).toBe(true);
    expect(isLocalOrLoopbackHost("http://127.0.0.1")).toBe(true);
    expect(isLocalOrLoopbackHost("https://ankits-studio-eight.vercel.app")).toBe(false);
  });
});

describe("canonical host consistency helpers", () => {
  it("builds stable entity @ids from the same origin", () => {
    const origin = "https://ankits-studio-eight.vercel.app";
    expect(organizationId(origin)).toBe(`${origin}/#organization`);
    expect(branchBusinessId(origin, "airoli-sector-19")).toBe(
      `${origin}/locations/airoli-sector-19/#business`,
    );
    expect(programmeServiceId(origin, "yoga")).toBe(`${origin}/programs/yoga/#service`);
  });

  it("strips tracking params from profile URLs for sameAs", () => {
    expect(
      cleanProfileUrl("https://www.instagram.com/ankitsstudio?igshid=abc"),
    ).toBe("https://www.instagram.com/ankitsstudio");
    expect(cleanProfileUrl("https://youtube.com/@ankitsstudio?si=xyz")).toBe(
      "https://youtube.com/@ankitsstudio",
    );
  });
});

describe("shared site origin wiring — canonical / sitemap / robots", () => {
  it("canonical, sitemap loc, and robots Sitemap are derived from siteConfig.url", async () => {
    const { siteConfig } = await import("@/lib/metadata");
    const { buildCanonicalUrl } = await import("@/lib/seo/canonical");
    const { buildSitemapEntries } = await import("@/lib/seo/sitemap");
    const { buildRobotsRules } = await import("@/lib/seo/robots");
    const origin = new URL(siteConfig.url).origin;

    expect(buildCanonicalUrl("/")).toBe(`${origin}/`);
    expect(buildCanonicalUrl("/programs")).toBe(`${origin}/programs`);
    expect(buildCanonicalUrl("/locations")).toBe(`${origin}/locations`);

    for (const entry of buildSitemapEntries()) {
      expect(entry.url.startsWith(origin)).toBe(true);
      expect(entry.url).not.toMatch(/localhost|127\.0\.0\.1/);
    }

    const robots = buildRobotsRules();
    if (robots.sitemap) {
      expect(String(robots.sitemap)).toBe(`${origin}/sitemap.xml`);
      expect(String(robots.sitemap)).not.toMatch(/localhost|127\.0\.0\.1/);
    }
  });
});
