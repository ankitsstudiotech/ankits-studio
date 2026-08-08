"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isStickyCtaEligiblePath } from "./stickyCtaEligibility";

export type StickyCtaBarProps = {
  label?: string;
  href?: string;
  supportingText?: string;
  /** @deprecated Prefer allowlist in stickyCtaEligibility — kept for redirect aliases. */
  hideOnPaths?: string[];
  pathname?: string;
};

const HERO_CTA_ID = "home-hero-primary-cta";
const TRIAL_SECTION_ID = "trial";
const BODY_STICKY_CLASS = "has-sticky-cta";

/**
 * Mobile-only sticky conversion bar. Desktop relies on header CTA.
 *
 * Hard-excluded: /trial, /contact (and aliases) via stickyCtaEligibility.
 * Soft-hide: /pricing and /timetable while enquiry builder is in view.
 * Homepage: reveal after hero CTA leaves view; hide when #trial is visible.
 *
 * Body padding stays while eligible so soft-hide does not cause CLS.
 */
export function StickyCtaBar({
  label = "Book a trial",
  href = "/trial",
  supportingText = "Feel the room — book a free trial",
  hideOnPaths = ["/book-a-free-trial"],
  pathname: pathnameProp,
}: StickyCtaBarProps) {
  const detectedPathname = usePathname() ?? "";
  const pathname = pathnameProp ?? detectedPathname;
  const eligible = isStickyCtaEligiblePath(pathname);
  const hardHidden = hideOnPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const active = eligible && !hardHidden;

  const isHomepage = pathname === "/" || pathname === "";
  const isSoftHideRoute = pathname === "/pricing" || pathname === "/timetable";
  const [homeVisibility, setHomeVisibility] = useState({
    heroVisible: true,
    trialVisible: false,
  });
  const [formCtaVisible, setFormCtaVisible] = useState(false);

  useEffect(() => {
    if (active) {
      document.body.classList.add(BODY_STICKY_CLASS);
    } else {
      document.body.classList.remove(BODY_STICKY_CLASS);
    }
  }, [active]);

  useEffect(() => {
    if (!active || !isHomepage) return;

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
  }, [active, isHomepage, pathname]);

  useEffect(() => {
    if (!active || !isSoftHideRoute) return;

    const formCta =
      document.getElementById("pricing-enquiry") ||
      document.getElementById("availability-enquiry");
    if (!formCta) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFormCtaVisible(Boolean(entry?.isIntersecting)),
      { root: null, threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(formCta);
    return () => observer.disconnect();
  }, [active, isSoftHideRoute, pathname]);

  if (!active) {
    return null;
  }

  const reveal =
    (!isHomepage || (!homeVisibility.heroVisible && !homeVisibility.trialVisible)) &&
    !(isSoftHideRoute && formCtaVisible);

  return (
    <div
      className={[
        "fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-field",
        "pb-[env(safe-area-inset-bottom,0px)] lg:hidden",
        "transition-[opacity,transform] duration-[var(--motion-sticky)] ease-[var(--ease-enter)] motion-reduce:transition-none",
        reveal
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0",
      ].join(" ")}
      aria-hidden={!reveal}
      data-sticky-cta-reveal={reveal ? "true" : "false"}
      data-sticky-cta-eligible="true"
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
