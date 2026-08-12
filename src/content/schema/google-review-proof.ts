import { z } from "zod";

/** Approved Google review for on-site display — integration prompt supplies records. */
export const googleReviewProofItemSchema = z.object({
  id: z.string().min(1),
  authorDisplayName: z.string().min(1),
  excerpt: z.string().min(1),
  sourceUrl: z.string().url(),
  publishedAt: z.string().min(1).optional(),
});
export type GoogleReviewProofItem = z.infer<typeof googleReviewProofItemSchema>;
