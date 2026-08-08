import {
  getBusinessIdentity,
  getContactDetails,
  getNavigationItems,
  getPubliclyListedBranches,
} from "@/content";
import {
  getPrimaryConversionHref,
  getPrimaryConversionLabel,
} from "@/lib/conversion";
import { MotionReady } from "@/components/motion";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { StickyCtaBar } from "./StickyCtaBar";
import type { FooterLinkGroup, NavItem } from "./types";

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

function toNavItems(): NavItem[] {
  const primaryHref = getPrimaryConversionHref();
  return getNavigationItems("primary").map((item) => ({
    id: item.id,
    label: item.isPrimaryCta ? getPrimaryConversionLabel() : item.label,
    // Primary CTA uses WhatsApp when central contact is verified; nav path
    // stays `/trial` in content for schema constraints (path must start with `/`).
    href: item.isPrimaryCta ? primaryHref : item.path,
    isPrimaryCta: item.isPrimaryCta,
  }));
}

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

  const branches = getPubliclyListedBranches().map((branch) => ({
    id: `footer-branch-${branch.slug}`,
    label: branch.name.replace(/^Ankit's Studio —\s*/i, ""),
    href: `/locations/${branch.slug}`,
  }));

  return [
    { title: "Explore", links: exploreLinks },
    { title: "Branches", links: branches },
  ];
}

/**
 * Server component. `SiteHeader` and `StickyCtaBar` are each independently
 * "use client" (they read `usePathname()` themselves) — there is no shared
 * client wrapper around them, so `SiteFooter` (no interactivity) stays a
 * pure server-rendered leaf, never entering the client bundle graph. See
 * docs/DECISIONS.md ADR-013 (ARCH-001).
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const identity = getBusinessIdentity();
  const contact = getContactDetails();
  const primaryHref = getPrimaryConversionHref();
  const verifiedContact = contact.dataStatus === "verified";

  return (
    <>
      <MotionReady />
      <SiteHeader brandName={identity.displayName} items={toNavItems()} />
      <div className="flex flex-1 flex-col bg-field text-ink-inverse">{children}</div>
      <SiteFooter
        brandName={identity.displayName}
        tagline={identity.tagline}
        phone={verifiedContact ? contact.generalPhone : undefined}
        email={verifiedContact ? contact.generalEmail : undefined}
        groups={toFooterGroups()}
      />
      <StickyCtaBar
        href={primaryHref}
        label="WhatsApp trial"
        supportingText="Free trial"
        hideOnPaths={["/book-a-free-trial"]}
      />
    </>
  );
}
