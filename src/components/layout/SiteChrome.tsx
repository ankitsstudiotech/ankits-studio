import {
  getBusinessIdentity,
  getNavigationItems,
  getPubliclyListedBranches,
} from "@/content";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { StickyCtaBar } from "./StickyCtaBar";
import type { FooterLinkGroup, NavItem } from "./types";

function toNavItems(): NavItem[] {
  return getNavigationItems("primary").map((item) => ({
    id: item.id,
    label: item.label,
    href: item.path,
    isPrimaryCta: item.isPrimaryCta,
  }));
}

function toFooterGroups(): FooterLinkGroup[] {
  const footerLinks = getNavigationItems("footer").map((item) => ({
    id: item.id,
    label: item.label,
    href: item.path,
  }));
  const branches = getPubliclyListedBranches().map((branch) => ({
    id: `footer-branch-${branch.slug}`,
    label: branch.slug.charAt(0).toUpperCase() + branch.slug.slice(1),
    href: `/locations/${branch.slug}`,
  }));

  return [
    { title: "Explore", links: footerLinks },
    { title: "Branches", links: branches },
  ];
}

/**
 * Server component. `SiteHeader` and `StickyCtaBar` are each independently
 * "use client" (they read `usePathname()` themselves) — there is no shared
 * client wrapper around them, so `SiteFooter` (no interactivity) stays a
 * pure server-rendered leaf, never entering the client bundle graph. See
 * docs/DECISIONS.md ADR-013 (ARCH-001) — this replaces the previous
 * `PathAwareShell` client wrapper, which pulled the footer into the client
 * graph for no reason.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const identity = getBusinessIdentity();
  const identityDisclaimer =
    identity.dataStatus === "verified" ? undefined : identity.mockDisclaimer;

  return (
    <>
      <SiteHeader brandName={identity.displayName} items={toNavItems()} />
      <div className="flex flex-1 flex-col">{children}</div>
      <SiteFooter
        brandName={identity.displayName}
        tagline={identity.tagline}
        groups={toFooterGroups()}
        disclaimer={
          identityDisclaimer ??
          "Branch contact actions remain disabled until records are verified."
        }
      />
      <StickyCtaBar href="/trial" hideOnPaths={["/trial", "/book-a-free-trial"]} />
    </>
  );
}
