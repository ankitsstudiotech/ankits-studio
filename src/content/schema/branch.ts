import { z } from "zod";
import { mediaAssetSchema } from "./media-asset";
import { provenanced } from "./provenance";
import { branchSlugSchema, programmeSlugSchema } from "./slugs";

export const openingHoursEntrySchema = z.object({
  // 0 = Monday ... 6 = Sunday (ISO-style week, not JS Date.getDay()) —
  // matches TimetableSlot.dayOfWeek's convention.
  dayOfWeek: z.number().int().min(0).max(6),
  opensAt: z.string(),
  closesAt: z.string(),
});
export type OpeningHoursEntry = z.infer<typeof openingHoursEntrySchema>;

/**
 * Field-level provenance for location facts (owner intake + Maps corroboration).
 * Distinct from record-level `dataStatus` on the Branch union.
 */
export const locationFieldProvenanceSchema = z.enum([
  "owner_confirmed",
  "externally_corroborated",
  "partially_verified",
  "pending",
  "mock",
]);
export type LocationFieldProvenance = z.infer<typeof locationFieldProvenanceSchema>;

export const branchFieldProvenanceSchema = z.object({
  existence: locationFieldProvenanceSchema,
  publicName: locationFieldProvenanceSchema,
  locality: locationFieldProvenanceSchema,
  address: locationFieldProvenanceSchema,
  pinCode: locationFieldProvenanceSchema,
  mapsUrl: locationFieldProvenanceSchema,
  googleBusinessProfileUrl: locationFieldProvenanceSchema,
  phone: locationFieldProvenanceSchema,
  whatsapp: locationFieldProvenanceSchema,
  operatingHours: locationFieldProvenanceSchema,
  batchSchedule: locationFieldProvenanceSchema,
  physicalServices: locationFieldProvenanceSchema,
  audienceAvailability: locationFieldProvenanceSchema,
  landmarks: locationFieldProvenanceSchema,
  nearestStation: locationFieldProvenanceSchema,
  parking: locationFieldProvenanceSchema,
  facilities: locationFieldProvenanceSchema,
  media: locationFieldProvenanceSchema,
});
export type BranchFieldProvenance = z.infer<typeof branchFieldProvenanceSchema>;

export const branchFaqEntrySchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
});
export type BranchFaqEntry = z.infer<typeof branchFaqEntrySchema>;

export const branchSchema = provenanced({
  id: z.string().min(1),
  slug: branchSlugSchema,
  /** Full public title, e.g. "Ankit's Studio — Airoli Sector 19". */
  name: z.string().min(1),
  /** Place-first locality label for discovery UI, e.g. "Airoli Sector 19". */
  locality: z.string().min(1),
  /**
   * Complete printable street address. Null while pending — never invent.
   * Legacy `address` string placeholders are retired in favour of this + status.
   */
  address: z.string().min(1).nullable(),
  pinCode: z.string().min(1).nullable(),
  /** Owner-supplied Maps short URL. Null while pending (Sector 8). */
  mapsUrl: z.string().url().nullable(),
  googleBusinessProfileUrl: z.string().url().nullable(),
  /**
   * Branch-specific phone. Null when only the central enquiry number applies.
   * Prefer central WhatsApp/phone via ContactDetails for dial actions.
   */
  phone: z.string().min(1).nullable(),
  /** WhatsApp digits/number for this branch context — usually central. */
  whatsapp: z.string().min(1),
  inheritsCentralEnquiry: z.boolean(),
  openingHours: z.array(openingHoursEntrySchema),
  openingHoursKind: z.enum(["operating-window", "detailed-timetable"]),
  batchScheduleStatus: z.enum(["pending", "published"]),
  /** Confirmed physical floor programmes only (never home/online). */
  physicalProgrammeSlugs: z.array(programmeSlugSchema),
  /**
   * @deprecated Prefer `physicalProgrammeSlugs`. Kept synced for selectors that
   * still read programmeSlugs during the location rebuild.
   */
  programmeSlugs: z.array(programmeSlugSchema),
  ladiesOnlyBatchesAvailable: z.boolean(),
  kidsOnlyBatchesAvailable: z.boolean(),
  maxGroupBatchSize: z.number().int().positive().nullable(),
  openingStatus: z.enum(["open", "temporarily-closed", "coming-soon"]),
  landmarks: z.string().nullable(),
  nearestStation: z.string().nullable(),
  parking: z.string().nullable(),
  facilities: z.array(z.string()).nullable(),
  mediaSlotKey: z.string().min(1),
  fieldProvenance: branchFieldProvenanceSchema,
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  faqEntries: z.array(branchFaqEntrySchema),
  relatedProgrammeSlugs: z.array(programmeSlugSchema),
  publiclyListed: z.boolean(),
  /** Optional legacy directions copy — omit when pending. */
  directions: z.string().optional(),
  nearbyTransport: z.array(z.string()).optional(),
  photos: z.array(mediaAssetSchema).optional(),
  /**
   * @deprecated Use `mapsUrl`. Retained optional alias for gradual consumer migration.
   */
  mapsShortUrl: z.string().url().optional(),
  mapEmbedUrl: z.string().url().optional(),
});
export type Branch = z.infer<typeof branchSchema>;
