import { z } from "zod";
import { mediaAssetSchema } from "./media-asset";
import { provenanced } from "./provenance";

/**
 * Site-wide business identity — distinct from Branch (per-location facts).
 * Singular record, not a list — see src/content/index.ts getBusinessIdentity().
 */
export const businessIdentitySchema = provenanced({
  legalName: z.string().min(1),
  displayName: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  /** Descriptor in the official logo lockup — not the legal business name. */
  logoDescriptor: z.string().min(1).optional(),
  foundingYear: z.number().int().min(1900).max(2100).optional(),
  logo: mediaAssetSchema.optional(),
  socialLinks: z
    .object({
      instagram: z.string().url().optional(),
      youtube: z.string().url().optional(),
    })
    .optional(),
});
export type BusinessIdentity = z.infer<typeof businessIdentitySchema>;
