import * as mock from "./mock";
import { toMapsPlaceListingHref } from "./maps-place-listing";
import type {
  Branch,
  BranchSlug,
  BlogPost,
  Guide,
  BusinessIdentity,
  ContactDetails,
  Faq,
  MemberStory,
  NavigationItem,
  NavigationPlacement,
  PricingPlan,
  Programme,
  ProgrammeSlug,
  StudioAbout,
  StudioCommercial,
  StudioMemberStoriesPage,
  StudioTrainersPage,
  Testimonial,
  TimetableSlot,
  Trainer,
  Transformation,
} from "./schema";
import {
  isTrainerPublishable,
  TRAINERS_ROUTE_INDEX_THRESHOLD,
} from "./schema/trainer";
import {
  isMemberStoryPublishable,
  MEMBER_STORIES_INDEX_STORY_THRESHOLD,
} from "./schema/member-story";
import {
  isTransformationPublishable,
  MEMBER_STORIES_INDEX_TRANSFORMATION_THRESHOLD,
} from "./schema/transformation";
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
const memberStories = mergeByKey(mock.mockMemberStories, verified.verifiedMemberStories, byId);
const transformations = mergeByKey(mock.mockTransformations, verified.verifiedTransformations, bySlug);
const testimonials = mergeByKey(mock.mockTestimonials, verified.verifiedTestimonials, byId);
const blogPosts = mergeByKey(mock.mockBlogPosts, verified.verifiedBlogPosts, bySlug);
const guides = mergeByKey(mock.mockGuides, verified.verifiedGuides, bySlug);
const businessIdentity = mergeSingular(mock.mockBusinessIdentity, verified.verifiedBusinessIdentity);
const contactDetails = mergeSingular(mock.mockContactDetails, verified.verifiedContactDetails);
const studioCommercial = mergeSingular(mock.mockStudioCommercial, verified.verifiedStudioCommercial);
const studioAbout = mergeSingular(mock.mockStudioAbout, verified.verifiedStudioAbout);
const studioTrainersPage = mergeSingular(
  mock.mockStudioTrainersPage,
  verified.verifiedStudioTrainersPage,
);
const studioMemberStoriesPage = mergeSingular(
  mock.mockStudioMemberStoriesPage,
  verified.verifiedStudioMemberStoriesPage,
);
const faqs = mergeByKey(mock.mockFaqs, verified.verifiedFaqs, byId);
const navigationItems = mergeByKey(mock.mockNavigationItems, verified.verifiedNavigationItems, byId);

export function getProgrammes(): Programme[] {
  return programmes;
}

/** Owner-confirmed public catalogue only (`taxonomyStatus: "confirmed"`). */
export function getConfirmedProgrammes(): Programme[] {
  return programmes.filter((programme) => programme.taxonomyStatus === "confirmed");
}

export function isConfirmedProgramme(programme: Programme): boolean {
  return programme.taxonomyStatus === "confirmed";
}

