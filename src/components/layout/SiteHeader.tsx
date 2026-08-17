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
  const cta = items.find((item) => item.isPrimaryCta);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-field">
      <Container
        full
        className="grid h-[var(--header-height)] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
      >
        <Link
          href={brandHref}
          className={[
            "inline-flex min-h-11 items-center gap-2.5 justify-self-start text-ink-inverse",
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

        <div className="flex items-center justify-end gap-2 justify-self-end">
          {cta ? (
            <Link
              href={cta.href}
              {...(cta.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={[
                "hidden lg:inline-flex min-h-11 items-center justify-center px-4",
                "bg-accent text-xs font-bold uppercase tracking-[0.1em] text-accent-foreground touch-target",
                "transition-[background-color,transform] duration-[var(--duration-fast)]",
                "hover:bg-accent-hover active:scale-[0.98] motion-reduce:active:scale-100",
                "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-volt)]",
              ].join(" ")}
            >
              {cta.label}
            </Link>
          ) : null}
          <MobileNav items={items} pathname={pathname} />
        </div>
      </Container>
    </header>
  );
}
