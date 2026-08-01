"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { StickyCtaBar } from "./StickyCtaBar";
import type { FooterLinkGroup, NavItem } from "./types";

export type PathAwareShellProps = {
  brandName: string;
  tagline: string;
  navItems: NavItem[];
  footerGroups: FooterLinkGroup[];
  footerDisclaimer?: string;
  children: React.ReactNode;
};

/**
 * Client shell so header active states and sticky CTA can read the pathname.
 * Nav/footer data are still prepared on the server and passed in as props.
 */
export function PathAwareShell({
  brandName,
  tagline,
  navItems,
  footerGroups,
  footerDisclaimer,
  children,
}: PathAwareShellProps) {
  const pathname = usePathname() ?? "";

  return (
    <>
      <SiteHeader brandName={brandName} items={navItems} pathname={pathname} />
      <div className="flex flex-1 flex-col">{children}</div>
      <SiteFooter
        brandName={brandName}
        tagline={tagline}
        groups={footerGroups}
        disclaimer={footerDisclaimer}
      />
      <StickyCtaBar
        pathname={pathname}
        href="/trial"
        hideOnPaths={["/trial", "/book-a-free-trial"]}
      />
    </>
  );
}
