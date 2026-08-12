/**
 * Studio Pulse motion contract — JS twin of CSS tokens in motion.css.
 * Prefer compositor-friendly transform/opacity/clip-path.
 */

export const EASE = {
  /** Quick decisive exit / press recovery */
  exit: [0.4, 0, 1, 1] as [number, number, number, number],
  /** Smooth editorial enter */
  enter: [0.23, 1, 0.32, 1] as [number, number, number, number],
  /** Slightly expressive emphasis (hovers, cues) */
  emphasis: [0.16, 1, 0.3, 1] as [number, number, number, number],
  /** Standard UI */
  standard: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
} as const;

/** Durations in seconds for Motion */
export const DURATION = {
  instant: 0.12,
  fast: 0.18,
  base: 0.26,
  slow: 0.42,
  hero: 0.72,
  section: 0.44,
  sticky: 0.2,
  menuOpen: 0.28,
  menuClose: 0.18,
} as const;

export const DISTANCE = {
  copy: 12,
  pair: 16,
  cue: 4,
  press: 0.985,
  ctaPress: 0.98,
} as const;

export type MotionTone =
  | "structured"
  | "fluid"
  | "calm"
  | "expressive"
  | "ceremonial"
  | "direct"
  | "remote";

/** Cue / intro timing personality — one component family, tone-driven CSS vars. */
export const MOTION_TONE_CSS: Record<
  MotionTone,
  { durationMs: number; ease: string; cueScale: number }
> = {
  structured: { durationMs: 200, ease: "var(--ease-emphasis)", cueScale: 1.55 },
  fluid: { durationMs: 260, ease: "var(--ease-enter)", cueScale: 1.7 },
  calm: { durationMs: 320, ease: "var(--ease-enter)", cueScale: 1.35 },
  expressive: { durationMs: 240, ease: "var(--ease-emphasis)", cueScale: 1.85 },
  ceremonial: { durationMs: 360, ease: "var(--ease-enter)", cueScale: 1.45 },
  direct: { durationMs: 180, ease: "var(--ease-standard)", cueScale: 1.4 },
  remote: { durationMs: 200, ease: "var(--ease-standard)", cueScale: 1.3 },
};

export function toneFromProgrammeSlug(slug: string): MotionTone {
  switch (slug) {
    case "functional-training":
      return "structured";
    case "home-personal-training":
      return "direct";
    case "online-training":
      return "remote";
    case "zumba":
      return "fluid";
    case "yoga":
      return "calm";
    case "adult-dance":
      return "expressive";
    case "wedding-choreography":
      return "ceremonial";
    case "corporate-wellness":
      return "ceremonial";
    default:
      return "structured";
  }
}
