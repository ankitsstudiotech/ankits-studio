import { z } from "zod";
import { provenanced } from "./provenance";
import { programmeSlugSchema } from "./slugs";

export const faqSchema = provenanced({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  programmeSlug: programmeSlugSchema.optional(),
});
export type Faq = z.infer<typeof faqSchema>;
