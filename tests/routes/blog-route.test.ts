import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { generateStaticParams } from "@/app/(marketing)/blog/[slug]/page";
import { getBlogPostBySlug, getBlogPosts } from "@/content";
import { buildSitemapEntries } from "@/lib/seo/sitemap";

describe("blog route — ADR-023 Studio Notes", () => {
  it("keeps sample fixtures in content but never as verified posts", () => {
    const posts = getBlogPosts();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((post) => post.dataStatus !== "verified")).toBe(true);
    expect(getBlogPostBySlug("sample-starting-with-strength")?.dataStatus).toBe("mock");
  });

  it("generateStaticParams only includes verified posts (empty today)", () => {
    expect(generateStaticParams()).toEqual([]);
  });

  it("blog index source has no sample article cards", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "app", "(marketing)", "blog", "page.tsx"),
      "utf8",
    );
    expect(source).toMatch(/Studio Notes/);
    expect(source).toMatch(/forceNoIndex:\s*true/);
    expect(source).not.toMatch(/getBlogPosts|Card href=\{`\/blog/);
    expect(source).toMatch(/\/programs/);
    expect(source).toMatch(/\/locations/);
    expect(source).toMatch(/\/timetable/);
  });

  it("blog slug source 404s non-verified posts and skips Article JSON-LD for mocks", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "app", "(marketing)", "blog", "[slug]", "page.tsx"),
      "utf8",
    );
    expect(source).toMatch(/dynamicParams\s*=\s*false/);
    expect(source).toMatch(/dataStatus !== "verified"/);
    expect(source).toMatch(/notFound\(\)/);
    expect(source).toMatch(/forceNoIndex:\s*true/);
    expect(source).toMatch(/buildArticleJsonLd/);
  });

  it("excludes /blog hub and sample slugs from sitemap entries when populated path runs", () => {
    const urls = buildSitemapEntries().map((entry) => entry.url);
    expect(urls.every((url) => !url.includes("/blog/sample-"))).toBe(true);
  });
});
