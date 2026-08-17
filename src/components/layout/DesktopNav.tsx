"use client";

import Link from "next/link";
import type { NavItem } from "./types";

export type DesktopNavProps = {
  items: NavItem[];
  pathname?: string;
};

export function DesktopNav({ items, pathname = "" }: DesktopNavProps) {
  // Contact stays in mobile menu + footer; desktop keeps Pricing visible without crowding.
  const links = items.filter(
    (item) => !item.isPrimaryCta && item.href !== "/contact",
  );

  return (
    <nav aria-label="Primary" className="hidden justify-self-center lg:block">
      <ul className="flex items-center gap-1">
        {links.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(`${item.href}/`));
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "inline-flex min-h-11 items-center px-2.5 text-sm font-medium xl:px-3",
                  "transition-[color,background-size] duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
                  "bg-[linear-gradient(var(--color-accent),var(--color-accent))] bg-no-repeat bg-[length:0_1px] bg-[position:0_100%]",
                  "hover:bg-[length:100%_1px] focus-visible:bg-[length:100%_1px]",
                  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-volt)]",
                  "motion-reduce:transition-none motion-reduce:bg-none",
                  active
                    ? "text-ink-inverse bg-[length:100%_1px]"
                    : "text-[var(--color-muted-on-field)] hover:text-ink-inverse",
                ].join(" ")}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
