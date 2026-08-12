/**
 * Homepage section priorities from owner form 2026-08-12.
 * Recorded for future visual composition — not rendered on `/` in this migration.
 */
export const mockHomepageIntent = {
  sourceDate: "2026-08-12",
  topThree: ["programmes", "branches", "google-reviews"] as const,
  sections: {
    programmes: "yes",
    googleReviews: "yes",
    branches: "yes",
    founder: "yes-compact-later",
    faq: "yes",
    freeTrial: "yes",
    memberStories: "yes-when-consented-data-exists",
    team: "no",
    practicalInformation: "no",
    machineFreeBlock: "not-sure-supporting-copy-only",
    garbaCommunityEvents: "not-sure-defer",
  },
  heroIntent: {
    themes: [
      "approachable fitness",
      "energetic but welcoming",
      "community",
      "personal attention",
      "fitness goals",
      "comfort and confidence",
      "strong workout atmosphere",
    ],
    audienceNote:
      "A large part of the fitness audience is women — copy must remain inclusive; do not imply only women may join.",
    outcomes: "no guaranteed measurable outcomes in hero copy",
  },
  motionPreference: {
    level: "medium-noticeable-restrained",
    likes: [
      "kinetic typography",
      "subtle scroll reveals",
      "programme-specific motion",
      "video hero",
      "animated section transitions",
      "interactive hover/focus",
      "horizontal storytelling",
      "editorial split layouts",
      "large typography",
    ],
    avoid: [
      "neon gym aesthetic",
      "excessive bounce/spin",
      "nightclub visuals",
      "heavy gradients",
      "over-saturation",
      "gimmicky motion",
      "excessive 3D",
      "clutter",
      "accessibility or performance damage",
    ],
  },
} as const;

export type HomepageIntent = typeof mockHomepageIntent;
