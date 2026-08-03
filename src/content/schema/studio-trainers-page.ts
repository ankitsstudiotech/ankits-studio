import { z } from "zod";
import { provenanced } from "./provenance";
import { ownerSourceSchema } from "./owner-source";

/**
 * Trainers index page copy — team-level facts only until profiles are publishable.
 */
export const studioTrainersPageSchema = provenanced({
  pageTitle: z.string().min(1),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  headline: z.string().min(1),
  lede: z.string().min(1),
  teamSizeLabel: z.string().min(1),
  teamSizeBody: z.string().min(1),
  /** e.g. owner_provided — never invent independent verification. */
  teamSizeProvenance: z.enum(["owner_provided", "verified"]),
  teamSizeProvenanceNote: z.string().min(1),
  programmesTitle: z.string().min(1),
  programmesBody: z.string().min(1),
  branchesTitle: z.string().min(1),
  branchesBody: z.string().min(1),
  readinessTitle: z.string().min(1),
  readinessBody: z.string().min(1),
  readinessBodyMockPreview: z.string().min(1).optional(),
  ownerSource: ownerSourceSchema.optional(),
});
export type StudioTrainersPage = z.infer<typeof studioTrainersPageSchema>;
