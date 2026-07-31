import { z } from "zod";
import { mediaAssetSchema } from "./media-asset";
import { provenanced } from "./provenance";
import { programmeSlugSchema } from "./slugs";

export const transformationSchema = provenanced({
  slug: z.string().min(1),
  programmeSlug: programmeSlugSchema,
  // Qualitative description only — never a specific unverifiable number.
  // See docs/BUSINESS-DATA-STATUS.md ("no fabricated transformation
  // numbers") and DECISIONS.md ADR-002.
  summary: z.string().min(1),
  durationWeeks: z.number().int().positive().optional(),
  beforeImage: mediaAssetSchema.optional(),
  afterImage: mediaAssetSchema.optional(),
});
export type Transformation = z.infer<typeof transformationSchema>;
