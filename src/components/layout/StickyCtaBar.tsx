"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type StickyCtaBarProps = {
  label?: string;
  href?: string;
  supportingText?: string;
  hideOnPaths?: string[];
  pathname?: string;
};

const HERO_CTA_ID = "home-hero-primary-cta";
const TRIAL_SECTION_ID = "trial";

/**
 * Mobile-only sticky conversion bar. Desktop relies on header CTA.
 * Touch targets ≥ 44px. Does not invent phone/WhatsApp links.
 *
 * On the homepage, the bar reveals only after the hero WhatsApp CTA leaves
 * the viewport, and hides again when the final #trial conversion is visible —
 * avoiding duplicate CTAs without layout shift (shell padding is always reserved).
 */
export function StickyCtaBar({
  label = "Book a trial",
  href = "/trial",
  supportingText = "Feel the room — book a free trial",
  hideOnPaths = ["/trial", "/book-a-free-trial"],
  pathname: pathnameProp,
}: StickyCtaBarProps) {
  const detectedPathname = usePathname() ?? "";
  const pathname = pathnameProp ?? detectedPathname;
  const isHomepage = pathname === "/";
  const isUtilityBuilder =
    pathname === "/pricing" || pathname === "/timetable" || pathname === "/contact";
  const [homeVisibility, setHomeVisibility] = useState({
    heroVisible: true,
    trialVisible: false,
  });
  const [builderVisible, setBuilderVisible] = useState(false);

  useEffect(() => {
    if (!isHomepage) return;

    const heroCta = document.getElementById(HERO_CTA_ID);
    const trialSection = document.getElementById(TRIAL_SECTION_ID);
    if (!heroCta || !trialSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setHomeVisibility((prev) => {
          let next = prev;
          for (const entry of entries) {
            if (entry.target.id === HERO_CTA_ID) {
              next = { ...next, heroVisible: entry.isIntersecting };
            }
            if (entry.target.id === TRIAL_SECTION_ID) {
              next = { ...next, trialVisible: entry.isIntersecting };
            }
          }
          return next;
        });
      },
      { root: null, threshold: 0, rootMargin: "0px" },
    );

    observer.observe(heroCta);
    observer.observe(trialSection);
    return () => observer.disconnect();
  }, [isHomepage, pathname]);

  useEffect(() => {
    if (!isUtilityBuilder) {
      setBuilderVisible(false);
      return;
    }
    const builder =
      document.getElementById("pricing-enquiry") ||
      document.getElementById("availability-enquiry") ||
      document.getElementById("contact-form") ||
      document.querySelector("form");
    if (!builder) return;
    const observer = new IntersectionObserver(
      ([entry]) => setBuilderVisible(Boolean(entry?.isIntersecting)),
      { root: null, threshold: 0.15 },
    );
    observer.observe(builder);
    return () => observer.disconnect();
  }, [isUtilityBuilder, pathname]);

  if (hideOnPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return null;
  }

  const reveal =
    (!isHomepage || (!homeVisibility.heroVisible && !homeVisibility.trialVisible)) &&
    !builderVisible;

  return (
    <div
      className={[
        "fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-field",
        "pb-[env(safe-area-inset-bottom,0px)] lg:hidden",
        "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
        reveal
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0",
      ].join(" ")}
      aria-hidden={!reveal}
      data-sticky-cta-reveal={reveal ? "true" : "false"}
    >
      <div className="mx-auto flex max-w-[var(--width-container)] items-center gap-3 px-[var(--spacing-gutter)] py-2.5">
        <p className="min-w-0 flex-1 truncate text-[length:var(--text-caption)] text-[var(--color-muted-on-field)]">
          {supportingText}
        </p>
        <Link
          href={href}
          tabIndex={reveal ? undefined : -1}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className={[
            "inline-flex min-h-11 shrink-0 items-center justify-center px-4",
            "bg-accent text-xs font-bold uppercase tracking-[0.08em] text-accent-foreground touch-target",
            "transition-[background-color,transform] duration-[var(--duration-fast)]",
            "hover:bg-accent-hover active:scale-[0.98] motion-reduce:active:scale-100",
            "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-volt)]",
          ].join(" ")}
        >
          {label}
        </Link>
      </div>
    </div>
  );
}
