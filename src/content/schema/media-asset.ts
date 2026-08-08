import { z } from "zod";

/**
 * Minimal binary asset shape — ADR-012.
 * Provenance-rich records live in `src/content/media` (StudioMediaItem).
 */
export const mediaAssetSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  status: z.enum(["fallback", "synthetic-preview", "verified-real"]).optional(),
  kind: z.enum(["image", "video", "poster"]).optional(),
  source: z.enum(["ai-concept", "owner", "fallback", "none"]).optional(),
});
export type MediaAsset = z.infer<typeof mediaAssetSchema>;
