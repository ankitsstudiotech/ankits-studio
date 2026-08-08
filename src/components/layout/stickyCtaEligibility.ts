import {
  getConfirmedProgrammes,
  getPubliclyListedBranches,
} from "@/content";

/**
 * Sticky WhatsApp CTA is conversion assistance on browse journeys only.
 *
 * Allowlist:
 * `/`, `/about`, `/programs`, confirmed `/programs/[slug]`,
 * `/locations`, listed `/locations/[slug]`, `/timetable`, `/pricing`
 *
 * Hard-excluded conversion destinations (in-page builders own the CTA):
 * `/trial`, `/contact` (+ aliases)
 *
 * Soft-hide on `/pricing` and `/timetable` while the enquiry builder is in view
 * is handled by StickyCtaBar IntersectionObserver.
 */
export function isStickyCtaEligiblePath(pathname: string): boolean {
  const path = pathname.split("?")[0]?.replace(/\/$/, "") || "/";
  const normalized = path === "" ? "/" : path;

  if (
    normalized === "/trial" ||
    normalized.startsWith("/trial/") ||
    normalized === "/contact" ||
    normalized === "/book-a-free-trial"
  ) {
    return false;
  }

  if (
    normalized === "/" ||
    normalized === "/about" ||
    normalized === "/programs" ||
    normalized === "/locations" ||
    normalized === "/timetable" ||
    normalized === "/pricing"
  ) {
    return true;
  }

  const programmeMatch = normalized.match(/^\/programs\/([^/]+)$/);
  if (programmeMatch) {
    const slug = programmeMatch[1];
    return getConfirmedProgrammes().some((programme) => programme.slug === slug);
  }

  const locationMatch = normalized.match(/^\/locations\/([^/]+)$/);
  if (locationMatch) {
    const slug = locationMatch[1];
    return getPubliclyListedBranches().some((branch) => branch.slug === slug);
  }

  return false;
}
