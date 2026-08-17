import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getConfirmedProgrammes,
  getPubliclyListedBranches,
  getStudioAbout,
} from "@/content";
import { getPrimaryConversionLabel } from "@/lib/conversion";

const SRC_ROOT = join(process.cwd(), "src");

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, acc);
    else if (/\.(tsx|ts|css|md)$/.test(entry)) acc.push(full);
  }
  return acc;
}

describe("final art-direction content lock", () => {
  it("keeps the eight production programme names", () => {
    expect(getConfirmedProgrammes().map((p) => p.name).sort()).toEqual(
      [
        "Corporate Wellness",
        "Dance",
        "Functional Training",
        "Home Personal Training",
        "Online Training",
        "Wedding Choreography",
        "Yoga",
        "Zumba",
      ].sort(),
    );
  });

  it("keeps the four production branch localities", () => {
    expect(getPubliclyListedBranches().map((b) => b.locality)).toEqual([
      "Airoli Sector 19",
      "Airoli Sector 8",
      "Ghansoli",
      "Thane",
    ]);
  });

  it("keeps production conversion labels (no Claim / Initiate / Protocol)", () => {
    expect(getPrimaryConversionLabel()).toBe("Book a free trial on WhatsApp");
    expect(getStudioAbout().headline.length).toBeGreaterThan(8);
  });

  it("does not leak Variant/Stitch invented copy into application source", () => {
    const files = walk(join(SRC_ROOT, "app")).concat(
      walk(join(SRC_ROOT, "components")),
      walk(join(SRC_ROOT, "content")),
      walk(join(SRC_ROOT, "lib")),
    );
    const leaks = [
      /Movement Culture/,
      /Kickboxing/,
      /Initiate Protocol/,
      /Claim Free Trial/,
      /Yoga & Mindfulness/,
      /Online Coaching/,
      /VIEW MANIFESTO/,
      /BOOK SESSION/,
      /OUR SPECIALITIES/,
    ];
    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      for (const leak of leaks) {
        if (leak.test(text)) hits.push(`${file.replace(process.cwd(), "")}: ${leak}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
