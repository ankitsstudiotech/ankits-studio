import type { NavigationItem } from "../schema";

/**
 * Matches docs/INFORMATION-ARCHITECTURE.md's phased primary nav exactly —
 * Tier 1 destinations + the trial CTA only. Tier 2 items (Pricing,
 * Trainers, Transformations) are intentionally absent — see
 * docs/DECISIONS.md ADR-007 finding I12. Branch links and social links are
 * intentionally not duplicated here: branches come from
 * `getPubliclyListedBranches()` directly, and no real social URLs exist yet
 * (not fabricated).
 */
export const mockNavigationItems: NavigationItem[] = [
  { dataStatus: "verified", id: "nav-home", label: "Home", path: "/", placement: "primary", order: 1 },
  {
    dataStatus: "verified",
    id: "nav-programmes",
    label: "Programmes",
    path: "/programmes",
    placement: "primary",
    order: 2,
  },
  {
    dataStatus: "verified",
    id: "nav-locations",
    label: "Locations",
    path: "/locations",
    placement: "primary",
    order: 3,
  },
  {
    dataStatus: "verified",
    id: "nav-timetable",
    label: "Timetable",
    path: "/timetable",
    placement: "primary",
    order: 4,
  },
  { dataStatus: "verified", id: "nav-contact", label: "Contact", path: "/contact", placement: "primary", order: 5 },
  {
    dataStatus: "verified",
    id: "nav-trial",
    label: "Book a Trial",
    path: "/trial",
    placement: "primary",
    order: 6,
    isPrimaryCta: true,
  },
  {
    dataStatus: "verified",
    id: "nav-footer-programmes",
    label: "Programmes",
    path: "/programmes",
    placement: "footer",
    order: 1,
  },
  { dataStatus: "verified", id: "nav-footer-blog", label: "Blog", path: "/blog", placement: "footer", order: 2 },
  {
    dataStatus: "verified",
    id: "nav-footer-contact",
    label: "Contact",
    path: "/contact",
    placement: "footer",
    order: 3,
  },
];
