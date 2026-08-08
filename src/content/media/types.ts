/**
 * Studio Pulse media provenance — Stage 4A.
 * See docs/media/SYNTHETIC-MEDIA-PREVIEW-POLICY.md
 */

export type MediaStatus = "fallback" | "synthetic-preview" | "verified-real";

export type MediaKind = "image" | "video" | "poster";

export type MediaSource = "ai-concept" | "owner" | "fallback" | "none";

export type ConsentStatus =
  | "not-applicable-synthetic"
  | "pending"
  | "granted"
  | "not-required"
  | "verified-real-only";

export type MediaMotionTreatment =
  | "hero-reveal"
  | "section-reveal"
  | "hover-crop"
  | "static";

export type ReplacementPriority = "P0" | "P1" | "P2";

export type FocalPoint = {
  /** 0–100 horizontal */
  x: number;
  /** 0–100 vertical */
  y: number;
};

/**
 * Typed media record for catalogue + resolve.
 * `src` omitted = geometry preview (no binary) or unresolved fallback.
 */
export type StudioMediaItem = {
  id: string;
  slot: string;
  status: MediaStatus;
  kind: MediaKind;
  orientation?: "landscape" | "portrait" | "square";
  aspectRatio: string;
  mobileAspectRatio?: string;
  alt: string;
  source: MediaSource;
  focalPoint?: FocalPoint;
  tabletFocalPoint?: FocalPoint;
  mobileFocalPoint?: FocalPoint;
  motionTreatment?: MediaMotionTreatment;
  programme?: string;
  branch?: string;
  consentStatus: ConsentStatus;
  replacementPriority: ReplacementPriority;
  /** Absent for geometry-only preview */
  src?: string;
  width?: number;
  height?: number;
  verifiedRealOnly?: boolean;
};

export type PremiumSlotDefinition = {
  key: string;
  purpose: string;
  desktopAspect: string;
  mobileAspect: string;
  motionTreatment: MediaMotionTreatment;
  replacementPriority: ReplacementPriority;
  fallbackFamily: "strength" | "calm" | "high-energy" | "warm" | "neutral";
  /** When true, synthetic assets are rejected */
  verifiedRealOnly: boolean;
  /** Geometry preview allowed under synthetic flag (Part 1) */
  geometryPreview: boolean;
  programme?: string;
  branch?: string;
  compositionHint?:
    | "structured"
    | "calm"
    | "fluid"
    | "expressive"
    | "ceremonial"
    | "direct"
    | "remote"
    | "editorial-split"
    | "atmosphere";
};
