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
