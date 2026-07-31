import { z } from "zod";
import { provenanced } from "./provenance";
import { branchSlugSchema, programmeSlugSchema } from "./slugs";

export const testimonialSchema = provenanced({
  id: z.string().min(1),
  quote: z.string().min(1),
  // Must read as illustrative, e.g. "Illustrative member" — never a real,
  // identifiable person. See docs/BUSINESS-DATA-STATUS.md.
  attributedName: z.string().min(1),
  programmeSlug: programmeSlugSchema.optional(),
  branchSlug: branchSlugSchema.optional(),
});
export type Testimonial = z.infer<typeof testimonialSchema>;
