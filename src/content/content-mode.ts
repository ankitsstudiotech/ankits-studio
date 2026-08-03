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
 * Mock vs. verified content mode, and the production mock-content safety
 * check — see docs/DECISIONS.md ADR-002 (the four-layer launch gate) and
 * ADR-011 (leak-path hardening). This module has no React/Next.js
 * dependency so it can be imported from next.config.ts at config-load time.
 */

interface ProvenanceLike {
  dataStatus: "mock" | "reference-only" | "verified";
}

function hasUnverified(records: readonly ProvenanceLike[]): boolean {
  return records.some((record) => record.dataStatus !== "verified");
}

const allContentDomainRecords: readonly ProvenanceLike[] = [
  ...mockProgrammes,
  ...mockBranches,
  ...mockTrainers,
  ...mockTimetableSlots,
  ...mockPricingPlans,
  ...mockBlogPosts,
  mockBusinessIdentity,
  mockContactDetails,
  mockStudioCommercial,
  mockStudioAbout,
  mockStudioTrainersPage,
  mockStudioMemberStoriesPage,
  ...mockFaqs,
  ...mockNavigationItems,
];

/** True whenever any record across the content domain isn't `"verified"`. */
export const siteHasUnverifiedContent = hasUnverified(allContentDomainRecords);

export const isProductionBuild = process.env.NODE_ENV === "production";

/**
 * Explicit opt-in for a production build to proceed while unverified
 * content exists — e.g. a preview deploy. Must be exactly `"true"`; unset
 * or any other value is treated as not allowed.
 */
export const isMockPublishAllowed = process.env.ALLOW_MOCK_PUBLISH === "true";

/**
 * Layer 3 of the ADR-002 launch gate. Call at build/config-load time (see
 * next.config.ts). Throws — and so fails the build — when this is a
 * production build, unverified content is present, and
 * `ALLOW_MOCK_PUBLISH` was not explicitly set to `"true"`.
 */
export function assertMockContentSafeForBuild(): void {
  if (isProductionBuild && siteHasUnverifiedContent && !isMockPublishAllowed) {
    throw new Error(
      'Production build blocked: unverified ("mock" or "reference-only") content ' +
        "is present in src/content, and ALLOW_MOCK_PUBLISH is not set to \"true\". " +
        "See docs/DECISIONS.md ADR-002 and ADR-011. Either verify the remaining " +
        "docs/BUSINESS-DATA-STATUS.md domains, or set ALLOW_MOCK_PUBLISH=true for an " +
        "explicitly-allowed preview build (which still ships noindex — see shouldNoIndex())."
    );
  }
}

/**
 * Layer 4 of the ADR-002 launch gate. True unless this is a production
 * build with zero unverified content anywhere in the content domain — i.e.
 * every other case (dev, preview, an explicitly mock-publish-allowed build)
 * stays noindex, even when `assertMockContentSafeForBuild` let the build
 * proceed.
 */
export function shouldNoIndex(): boolean {
  return !(isProductionBuild && !siteHasUnverifiedContent);
}
