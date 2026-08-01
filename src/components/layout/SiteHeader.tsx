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
    <header className="sticky top-0 z-30 border-b border-white/10 bg-field">
      <Container className="flex h-[var(--header-height)] items-center justify-between gap-4">
        <Link
          href={brandHref}
          className={[
            "inline-flex min-h-11 items-center font-[family-name:var(--font-display)] text-2xl tracking-[0.04em] text-ink-inverse sm:text-[1.75rem]",
            "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-volt)]",
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
