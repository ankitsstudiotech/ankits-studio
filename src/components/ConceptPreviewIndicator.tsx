import { isConceptPreview } from "@/lib/concept-preview";

/**
 * Global chrome for hosted concept-preview deployments only.
 * Separate from per-asset “AI concept preview” labels and from MockModeIndicator.
 * Rendered in normal document flow (SSR) so it does not introduce CLS.
 */
export function ConceptPreviewIndicator() {
  if (!isConceptPreview()) {
    return null;
  }

  return (
    <div
      role="status"
      aria-label="Art direction concept preview with AI media"
      data-concept-preview="true"
      className="border-b border-[var(--color-border-on-field)] bg-field-raised px-3 py-1.5 text-center sm:px-4"
    >
      <p className="font-[family-name:var(--font-display)] text-[0.65rem] font-normal uppercase tracking-[0.18em] text-[var(--color-volt)] sm:text-xs">
        Concept preview · AI media
      </p>
      <p className="sr-only">
        This hosted deployment shows Stage 4A synthetic art-direction imagery. It is
        noindex and is not the public production site. Individual images remain labelled
        AI concept preview.
      </p>
    </div>
  );
}
