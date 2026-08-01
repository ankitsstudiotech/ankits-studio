import { siteHasUnverifiedContent } from "@/content/content-mode";

/**
 * Non-dismissable visual indicator that mock/reference-only content is in
 * use — see docs/BUSINESS-DATA-STATUS.md ("mock content must be visually
 * labelled in development") and the full ADR-002 layer-2 banner requirement.
 *
 * Shows whenever unverified content exists AND either `NODE_ENV ===
 * "development"` OR `ALLOW_MOCK_PUBLISH === "true"` (a preview build that
 * explicitly opted into shipping mock content — see docs/DECISIONS.md
 * ADR-002/ADR-011/ADR-013 MOCK-001). A verified production build (neither
 * condition true) never shows this banner. Stays absent from a genuinely
 * verified production build even if `ALLOW_MOCK_PUBLISH` were left set,
 * since `siteHasUnverifiedContent` would then be false.
 */
export function MockModeIndicator() {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isMockPreviewBuild = process.env.ALLOW_MOCK_PUBLISH === "true";

  if ((!isDevelopment && !isMockPreviewBuild) || !siteHasUnverifiedContent) {
    return null;
  }

  return (
    <div role="status" className="w-full bg-accent-strength px-4 py-2 text-center text-sm font-medium text-white">
      {isDevelopment ? "Development preview" : "Preview build"} — this site is showing mock/unverified
      content and stays noindex. See docs/BUSINESS-DATA-STATUS.md.
    </div>
  );
}
