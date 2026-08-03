import { z } from "zod";
import { mediaAssetSchema } from "./media-asset";
import { provenanced } from "./provenance";
import { ownerSourceSchema } from "./owner-source";
import { branchSlugSchema, programmeSlugSchema } from "./slugs";

/**
 * First-party member stories — distinct from Google reviews and from
 * evidence-strong Transformations. See docs/DECISIONS.md ADR-022.
 */

export const anonymityLevelSchema = z.enum([
  "full_name",
  "first_name",
  "initials",
  "anonymous_label",
]);
export type AnonymityLevel = z.infer<typeof anonymityLevelSchema>;

export const consentStatusSchema = z.enum(["pending", "granted", "denied", "withdrawn"]);
export type ConsentStatus = z.infer<typeof consentStatusSchema>;

export const evidenceVerificationStatusSchema = z.enum([
  "pending",
  "owner_provided",
  "evidence_received",
  "verified",
  "publishable",
]);
export type EvidenceVerificationStatus = z.infer<typeof evidenceVerificationStatusSchema>;

export const evidencePublicationStatusSchema = z.enum([
  "draft",
  "ready",
  "published",
  "withheld",
]);
export type EvidencePublicationStatus = z.infer<typeof evidencePublicationStatusSchema>;

export const healthClaimRiskSchema = z.enum(["none", "low", "elevated", "blocked"]);
export type HealthClaimRisk = z.infer<typeof healthClaimRiskSchema>;

export const memberStorySchema = provenanced({
  id: z.string().min(1),
  slug: z.string().min(1),
  memberDisplayName: z.string().min(1),
  anonymityLevel: anonymityLevelSchema.default("first_name"),
  branchSlug: branchSlugSchema.optional(),
  programmeSlug: programmeSlugSchema.optional(),
  storyText: z.string().min(1),
  memberProvidedQuote: z.string().min(1).optional(),
  publicationConsentStatus: consentStatusSchema.default("pending"),
  quoteConsentStatus: consentStatusSchema.default("pending"),
  photographPermissionStatus: consentStatusSchema.default("pending"),
  consentDate: z.string().min(1).optional(),
  evidenceReferences: z.array(z.string()).default([]),
  sourceProvenance: z.string().min(1),
  verificationStatus: evidenceVerificationStatusSchema.default("pending"),
  publicationStatus: evidencePublicationStatusSchema.default("draft"),
  media: mediaAssetSchema.optional(),
  moderationNotes: z.string().optional(),
  healthClaimRisk: healthClaimRiskSchema.default("none"),
  seoTitle: z.string().min(1).optional(),
  seoDescription: z.string().min(1).optional(),
  ownerSource: ownerSourceSchema.optional(),
});
export type MemberStory = z.infer<typeof memberStorySchema>;

/**
 * Publishability gate — mock records never pass.
 * A real identity or approved anonymous display name, written permission,
 * approved text, programme or branch relationship, provenance, safe moderation.
 */
export function isMemberStoryPublishable(story: MemberStory): boolean {
  if (story.dataStatus !== "verified") return false;
  if (story.publicationStatus !== "published") return false;
  if (story.verificationStatus !== "publishable" && story.verificationStatus !== "verified") {
    return false;
  }
  if (story.publicationConsentStatus !== "granted") return false;
  if (!story.memberDisplayName.trim()) return false;
  if (!story.storyText.trim()) return false;
  if (!story.sourceProvenance.trim()) return false;
  if (!story.programmeSlug && !story.branchSlug) return false;
  if (story.healthClaimRisk === "blocked") return false;
  if (story.memberProvidedQuote && story.quoteConsentStatus !== "granted") return false;
  if (story.media?.src && story.photographPermissionStatus !== "granted") return false;
  return true;
}

/**
 * Index `/transformations` when enough publishable Member Stories exist (ADR-022).
 * Transformations can also unlock indexing — see `shouldIndexMemberStoriesRoute`.
 */
export const MEMBER_STORIES_INDEX_STORY_THRESHOLD = 3;
