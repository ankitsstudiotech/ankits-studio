import { describe, expect, it } from "vitest";
import { getBranches } from "@/content";
import { getBranchOrNotFound } from "@/app/locations/_lib/lookup";
import { generateMetadata, generateStaticParams } from "@/app/locations/[slug]/page";

describe("locations static generation", () => {
  it("generates a static param for every branch, including Thane", () => {
    const params = generateStaticParams();
    const slugs = params.map((p) => p.slug).sort();
    expect(slugs).toEqual(["airoli", "ghansoli", "thane"]);
  });
});

describe("locations 404 handling", () => {
  it("returns the branch for a valid slug", () => {
    const branch = getBranchOrNotFound("ghansoli");
    expect(branch.slug).toBe("ghansoli");
  });

  it("still resolves Thane directly (route exists for prototyping, just unlinked)", () => {
    const branch = getBranchOrNotFound("thane");
    expect(branch.slug).toBe("thane");
    expect(branch.publiclyListed).toBe(false);
  });

  it("throws (404s) for an unknown slug", () => {
    expect(() => getBranchOrNotFound("mumbai-central")).toThrow();
  });
});

describe("locations generateMetadata", () => {
  it("produces unique titles across every branch", async () => {
    const entries = await Promise.all(
      getBranches().map((b) => generateMetadata({ params: Promise.resolve({ slug: b.slug }) }))
    );
    const titles = entries.map((m) => m.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("produces unique descriptions across every branch", async () => {
    const entries = await Promise.all(
      getBranches().map((b) => generateMetadata({ params: Promise.resolve({ slug: b.slug }) }))
    );
    const descriptions = entries.map((m) => m.description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("produces a canonical URL containing the branch's own slug", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: "airoli" }) });
    expect(metadata.alternates?.canonical).toContain("/locations/airoli");
  });

  it("throws (404s) when generating metadata for an unknown slug", async () => {
    await expect(generateMetadata({ params: Promise.resolve({ slug: "mumbai-central" }) })).rejects.toThrow();
  });
});
