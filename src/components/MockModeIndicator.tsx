import { siteHasUnverifiedContent } from "@/content/content-mode";

/**
 * Non-dismissable visual indicator that mock/reference-only content is in
 * use — see docs/BUSINESS-DATA-STATUS.md and ADR-002 layer-2.
 *
 * Shows whenever unverified content exists AND either `NODE_ENV ===
 * "development"` OR `ALLOW_MOCK_PUBLISH === "true"` (stakeholder mock
 * preview). There is no dismiss control: the banner disappears only when
 * `siteHasUnverifiedContent` becomes false (verified content mode).
 *
 * See docs/MOCK-PREVIEW-DEPLOYMENT.md.
 */
export function MockModeIndicator() {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isMockPreviewBuild = process.env.ALLOW_MOCK_PUBLISH === "true";

  if ((!isDevelopment && !isMockPreviewBuild) || !siteHasUnverifiedContent) {
    return null;
  }

  const contextLabel = isDevelopment ? "Development preview" : "Mock preview";

  return (
    <div
      role="status"
      className="w-full bg-[#c2410c] px-4 py-2.5 text-center text-sm font-medium text-white"
    >
      <p className="font-semibold tracking-wide">
        {contextLabel} — mock / unverified content · noindex
      </p>
      <p className="mt-0.5 text-xs font-normal text-white/90">
        Not live studio data. This banner cannot be dismissed; it is removed only when content
        is verified. See docs/BUSINESS-DATA-STATUS.md.
      </p>
    </div>
  );
}
