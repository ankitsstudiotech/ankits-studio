import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getBranchDirectoryNumeral, getPubliclyListedBranches } from "@/content";

function read(rel: string) {
  return readFileSync(join(process.cwd(), rel), "utf8");
}

describe("hero narrative composition — Batch 05", () => {
  it("maps publicly listed branches to the Home 01–04 directory numerals", () => {
    const branches = getPubliclyListedBranches();
    expect(branches.map((branch) => branch.slug)).toEqual([
      "airoli-sector-19",
      "airoli-sector-8",
      "ghansoli",
      "thane",
    ]);
    expect(branches.map((branch) => getBranchDirectoryNumeral(branch.slug))).toEqual([
      "01",
      "02",
      "03",
      "04",
    ]);
    expect(branches.every((branch) => typeof branch.openingYear === "number")).toBe(true);
  });

  it("About opening is a 7/5 editorial pair with a founding-year rail, not a fact-card stack", () => {
    const page = read("src/app/(marketing)/about/page.tsx");
    expect(page).toMatch(/data-compose="about-opening"/);
    expect(page).toMatch(/openRail/);
    expect(page).toMatch(/openYearValue/);
    expect(page).toMatch(/From one studio to four neighbourhoods/);
    expect(page).not.toMatch(/Meet our founder/);
    const css = read("src/components/about/pulse/about.module.css");
    expect(css).toMatch(/grid-template-columns:\s*minmax\(0,\s*38rem\)\s+minmax\(18rem,\s*1fr\)/);
    expect(css).not.toMatch(/border-radius:\s*1rem/);
  });

  it("Home founder is a typographic editorial moment without a portrait slot", () => {
    const founder = read("src/components/home/FounderHomeMoment.tsx");
    expect(founder).toMatch(/data-compose="founder-opening"/);
    expect(founder).toMatch(/Founder · since/);
    expect(founder).toMatch(/founderChronology/);
    expect(founder).not.toMatch(/PulseMedia|founderMedia|portrait/);
    expect(founder).not.toMatch(/Meet our founder/);
    const home = read("src/app/(marketing)/page.tsx");
    expect(home).toMatch(/chronology=\{branchCards/);
  });

  it("branch heroes share one location-rail family with directory numerals and Maps", () => {
    const detail = read("src/components/locations/pulse/BranchDetailView.tsx");
    expect(detail).toMatch(/data-compose="branch-opening"/);
    expect(detail).toMatch(/getBranchDirectoryNumeral/);
    expect(detail).toMatch(/detailRail/);
    expect(detail).toMatch(/detailNum/);
    expect(detail).toMatch(/Open in Google Maps/);
    expect(detail).toMatch(/target="_blank"/);
    expect(detail).toMatch(/rel="noopener noreferrer"/);
    expect(detail).toMatch(/detailAddress/);
    expect(detail).not.toMatch(/PulseMedia/);
    expect(detail).not.toMatch(/branch-floor|interior photo/i);
    const css = read("src/components/locations/pulse/location-pulse.module.css");
    expect(css).toMatch(/grid-template-columns:\s*minmax\(0,\s*38rem\)\s+minmax\(16rem,\s*1fr\)/);
  });

  it("Calm yoga hero no longer reserves an empty grid cell beside the title", () => {
    const css = read("src/components/programs/pulse/programme-pulse.module.css");
    expect(css).toMatch(
      /\.detailHero\[data-compose-family="calm"\] \.composeHeroWithMedia \{[\s\S]*grid-template-columns:\s*minmax\(18rem,\s*32rem\)\s+minmax\(0,\s*1fr\)/,
    );
    expect(css).toMatch(/grid-template-areas:\s*"title media"\s+"meta media"/);
    expect(css).not.toMatch(/"title \."/);
    expect(css).toMatch(/data-compose-family="structured"/);
    expect(css).toMatch(/data-compose-family="fluid"/);
    expect(css).toMatch(/data-compose-family="service"/);
  });
});
