/**
 * Production media slot catalogue — metadata only.
 * Real binaries are not bundled until owner-verified.
 * See docs/media/STUDIO-MEDIA-REQUIREMENTS.md.
 */

export type MediaSlotMedium = "image" | "video";

export type MediaSlotDefinition = {
  key: string;
  preferredMedium: MediaSlotMedium;
  desktopAspect: `${number}/${number}`;
  mobileAspect: `${number}/${number}`;
  loading: "priority" | "lazy";
  crop: "cover" | "contain";
  fallbackFamily: "strength" | "calm" | "high-energy" | "warm" | "neutral";
  altGuideline: string;
  posterRequired: boolean;
  provenanceStatus: "pending";
};

export const STUDIO_MEDIA_SLOTS: readonly MediaSlotDefinition[] = [
  {
    key: "home.hero",
    preferredMedium: "video",
    desktopAspect: "16/9",
    mobileAspect: "16/9",
    loading: "priority",
    crop: "cover",
    fallbackFamily: "strength",
    altGuideline: "Coach-led session at Ankit’s Studio",
    posterRequired: true,
    provenanceStatus: "pending",
  },
  {
    key: "home.differentiator",
    preferredMedium: "image",
    desktopAspect: "16/9",
    mobileAspect: "16/9",
    loading: "lazy",
    crop: "cover",
    fallbackFamily: "calm",
    altGuideline: "Machine-free training floor",
    posterRequired: false,
    provenanceStatus: "pending",
  },
  {
    key: "service.functional-training",
    preferredMedium: "image",
    desktopAspect: "4/5",
    mobileAspect: "3/4",
    loading: "lazy",
    crop: "cover",
    fallbackFamily: "strength",
    altGuideline: "Functional training session",
    posterRequired: false,
    provenanceStatus: "pending",
  },
  {
    key: "service.yoga",
    preferredMedium: "image",
    desktopAspect: "4/5",
    mobileAspect: "4/5",
    loading: "lazy",
    crop: "cover",
    fallbackFamily: "calm",
    altGuideline: "Yoga session at Ankit’s Studio",
    posterRequired: false,
    provenanceStatus: "pending",
  },
  {
    key: "service.zumba",
    preferredMedium: "image",
    desktopAspect: "4/5",
    mobileAspect: "3/4",
    loading: "lazy",
    crop: "cover",
    fallbackFamily: "high-energy",
    altGuideline: "Zumba class at Ankit’s Studio",
    posterRequired: true,
    provenanceStatus: "pending",
  },
  {
    key: "service.dance",
    preferredMedium: "image",
    desktopAspect: "4/5",
    mobileAspect: "4/5",
    loading: "lazy",
    crop: "cover",
    fallbackFamily: "high-energy",
    altGuideline: "Adult dance class",
    posterRequired: false,
    provenanceStatus: "pending",
  },
  {
    key: "service.wedding-choreography",
    preferredMedium: "image",
    desktopAspect: "4/5",
    mobileAspect: "4/5",
    loading: "lazy",
    crop: "cover",
    fallbackFamily: "warm",
    altGuideline: "Wedding choreography rehearsal",
    posterRequired: false,
    provenanceStatus: "pending",
  },
  {
    key: "service.home-personal-training",
    preferredMedium: "image",
    desktopAspect: "4/5",
    mobileAspect: "3/4",
    loading: "lazy",
    crop: "cover",
    fallbackFamily: "neutral",
    altGuideline: "Home personal training session",
    posterRequired: false,
    provenanceStatus: "pending",
  },
  {
    key: "service.online-training",
    preferredMedium: "image",
    desktopAspect: "16/9",
    mobileAspect: "16/9",
    loading: "lazy",
    crop: "contain",
    fallbackFamily: "neutral",
    altGuideline: "Online training session",
    posterRequired: false,
    provenanceStatus: "pending",
  },
  {
    key: "branch.airoli",
    preferredMedium: "image",
    desktopAspect: "16/9",
    mobileAspect: "3/2",
    loading: "lazy",
    crop: "cover",
    fallbackFamily: "neutral",
    altGuideline: "Ankit’s Studio Airoli Sector 19",
    posterRequired: false,
    provenanceStatus: "pending",
  },
  {
    key: "branch.airoli-sector-8",
    preferredMedium: "image",
    desktopAspect: "16/9",
    mobileAspect: "3/2",
    loading: "lazy",
    crop: "cover",
    fallbackFamily: "neutral",
    altGuideline: "Ankit’s Studio Airoli Sector 8",
    posterRequired: false,
    provenanceStatus: "pending",
  },
  {
    key: "branch.ghansoli",
    preferredMedium: "image",
    desktopAspect: "16/9",
    mobileAspect: "3/2",
    loading: "lazy",
    crop: "cover",
    fallbackFamily: "neutral",
    altGuideline: "Ankit’s Studio Ghansoli",
    posterRequired: false,
    provenanceStatus: "pending",
  },
  {
    key: "branch.thane",
    preferredMedium: "image",
    desktopAspect: "16/9",
    mobileAspect: "3/2",
    loading: "lazy",
    crop: "cover",
    fallbackFamily: "neutral",
    altGuideline: "Ankit’s Studio Thane",
    posterRequired: false,
    provenanceStatus: "pending",
  },
  {
    key: "community.group",
    preferredMedium: "image",
    desktopAspect: "16/9",
    mobileAspect: "3/2",
    loading: "lazy",
    crop: "cover",
    fallbackFamily: "neutral",
    altGuideline: "Group session at Ankit’s Studio",
    posterRequired: false,
    provenanceStatus: "pending",
  },
] as const;

export function getMediaSlot(key: string): MediaSlotDefinition | undefined {
  return STUDIO_MEDIA_SLOTS.find((slot) => slot.key === key);
}
