/**
 * Slots that may never accept synthetic-preview assets.
 */

export const VERIFIED_REAL_ONLY_SLOTS = [
  "about.founder",
  "trainers.portrait",
  "trainers.coaching-action",
  "location.airoli-sector-19.hero",
  "location.airoli-sector-8.hero",
  "location.ghansoli.hero",
  "location.thane.hero",
  "branch.airoli-sector-19",
  "branch.airoli-sector-19.exterior",
  "branch.airoli-sector-19.interior",
  "branch.airoli-sector-8",
  "branch.airoli-sector-8.exterior",
  "branch.airoli-sector-8.interior",
  "branch.ghansoli",
  "branch.ghansoli.exterior",
  "branch.ghansoli.interior",
  "branch.thane",
  "branch.thane.exterior",
  "branch.thane.interior",
  "stories.member-portrait",
  "stories.activity",
  "stories.before-after",
  "stories.video-testimonial",
  "transformations.before",
  "transformations.after",
  "reviews.author",
  "credentials.certification",
] as const;

export type VerifiedRealOnlySlot = (typeof VERIFIED_REAL_ONLY_SLOTS)[number];

const REAL_ONLY = new Set<string>(VERIFIED_REAL_ONLY_SLOTS);

export function isVerifiedRealOnlySlot(slotKey: string): boolean {
  if (REAL_ONLY.has(slotKey)) return true;
  if (slotKey.startsWith("location.") && slotKey.endsWith(".hero")) return true;
  if (slotKey.startsWith("branch.") && !slotKey.includes("class-activity") && !slotKey.includes("community")) {
    return true;
  }
  return false;
}

export function canAcceptSyntheticMedia(slotKey: string): boolean {
  return !isVerifiedRealOnlySlot(slotKey);
}
