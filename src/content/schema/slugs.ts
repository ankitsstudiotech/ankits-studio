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
  /** Owner form 2026-08-12 — full public programme (ADR-022). */
  "corporate-wellness",
]);
export type ProgrammeSlug = z.infer<typeof programmeSlugSchema>;

export const branchSlugSchema = z.enum([
  /** Canonical Sector 19 route — legacy `/locations/airoli` permanently redirects here. */
  "airoli-sector-19",
  "airoli-sector-8",
  "ghansoli",
  "thane",
]);
export type BranchSlug = z.infer<typeof branchSlugSchema>;

/** Retired public slug for Sector 19 — redirect target is `airoli-sector-19`. */
export const LEGACY_AIROLI_SECTOR_19_SLUG = "airoli" as const;
