import {
  mockBlogPosts,
  mockBranches,
  mockBusinessIdentity,
  mockContactDetails,
  mockFaqs,
  mockNavigationItems,
  mockPricingPlans,
  mockProgrammes,
  mockStudioCommercial,
  mockStudioAbout,
  mockStudioTrainersPage,
  mockStudioMemberStoriesPage,
  mockTimetableSlots,
  mockTrainers,
} from "./mock";

/**
 * Mock vs. verified content mode, and the production launch gate.
 * See docs/DECISIONS.md ADR-002 / ADR-011.
 *
 * V1 launch rule: enquiry-based gaps (exact fees, batch grids) and soft
 * unpublished domains (sample blog, illustrative FAQs, mock timetable rows
 * that public getters already hide) must not force ALLOW_MOCK_PUBLISH or
 * site-wide noindex. Fake customer evidence must still never publish.
 */

interface ProvenanceLike {
  dataStatus: "mock" | "reference-only" | "verified";
}

function hasUnverified(records: readonly ProvenanceLike[]): boolean {
  return records.some((record) => record.dataStatus !== "verified");
}

/**
 * Soft / unpublished domains — may stay mock. Public getters already withhold
 * fake schedules, fees, trainers and testimonials. These do not block V1.
 */
const softContentDomainRecords: readonly ProvenanceLike[] = [
  ...mockTimetableSlots,
  ...mockPricingPlans,
  ...mockBlogPosts,
  ...mockFaqs,
  ...mockTrainers,
  mockStudioTrainersPage,
  mockStudioMemberStoriesPage,
];

/**
 * Launch-critical marketing facts — must be verified for an indexable
 * production build without ALLOW_MOCK_PUBLISH.
 */
const launchCriticalRecords: readonly ProvenanceLike[] = [
  ...mockProgrammes,
  ...mockBranches,
  mockBusinessIdentity,
  mockContactDetails,
  mockStudioCommercial,
  mockStudioAbout,
  ...mockNavigationItems,
];

const allContentDomainRecords: readonly ProvenanceLike[] = [
  ...launchCriticalRecords,
  ...softContentDomainRecords,
];

/** True whenever any record across the content domain isn't `"verified"`. */
export const siteHasUnverifiedContent = hasUnverified(allContentDomainRecords);

/** True when launch-critical marketing records are fully verified. */
export const launchCriticalContentVerified = !hasUnverified(launchCriticalRecords);

export const isProductionBuild = process.env.NODE_ENV === "production";

/**
 * Explicit opt-in for a mock/preview production build. Must be exactly `"true"`.
 * Preview builds stay noindex even when launch-critical content is verified.
 */
export const isMockPublishAllowed = process.env.ALLOW_MOCK_PUBLISH === "true";

/**
 * Layer 3 — fail the production build only when launch-critical content is
 * still unverified and the operator did not opt into a preview publish.
 * Soft mock domains (blog samples, FAQ drafts, withheld timetable rows) are
 * allowed without ALLOW_MOCK_PUBLISH.
 */
export function assertMockContentSafeForBuild(): void {
  if (isProductionBuild && !launchCriticalContentVerified && !isMockPublishAllowed) {
    throw new Error(
      'Production build blocked: unverified launch-critical content is present ' +
        "in src/content, and ALLOW_MOCK_PUBLISH is not set to \"true\". " +
        "Verify programmes, branches, contact, identity, about, commercial and navigation, " +
        "or set ALLOW_MOCK_PUBLISH=true for an explicitly noindex preview build.",
    );
  }
}

/**
 * True for a real hosted production release (Vercel Production) or an
 * explicit local release simulation (`ANKITS_PRODUCTION_RELEASE=true`).
 * Local preview builds and synthetic art-direction builds must not set these.
 */
export function isRealProductionRelease(): boolean {
  if (process.env.VERCEL_ENV === "production") return true;
  if (process.env.ANKITS_PRODUCTION_RELEASE === "true") return true;
  return false;
}

/**
 * Hard release gate — Stage 7.
 * Blocks shipping synthetic media, concept-preview, or mock-publish flags on a
 * real production release. Does not block local / Preview concept builds unless
 * ANKITS_PRODUCTION_RELEASE=true or VERCEL_ENV=production.
 */
export function assertProductionReleaseSafe(): void {
  if (!isRealProductionRelease()) return;

  if (process.env.ANKITS_CONCEPT_PREVIEW === "true") {
    throw new Error(
      "Production release blocked: ANKITS_CONCEPT_PREVIEW=true. " +
        "Concept preview is a separate noindex Preview deployment only — never Production.",
    );
  }

  if (process.env.NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA === "true") {
    throw new Error(
      "Production release blocked: NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=true. " +
        "Unset for Vercel Production. Use owner-approved illustrative-ai in the catalogue instead; " +
        "this flag is for concept-preview / experimental synthetic-preview only.",
    );
  }

  if (process.env.ALLOW_MOCK_PUBLISH === "true") {
    throw new Error(
      'Production release blocked: ALLOW_MOCK_PUBLISH=true. ' +
        "Unset ALLOW_MOCK_PUBLISH for a real production release.",
    );
  }
}

/**
 * Site-wide robots gate.
 * Indexable only for a real production build with verified launch-critical
 * content and without ALLOW_MOCK_PUBLISH / concept-preview (those stay noindex).
 */
export function shouldNoIndex(): boolean {
  // Inline env read — content-mode is imported from next.config (no @/ alias).
  if (process.env.ANKITS_CONCEPT_PREVIEW === "true") return true;
  if (!isProductionBuild) return true;
  if (isMockPublishAllowed) return true;
  return !launchCriticalContentVerified;
}

/**
 * Compact preview chrome may show in development, or on an explicit
 * ALLOW_MOCK_PUBLISH preview build, while soft or critical content remains
 * unverified. Real production never shows it.
 */
export function shouldShowMockPreviewBanner(): boolean {
  if (!siteHasUnverifiedContent) return false;
  if (isMockPublishAllowed) return true;
  return !isProductionBuild;
}
