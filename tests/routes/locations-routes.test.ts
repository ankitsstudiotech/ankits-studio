import { describe, expect, it } from "vitest";
import { getBranches } from "@/content";
import { getBranchOrNotFound } from "@/app/locations/_lib/lookup";
import { generateMetadata, generateStaticParams } from "@/app/locations/[slug]/page";
import { LEGACY_AIROLI_SECTOR_19_SLUG } from "@/content/schema/slugs";

const FINAL_SLUGS = ["airoli-sector-19", "airoli-sector-8", "ghansoli", "thane"] as const;

describe("locations static generation", () => {
  it("generates a static param for every confirmed branch", () => {
    const params = generateStaticParams();
    const slugs = params.map((p) => p.slug).sort();
    expect(slugs).toEqual([...FINAL_SLUGS].sort());
  });
});

describe("locations 404 handling", () => {
  it("returns the branch for a valid slug", () => {
    const branch = getBranchOrNotFound("ghansoli");
    expect(branch.slug).toBe("ghansoli");
  });

  it("resolves Thane as a publicly listed open branch", () => {
    const branch = getBranchOrNotFound("thane");
    expect(branch.slug).toBe("thane");
    expect(branch.publiclyListed).toBe(true);
  });

  it("resolves Airoli Sector 19 on the canonical slug", () => {
    const branch = getBranchOrNotFound("airoli-sector-19");
    expect(branch.locality).toBe("Airoli Sector 19");
    expect(branch.slug).toBe("airoli-sector-19");
  });

  it("throws (404s) for an unknown slug", () => {
    expect(() => getBranchOrNotFound("mumbai-central")).toThrow();
  });

  it("does not treat the legacy airoli slug as a content record (redirect handles it)", () => {
    const slugs: string[] = getBranches().map((branch) => branch.slug);
    expect(slugs).not.toContain(LEGACY_AIROLI_SECTOR_19_SLUG);
    expect(() => getBranchOrNotFound("airoli")).toThrow();
  });
});

describe("locations generateMetadata", () => {
  it("produces unique titles across every branch", async () => {
    const entries = await Promise.all(
      getBranches().map((b) => generateMetadata({ params: Promise.resolve({ slug: b.slug }) })),
    );
    const titles = entries.map((m) => m.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("produces unique descriptions across every branch", async () => {
    const entries = await Promise.all(
      getBranches().map((b) => generateMetadata({ params: Promise.resolve({ slug: b.slug }) })),
    );
    const descriptions = entries.map((m) => m.description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("produces a canonical URL containing the branch's own slug", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "airoli-sector-19" }),
    });
    expect(metadata.alternates?.canonical).toContain("/locations/airoli-sector-19");
  });

  it("throws (404s) when generating metadata for an unknown slug", async () => {
    await expect(
      generateMetadata({ params: Promise.resolve({ slug: "mumbai-central" }) }),
    ).rejects.toThrow();
  });
});
