import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { resolveSlotMedia } from "@/content/media";

describe("interim illustrative-ai production gates", () => {
  it("resolves home hero as illustrative-ai without synthetic flag", () => {
    const hero = resolveSlotMedia("home.hero");
    expect(hero?.status).toBe("illustrative-ai");
    expect(hero?.replacementStatus).toBe("replace-after-owner-photoshoot");
  });

  it("resolves corporate wellness hero as owner-approved illustrative-ai", () => {
    const hero = resolveSlotMedia("programme.corporate-wellness.hero");
    expect(hero?.status).toBe("illustrative-ai");
    expect(hero?.source).toBe("ai-generated-illustration");
    expect(hero?.consentStatus).toBe("not-applicable-ai");
    expect(hero?.replacementStatus).toBe("replace-after-owner-photoshoot");
    expect(hero?.src).toBe("/media/synthetic-preview/programme-corporate-wellness-hero-v2-square.webp");
    expect(hero?.alt).toMatch(/Illustrative workplace wellness session/i);
    expect(hero?.alt).not.toMatch(/Ankit’s Studio Corporate Wellness session/i);
  });

  it("never resolves founder or branch hero slots", () => {
    expect(resolveSlotMedia("about.founder")).toBeNull();
    expect(resolveSlotMedia("location.airoli-sector-19.hero")).toBeNull();
  });

  it("footer includes global illustrative disclosure", () => {
    const footer = readFileSync(
      join(process.cwd(), "src", "components", "layout", "SiteFooter.tsx"),
      "utf8",
    );
    expect(footer).toMatch(/illustrative AI-generated imagery/);
    expect(footer).toMatch(/about#visuals/);
  });

  it("editorial frame hides per-image concept label for illustrative-ai", () => {
    const frame = readFileSync(
      join(process.cwd(), "src", "components", "media", "EditorialMediaFrame.tsx"),
      "utf8",
    );
    expect(frame).toMatch(/synthetic-preview/);
    expect(frame).not.toContain("illustrative-ai");
    expect(frame).toMatch(/showSyntheticLabel/);
  });
});
