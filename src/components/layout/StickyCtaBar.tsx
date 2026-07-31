"use client";

import Link from "next/link";

export type StickyCtaBarProps = {
  label?: string;
  href?: string;
  supportingText?: string;
  /** Hide on these path prefixes (e.g. already on /trial). */
  hideOnPaths?: string[];
  pathname?: string;
};

/**
 * Mobile-only sticky conversion bar. Desktop relies on header CTA.
 * Touch targets ≥ 44px. Does not invent phone/WhatsApp links.
 */
export function StickyCtaBar({
  label = "Book a trial",
  href = "/trial",
  supportingText = "Try a class — illustrative CTA",
  hideOnPaths = ["/trial"],
  pathname = "",
}: StickyCtaBarProps) {
  if (hideOnPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return null;
  }

  return (
    <div
      className={[
        "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface-raised/95 backdrop-blur-md",
        "pb-[env(safe-area-inset-bottom,0px)] lg:hidden",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-[var(--width-container)] items-center gap-3 px-[var(--spacing-gutter)] py-2.5">
        <p className="min-w-0 flex-1 truncate text-[length:var(--text-caption)] text-ink-muted">
          {supportingText}
        </p>
        <Link
          href={href}
          className={[
            "inline-flex min-h-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] px-4",
            "bg-accent text-sm font-semibold text-accent-foreground touch-target",
            "transition-[background-color,transform] duration-[var(--duration-fast)]",
            "hover:bg-accent-hover active:scale-[0.98] motion-reduce:active:scale-100",
            "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring",
          ].join(" ")}
        >
          {label}
        </Link>
      </div>
    </div>
  );
}
