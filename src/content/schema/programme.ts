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

export const programmeSchema = provenanced({
  slug: programmeSlugSchema,
  name: z.string().min(1),
  shortDescription: z.string().min(1),
  longDescription: z.string().min(1),
  audienceTags: z.array(z.string()),
  branchSlugs: z.array(branchSlugSchema),
  heroAccent: programmeAccentFamilySchema,
});
export type Programme = z.infer<typeof programmeSchema>;
