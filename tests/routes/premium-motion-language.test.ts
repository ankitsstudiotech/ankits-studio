import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { toneFromProgrammeSlug, EASE, DURATION } from "@/components/motion/tokens";

function read(rel: string) {
  return readFileSync(join(process.cwd(), rel), "utf8");
}

describe("premium motion language — Stage 3", () => {
  it("defines semantic motion tokens and easings", () => {
    const css = read("src/styles/motion.css");
    expect(css).toMatch(/--motion-instant/);
    expect(css).toMatch(/--motion-hero/);
    expect(css).toMatch(/--ease-enter/);
    expect(css).toMatch(/--ease-exit/);
    expect(css).toMatch(/--ease-emphasis/);
    expect(DURATION.hero).toBeLessThanOrEqual(0.9);
    expect(EASE.enter).toHaveLength(4);
  });

  it("maps programme slugs to explicit motion tones (not title casing)", () => {
    expect(toneFromProgrammeSlug("functional-training")).toBe("structured");
    expect(toneFromProgrammeSlug("yoga")).toBe("calm");
    expect(toneFromProgrammeSlug("zumba")).toBe("fluid");
    expect(toneFromProgrammeSlug("adult-dance")).toBe("expressive");
    expect(toneFromProgrammeSlug("wedding-choreography")).toBe("ceremonial");
    expect(toneFromProgrammeSlug("home-personal-training")).toBe("direct");
    expect(toneFromProgrammeSlug("online-training")).toBe("remote");
  });

  it("programme rows use scaleX cues and data-motion-tone", () => {
    const row = read("src/components/programs/ProgrammeRow.tsx");
    const css = read("src/components/programs/programme-row.module.css");
    expect(row).toMatch(/data-motion-tone/);
    expect(row).toMatch(/programme-cue/);
    expect(row).not.toMatch(/cueSeg|cueFine/);
    expect(css).toMatch(/scaleX/);
    expect(css).not.toMatch(/\.row:hover \.cue \{\s*width:/);
    expect(css).not.toMatch(/cueSeg|cueFine/);
  });

  it("hero uses MaskedLines and CSS-timed hierarchy (no wrapping HeroReveal)", () => {
    const hero = read("src/components/home/Hero.tsx");
    expect(hero).toMatch(/MaskedLines/);
    expect(hero).toMatch(/titleLines/);
    expect(hero).toMatch(/hero-support/);
    expect(hero).not.toMatch(/HeroReveal/);
  });

  it("motion CSS keeps headline lines visible while motion-pending and respects prm", () => {
    const css = read("src/styles/motion.css");
    expect(css).toMatch(/html\.motion-pending \.hero-masked-title \.motion-mask-inner/);
    expect(css).toMatch(/html\.prm/);
    expect(css).toMatch(/pulse-mask-rise-soft/);
  });

  it("keeps first hero headline line and support visible for LCP", () => {
    const css = read("src/styles/motion.css");
    expect(css).toMatch(/motion-mask-line:first-child[\s\S]{0,120}animation:\s*none/);
    expect(css).toMatch(/motion-mask-line:not\(:first-child\)[\s\S]{0,160}pulse-mask-rise-soft/);
    expect(css).toMatch(/html\.motion-ready \.hero-support[\s\S]{0,120}animation:\s*none/);
    expect(css).toMatch(/html\.motion-pending \.hero-support[\s\S]{0,80}opacity:\s*1/);
  });

  it("mobile nav animates panel with CSS and reduced-motion support", () => {
    const nav = read("src/components/layout/MobileNav.tsx");
    expect(nav).not.toMatch(/from ["']motion\/react["']/);
    expect(nav).toMatch(/motion-reduce:transition-none/);
    expect(nav).toMatch(/translate-x-full|translate-x-0/);
    expect(nav).toMatch(/duration-\[var\(--motion-menu-open\)\]/);
  });

  it("reduced-motion policy zeros motion durations in CSS", () => {
    const css = read("src/styles/motion.css");
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(css).toMatch(/--motion-hero:\s*0ms/);
  });
});
