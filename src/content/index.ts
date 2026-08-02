import * as mock from "./mock";
import type {
  Branch,
  BranchSlug,
  BlogPost,
  BusinessIdentity,
  ContactDetails,
  Faq,
  NavigationItem,
  NavigationPlacement,
  PricingPlan,
  Programme,
  ProgrammeSlug,
  StudioCommercial,
  Testimonial,
  TimetableSlot,
  Trainer,
  Transformation,
} from "./schema";
import * as verified from "./verified";

/**
 * Content source abstraction. This is the ONLY module that should read
 * `./mock/**` or `./verified/**` directly — everything under `src/app`,
 * `src/components`, and `src/lib` must import from here instead (enforced
 * by the `no-restricted-imports` rule in eslint.config.mjs).
 */

function mergeByKey<Item, Key>(
  mockRecords: readonly Item[],
  verifiedRecords: readonly Item[],
  keyOf: (item: Item) => Key
): Item[] {
  const verifiedKeys = new Set(verifiedRecords.map(keyOf));
  return [...verifiedRecords, ...mockRecords.filter((item) => !verifiedKeys.has(keyOf(item)))];
}

function mergeSingular<Item>(mockRecord: Item, verifiedRecord: Item | null): Item {
  return verifiedRecord ?? mockRecord;
}

const bySlug = <Item extends { slug: string }>(item: Item) => item.slug;
const byId = <Item extends { id: string }>(item: Item) => item.id;

const programmes = mergeByKey(mock.mockProgrammes, verified.verifiedProgrammes, bySlug);
const branches = mergeByKey(mock.mockBranches, verified.verifiedBranches, bySlug);
const trainers = mergeByKey(mock.mockTrainers, verified.verifiedTrainers, bySlug);
const timetableSlots = mergeByKey(mock.mockTimetableSlots, verified.verifiedTimetableSlots, byId);
const pricingPlans = mergeByKey(mock.mockPricingPlans, verified.verifiedPricingPlans, bySlug);
const transformations = mergeByKey(mock.mockTransformations, verified.verifiedTransformations, bySlug);
const testimonials = mergeByKey(mock.mockTestimonials, verified.verifiedTestimonials, byId);
const blogPosts = mergeByKey(mock.mockBlogPosts, verified.verifiedBlogPosts, bySlug);
const businessIdentity = mergeSingular(mock.mockBusinessIdentity, verified.verifiedBusinessIdentity);
const contactDetails = mergeSingular(mock.mockContactDetails, verified.verifiedContactDetails);
const studioCommercial = mergeSingular(mock.mockStudioCommercial, verified.verifiedStudioCommercial);
const faqs = mergeByKey(mock.mockFaqs, verified.verifiedFaqs, byId);
const navigationItems = mergeByKey(mock.mockNavigationItems, verified.verifiedNavigationItems, byId);

export function getProgrammes(): Programme[] {
  return programmes;
}

export function getProgrammeBySlug(slug: ProgrammeSlug): Programme | undefined {
  return programmes.find((programme) => programme.slug === slug);
}

export function getBranches(): Branch[] {
  return branches;
}

export function getPubliclyListedBranches(): Branch[] {
  return branches.filter((branch) => branch.publiclyListed);
}

export function getBranchBySlug(slug: BranchSlug): Branch | undefined {
  return branches.find((branch) => branch.slug === slug);
}

export function getTrainers(): Trainer[] {
  return trainers;
}

export function getTrainerBySlug(slug: string): Trainer | undefined {
  return trainers.find((trainer) => trainer.slug === slug);
}

/**
 * Public timetable accessor — **verified slots only**.
 *
 * Mock/illustrative rows remain in `content/mock/timetable.ts` for provenance
 * and launch-gate detection (`content-mode`), but must never render on public
 * marketing routes. Exact batch schedules are still PENDING (BUSINESS-DATA-STATUS).
 */
export function getTimetableSlots(filter?: {
  branchSlug?: BranchSlug;
  programmeSlug?: ProgrammeSlug;
}): TimetableSlot[] {
  const verifiedSlots = timetableSlots.filter((slot) => slot.dataStatus === "verified");
  if (!filter) return verifiedSlots;
  return verifiedSlots.filter(
    (slot) =>
      (filter.branchSlug === undefined || slot.branchSlug === filter.branchSlug) &&
      (filter.programmeSlug === undefined || slot.programmeSlug === filter.programmeSlug),
  );
}

export function getPricingPlans(): PricingPlan[] {
  return pricingPlans;
}

export function getTransformations(): Transformation[] {
  return transformations;
}

export function getTestimonials(): Testimonial[] {
  return testimonials;
}

export function getBlogPosts(): BlogPost[] {
  return blogPosts;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

/**
 * Clickable phone/WhatsApp/Maps for a branch — null unless branch is verified (ADR-011).
 */
export function getBranchContactLinks(branch: Branch): {
  phoneHref: string | null;
  whatsappHref: string | null;
  mapEmbedUrl: string | null;
} {
  if (branch.dataStatus !== "verified") {
    return { phoneHref: null, whatsappHref: null, mapEmbedUrl: null };
  }
  return {
    phoneHref: `tel:${branch.phone.replace(/\s+/g, "")}`,
    whatsappHref: `https://wa.me/${branch.whatsapp.replace(/\D/g, "")}`,
    mapEmbedUrl: branch.mapEmbedUrl ?? null,
  };
}

/**
 * Dialable central studio enquiry links when ContactDetails is verified.
 * Opening WhatsApp does not mean a message was delivered.
 */
export function getStudioContactLinks(): {
  phoneHref: string | null;
  whatsappHref: string | null;
} {
  if (contactDetails.dataStatus !== "verified") {
    return { phoneHref: null, whatsappHref: null };
  }
  const phone = contactDetails.generalPhone;
  const whatsapp = contactDetails.generalWhatsapp ?? contactDetails.generalPhone;
  return {
    phoneHref: `tel:${phone.replace(/\s+/g, "")}`,
    whatsappHref: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
  };
}

export function getBusinessIdentity(): BusinessIdentity {
  return businessIdentity;
}

export function getContactDetails(): ContactDetails {
  return contactDetails;
}

export function getStudioCommercial(): StudioCommercial {
  return studioCommercial;
}

export function getFaqs(filter?: { programmeSlug?: ProgrammeSlug; branchSlug?: BranchSlug }): Faq[] {
  if (!filter?.programmeSlug && !filter?.branchSlug) return faqs;
  return faqs.filter(
    (faq) =>
      (filter.programmeSlug === undefined || faq.programmeSlug === filter.programmeSlug) &&
      (filter.branchSlug === undefined || faq.branchSlug === filter.branchSlug)
  );
}

export function getNavigationItems(placement?: NavigationPlacement): NavigationItem[] {
  const items = placement ? navigationItems.filter((item) => item.placement === placement) : navigationItems;
  return [...items].sort((a, b) => a.order - b.order);
}

export { siteHasUnverifiedContent, shouldNoIndex } from "./content-mode";
export * from "./schema";
