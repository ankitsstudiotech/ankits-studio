import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getConfirmedProgrammes, getPubliclyListedBranches } from "@/content";

function read(rel: string) {
  return readFileSync(join(process.cwd(), rel), "utf8");
}

describe("Batch 06 — closing conversion family", () => {
  it("uses one shared ClosingBand primitive with copy-left action-right composition", () => {
    const band = read("src/components/conversion/ClosingBand.tsx");
    const css = read("src/components/conversion/closing-band.module.css");
    expect(band).toMatch(/data-compose="closing-band"/);
    expect(band).toMatch(/variant === "accent"/);
    expect(css).toMatch(/grid-template-columns:\s*minmax\(0,\s*1fr\)\s+auto/);
    expect(css).not.toMatch(/width:\s*100%[\s\S]{0,80}button/);
    expect(css).toMatch(/\.accent \.actionPrimary :global\(a\)/);
  });

  it("Home trial, programmes, branches, About, trainers and stories share ClosingBand", () => {
    expect(read("src/components/home/FreeTrialCta.tsx")).toMatch(/ClosingBand/);
    expect(read("src/components/programs/pulse/ProgrammeDetailView.tsx")).toMatch(/ClosingBand/);
    expect(read("src/components/locations/pulse/BranchDetailView.tsx")).toMatch(/ClosingBand/);
    expect(read("src/app/(marketing)/about/page.tsx")).toMatch(/ClosingBand/);
    expect(read("src/app/(marketing)/trainers/page.tsx")).toMatch(/Ask about availability/);
    expect(read("src/app/(marketing)/transformations/page.tsx")).toMatch(/ClosingBand/);
  });

  it("preserves Corporate Wellness enquiry copy and Home purple accent identity", () => {
    const detail = read("src/components/programs/pulse/ProgrammeDetailView.tsx");
    expect(detail).toMatch(/serviceEnquiry\s*\?\s*"Planning wellness for your team\?"/);
    expect(detail).toMatch(/isServiceEnquiryProgramme/);
    const home = read("src/components/home/FreeTrialCta.tsx");
    expect(home).toMatch(/variant = "accent"/);
    expect(home).toMatch(/Free trial class/);
  });
});

describe("Batch 06 — content-aware facts and includes", () => {
  it("glance facts use data-count layout without placeholder cells", () => {
    const detail = read("src/components/programs/pulse/ProgrammeDetailView.tsx");
    const css = read("src/components/programs/pulse/programme-pulse.module.css");
    expect(detail).toMatch(/data-count=\{glancePanels\.length\}/);
    expect(detail).not.toMatch(/empty fact|placeholder fact|nbsp;{4}/i);
    expect(css).toMatch(/\.snapshotFacts\[data-count="3"\]/);
    expect(css).toMatch(/\.includeList \{[^}]*columns:\s*1/);
    expect(css).not.toMatch(/\.includeList \{[^}]*grid-template-columns/);
  });

  it("does not invent extra glance facts beyond who / session / options", () => {
    const detail = read("src/components/programs/pulse/ProgrammeDetailView.tsx");
    expect(detail).toMatch(/Who it’s for/);
    expect(detail).toMatch(/label: "Session"/);
    expect(detail).toMatch(/label: "Options"/);
    expect(detail).not.toMatch(/glancePanels\.push\(\{ label: "Trial"/);
  });

  it("confirmed programmes have variable benefit counts rather than a padded grid", () => {
    const counts = getConfirmedProgrammes().map((programme) => programme.benefits.length);
    expect(new Set(counts).size).toBeGreaterThan(1);
    expect(counts.every((count) => count > 0)).toBe(true);
  });
});

describe("Batch 06 — thin FAQs and residual duplication", () => {
  it("FaqBlock never titles a one-question chapter FAQ", () => {
    const block = read("src/components/content/FaqBlock.tsx");
    expect(block).toMatch(/items\.length === 1/);
    expect(block).toMatch(/Good to know/);
    expect(block).toMatch(/items\.length === 0\) return null/);
  });

  it("About team is a full-width editorial chapter with media, not a 50/50 FAQ pair", () => {
    const about = read("src/app/(marketing)/about/page.tsx");
    expect(about).toMatch(/teamChapter/);
    expect(about).toMatch(/data-has-media/);
    expect(about).not.toMatch(/about-faq-machine-free/);
  });

  it("branch pages drop the one-item ladies/kids FAQ that duplicates batch guidance", () => {
    const branch = read("src/components/locations/pulse/BranchDetailView.tsx");
    expect(branch).not.toMatch(/FaqBlock/);
    expect(branch).toMatch(/Ladies-only/);
    expect(getPubliclyListedBranches().every((item) => item.faqEntries.length > 0)).toBe(true);
  });

  it("Getting Here no longer repeats hero Since / Station / Landmark labels", () => {
    const branch = read("src/components/locations/pulse/BranchDetailView.tsx");
    expect(branch).toMatch(/<dt>Since<\/dt>/);
    expect(branch).toMatch(/<dt>Landmark<\/dt>/);
    expect(branch).toMatch(/<dt>Station<\/dt>/);
    expect(branch).toMatch(/On arrival/);
    expect(branch).not.toMatch(/Studio since/);
    expect(branch).not.toMatch(/Nearest station/);
  });

  it("Home founder leads with the name, not a giant 2019 numeral", () => {
    const founder = read("src/components/home/FounderHomeMoment.tsx");
    expect(founder).toMatch(/Founder · since/);
    expect(founder).toMatch(/Founded in Airoli/);
    expect(founder).not.toMatch(/founderYear/);
    const css = read("src/components/home/pulse/pulse-home.module.css");
    expect(css).not.toMatch(/\.founderYear/);
  });

  it("related discovery uses a compact Find a studio track, not a directory card", () => {
    const detail = read("src/components/programs/pulse/ProgrammeDetailView.tsx");
    const css = read("src/components/programs/pulse/programme-pulse.module.css");
    expect(detail).toMatch(/Train near you/);
    expect(detail).toMatch(/Find a studio/);
    expect(css).toMatch(/minmax\(10rem,\s*13\.5rem\)/);
  });
});
