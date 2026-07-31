import type { Transformation } from "../schema";

/**
 * Summaries are deliberately qualitative — no specific percentages, kg, or
 * duration claims that could read as a verifiable real result. See
 * docs/BUSINESS-DATA-STATUS.md ("no fabricated transformation numbers").
 */
export const mockTransformations: Transformation[] = [
  {
    dataStatus: "mock",
    mockDisclaimer:
      "Illustrative example only — describes the kind of outcome a programme is designed for, not a real member's result.",
    slug: "illustrative-strength-journey",
    programmeSlug: "strength-training",
    summary:
      "An illustrative example of the kind of strength and consistency gains this programme is designed to build over a sustained training block.",
  },
  {
    dataStatus: "mock",
    mockDisclaimer:
      "Illustrative example only — describes the kind of outcome a programme is designed for, not a real member's result.",
    slug: "illustrative-fitness-journey",
    programmeSlug: "weight-loss-fitness",
    summary:
      "An illustrative example of the kind of general fitness and energy improvements this programme is designed to support.",
  },
];
