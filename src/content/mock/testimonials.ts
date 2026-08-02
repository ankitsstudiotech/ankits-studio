import type { Testimonial } from "../schema";

/**
 * Attributed names deliberately read as illustrative, never as a real,
 * identifiable person — see docs/BUSINESS-DATA-STATUS.md.
 */
export const mockTestimonials: Testimonial[] = [
  {
    dataStatus: "mock",
    mockDisclaimer: "Illustrative example quote — not a real member testimonial.",
    id: "illustrative-testimonial-1",
    quote: "Illustrative example: a placeholder quote describing a positive class experience.",
    attributedName: "Illustrative member",
    programmeSlug: "yoga",
    branchSlug: "airoli-sector-19",
  },
  {
    dataStatus: "mock",
    mockDisclaimer: "Illustrative example quote — not a real member testimonial.",
    id: "illustrative-testimonial-2",
    quote: "Illustrative example: a placeholder quote describing a coached strength session.",
    attributedName: "Illustrative member",
    programmeSlug: "strength-training",
    branchSlug: "ghansoli",
  },
];
