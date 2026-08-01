import {
  getBusinessIdentity,
  getNavigationItems,
  getPubliclyListedBranches,
} from "@/content";
import { PathAwareShell } from "./PathAwareShell";
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

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const identity = getBusinessIdentity();
  const identityDisclaimer =
    identity.dataStatus === "verified" ? undefined : identity.mockDisclaimer;

  return (
    <PathAwareShell
      brandName={identity.displayName}
      tagline={identity.tagline}
      navItems={toNavItems()}
      footerGroups={toFooterGroups()}
      footerDisclaimer={
        identityDisclaimer ??
        "Branch contact actions remain disabled until records are verified."
      }
    >
      {children}
    </PathAwareShell>
  );
}
