import {
  getConfirmedProgrammes,
  getPubliclyListedBranches,
} from "@/content";

/**
 * Sticky WhatsApp CTA is conversion assistance on primary journeys only —
 * not universal chrome on legal/secondary/withheld routes.
 *
 * Allowlist (exact or confirmed detail):
 * `/`, `/about`, `/programs`, confirmed `/programs/[slug]`,
 * `/locations`, listed `/locations/[slug]`, `/timetable`, `/pricing`,
 * `/contact`, `/trial` (+ `/trial/*`).
 *
 * Everything else is ineligible (privacy, terms, trainers, transformations,
 * blog, 404, legacy programmes, design-lab, …).
 */
export function isStickyCtaEligiblePath(pathname: string): boolean {
  const path = pathname.split("?")[0]?.replace(/\/$/, "") || "/";
  const normalized = path === "" ? "/" : path;

  if (
    normalized === "/" ||
    normalized === "/about" ||
    normalized === "/programs" ||
    normalized === "/locations" ||
    normalized === "/timetable" ||
    normalized === "/pricing" ||
    normalized === "/contact" ||
    normalized === "/trial"
  ) {
    return true;
  }

  if (normalized.startsWith("/trial/")) {
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
