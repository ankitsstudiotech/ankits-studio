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
 * by the `no-restricted-imports` rule in eslint.config.mjs). This lets a
 * future swap from mock/verified arrays to a real CMS touch this one file,
 * not every component — see docs/CONTENT-MODEL.md.
 */

function mergeByKey<Item, Key>(
  mockRecords: readonly Item[],
  verifiedRecords: readonly Item[],
  keyOf: (item: Item) => Key
): Item[] {
  const verifiedKeys = new Set(verifiedRecords.map(keyOf));
  return [...verifiedRecords, ...mockRecords.filter((item) => !verifiedKeys.has(keyOf(item)))];
}

/** For singular (non-list) domains: a verified override replaces mock entirely. */
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
const faqs = mergeByKey(mock.mockFaqs, verified.verifiedFaqs, byId);
const navigationItems = mergeByKey(mock.mockNavigationItems, verified.verifiedNavigationItems, byId);

export function getProgrammes(): Programme[] {
  return programmes;
}

export function getProgrammeBySlug(slug: ProgrammeSlug): Programme | undefined {
  return programmes.find((programme) => programme.slug === slug);
}

/** All branches, including ones not publicly listed (e.g. Thane). */
export function getBranches(): Branch[] {
  return branches;
}

/** Only branches safe to show in public nav/footer/sitemap — see ADR-007 (I2). */
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

export function getTimetableSlots(filter?: { branchSlug?: BranchSlug; programmeSlug?: ProgrammeSlug }): TimetableSlot[] {
  if (!filter) return timetableSlots;
  return timetableSlots.filter(
    (slot) =>
      (filter.branchSlug === undefined || slot.branchSlug === filter.branchSlug) &&
      (filter.programmeSlug === undefined || slot.programmeSlug === filter.programmeSlug)
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

/**
 * The only sanctioned way to get a clickable phone/WhatsApp link or a Maps
 * embed URL for a branch. Structurally returns null for every field unless
 * the branch is `dataStatus === "verified"` — components must use this
 * rather than reading `branch.phone` / `branch.mapEmbedUrl` directly to
 * build an href. See docs/DECISIONS.md ADR-011.
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

export function getBusinessIdentity(): BusinessIdentity {
  return businessIdentity;
}

export function getContactDetails(): ContactDetails {
  return contactDetails;
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
