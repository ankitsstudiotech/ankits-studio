import type { StudioMediaItem } from "./types";

/**
 * Synthetic / verified catalogue.
 * Stage 4A Part 1: empty of binaries — resolve may emit geometry previews only.
 */
export const MEDIA_CATALOGUE: readonly StudioMediaItem[] = [];

export function getCatalogueItem(slotKey: string): StudioMediaItem | undefined {
  return MEDIA_CATALOGUE.find((item) => item.slot === slotKey);
}
