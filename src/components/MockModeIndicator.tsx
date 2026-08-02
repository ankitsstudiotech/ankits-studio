import { siteHasUnverifiedContent } from "@/content/content-mode";

/**
 * Non-dismissable visual indicator that mock/reference-only content is in
 * use — see docs/BUSINESS-DATA-STATUS.md and ADR-002 layer-2.
 *
 * Warning amber (not brand action purple) so status never collides with CTAs.
 * Mobile: single concise line to reduce first-viewport chrome tax.
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
      className="w-full bg-[var(--color-warning)] px-3 py-1.5 text-center text-[var(--color-warning-foreground)] sm:px-4 sm:py-2"
    >
      <p className="text-xs font-semibold tracking-wide sm:text-sm">
        {contextLabel} — some details still pending confirmation · noindex
      </p>
      <p className="mt-0.5 hidden text-xs font-normal opacity-90 sm:block">
        Not every address, timetable, or fee on this preview is final. This banner stays until
        remaining content is verified.
      </p>
    </div>
  );
}
