import type {
  Branch,
  BlogPost,
  BusinessIdentity,
  ContactDetails,
  Faq,
  NavigationItem,
  PricingPlan,
  Programme,
  Testimonial,
  TimetableSlot,
  Trainer,
  Transformation,
} from "../schema";

/**
 * Empty until the business owner confirms real values — see
 * docs/BUSINESS-DATA-STATUS.md's verification workflow. Populating one of
 * these arrays and flipping the corresponding mock record's `dataStatus` to
 * "verified" happens in the same change, per that doc's workflow; it is
 * never done on inference by either agent (docs/DECISIONS.md ADR-002).
 */
export const verifiedProgrammes: Programme[] = [];
export const verifiedBranches: Branch[] = [];
export const verifiedTrainers: Trainer[] = [];
export const verifiedTimetableSlots: TimetableSlot[] = [];
export const verifiedPricingPlans: PricingPlan[] = [];
export const verifiedTransformations: Transformation[] = [];
export const verifiedTestimonials: Testimonial[] = [];
export const verifiedBlogPosts: BlogPost[] = [];

/** Singular records: `null` means "no verified override yet, fall back to mock." */
export const verifiedBusinessIdentity: BusinessIdentity | null = null;
export const verifiedContactDetails: ContactDetails | null = null;
export const verifiedStudioCommercial: import("../schema").StudioCommercial | null = null;
export const verifiedFaqs: Faq[] = [];
export const verifiedNavigationItems: NavigationItem[] = [];
