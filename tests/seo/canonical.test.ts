import { describe, expect, it } from "vitest";
import { buildCanonicalUrl, isValidCanonicalUrl } from "@/lib/seo/canonical";

describe("buildCanonicalUrl", () => {
  it("builds a valid absolute canonical URL for a normal path", () => {
    const url = buildCanonicalUrl("/programmes");
    expect(isValidCanonicalUrl(url)).toBe(true);
    expect(url.endsWith("/programmes")).toBe(true);
  });

  it("builds a valid canonical URL for the root path", () => {
    const url = buildCanonicalUrl("/");
    expect(isValidCanonicalUrl(url)).toBe(true);
  });

  it("throws when the path is missing a leading slash (missing required field shape)", () => {
    expect(() => buildCanonicalUrl("programmes")).toThrow();
  });

  it("throws when the path includes a query string", () => {
    expect(() => buildCanonicalUrl("/timetable?branch=airoli")).toThrow();
  });

  it("throws when the path includes a fragment", () => {
    expect(() => buildCanonicalUrl("/programmes#yoga")).toThrow();
  });

  it("throws on a trailing slash for a non-root path", () => {
    expect(() => buildCanonicalUrl("/programmes/")).toThrow();
  });
});

describe("isValidCanonicalUrl", () => {
  it("rejects a non-URL string", () => {
    expect(isValidCanonicalUrl("not a url")).toBe(false);
  });

  it("rejects a URL with a fragment", () => {
    expect(isValidCanonicalUrl("https://example.test/page#section")).toBe(false);
  });

  it("accepts a well-formed https URL", () => {
    expect(isValidCanonicalUrl("https://example.test/page")).toBe(true);
  });
});
