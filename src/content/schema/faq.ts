import { z } from "zod";
import { provenanced } from "./provenance";
import { branchSlugSchema, programmeSlugSchema } from "./slugs";

export const faqSchema = provenanced({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  programmeSlug: programmeSlugSchema.optional(),
  branchSlug: branchSlugSchema.optional(),
});
export type Faq = z.infer<typeof faqSchema>;
