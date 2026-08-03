import { z } from "zod";
import { mediaAssetSchema } from "./media-asset";
import { provenanced } from "./provenance";
import { ownerSourceSchema } from "./owner-source";
import { branchSlugSchema, programmeSlugSchema } from "./slugs";

/**
 * Trainer profile readiness — a name alone is never enough to publish.
 * See docs/DECISIONS.md ADR-019.
 */

export const trainerVerificationStatusSchema = z.enum([
  "pending",
  "owner_provided",
  "evidence_received",
  "verified",
  "publishable",
]);
export type TrainerVerificationStatus = z.infer<typeof trainerVerificationStatusSchema>;

export const trainerPublicationStatusSchema = z.enum([
  "draft",
  "ready",
  "published",
  "withheld",
]);
export type TrainerPublicationStatus = z.infer<typeof trainerPublicationStatusSchema>;

export const trainerConsentStatusSchema = z.enum(["pending", "granted", "denied"]);

export const trainerCertificationSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1).optional(),
  evidenceRef: z.string().min(1).optional(),
});
export type TrainerCertification = z.infer<typeof trainerCertificationSchema>;

export const trainerSchema = provenanced({
  /** Stable id — defaults to slug when not separately assigned. */
  id: z.string().min(1),
  slug: z.string().min(1),
  /** Public display name. */
  name: z.string().min(1),
  photo: mediaAssetSchema.optional(),
  role: z.string().min(1).optional(),
  /** Programme relationships (confirmed catalogue slugs). */
  specialties: z.array(programmeSlugSchema).default([]),
  branchSlugs: z.array(branchSlugSchema).default([]),
  yearsOfExperience: z.number().nonnegative().optional(),
  bio: z.string().min(1).optional(),
  /** Legacy free-text qualification lines — prefer `certifications` when structured. */
  qualifications: z.array(z.string()).default([]),
  certifications: z.array(trainerCertificationSchema).default([]),
  firstAidOrCprStatus: z.enum(["pending", "confirmed", "not_applicable"]).optional(),
  publicationConsentStatus: trainerConsentStatusSchema.default("pending"),
  profileVerificationStatus: trainerVerificationStatusSchema.default("pending"),
  profilePublicationStatus: trainerPublicationStatusSchema.default("draft"),
  /** Explicit permission to show the photograph publicly. */
  photoPublicationPermission: z.boolean().optional(),
  mediaFocalPoint: z
    .object({
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
    })
    .optional(),
  seoTitle: z.string().min(1).optional(),
  seoDescription: z.string().min(1).optional(),
  fieldProvenance: z.record(z.string(), z.string()).optional(),
  ownerSource: ownerSourceSchema.optional(),
});
export type Trainer = z.infer<typeof trainerSchema>;

/**
 * Publishability gate — all conditions required.
 * Owner supplying a name alone must never make a profile public.
 */
export function isTrainerPublishable(trainer: Trainer): boolean {
  if (trainer.dataStatus !== "verified") return false;
  if (trainer.profilePublicationStatus !== "published") return false;
  if (
    trainer.profileVerificationStatus !== "publishable" &&
    trainer.profileVerificationStatus !== "verified"
  ) {
    return false;
  }
  if (trainer.publicationConsentStatus !== "granted") return false;
  if (!trainer.name.trim()) return false;
  if (!trainer.photo?.src) return false;
  if (trainer.photoPublicationPermission !== true) return false;
  if (!trainer.role?.trim()) return false;
  if (trainer.specialties.length === 0 && trainer.branchSlugs.length === 0) return false;

  const hasSafeCredentialOrExperience =
    trainer.qualifications.length > 0 ||
    trainer.certifications.length > 0 ||
    typeof trainer.yearsOfExperience === "number";
  if (!hasSafeCredentialOrExperience) return false;

  return true;
}

/** Minimum publishable profiles before `/trainers` may be indexed (ADR-019). */
export const TRAINERS_ROUTE_INDEX_THRESHOLD = 3;
