import { describe, expect, it } from "vitest";
import { getProgrammes } from "@/content";
import { getProgrammeOrNotFound } from "@/app/programs/_lib/lookup";
import { generateMetadata, generateStaticParams } from "@/app/programs/[slug]/page";

describe("programs static generation", () => {
  it("generates a static param for every programme", () => {
    const params = generateStaticParams();
    const slugs = params.map((p) => p.slug).sort();
    const expected = getProgrammes()
      .map((p) => p.slug)
      .sort();
    expect(slugs).toEqual(expected);
  });
});

describe("programs 404 handling", () => {
  it("returns the programme for a valid slug", () => {
    const programme = getProgrammeOrNotFound("yoga");
    expect(programme.slug).toBe("yoga");
  });

  it("throws (404s) for an unknown slug", () => {
    expect(() => getProgrammeOrNotFound("not-a-real-programme")).toThrow();
  });

  it("throws (404s) for an empty slug", () => {
    expect(() => getProgrammeOrNotFound("")).toThrow();
  });
});

describe("programs generateMetadata", () => {
  it("produces unique titles across every programme", async () => {
    const entries = await Promise.all(
      getProgrammes().map((p) => generateMetadata({ params: Promise.resolve({ slug: p.slug }) }))
    );
    const titles = entries.map((m) => m.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("produces unique descriptions across every programme", async () => {
    const entries = await Promise.all(
      getProgrammes().map((p) => generateMetadata({ params: Promise.resolve({ slug: p.slug }) }))
    );
    const descriptions = entries.map((m) => m.description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("produces a canonical URL containing the programme's own slug", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: "zumba" }) });
    expect(metadata.alternates?.canonical).toContain("/programs/zumba");
  });

  it("throws (404s) when generating metadata for an unknown slug", async () => {
    await expect(generateMetadata({ params: Promise.resolve({ slug: "not-a-real-programme" }) })).rejects.toThrow();
  });
});
