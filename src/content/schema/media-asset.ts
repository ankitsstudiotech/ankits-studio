import { z } from "zod";

/**
 * Deliberately minimal — see docs/DECISIONS.md ADR-012. No `licenceNote` or
 * `lqip` yet; no real photography exists to attach them to (YAGNI).
 */
export const mediaAssetSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type MediaAsset = z.infer<typeof mediaAssetSchema>;
