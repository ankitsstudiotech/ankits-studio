import { z } from "zod";
import { provenanced } from "./provenance";
import { programmeSlugSchema } from "./slugs";

export const blogPostSchema = provenanced({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  // Opaque body format for now (MDX vs. plain vs. block-based is a Phase 3
  // decision) — see docs/DECISIONS.md ADR-012.
  body: z.string(),
  publishedAt: z.string(),
  programmeSlugs: z.array(programmeSlugSchema).optional(),
});
export type BlogPost = z.infer<typeof blogPostSchema>;
