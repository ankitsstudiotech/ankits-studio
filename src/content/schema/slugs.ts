import { z } from "zod";

// Kept in their own module (no other schema file) so programme.ts and
// branch.ts can both reference the other domain's slug without a circular
// import between the two.

export const programmeSlugSchema = z.enum([
  // Legacy brief catalogue — retained pending taxonomy confirmation
  // (see docs/business/OWNER-DATA-MIGRATION-2026-08-01.md).
  "strength-training",
  "personal-training",
  "yoga",
  "zumba",
  "adult-dance",
  "kids-dance",
  "weight-loss-fitness",
  // Owner-interview 2026-08-01 additions (no silent deletes of legacy routes).
  "functional-training",
  "wedding-choreography",
  "home-personal-training",
  "online-training",
]);
export type ProgrammeSlug = z.infer<typeof programmeSlugSchema>;

export const branchSlugSchema = z.enum([
  /** Display: Airoli Sector 19 — slug retained to avoid silent redirect. */
  "airoli",
  "airoli-sector-8",
  "ghansoli",
  "thane",
]);
export type BranchSlug = z.infer<typeof branchSlugSchema>;
