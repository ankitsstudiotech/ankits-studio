import { getBusinessIdentity, getNavigationItems } from "@/content";
import {
  getPrimaryConversionHref,
  getPrimaryConversionLabel,
} from "@/lib/conversion";
import { MotionReady } from "@/components/motion";
import { SiteHeader } from "./SiteHeader";
import { StickyCtaBar } from "./StickyCtaBar";
import type { NavItem } from "./types";

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

/**
 * Header + sticky CTA only. The footer is rendered by `PageWithFooter` inside
 * each page payload so it cannot paint in the layout shell (ADR-013 ARCH-001
 * still holds: SiteFooter stays a server leaf, never imported by client chrome).
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const identity = getBusinessIdentity();

  return (
    <>
      <MotionReady />
      <SiteHeader brandName={identity.displayName} items={toNavItems()} />
      {children}
      <StickyCtaBar hideOnPaths={["/book-a-free-trial"]} />
    </>
  );
}
