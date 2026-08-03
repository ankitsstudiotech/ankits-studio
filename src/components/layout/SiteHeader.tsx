"use client";

import Image from "next/image";
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

const SYMBOL_SRC = "/brand/ankits-studio-symbol-transparent.png";

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
            "inline-flex min-h-11 items-center gap-2.5 text-ink-inverse",
            "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-volt)]",
            "touch-target",
          ].join(" ")}
        >
          <Image
            src={SYMBOL_SRC}
            alt=""
            width={32}
            height={32}
            className="block h-8 w-8 shrink-0 object-contain"
            priority
          />
          <span className="font-[family-name:var(--font-display)] text-xl tracking-[0.04em] sm:text-2xl">
            {brandName}
          </span>
        </Link>

        <DesktopNav items={items} pathname={pathname} />
        <MobileNav items={items} pathname={pathname} />
      </Container>
    </header>
  );
}