/** Legacy routes kept reachable but excluded from sitemap / primary discovery. */
export function isMigrationPendingProgramme(programme: Programme): boolean {
  return programme.taxonomyStatus === "migration-pending";
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

/** 1-based directory index matching the Home 01–04 branch system. */
export function getBranchDirectoryIndex(slug: string): number | null {
  const index = getPubliclyListedBranches().findIndex((branch) => branch.slug === slug);
  return index >= 0 ? index + 1 : null;
}

export function getBranchDirectoryNumeral(slug: string): string | null {
  const index = getBranchDirectoryIndex(slug);
  return index == null ? null : String(index).padStart(2, "0");
}

export function getBranchBySlug(slug: BranchSlug): Branch | undefined {
  return branches.find((branch) => branch.slug === slug);
}

export function getTrainers(): Trainer[] {
  return trainers;
}

/** Profiles that pass the publishability gate — safe for public marketing surfaces. */
export function getPublishableTrainers(): Trainer[] {
  return trainers.filter(isTrainerPublishable);
}

export function getTrainerBySlug(slug: string): Trainer | undefined {
  return trainers.find((trainer) => trainer.slug === slug);
}

export function getPublishableTrainerBySlug(slug: string): Trainer | undefined {
  const trainer = getTrainerBySlug(slug);
  return trainer && isTrainerPublishable(trainer) ? trainer : undefined;
}

/**
 * `/trainers` may be indexed only after enough publishable profiles exist (ADR-019).
 */
export function shouldIndexTrainersRoute(): boolean {
  return getPublishableTrainers().length >= TRAINERS_ROUTE_INDEX_THRESHOLD;
}

export { isTrainerPublishable, TRAINERS_ROUTE_INDEX_THRESHOLD };

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

/**
 * Public pricing plans — **verified rows only**.
 * Illustrative membership fees must never appear on /pricing under mock-preview.
 */
export function getPricingPlans(): PricingPlan[] {
  return pricingPlans.filter((plan) => plan.dataStatus === "verified");
}

/** All member-story records (including drafts) — prefer publishable accessors for marketing. */
export function getMemberStories(): MemberStory[] {
  return memberStories;
}

/** Publishable first-party member stories only (ADR-022). */
export function getPublishableMemberStories(): MemberStory[] {
  return memberStories.filter(isMemberStoryPublishable);
}

/**
 * Transformation records for internal tooling — never treat mock fixtures as publishable.
 * Marketing surfaces must use `getPublishableTransformations()`.
 */
export function getTransformations(): Transformation[] {
  return transformations.filter((item) => item.dataStatus === "verified");
}

/** Publishable evidence-strong transformations only (ADR-022). */
export function getPublishableTransformations(): Transformation[] {
  return transformations.filter(isTransformationPublishable);
}

/**
 * Legacy testimonial accessor — production list is empty.
 * Prefer Member Stories. Design-lab fixtures are not returned here.
 */
export function getTestimonials(): Testimonial[] {
  return testimonials.filter((item) => item.dataStatus === "verified");
}

/**
 * `/transformations` (Member Stories) may be indexed only after the ADR-022 threshold.
 */
export function shouldIndexMemberStoriesRoute(): boolean {
  return (
    getPublishableMemberStories().length >= MEMBER_STORIES_INDEX_STORY_THRESHOLD ||
    getPublishableTransformations().length >= MEMBER_STORIES_INDEX_TRANSFORMATION_THRESHOLD
  );
}

export {
  isMemberStoryPublishable,
  isTransformationPublishable,
  MEMBER_STORIES_INDEX_STORY_THRESHOLD,
  MEMBER_STORIES_INDEX_TRANSFORMATION_THRESHOLD,
};

export function getBlogPosts(): BlogPost[] {
  return blogPosts;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

/** All guide records (verified Batch 1 editorial + any future mocks). */
export function getGuides(): Guide[] {
  return guides;
}

/** Indexable / statically generated guides only. */
export function getPublishedGuides(): Guide[] {
  return guides.filter((guide) => guide.dataStatus === "verified");
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function getPublishedGuideBySlug(slug: string): Guide | undefined {
  const guide = getGuideBySlug(slug);
  return guide?.dataStatus === "verified" ? guide : undefined;
}

/** Helpful guides for a programme detail page — same-cluster, max 4. */
export function getGuidesForProgramme(programmeSlug: string): Guide[] {
  return getPublishedGuides()
    .filter((guide) => guide.primaryProgrammeSlug === programmeSlug)
    .slice(0, 4);
}

/**
 * Clickable phone/WhatsApp/Maps embed for a branch — null unless the branch
 * record is verified (ADR-011). Owner-confirmed Maps short URLs may still be
 * exposed via `getBranchMapsUrl` while printable address remains pending.
 */
export function getBranchContactLinks(branch: Branch): {
  phoneHref: string | null;
  whatsappHref: string | null;
  mapEmbedUrl: string | null;
} {
  if (branch.dataStatus !== "verified") {
    return { phoneHref: null, whatsappHref: null, mapEmbedUrl: null };
  }
  const phone = branch.phone;
  return {
    phoneHref: phone ? `tel:${phone.replace(/\s+/g, "")}` : null,
    whatsappHref: `https://wa.me/${branch.whatsapp.replace(/\D/g, "")}`,
    mapEmbedUrl: branch.mapEmbedUrl ?? null,
  };
}

/**
 * Owner-confirmed Maps short URL as stored in branch content, or null when pending.
 * This URL currently 302s to Google's /maps/dir/ navigation state — do not use
 * it as a public href. Use `getBranchMapsUrl` for outbound listing links.
 */
export function getBranchMapsOwnerUrl(branch: Branch): string | null {
  if (branch.fieldProvenance.mapsUrl !== "owner_confirmed") return null;
  return branch.mapsUrl ?? branch.mapsShortUrl ?? null;
}

/**
 * Public Maps href for a branch: the place listing for the same owner-confirmed
 * destination. Never a directions / navigation URL.
 */
export function getBranchMapsUrl(branch: Branch): string | null {
  const ownerUrl = getBranchMapsOwnerUrl(branch);
  if (!ownerUrl) return null;
  return toMapsPlaceListingHref(ownerUrl);
}

/** Physical floor programmes only — never home/online delivery modes. */
export function getBranchPhysicalProgrammes(branch: Branch): Programme[] {
  return branch.physicalProgrammeSlugs
    .map((slug) => getProgrammeBySlug(slug))
    .filter((programme): programme is Programme => programme !== undefined);
}

/**
 * Dialable central studio enquiry links when ContactDetails is verified.
 * Opening WhatsApp does not mean a message was delivered.
 */
export function getStudioContactLinks(): {
  phoneHref: string | null;
  whatsappHref: string | null;
  emailHref: string | null;
} {
  if (contactDetails.dataStatus !== "verified") {
    return { phoneHref: null, whatsappHref: null, emailHref: null };
  }
  const phone = contactDetails.generalPhone;
  const whatsapp = contactDetails.generalWhatsapp ?? contactDetails.generalPhone;
  return {
    phoneHref: `tel:${phone.replace(/\s+/g, "")}`,
    whatsappHref: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
    emailHref: `mailto:${contactDetails.generalEmail}`,
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

export function getStudioAbout(): StudioAbout {
  return studioAbout;
}

export function getHomepageIntent() {
  return mock.mockHomepageIntent;
}

export function getMediaPolicy() {
  return mock.mockMediaPolicy;
}

export function getStudioTrainersPage(): StudioTrainersPage {
  return studioTrainersPage;
}

export function getStudioMemberStoriesPage(): StudioMemberStoriesPage {
  return studioMemberStoriesPage;
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

export {
  siteHasUnverifiedContent,
  launchCriticalContentVerified,
  shouldNoIndex,
  shouldShowMockPreviewBanner,
} from "./content-mode";
export {
  isMapsDirectionsHref,
  OWNER_CONFIRMED_MAPS_SHORT_URLS,
  OWNER_MAPS_PLACE_LISTING_HREFS,
  toMapsPlaceListingHref,
} from "./maps-place-listing";
export * from "./schema";
