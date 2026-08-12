import { isConceptPreview } from "@/lib/concept-preview";
import { isSyntheticMediaEnabled } from "@/lib/media/feature-flag";
import { getCatalogueItem } from "./catalogue";
import { getPremiumSlot } from "./premium-slots";
import { canAcceptSyntheticMedia, isVerifiedRealOnlySlot } from "./real-only";
import type { StudioMediaItem } from "./types";

function geometryPreviewItem(slotKey: string): StudioMediaItem | null {
  const slot = getPremiumSlot(slotKey);
  if (!slot || !slot.geometryPreview || slot.verifiedRealOnly) return null;
  if (!canAcceptSyntheticMedia(slotKey)) return null;
  if (!isSyntheticMediaEnabled()) return null;

  return {
    id: `geometry-${slotKey}`,
    slot: slotKey,
    status: "synthetic-preview",
    kind: "image",
    orientation: slot.desktopAspect.includes("16") ? "landscape" : "portrait",
    aspectRatio: slot.desktopAspect,
    mobileAspectRatio: slot.mobileAspect,
    alt: `Geometry preview for ${slotKey} — not photography`,
    source: "ai-concept",
    consentStatus: "not-applicable-synthetic",
    replacementPriority: slot.replacementPriority,
    motionTreatment: slot.motionTreatment,
    programme: slot.programme,
    branch: slot.branch,
    focalPoint: { x: 62, y: 42 },
    mobileFocalPoint: { x: 68, y: 40 },
  };
}

function canRenderCatalogueItem(item: StudioMediaItem, slotKey: string): boolean {
  if (!item.src) return false;
  if (!canAcceptSyntheticMedia(slotKey)) return false;

  if (item.status === "verified-real") return true;

  if (item.status === "illustrative-ai") {
    return true;
  }

  if (item.status === "synthetic-preview") {
    return isSyntheticMediaEnabled() || isConceptPreview();
  }

  return false;
}

/**
 * Resolve media for a premium slot.
 * Production default: owner-approved illustrative-ai (no feature flag).
 * verified-real > illustrative-ai > synthetic-preview (concept flag only) > fallback.
 */
export function resolveSlotMedia(slotKey: string): StudioMediaItem | null {
  if (isVerifiedRealOnlySlot(slotKey)) {
    const real = getCatalogueItem(slotKey);
    if (real?.status === "verified-real" && real.src) return real;
    return null;
  }

  const catalogued = getCatalogueItem(slotKey);
  if (catalogued?.src && canRenderCatalogueItem(catalogued, slotKey)) {
    return catalogued;
  }

  if (catalogued?.status === "synthetic-preview" && !catalogued.src) {
    return geometryPreviewItem(slotKey);
  }
  if (!catalogued) {
    return geometryPreviewItem(slotKey);
  }
  return null;
}

export function slotHasRenderableMedia(slotKey: string): boolean {
  return resolveSlotMedia(slotKey) !== null;
}
