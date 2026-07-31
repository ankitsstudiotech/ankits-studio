import { z } from "zod";

// Kept in their own module (no other schema file) so programme.ts and
// branch.ts can both reference the other domain's slug without a circular
// import between the two.

export const programmeSlugSchema = z.enum([
  "strength-training",
  "personal-training",
  "yoga",
  "zumba",
  "adult-dance",
  "kids-dance",
  "weight-loss-fitness",
]);
export type ProgrammeSlug = z.infer<typeof programmeSlugSchema>;

export const branchSlugSchema = z.enum(["airoli", "ghansoli", "thane"]);
export type BranchSlug = z.infer<typeof branchSlugSchema>;
