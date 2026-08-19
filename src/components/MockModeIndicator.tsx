import { siteHasUnverifiedContent } from "@/content/content-mode";
import { shouldShowMockPreviewBanner } from "@/content/content-mode";

/**
 * Compact preview notice for development / explicit mock-publish builds.
 * Never renders in real production — see shouldShowMockPreviewBanner().
 *
 * Warning amber (not brand action purple) so status never collides with CTAs.
 */
export function MockModeIndicator() {
  if (!shouldShowMockPreviewBanner()) {
    return null;
  }

  const isDevelopment = process.env.NODE_ENV === "development";
  const contextLabel = isDevelopment ? "Development preview" : "Mock preview";

  return (
    <div
      role="status"
      className="w-full bg-[var(--color-warning)] px-3 py-1.5 text-center text-[var(--color-warning-foreground)] sm:px-4 sm:py-2"
    >
      <p className="text-xs font-semibold tracking-wide sm:text-sm">
        {contextLabel} — some details still pending confirmation · noindex
      </p>
      {siteHasUnverifiedContent ? (
        <p className="mt-0.5 hidden text-xs font-normal opacity-90 sm:block">
          Soft unpublished domains may still be mock. This banner does not appear on a real
          production deploy.
        </p>
      ) : null}
    </div>
  );
}
