import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const EVIDENCE = join(process.cwd(), "docs/revamp/screenshots/stage-3-ai-cls-correction");

function pngHeader(filePath: string) {
  const buf = readFileSync(filePath);
  expect(buf.readUInt32BE(0)).toBe(0x89504e47);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), bytes: buf.length };
}

describe("screenshot dimension integrity — CLS correction evidence", () => {
  it("Home full-page captures match requested CSS widths exactly", () => {
    const cases = [
      ["home-390.png", 390],
      ["home-768.png", 768],
      ["home-1440.png", 1440],
      ["home-1920.png", 1920],
    ] as const;
    for (const [file, width] of cases) {
      const abs = join(EVIDENCE, file);
      expect(existsSync(abs), file).toBe(true);
      const meta = pngHeader(abs);
      expect(meta.width, file).toBe(width);
    }
  });

  it("final CLS evidence Home captures match requested CSS widths exactly", () => {
    const finalDir = join(process.cwd(), "docs/revamp/screenshots/stage-3-ai-cls-final");
    const cases = [
      ["home-390.png", 390],
      ["home-1440.png", 1440],
      ["home-1920.png", 1920],
    ] as const;
    for (const [file, width] of cases) {
      const abs = join(finalDir, file);
      expect(existsSync(abs), file).toBe(true);
      const meta = pngHeader(abs);
      expect(meta.width, file).toBe(width);
    }
  });

  it("Corporate Wellness AI-final captures match requested CSS widths exactly", () => {
    const dir = join(process.cwd(), "docs/revamp/screenshots/corporate-wellness-ai-final");
    const cases = [
      ["full-390.png", 390],
      ["full-768.png", 768],
      ["full-1024.png", 1024],
      ["full-1440.png", 1440],
      ["full-1920.png", 1920],
      ["viewport-390x844.png", 390],
      ["viewport-768x1024.png", 768],
      ["viewport-1440x900.png", 1440],
    ] as const;
    for (const [file, width] of cases) {
      const abs = join(dir, file);
      expect(existsSync(abs), file).toBe(true);
      const meta = pngHeader(abs);
      expect(meta.width, file).toBe(width);
    }
  });

  it("Google Reviews final captures match requested CSS widths exactly", () => {
    const dir = join(process.cwd(), "docs/revamp/screenshots/google-reviews-final");
    const cases = [
      ["home-390.png", 390],
      ["home-768.png", 768],
      ["home-1440.png", 1440],
      ["home-1920.png", 1920],
      ["viewport-390x844.png", 390],
      ["viewport-768x1024.png", 768],
      ["viewport-1440x900.png", 1440],
      ["corporate-wellness-sticky-390x844.png", 390],
    ] as const;
    for (const [file, width] of cases) {
      const abs = join(dir, file);
      expect(existsSync(abs), file).toBe(true);
      const meta = pngHeader(abs);
      expect(meta.width, file).toBe(width);
    }
  });

  it("Production Bug Batch 01 captures match requested CSS widths", () => {
    const dir = join(process.cwd(), "docs/revamp/screenshots/production-bug-batch-01");
    const cases = [
      ["after-390x844-home.png", 390],
      ["after-768x1024-home.png", 768],
      ["after-1440x900-home.png", 1440],
      ["after-1536-home-hero.png", 1536],
      ["after-1920x1080-home.png", 1920],
      ["wide-layout-before-after.png", 1800],
    ] as const;
    for (const [file, width] of cases) {
      const abs = join(dir, file);
      expect(existsSync(abs), file).toBe(true);
      const meta = pngHeader(abs);
      expect(meta.width, file).toBe(width);
    }
  });

  it("Production Bug Batch 02 captures match requested CSS widths", () => {
    const dir = join(process.cwd(), "docs/revamp/screenshots/production-bug-batch-02");
    const cases = [
      ["after-390x844-home.png", 390],
      ["after-768x1024-home.png", 768],
      ["after-1440x900-home.png", 1440],
      ["after-1920x1080-home.png", 1920],
      ["programme-cue-before-after.png", 1800],
      ["programme-cue-final-matrix.png", 1600],
    ] as const;
    for (const [file, width] of cases) {
      const abs = join(dir, file);
      expect(existsSync(abs), file).toBe(true);
      const meta = pngHeader(abs);
      expect(meta.width, file).toBe(width);
    }
  });

  it("Batch 04 dead-space row redesign comparison sheet is 1800 CSS px wide", () => {
    const abs = join(
      process.cwd(),
      "docs/revamp/screenshots/batch-04-dead-space-row-redesign/row-list-before-after-critical.png",
    );
    expect(existsSync(abs)).toBe(true);
    const meta = pngHeader(abs);
    expect(meta.width).toBe(1800);
  });

  it("Batch 04 after section clips at 1536 match the viewport width", () => {
    const dir = join(process.cwd(), "docs/revamp/screenshots/batch-04-dead-space-row-redesign");
    const cases = [
      "after-home-programmes-1536x730.png",
      "after-home-branches-1536x730.png",
      "after-programs-index-1536x730.png",
      "after-branch-available-1536x730.png",
    ] as const;
    for (const file of cases) {
      const abs = join(dir, file);
      expect(existsSync(abs), file).toBe(true);
      expect(pngHeader(abs).width, file).toBe(1536);
    }
  });

  it("Batch 05 comparison sheets are 1800 CSS px wide", () => {
    const dir = join(process.cwd(), "docs/revamp/screenshots/batch-05-hero-narrative-composition");
    for (const file of [
      "batch-05-about-founder-before-after.png",
      "batch-05-branch-heroes-before-after.png",
      "batch-05-programme-hero-audit.png",
    ] as const) {
      const abs = join(dir, file);
      expect(existsSync(abs), file).toBe(true);
      expect(pngHeader(abs).width, file).toBe(1800);
    }
  });

  it("Batch 05 after hero clips at 1536 match the viewport width", () => {
    const dir = join(process.cwd(), "docs/revamp/screenshots/batch-05-hero-narrative-composition");
    const cases = [
      "after-about-hero-1536x730.png",
      "after-home-founder-1536x730.png",
      "after-branch-airoli-19-1536x730.png",
      "after-yoga-hero-1536x730.png",
    ] as const;
    for (const file of cases) {
      const abs = join(dir, file);
      expect(existsSync(abs), file).toBe(true);
      expect(pngHeader(abs).width, file).toBe(1536);
    }
  });

  it("integrity JSON fails the pack when a PNG width does not match the viewport", () => {
    const reportPath = join(process.cwd(), "docs/revamp/AI-MEDIA-SCREENSHOT-INTEGRITY.json");
    expect(existsSync(reportPath)).toBe(true);
    const report = JSON.parse(readFileSync(reportPath, "utf8"));
    expect(report).toHaveProperty("exactWidthCount");
    for (const row of report.results) {
      if (row.width != null && row.expectedWidth != null) {
        expect(row.width, row.file).toBe(row.expectedWidth);
        expect(row.widthMatches, row.file).toBe(true);
      }
    }
  });
});
