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
  /** Free trial available once per person (owner-confirmed 2026-08-03). */
  trialOncePerPerson: z.boolean().optional(),
  /** Free trial at every physical branch. */
  trialAtEveryPhysicalBranch: z.boolean().optional(),
  /** Free trial for every confirmed service. */
  trialForEveryService: z.boolean().optional(),
  /** Advance booking not compulsory — still recommend WhatsApp check. */
  advanceBookingCompulsory: z.boolean().optional(),
  registrationFeeInr: z.number().nonnegative().optional(),
  /** Registration is per person and not recharged after a membership break. */
  registrationFeeOncePerPersonLifetime: z.boolean().optional(),
  programmeFeesStatus: z.enum(["pending", "published"]),
  /** Owner-confirmed: fees differ by branch; amounts still pending. */
  feesDifferByBranch: z.boolean().optional(),
  /** Owner-confirmed: GST included in supplied prices (amounts still pending). */
  gstIncludedInSuppliedPrices: z.boolean().optional(),
  /** Discounts exist; rules unpublished. */
  discountsAvailableStatus: z.enum(["pending", "published"]).optional(),
  weddingPricingBasis: z.enum(["per_couple", "pending"]).optional(),
  homePtPricingBasis: z.enum(["per_session", "pending"]).optional(),
  onlineTrainingPlatform: z.string().min(1).optional(),
  onlineTrainingFormats: z.array(z.enum(["one-to-one", "group"])).optional(),
  /**
   * Membership policies — owner-confirmed but not final customer-facing legal copy.
   */
  membershipPoliciesStatus: z
    .enum(["owner_confirmed_pending_legal_copy", "published", "pending"])
    .optional(),
  membershipNoCancellation: z.boolean().optional(),
  membershipNoRefund: z.boolean().optional(),
  membershipBranchTransferAllowed: z.boolean().optional(),
  membershipPauseAllowed: z.boolean().optional(),
  /** Ambiguous “Missed classes — No” — do not publish until clarified. */
  missedClassesPolicyStatus: z.enum(["ambiguous", "pending", "published"]).optional(),
  /** Corporate Fitness — confirmed incomplete; enquiry-only (ADR-020). */
  corporateFitnessStatus: z.enum(["enquiry-only", "published", "pending"]).optional(),
  corporateFitnessNote: z.string().min(1).optional(),
  typicalSessionMinutes: z.number().int().positive().optional(),
  maxGroupBatchSize: z.number().int().positive().optional(),
  ladiesOnlyBatchesAvailable: z.boolean().optional(),
  kidsOnlyBatchesAvailable: z.boolean().optional(),
  kidsDanceAgeGroups: z.array(z.string()).optional(),
  enquiriesAcrossAgeGroups: z.boolean().optional(),
  beginnersWelcome: z.boolean().optional(),
  /** Safe differentiator copy — no outcome promises; group ≠ personalised PT. */
  differentiator: z.string().min(1).optional(),
  trainerCountNote: z.string().min(1).optional(),
  trainerWorkforceNote: z.string().min(1).optional(),
  experienceNotePartial: z.string().min(1).optional(),
  commercialPriorityNotePartial: z.string().min(1).optional(),
  ownerSource: ownerSourceSchema.optional(),
});
export type StudioCommercial = z.infer<typeof studioCommercialSchema>;
