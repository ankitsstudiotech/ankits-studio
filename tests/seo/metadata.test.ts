import { describe, expect, it } from "vitest";
import { getBranches, getProgrammes } from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";

/**
 * "Unique titles" / "Unique descriptions": generated across every known
 * content-derived virtual page (each Programme, each Branch) — there are
 * no actual page.tsx files yet (out of this task's scope), so this proves
 * the underlying content + title/description construction doesn't collide
 * by construction, which is what will back real pages once Track D builds
 * them.
 */
function buildProgrammeMetadataEntries() {
  return getProgrammes().map((programme) =>
    buildPageMetadata({
      title: programme.name,
      description: programme.shortDescription,
      path: `/programs/${programme.slug}`,
    })
  );
}

function buildBranchMetadataEntries() {
  return getBranches().map((branch) =>
    buildPageMetadata({
      title: branch.name,
      description: `${branch.name} — programs, timings, and contact details.`,
      path: `/locations/${branch.slug}`,
    })
  );
}

describe("buildPageMetadata", () => {
  it("produces unique titles across every programme page", () => {
    const titles = buildProgrammeMetadataEntries().map((metadata) => metadata.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("produces unique descriptions across every programme page", () => {
    const descriptions = buildProgrammeMetadataEntries().map((metadata) => metadata.description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("produces unique titles across every branch page", () => {
    const titles = buildBranchMetadataEntries().map((metadata) => metadata.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("produces unique titles across the combined programme + branch page set", () => {
    const titles = [...buildProgrammeMetadataEntries(), ...buildBranchMetadataEntries()].map(
      (metadata) => metadata.title
    );
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("sets a valid canonical URL via alternates.canonical", () => {
    const metadata = buildPageMetadata({ title: "Programs", description: "All programs.", path: "/programs" });
    expect(metadata.alternates?.canonical).toContain("/programs");
  });

  it("throws when title is missing (missing required field)", () => {
    expect(() =>
      // @ts-expect-error -- intentionally omitting a required field
      buildPageMetadata({ description: "x", path: "/programs" })
    ).toThrow();
  });

  it("throws when description is empty (missing required field)", () => {
    expect(() => buildPageMetadata({ title: "x", description: "", path: "/programs" })).toThrow();
  });

  it("throws when path is malformed (missing required field shape)", () => {
    expect(() => buildPageMetadata({ title: "x", description: "x", path: "programs" })).toThrow();
  });

  it("always includes a robots field (mock-mode noindex/nofollow)", () => {
    const metadata = buildPageMetadata({ title: "x", description: "x", path: "/programs" });
    expect(metadata.robots).toBeDefined();
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });

  it("forceNoIndex keeps sample blog routes noindex even when building page metadata", () => {
    const metadata = buildPageMetadata({
      title: "Sample",
      description: "Sample article.",
      path: "/blog/sample",
      forceNoIndex: true,
    });
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });
});
