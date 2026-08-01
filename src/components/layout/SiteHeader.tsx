"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import type { NavItem } from "./types";

export type SiteHeaderProps = {
  brandName?: string;
  brandHref?: string;
  items: NavItem[];
  /** Overrides the detected pathname (e.g. design-lab's static showcase). Most callers should omit this and let the header detect it itself. */
  pathname?: string;
};

export function SiteHeader({
  brandName = "Ankit's Studio",
  brandHref = "/",
  items,
  pathname: pathnameProp,
}: SiteHeaderProps) {
  const detectedPathname = usePathname() ?? "";
  const pathname = pathnameProp ?? detectedPathname;

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-surface/90 backdrop-blur-md">
      <Container className="flex h-[var(--header-height)] items-center justify-between gap-4">
        <Link
          href={brandHref}
          className={[
            "inline-flex min-h-11 items-center font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-ink sm:text-xl",
            "rounded-[var(--radius-sm)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring",
            "touch-target",
          ].join(" ")}
        >
          {brandName}
        </Link>

        <DesktopNav items={items} pathname={pathname} />
        <MobileNav items={items} pathname={pathname} />
      </Container>
    </header>
  );
}
