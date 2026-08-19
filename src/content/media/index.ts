export type {
  ConsentStatus,
  FocalPoint,
  MediaKind,
  MediaMotionTreatment,
  MediaSource,
  MediaStatus,
  PremiumSlotDefinition,
  ReplacementPriority,
  StudioMediaItem,
} from "./types";
export {
  VERIFIED_REAL_ONLY_SLOTS,
  canAcceptSyntheticMedia,
  isVerifiedRealOnlySlot,
} from "./real-only";
export {
  PREMIUM_MEDIA_SLOTS,
  getPremiumSlot,
  programmeHeroSlotKey,
} from "./premium-slots";
export { MEDIA_CATALOGUE, getCatalogueItem } from "./catalogue";
export { resolveSlotMedia, slotHasRenderableMedia } from "./resolve";
export { isSyntheticMediaEnabled } from "@/lib/media/feature-flag";
