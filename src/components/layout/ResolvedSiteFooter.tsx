import {
  getBusinessIdentity,
  getConfirmedProgrammes,
  getContactDetails,
  getNavigationItems,
  getPubliclyListedBranches,
} from "@/content";
import { SiteFooter } from "./SiteFooter";
import type { FooterLinkGroup } from "./types";

/** Withheld Tier 2/3 destinations — keep routes, do not promote in footer. */
const FOOTER_EXCLUDE_PATHS = new Set(["/trainers", "/transformations", "/blog"]);

/** Launch-ready explore destinations (filter + inject missing). */
const FOOTER_EXPLORE_ORDER: Array<{ path: string; label: string; id: string }> = [
  { path: "/about", label: "About", id: "footer-about" },
  { path: "/programs", label: "Programmes", id: "footer-programmes" },
  { path: "/locations", label: "Locations", id: "footer-locations" },
  { path: "/timetable", label: "Batch availability", id: "footer-timetable" },
  { path: "/pricing", label: "Pricing", id: "footer-pricing" },
  { path: "/contact", label: "Contact", id: "footer-contact" },
  { path: "/privacy-policy", label: "Privacy policy", id: "footer-privacy" },
  { path: "/terms", label: "Terms", id: "footer-terms" },
];

function toFooterGroups(): FooterLinkGroup[] {
  const fromContent = new Map(
    getNavigationItems("footer")
      .filter((item) => !FOOTER_EXCLUDE_PATHS.has(item.path))
      .map((item) => [item.path, { id: item.id, label: item.label, href: item.path }]),
  );

  const exploreLinks = FOOTER_EXPLORE_ORDER.map((entry) => {
    const existing = fromContent.get(entry.path);
    return (
      existing ?? {
        id: entry.id,
        label: entry.label,
        href: entry.path,
      }
    );
  });

  const programmes = getConfirmedProgrammes().map((programme) => ({
    id: `footer-programme-${programme.slug}`,
    label: programme.name,
    href: `/programs/${programme.slug}`,
  }));

  const branches = getPubliclyListedBranches().map((branch) => ({
    id: `footer-branch-${branch.slug}`,
    label: branch.name.replace(/^Ankit's Studio —\s*/i, ""),
    href: `/locations/${branch.slug}`,
  }));

  return [
    { title: "Explore", links: exploreLinks },
    { title: "Programmes", links: programmes },
    { title: "Branches", links: branches },
  ];
}

/**
 * Footer must live in the page segment (the `S:` payload), not the layout shell.
 * Layout-shell footer paints with the loading fallback and then jumps when the
 * real page streams in — Lighthouse CLS 0.71 on `footer.border-t`.
 */
export function ResolvedSiteFooter() {
  const identity = getBusinessIdentity();
  const contact = getContactDetails();
  const verifiedContact = contact.dataStatus === "verified";

  return (
    <SiteFooter
      brandName={identity.displayName}
      tagline={identity.tagline}
      phone={verifiedContact ? contact.generalPhone : undefined}
      email={verifiedContact ? contact.generalEmail : undefined}
      instagramHref={identity.socialLinks?.instagram}
      youtubeHref={identity.socialLinks?.youtube}
      groups={toFooterGroups()}
    />
  );
}
