import { z } from "zod";
import { provenanced } from "./provenance";
import { ownerSourceSchema } from "./owner-source";

/**
 * About-page content — verified studio story only.
 * Founder narrative, founding date, and credentials stay nullable until owner-confirmed.
 */
const faqEntrySchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const studioAboutSchema = provenanced({
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  /** Short title for Next metadata (site template adds brand). */
  pageTitle: z.string().min(1),
  headline: z.string().min(1),
  lede: z.string().min(1),
  approachTitle: z.string().min(1),
  approachBody: z.string().min(1),
  disciplinesTitle: z.string().min(1),
  disciplinesBody: z.string().min(1),
  branchesTitle: z.string().min(1),
  branchesBody: z.string().min(1),
  teamTitle: z.string().min(1),
  /** Plain statement; must cite owner-provided count only — no quality adjectives. */
  teamBody: z.string().min(1),
  /** Explicit provenance label for the 15+ count (e.g. "Owner-provided"). */
  teamCountProvenance: z.string().min(1),
  /**
   * Reserved for verified trainer profiles later — empty until supplied.
   * About must not invent names, roles, or portraits.
   */
  trainerProfileSlugs: z.array(z.string().min(1)).default([]),
  founderStoryStatus: z.enum(["pending", "verified"]),
  founderStory: z.string().min(1).optional(),
  foundingDateStatus: z.enum(["pending", "verified"]),
  foundingDateLabel: z.string().min(1).optional(),
  credentialsStatus: z.enum(["pending", "verified"]),
  credentialsSummary: z.string().min(1).optional(),
  faqs: z.array(faqEntrySchema).default([]),
  ownerSource: ownerSourceSchema.optional(),
});

export type StudioAbout = z.infer<typeof studioAboutSchema>;
