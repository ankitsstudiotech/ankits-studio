"use client";

import Link from "next/link";
import type { NavItem } from "./types";

export type DesktopNavProps = {
  items: NavItem[];
  pathname?: string;
};

export function DesktopNav({ items, pathname = "" }: DesktopNavProps) {
  const links = items.filter((item) => !item.isPrimaryCta);
  const cta = items.find((item) => item.isPrimaryCta);

  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {links.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "inline-flex min-h-11 items-center rounded-[var(--radius-md)] px-3 text-sm font-medium",
                  "transition-colors duration-[var(--duration-fast)]",
                  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring",
                  active ? "text-ink" : "text-ink-muted hover:text-ink",
                ].join(" ")}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
        {cta ? (
          <li className="ml-2">
            <Link
              href={cta.href}
              className={[
                "inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] px-4",
                "bg-accent text-sm font-semibold text-accent-foreground",
                "transition-[background-color,transform] duration-[var(--duration-fast)]",
                "hover:bg-accent-hover active:scale-[0.98] motion-reduce:active:scale-100",
                "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring",
                "touch-target",
              ].join(" ")}
            >
              {cta.label}
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
