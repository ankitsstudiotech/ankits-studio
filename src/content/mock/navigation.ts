import type { NavigationItem } from "../schema";

/**
 * Primary nav stays Tier 1 (+ trial CTA). Footer carries Tier 2/3 and legal
 * destinations once those routes ship with inline disclaimers (ADR-007 I12).
 *
 * Booking path is `/trial` (IA). `/book-a-free-trial` redirects there.
 */
export const mockNavigationItems: NavigationItem[] = [
  { dataStatus: "verified", id: "nav-home", label: "Home", path: "/", placement: "primary", order: 1 },
  {
    dataStatus: "verified",
    id: "nav-programmes",
    label: "Programmes",
    path: "/programs",
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
    label: "Batch Availability",
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
    id: "nav-footer-about",
    label: "About",
    path: "/about",
    placement: "footer",
    order: 1,
  },
  {
    dataStatus: "verified",
    id: "nav-footer-programmes",
    label: "Programmes",
    path: "/programs",
    placement: "footer",
    order: 2,
  },
  {
    dataStatus: "verified",
    id: "nav-footer-trainers",
    label: "Trainers",
    path: "/trainers",
    placement: "footer",
    order: 3,
  },
  {
    dataStatus: "verified",
    id: "nav-footer-pricing",
    label: "Pricing",
    path: "/pricing",
    placement: "footer",
    order: 4,
  },
  {
    dataStatus: "verified",
    id: "nav-footer-transformations",
    label: "Member Stories",
    path: "/transformations",
    placement: "footer",
    order: 5,
  },
  { dataStatus: "verified", id: "nav-footer-blog", label: "Blog", path: "/blog", placement: "footer", order: 6 },
  {
    dataStatus: "verified",
    id: "nav-footer-contact",
    label: "Contact",
    path: "/contact",
    placement: "footer",
    order: 7,
  },
  {
    dataStatus: "verified",
    id: "nav-footer-privacy",
    label: "Privacy policy",
    path: "/privacy-policy",
    placement: "footer",
    order: 8,
  },
  {
    dataStatus: "verified",
    id: "nav-footer-terms",
    label: "Terms",
    path: "/terms",
    placement: "footer",
    order: 9,
  },
];
