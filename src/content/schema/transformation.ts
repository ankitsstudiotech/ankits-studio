import { z } from "zod";
import { mediaAssetSchema } from "./media-asset";
import { provenanced } from "./provenance";
import { ownerSourceSchema } from "./owner-source";
import { branchSlugSchema, programmeSlugSchema } from "./slugs";
import {
  consentStatusSchema,
  evidencePublicationStatusSchema,
  evidenceVerificationStatusSchema,
  healthClaimRiskSchema,
  anonymityLevelSchema,
} from "./member-story";

/**
 * Evidence-strong member stories (timeframe + outcome). Not Google reviews.
 * See docs/DECISIONS.md ADR-022.
 */

export const transformationSchema = provenanced({
  id: z.string().min(1),
  slug: z.string().min(1),
  memberDisplayName: z.string().min(1),
  anonymityLevel: anonymityLevelSchema.default("first_name"),
  branchSlug: branchSlugSchema.optional(),
  programmeSlug: programmeSlugSchema,
  storyText: z.string().min(1).optional(),
  memberProvidedQuote: z.string().min(1).optional(),
  publicationConsentStatus: consentStatusSchema.default("pending"),
  quoteConsentStatus: consentStatusSchema.default("pending"),
  photographPermissionStatus: consentStatusSchema.default("pending"),
  consentDate: z.string().min(1).optional(),
  evidenceReferences: z.array(z.string()).default([]),
  sourceProvenance: z.string().min(1),
  verificationStatus: evidenceVerificationStatusSchema.default("pending"),
  publicationStatus: evidencePublicationStatusSchema.default("draft"),
  moderationNotes: z.string().optional(),
  healthClaimRisk: healthClaimRiskSchema.default("none"),
  statedStartingPoint: z.string().min(1),
  statedGoal: z.string().min(1).optional(),
  timeframeLabel: z.string().min(1),
  programmeFollowedLabel: z.string().min(1).optional(),
  memberDescribedOutcome: z.string().min(1),
  measurableOutcome: z.string().min(1).nullable().optional(),
  measurementSource: z.string().min(1).optional(),
  beforeMedia: mediaAssetSchema.optional(),
  afterMedia: mediaAssetSchema.optional(),
  beforeMediaPermissionStatus: consentStatusSchema.default("pending"),
  afterMediaPermissionStatus: consentStatusSchema.default("pending"),
  imageDateVerified: z.boolean().optional(),
  imageTreatmentDisclosure: z.string().min(1).optional(),
  disclaimerRequirements: z.array(z.string()).default([]),
  seoTitle: z.string().min(1).optional(),
  seoDescription: z.string().min(1).optional(),
  ownerSource: ownerSourceSchema.optional(),
  /** @deprecated Prefer memberDescribedOutcome. Optional for empty arrays. */
  summary: z.string().min(1).optional(),
});
export type Transformation = z.infer<typeof transformationSchema>;

export function isTransformationPublishable(item: Transformation): boolean {
  if (item.dataStatus !== "verified") return false;
  if (item.publicationStatus !== "published") return false;
  if (item.verificationStatus !== "publishable" && item.verificationStatus !== "verified") {
    return false;
  }
  if (item.publicationConsentStatus !== "granted") return false;
  if (!item.memberDisplayName.trim()) return false;
  if (!item.statedStartingPoint.trim()) return false;
  if (!item.timeframeLabel.trim()) return false;
  if (!item.memberDescribedOutcome.trim()) return false;
  if (!item.sourceProvenance.trim()) return false;
  if (!item.programmeSlug) return false;
  if (item.healthClaimRisk === "blocked") return false;
  if (item.measurableOutcome && !item.measurementSource?.trim()) return false;
  if (item.beforeMedia?.src && item.beforeMediaPermissionStatus !== "granted") return false;
  if (item.afterMedia?.src && item.afterMediaPermissionStatus !== "granted") return false;
  if ((item.beforeMedia?.src || item.afterMedia?.src) && item.imageDateVerified !== true) {
    return false;
  }
  if (item.memberProvidedQuote && item.quoteConsentStatus !== "granted") return false;
  return true;
}

/** Index unlock via complete Transformations (ADR-022). */
export const MEMBER_STORIES_INDEX_TRANSFORMATION_THRESHOLD = 2;
