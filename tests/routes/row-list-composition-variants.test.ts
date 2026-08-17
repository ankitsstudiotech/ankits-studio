import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function read(rel: string) {
  return readFileSync(join(process.cwd(), rel), "utf8");
}

describe("row-list composition variants — Batch 04", () => {
  it("ProgrammeRow exposes contextual layouts instead of one stretched anatomy", () => {
    const row = read("src/components/programs/ProgrammeRow.tsx");
    expect(row).toMatch(/layout\?: ProgrammeRowLayout/);
    expect(row).toMatch(/"featured" \| "cell" \| "index"/);
    expect(row).toMatch(/data-layout=\{layout\}/);
    const css = read("src/components/programs/programme-row.module.css");
    expect(css).not.toMatch(/minmax\(0,\s*var\(--layout-copy-max\)\)/);
    expect(css).not.toMatch(/--layout-copy-max/);
    expect(css).toMatch(/data-layout="featured"/);
    expect(css).toMatch(/data-layout="cell"/);
    expect(css).toMatch(/data-layout="index"/);
  });

  it("homepage programme discovery uses an editorial matrix, not eight stacked rows", () => {
    const showcase = read("src/components/home/ProgrammeShowcase.tsx");
    expect(showcase).toMatch(/layout=\{layout\}/);
    expect(showcase).toMatch(/data-matrix=\{matrix\}/);
    expect(showcase).toMatch(/clusterPair/);
    expect(showcase).toMatch(/Choose how you want to move/);
    const css = read("src/components/home/pulse/pulse-home.module.css");
    expect(css).toMatch(/lanes\[data-matrix="train"\]/);
    expect(css).toMatch(/lanes\[data-matrix="move"\]/);
    expect(css).toMatch(/grid-template-columns:\s*1fr 1fr 1fr/);
  });

  it("homepage branches use a 2×2 locality index", () => {
    const explorer = read("src/components/home/BranchExplorer.tsx");
    expect(explorer).toMatch(/data-discovery="branch-index"/);
    expect(explorer).toMatch(/Open in Maps/);
    expect(explorer).toMatch(/Studio page/);
    const css = read("src/components/home/pulse/pulse-home.module.css");
    expect(css).toMatch(/\.branchRows \{[\s\S]*display:\s*grid/);
    expect(css).toMatch(/grid-template-columns:\s*1fr 1fr/);
    expect(css).not.toMatch(/minmax\(0,\s*36rem\)\s+max-content/);
  });

  it("programmes index uses dense index layout, not homepage matrix clone", () => {
    const discovery = read("src/components/programs/pulse/ProgrammeDiscovery.tsx");
    expect(discovery).toMatch(/isFeatured/);
    expect(discovery).toMatch(/layout=\{isFeatured \? "featured" : "cell"\}/);
    expect(discovery).toMatch(/data-matrix="index"/);
    expect(discovery).toMatch(/indexIntro/);
    expect(discovery).not.toMatch(/data-matrix="train"/);
    expect(discovery).toMatch(/For Teams/);
  });

  it("branch available-services uses a compact typographic index without arrows", () => {
    const detail = read("src/components/locations/pulse/BranchDetailView.tsx");
    expect(detail).toMatch(/serviceIndex/);
    expect(detail).not.toMatch(/aria-hidden>→/);
    expect(detail).not.toMatch(/pulse-related-pair/);
    const css = read("src/components/locations/pulse/location-pulse.module.css");
    expect(css).toMatch(/\.serviceIndex \{/);
    expect(css).toMatch(/grid-template-columns:\s*1fr 1fr 1fr/);
  });

  it("programme related + locations share one asymmetric closing composition", () => {
    const view = read("src/components/programs/pulse/ProgrammeDetailView.tsx");
    expect(view).toMatch(/relatedDiscovery/);
    expect(view).toMatch(/data-columns/);
    expect(view).toMatch(/asymmetric/);
    expect(view).toMatch(/Find a studio/);
    const css = read("src/components/programs/pulse/programme-pulse.module.css");
    expect(css).toMatch(/minmax\(0,\s*1fr\)\s+minmax\(10rem,\s*13\.5rem\)/);
  });

  it("about programme list is a compact numbered index supporting the narrative", () => {
    const about = read("src/app/(marketing)/about/page.tsx");
    expect(about).toMatch(/disciplineLink/);
    expect(about).toMatch(/disciplineNum/);
    expect(about).not.toMatch(/pulse-related-pair/);
    const css = read("src/components/about/pulse/about.module.css");
    expect(css).toMatch(/disciplineIndex \{[\s\S]*grid-template-columns:\s*1fr 1fr/);
  });

  it("does not introduce card-wall or pill/tag-cloud treatments on these surfaces", () => {
    const files = [
      "src/components/home/pulse/pulse-home.module.css",
      "src/components/programs/programme-row.module.css",
      "src/components/locations/pulse/location-pulse.module.css",
      "src/components/programs/pulse/programme-pulse.module.css",
      "src/components/about/pulse/about.module.css",
    ];
    for (const file of files) {
      const css = read(file);
      expect(css, file).not.toMatch(/border-radius:\s*(?:0\.5rem|8px|12px|999px)/);
      expect(css, file).not.toMatch(/box-shadow:\s*0 1[0-9]px/);
    }
  });
});
