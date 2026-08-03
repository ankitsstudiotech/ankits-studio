import { z } from "zod";
import { provenanced } from "./provenance";

/** Verified page copy for the Member Stories route (`/transformations`). */
export const studioMemberStoriesPageSchema = provenanced({
  pageTitle: z.string().min(1),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  headline: z.string().min(1),
  lede: z.string().min(1),
  consentTitle: z.string().min(1),
  consentBody: z.string().min(1),
  readinessTitle: z.string().min(1),
  readinessBody: z.string().min(1),
  readinessSupporting: z.string().min(1).optional(),
  programmesTitle: z.string().min(1),
  programmesBody: z.string().min(1),
  branchesTitle: z.string().min(1),
  branchesBody: z.string().min(1),
  ctaTitle: z.string().min(1),
  ctaBody: z.string().min(1),
});
export type StudioMemberStoriesPage = z.infer<typeof studioMemberStoriesPageSchema>;
