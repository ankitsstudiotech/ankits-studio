import { z } from "zod";
import { provenanced } from "./provenance";
import { branchSlugSchema, programmeSlugSchema } from "./slugs";

/**
 * Semantic family, not a raw design token — see DECISIONS.md ADR-012.
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
 * Discovery taxonomy clusters (homepage + /programs index).
 * Distinct from Stage 5 page-composition families (structured/fluid/calm/service).
 */
export const programmeClusterSchema = z.enum(["train", "move", "celebrate", "teams"]);
export type ProgrammeCluster = z.infer<typeof programmeClusterSchema>;

/**
 * Confirmed service taxonomy fields live alongside legacy description fields.
 * Prefer owner-confirmed facts; leave unanswered details pending rather than inventing.
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
  deliveryMode: z.enum(["in-studio", "home", "online"]).optional(),
  /**
   * Legacy brief programmes that conflict with the 2026-08-01 owner catalogue
   * stay reachable until Ankit confirms keep / rename / redirect.
   */
  taxonomyStatus: z.enum(["confirmed", "migration-pending"]).optional(),
  /** Editorial cluster for discovery — does not replace the service name. */
  serviceCluster: programmeClusterSchema.optional(),
  /** Free trial is owner-confirmed for studio services. */
  trialAvailable: z.boolean().optional(),
  pricingStatus: z.enum(["pending", "published"]).optional(),
  batchScheduleStatus: z.enum(["pending", "published"]).optional(),
  mediaSlotKey: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  relatedProgrammeSlugs: z.array(programmeSlugSchema).optional(),
  /** Audience attributes — not separate services. */
  ladiesOnlyBatchesAvailable: z.boolean().optional(),
  kidsOnlyBatchesAvailable: z.boolean().optional(),
  /** Honest FAQ entries owned by the programme record. */
  faqEntries: z
    .array(
      z.object({
        id: z.string().min(1),
        question: z.string().min(1),
        answer: z.string().min(1),
      }),
    )
    .optional(),
  /** Suggested enquiry relatives while taxonomy is pending (not redirects). */
  taxonomyRelatedSlug: programmeSlugSchema.optional(),
});
export type Programme = z.infer<typeof programmeSchema>;
