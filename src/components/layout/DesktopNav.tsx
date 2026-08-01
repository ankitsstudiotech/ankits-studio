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
                  "inline-flex min-h-11 items-center px-3 text-xs font-medium uppercase tracking-[0.1em]",
                  "transition-[color,background-size] duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
                  "bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0_1px] bg-[position:0_100%]",
                  "hover:bg-[length:100%_1px] focus-visible:bg-[length:100%_1px]",
                  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-volt)]",
                  "motion-reduce:transition-none motion-reduce:bg-none",
                  active ? "text-ink-inverse" : "text-[var(--color-muted-on-field)] hover:text-ink-inverse",
                ].join(" ")}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
        {cta ? (
          <li className="ml-3">
            <Link
              href={cta.href}
              className={[
                "inline-flex min-h-11 items-center justify-center px-4",
                "bg-accent text-xs font-bold uppercase tracking-[0.1em] text-accent-foreground touch-target",
                "transition-[background-color,transform] duration-[var(--duration-fast)]",
                "hover:bg-accent-hover active:scale-[0.98] motion-reduce:active:scale-100",
                "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-volt)]",
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
