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
    // no src — EditorialMediaFrame renders geometry surface
  };
}

/**
 * Resolve media for a premium slot.
 * Flag false → never returns synthetic-preview (production text-led path).
 * Real-only slots → never return synthetic.
 */
export function resolveSlotMedia(slotKey: string): StudioMediaItem | null {
  if (isVerifiedRealOnlySlot(slotKey)) {
    const real = getCatalogueItem(slotKey);
    if (real?.status === "verified-real" && real.src) return real;
    return null;
  }

  const catalogued = getCatalogueItem(slotKey);
  if (catalogued) {
    if (catalogued.status === "verified-real" && catalogued.src) {
      return catalogued;
    }
    if (catalogued.status === "synthetic-preview") {
      if (!isSyntheticMediaEnabled()) return null;
      if (!canAcceptSyntheticMedia(slotKey)) return null;
      // Prefer binary assets; skip empty geometry when a file-backed entry exists.
      if (catalogued.src) return catalogued;
    }
  }

  // Part 1 geometry fallback only when no file-backed catalogue entry.
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
