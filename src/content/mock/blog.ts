import type { BlogPost } from "../schema";

/**
 * Sample articles exist only to exercise blog route architecture.
 * They are mock, clearly labelled, and must remain noindex (see blog
 * generateMetadata). Not owner-approved editorial content.
 */
export const mockBlogPosts: BlogPost[] = [
  {
    dataStatus: "mock",
    mockDisclaimer:
      "Sample article for layout and routing only — not owner-approved editorial content. Do not treat as studio advice.",
    slug: "sample-starting-with-strength",
    title: "Sample: Starting with strength training",
    excerpt:
      "Illustrative sample post about approaching coached strength work as a beginner. Placeholder copy for the blog route shell.",
    body: [
      "This is sample article body copy used to verify the blog detail route.",
      "",
      "It is not coaching advice, not an owner-approved story, and not a claim about Ankit's Studio programmes.",
      "",
      "Replace with verified editorial content before any public indexation.",
    ].join("\n"),
    publishedAt: "2026-01-15",
    programmeSlugs: ["strength-training"],
  },
  {
    dataStatus: "mock",
    mockDisclaimer:
      "Sample article for layout and routing only — not owner-approved editorial content. Do not treat as studio advice.",
    slug: "sample-finding-your-first-class",
    title: "Sample: Finding your first class",
    excerpt:
      "Illustrative sample post about choosing a first visit. Placeholder copy for the blog route shell.",
    body: [
      "This second sample article exists so the blog index can show more than one card.",
      "",
      "No schedules, fees, or outcomes in this copy should be read as real studio information.",
      "",
      "Legal and editorial review are required before launch.",
    ].join("\n"),
    publishedAt: "2026-02-01",
    programmeSlugs: ["yoga", "zumba"],
  },
];
