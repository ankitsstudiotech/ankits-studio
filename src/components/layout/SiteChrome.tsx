import {
  getBusinessIdentity,
  getNavigationItems,
  getPubliclyListedBranches,
} from "@/content";
import {
  getPrimaryConversionHref,
  getPrimaryConversionLabel,
  SECONDARY_TRIAL_FORM_HREF,
} from "@/lib/conversion";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { StickyCtaBar } from "./StickyCtaBar";
import type { FooterLinkGroup, NavItem } from "./types";

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
  const footerLinks = getNavigationItems("footer").map((item) => ({
    id: item.id,
    label: item.label,
    href: item.path,
  }));
  const branches = getPubliclyListedBranches().map((branch) => ({
    id: `footer-branch-${branch.slug}`,
    label: branch.name.replace(/^Ankit's Studio —\s*/i, ""),
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
 * docs/DECISIONS.md ADR-013 (ARCH-001).
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const identity = getBusinessIdentity();
  const identityDisclaimer =
    identity.dataStatus === "verified" ? undefined : identity.mockDisclaimer;
  const primaryHref = getPrimaryConversionHref();

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
          "Branch addresses remain pending confirmation. Central WhatsApp opens a chat — it does not confirm message delivery. Trial form remains available as a secondary path."
        }
      />
      <StickyCtaBar
        href={primaryHref}
        label={getPrimaryConversionLabel()}
        supportingText="Free trial — message us on WhatsApp"
        hideOnPaths={[SECONDARY_TRIAL_FORM_HREF, "/book-a-free-trial"]}
      />
    </>
  );
}
