import { z } from "zod";

/**
 * Zod-validated environment variables. Fails fast with a clear error at
 * import time if something is malformed, rather than surfacing as a
 * confusing runtime bug later. See docs/DECISIONS.md ADR-002/ADR-011 for
 * why `ALLOW_MOCK_PUBLISH` exists.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  /** Must be exactly "true" to allow a production build with unverified
   *  content present (e.g. a preview deploy). Unset means not allowed. */
  ALLOW_MOCK_PUBLISH: z.enum(["true", "false"]).optional(),
  /** Absolute site URL, used for metadataBase / OG image URLs. Falls back
   *  to a localhost placeholder in src/lib/metadata.ts when unset — no
   *  real domain is verified yet. */
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  /**
   * Stage 4A — synthetic art-direction media. Default absent/false keeps
   * production on the approved text-led experience. Must be exactly "true"
   * to render synthetic-preview / geometry surfaces.
   */
  NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA: z.enum(["true", "false"]).optional(),
  /**
   * Hosted concept-preview deploy only. Must be paired with
   * NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=true (see isConceptPreview()).
   * Never set on Vercel Production.
   */
  ANKITS_CONCEPT_PREVIEW: z.enum(["true", "false"]).optional(),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment variables:", z.treeifyError(parsed.error));
    throw new Error("Invalid environment variables — see the logged error above.");
  }
  return parsed.data;
}

export const env = loadEnv();
