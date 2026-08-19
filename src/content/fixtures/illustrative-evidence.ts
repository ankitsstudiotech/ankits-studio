/**
 * Development-only fictional evidence fixtures.
 *
 * NEVER import from production selectors in `src/content/index.ts`.
 * NEVER include in sitemap, metadata, or structured data.
 * NEVER render on marketing routes — including when ALLOW_MOCK_PUBLISH=true.
 * Safe for unit tests and design-lab surfaces that mark content as fictional.
 */

export const ILLUSTRATIVE_EVIDENCE_FIXTURES = {
  status: "fictional_development_only" as const,
  testimonials: [
    {
      id: "illustrative-testimonial-1",
      quote: "Illustrative example: a placeholder quote describing a positive class experience.",
      attributedName: "Illustrative member",
      programmeSlug: "yoga",
      branchSlug: "airoli-sector-19",
      fictional: true as const,
    },
    {
      id: "illustrative-testimonial-2",
      quote: "Illustrative example: a placeholder quote describing a coached strength session.",
      attributedName: "Illustrative member",
      programmeSlug: "strength-training",
      branchSlug: "ghansoli",
      fictional: true as const,
    },
  ],
  journeys: [
    {
      slug: "illustrative-strength-journey",
      programmeSlug: "strength-training",
      summary:
        "An illustrative example of the kind of strength and consistency gains this programme is designed to build over a sustained training block.",
      fictional: true as const,
    },
    {
      slug: "illustrative-fitness-journey",
      programmeSlug: "weight-loss-fitness",
      summary:
        "An illustrative example of the kind of general fitness and energy improvements this programme is designed to support.",
      fictional: true as const,
    },
  ],
} as const;
