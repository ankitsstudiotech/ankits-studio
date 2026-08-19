import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function read(rel: string) {
  return readFileSync(join(process.cwd(), rel), "utf8");
}

describe("programme cue and divider grammar — Bug Batch 02", () => {
  it("defines one shared programme-cue primitive in Studio Pulse tokens", () => {
    const tokens = read("src/styles/tokens.css");
    const studio = read("src/styles/studio.css");
    expect(tokens).toMatch(/--cue-length:\s*2\.35rem/);
    expect(tokens).toMatch(/--cue-thickness:\s*2px/);
    expect(tokens).toMatch(/--cue-hover-scale:\s*1\.9/);
    expect(studio).toMatch(/\.programme-cue\s*\{/);
    expect(studio).toMatch(/background:\s*var\(--color-accent\)/);
  });

  it("ProgrammeRow ships exactly one cue with no segments or second line", () => {
    const row = read("src/components/programs/ProgrammeRow.tsx");
    const css = read("src/components/programs/programme-row.module.css");
    expect(row).toMatch(/programme-cue/);
    expect(row.match(/data-motion-cue/g)?.length).toBe(1);
    expect(row).not.toMatch(/cueSeg|cueFine|data-seg/);
    expect(css).not.toMatch(/cueSeg|cueFine|data-cluster="move"|accent-calm|accent-warm|accent-high-energy/);
    expect(css).toMatch(/scaleX\(var\(--cue-hover-scale\)\)/);
    expect(css).toMatch(/border-bottom:\s*var\(--rule-structural-width\)\s+solid\s+var\(--rule-structural\)/);
  });

  it("detail and leftover lane cues reuse the shared primitive without colour forks", () => {
    const pulse = read("src/components/programs/pulse/programme-pulse.module.css");
    const detail = read("src/components/programs/pulse/ProgrammeDetailView.tsx");
    expect(detail).toMatch(/programme-cue/);
    expect(pulse).not.toMatch(/lane\[data-tempo="yoga"\] \.cue/);
    expect(pulse).not.toMatch(/lane\[data-tempo="zumba"\] \.cue/);
    expect(pulse).not.toMatch(/detailHero\[data-motion-tone="calm"\] \.detailAccent/);
    expect(pulse).not.toMatch(/detailHero\[data-motion-tone="ceremonial"\] \.detailAccent/);
  });
});
