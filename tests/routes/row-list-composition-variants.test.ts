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
    expect(row).toMatch(/"featured" \| "cell" \| "index" \| "module"/);
    expect(row).toMatch(/data-layout=\{layout\}/);
    const css = read("src/components/programs/programme-row.module.css");
    expect(css).not.toMatch(/minmax\(0,\s*var\(--layout-copy-max\)\)/);
    expect(css).not.toMatch(/--layout-copy-max/);
    expect(css).toMatch(/data-layout="featured"/);
    expect(css).toMatch(/data-layout="cell"/);
    expect(css).toMatch(/data-layout="index"/);
    expect(css).toMatch(/data-layout="module"/);
  });

  it("homepage programme discovery uses an editorial matrix, not eight stacked rows", () => {
    const showcase = read("src/components/home/ProgrammeShowcase.tsx");
    expect(showcase).toMatch(/layout="module"/);
    expect(showcase).toMatch(/data-matrix="editorial"/);
    expect(showcase).toMatch(/Choose how you want to move/);
    expect(showcase).toMatch(/For Teams/);
    expect(showcase).toMatch(/cluster.lede/);
    expect(showcase).toMatch(/clusterKey/);
    const css = read("src/components/home/pulse/pulse-home.module.css");
    expect(css).toMatch(/\.moduleMatrix/);
    expect(css).toMatch(/grid-template-columns:\s*repeat\(4,/);
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

  it("programmes index uses category-led discovery, not an eight-cell matrix", () => {
    const discovery = read("src/components/programs/pulse/ProgrammeDiscovery.tsx");
    expect(discovery).toMatch(/data-programme-pairs/);
    expect(discovery).toMatch(/data-chapter="train"/);
    expect(discovery).toMatch(/data-chapter="move"/);
    expect(discovery).toMatch(/For Teams/);
    expect(discovery).toMatch(/functional-training/);
    expect(discovery).toMatch(/home-personal-training/);
    expect(discovery).toMatch(/online-training/);
    expect(discovery).toMatch(/zumba/);
    expect(discovery).toMatch(/yoga/);
    expect(discovery).toMatch(/adult-dance/);
    expect(discovery).toMatch(/corporate-wellness/);
    expect(discovery).toMatch(/wedding-choreography/);
    expect(discovery).not.toMatch(/pairSequence/);
    expect(discovery).not.toMatch(/pairBand/);
    expect(discovery).not.toMatch(/shortDescription/);
    expect(discovery).not.toMatch(/data-matrix="train"/);
    expect(discovery).not.toMatch(/layout=\{isFeatured \? "featured" : "cell"\}/);
    const css = read("src/components/programs/pulse/programme-pulse.module.css");
    expect(css).toMatch(/grid-template-columns:\s*repeat\(12,/);
    expect(css).toMatch(/aspect-ratio:\s*4 \/ 3/);
    expect(css).toMatch(/aspect-ratio:\s*1 \/ 1/);
    expect(css).not.toMatch(/\.pairBand/);
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

  it("programme related + locations share one discovery composition", () => {
    const view = read("src/components/programs/pulse/ProgrammeDetailView.tsx");
    expect(view).toMatch(/relatedDiscovery/);
    expect(view).toMatch(/relatedStudio/);
    expect(view).toMatch(/relatedFrame/);
    expect(view).toMatch(/Find a studio/);
    expect(view).toMatch(
      /relatedFrame[\s\S]*relatedIndex[\s\S]*<\/ul>[\s\S]*<\/div>[\s\S]*relatedStudio/,
    );
    const css = read("src/components/programs/pulse/programme-pulse.module.css");
    expect(css).toMatch(/\.relatedFrame \{/);
    expect(css).toMatch(/\.relatedStudio \{/);
    expect(css).toMatch(/\.relatedFrame \+ \.relatedStudio \{/);
    expect(css).toMatch(/grid-template-columns:\s*max-content minmax\(0,\s*1fr\) auto/);
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
