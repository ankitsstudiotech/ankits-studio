import { z } from "zod";
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

export const branchSchema = provenanced({
  slug: branchSlugSchema,
  name: z.string().min(1),
  address: z.string().min(1),
  // Owner-supplied Maps link. Present on the record for internal reference,
  // but never read by the UI layer until dataStatus === "verified" — see
  // src/content/index.ts and DECISIONS.md ADR-011.
  mapEmbedUrl: z.string().url().optional(),
  phone: z.string().min(1),
  whatsapp: z.string().min(1),
  openingHours: z.array(openingHoursEntrySchema),
  programmeSlugs: z.array(programmeSlugSchema),
  // Whether this branch appears in public nav/footer/sitemap. False for any
  // branch still "reference-only" (e.g. Thane) — see
  // docs/BUSINESS-DATA-STATUS.md and DECISIONS.md ADR-007 (finding I2).
  publiclyListed: z.boolean(),
});
export type Branch = z.infer<typeof branchSchema>;
