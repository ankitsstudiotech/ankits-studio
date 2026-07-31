import { z } from "zod";
import { provenanced } from "./provenance";
import { branchSlugSchema, programmeSlugSchema } from "./slugs";

/**
 * Semantic family, not a raw design token — see DECISIONS.md ADR-012. The
 * design-tokens track maps each family to actual CSS tokens; content never
 * names a token value directly.
 */
export const programmeAccentFamilySchema = z.enum([
  "strength",
  "calm",
  "high-energy",
]);
export type ProgrammeAccentFamily = z.infer<typeof programmeAccentFamilySchema>;

export const programmeDifficultySchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
  "all-levels",
]);
export type ProgrammeDifficulty = z.infer<typeof programmeDifficultySchema>;

/**
 * `whoItsFor`/`classStructure`/`benefits`/`difficulty`/`requiredEquipment`
 * are general, category-level descriptions of what the programme involves
 * — the same kind of content as the pre-existing `shortDescription`/
 * `longDescription` fields, not a specific, owner-verifiable business fact
 * (unlike price, a trainer's real name, or a branch address). Consistent
 * with the precedent already set by those two fields (see
 * docs/BUSINESS-DATA-STATUS.md: "Names/descriptions of *what programmes
 * exist* are real"), these stay on the `verified` Programme record rather
 * than forcing it to `mock` — see docs/HANDOFF-ROUTES.md for the full
 * reasoning. `requiredEquipment` may be an empty array, meaning "none".
 */
export const programmeSchema = provenanced({
  slug: programmeSlugSchema,
  name: z.string().min(1),
  shortDescription: z.string().min(1),
  longDescription: z.string().min(1),
  audienceTags: z.array(z.string()),
  branchSlugs: z.array(branchSlugSchema),
  heroAccent: programmeAccentFamilySchema,
  whoItsFor: z.string().min(1),
  classStructure: z.string().min(1),
  benefits: z.array(z.string()).min(1),
  difficulty: programmeDifficultySchema,
  requiredEquipment: z.array(z.string()),
});
export type Programme = z.infer<typeof programmeSchema>;
