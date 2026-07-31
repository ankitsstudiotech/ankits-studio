import { siteHasUnverifiedContent } from "@/content/content-mode";

/**
 * Development-only visual indicator that mock/reference-only content is in
 * use — see docs/BUSINESS-DATA-STATUS.md ("mock content must be visually
 * labelled in development").
 *
 * This is narrower than the full ADR-002 layer-2 banner, which must also
 * appear on any `ALLOW_MOCK_PUBLISH=true` preview build, not just local
 * `next dev` — that broader, non-dismissable version is still open, see
 * docs/TASKS.md Track F.
 */
export function MockModeIndicator() {
  if (process.env.NODE_ENV !== "development" || !siteHasUnverifiedContent) {
    return null;
  }

  return (
    <div role="status" className="w-full bg-accent-strength px-4 py-2 text-center text-sm font-medium text-white">
      Development preview — this site is showing mock/unverified content. See docs/BUSINESS-DATA-STATUS.md.
    </div>
  );
}
