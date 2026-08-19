import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { resolveSlotMedia } from "@/content/media";

const SHOTS = join(process.cwd(), "docs/revamp/screenshots");

function pngHeader(filePath: string) {
  const buf = readFileSync(filePath);
  expect(buf.length).toBeGreaterThan(1024);
  expect(buf.readUInt32BE(0)).toBe(0x89504e47);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), bytes: buf.length };
}

describe("AI media comparison integrity", () => {
  it("fixed before/after comparison sheets decode and exceed minimum size", () => {
    for (const file of [
      "final-production-ai-media-comparison-390-fixed.png",
      "final-production-ai-media-comparison-1440-fixed.png",
      "programme-family-ai-production-comparison-fixed.png",
      "programme-family-ai-production-comparison-final.png",
    ]) {
      const abs = join(SHOTS, file);
      expect(existsSync(abs), file).toBe(true);
      const meta = pngHeader(abs);
      expect(meta.width).toBeGreaterThan(400);
      expect(meta.height).toBeGreaterThan(400);
      expect(meta.bytes).toBeGreaterThan(120_000);
    }
  });

  it("screenshot integrity report passes for route captures", () => {
    const reportPath = join(process.cwd(), "docs/revamp/AI-MEDIA-SCREENSHOT-INTEGRITY.json");
    expect(existsSync(reportPath)).toBe(true);
    const report = JSON.parse(readFileSync(reportPath, "utf8"));
    expect(report.allPass).toBe(true);
    expect(report.totalChecked).toBeGreaterThanOrEqual(57);
  });
});

describe("Corporate Wellness illustrative media", () => {
  it("resolves the owner-approved workplace wellness hero", () => {
    const hero = resolveSlotMedia("programme.corporate-wellness.hero");
    expect(hero).not.toBeNull();
    expect(hero?.status).toBe("illustrative-ai");
    expect(hero?.verifiedRealOnly).toBeUndefined();
    expect(hero?.focalPoint).toEqual({ x: 50, y: 44 });
    expect(hero?.mobileFocalPoint).toEqual({ x: 50, y: 40 });
    expect(hero?.tabletFocalPoint).toEqual({ x: 50, y: 44 });
  });
});

describe("comparison generator root cause documented", () => {
  it("records file:// path failure as historical root cause; fixed composer uses data URLs", () => {
    const broken = readFileSync(
      join(process.cwd(), "docs/revamp/_create-ai-media-comparison.mjs"),
      "utf8",
    );
    expect(broken).toMatch(/file:\/\//);
    const fixed = readFileSync(
      join(process.cwd(), "docs/revamp/_compose-ai-media-comparisons-fixed.mjs"),
      "utf8",
    );
    expect(fixed).toMatch(/data:image\/png;base64/);
    expect(fixed).not.toMatch(/src="file:\/\/\//);
  });
});
