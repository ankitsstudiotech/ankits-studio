import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function read(rel: string) {
  return readFileSync(join(process.cwd(), rel), "utf8");
}

describe("global recurrence grammar — Bug Batch 03", () => {
  it("keeps structural dividers as 1px solid neutral tokens in Pulse modules", () => {
    const files = [
      "src/styles/studio.css",
      "src/components/programs/programme-row.module.css",
      "src/components/locations/branch-row.module.css",
      "src/components/locations/pulse/location-pulse.module.css",
      "src/components/programs/pulse/programme-pulse.module.css",
      "src/components/home/pulse/pulse-home.module.css",
      "src/components/about/pulse/about.module.css",
    ];
    for (const file of files) {
      const css = read(file);
      expect(css, file).not.toMatch(/border-(?:top|bottom):\s*[^;]*dashed/);
      expect(css, file).not.toMatch(/\.programme-cue[^{]*\{[^}]*dashed/);
    }
    const studio = read("src/styles/studio.css");
    expect(studio).toMatch(/--rule-structural-width\)\s+solid\s+var\(--rule-structural\)/);
    expect(studio).toMatch(/\.pulse-related-pair/);
    expect(studio).toMatch(/width:\s*auto/);
    expect(read("src/components/about/pulse/about.module.css")).not.toMatch(
      /border-top-width:\s*2px/,
    );
    expect(read("src/components/programs/pulse/programme-pulse.module.css")).not.toMatch(
      /relatedList a:hover[\s\S]{0,80}border-bottom-color/,
    );
  });

  it("does not pin related location/about rows with space-between", () => {
    const location = read("src/components/locations/pulse/location-pulse.module.css");
    expect(location).not.toMatch(/\.serviceList a[\s\S]*justify-content:\s*space-between/);
    const about = read("src/components/about/pulse/about.module.css");
    expect(about).not.toMatch(/\.disciplineIndex a[\s\S]*justify-content:\s*space-between/);
    const detail = read("src/components/locations/pulse/BranchDetailView.tsx");
    expect(detail).toMatch(/serviceIndex/);
    expect(detail).not.toMatch(/pulse-related-pair/);
    const aboutPage = read("src/app/(marketing)/about/page.tsx");
    expect(aboutPage).toMatch(/disciplineLink/);
    expect(aboutPage).not.toMatch(/pulse-related-pair/);
  });

  it("keeps the Batch 02 programme-cue primitive", () => {
    const studio = read("src/styles/studio.css");
    expect(studio).toMatch(/\.programme-cue\s*\{/);
    expect(studio).toMatch(/background:\s*var\(--color-accent\)/);
    const tokens = read("src/styles/tokens.css");
    expect(tokens).toMatch(/--cue-length:\s*2\.35rem/);
    expect(tokens).toMatch(/--cue-thickness:\s*2px/);
  });
});
