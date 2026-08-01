import { z } from "zod";
import { provenanced } from "./provenance";
import { ownerSourceSchema } from "./owner-source";

/**
 * Site-wide commercial / audience facts that are not pricing-plan rows and
 * not timetable slots. Operating window lives on Branch.openingHours;
 * detailed batch schedules remain TimetableSlot (still pending).
 */
export const studioCommercialSchema = provenanced({
  trialIsFree: z.boolean(),
  registrationFeeInr: z.number().nonnegative().optional(),
  programmeFeesStatus: z.enum(["pending", "published"]),
  maxGroupBatchSize: z.number().int().positive().optional(),
  ladiesOnlyBatchesAvailable: z.boolean().optional(),
  kidsOnlyBatchesAvailable: z.boolean().optional(),
  enquiriesAcrossAgeGroups: z.boolean().optional(),
  /** Safe differentiator copy — no outcome promises. */
  differentiator: z.string().min(1).optional(),
  /** Owner said 15+ trainers — count only, no quality adjectives. */
  trainerCountNote: z.string().min(1).optional(),
  /**
   * Experience claim left partially confirmed until subject is clarified.
   * Store the raw owner phrase; do not expand into marketing copy.
   */
  experienceNotePartial: z.string().min(1).optional(),
  /**
   * “Grow fitness” commercial priority — meaning still needs clarification.
   */
  commercialPriorityNotePartial: z.string().min(1).optional(),
  ownerSource: ownerSourceSchema.optional(),
});
export type StudioCommercial = z.infer<typeof studioCommercialSchema>;
