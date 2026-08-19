/**
 * Hosted art-direction / synthetic concept preview gate.
 *
 * Full concept mode requires BOTH flags so ordinary Vercel Preview deploys
 * cannot accidentally become the media-rich concept site.
 *
 * Local Stage 4A still uses NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA alone for media;
 * these helpers identify the hosted concept environment (SEO + chrome marker).
 */

/** Hosted concept-preview flag only — drives hard noindex when set. */
export function isConceptPreviewEnv(): boolean {
  return process.env.ANKITS_CONCEPT_PREVIEW === "true";
}

/**
 * Full concept-preview mode: ANKITS_CONCEPT_PREVIEW=true AND
 * NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=true.
 */
export function isConceptPreview(): boolean {
  return (
    isConceptPreviewEnv() && process.env.NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA === "true"
  );
}
