"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { getStickyCtaPresentation } from "@/lib/conversion";
import { isStickyCtaEligiblePath } from "./stickyCtaEligibility";
import { isSoftHideTargetInView, subscribeSoftHide } from "./stickyCtaSoftHide";

export type StickyCtaBarProps = {
  /** @deprecated Presentation is derived from conversion intent. */
  label?: string;
  /** @deprecated Presentation is derived from conversion intent. */
  href?: string;
  /** @deprecated Presentation is derived from conversion intent. */
  supportingText?: string;
  /** @deprecated Prefer allowlist in stickyCtaEligibility — kept for redirect aliases. */
  hideOnPaths?: string[];
  pathname?: string;
};

const HERO_CTA_ID = "home-hero-primary-cta";
const TRIAL_SECTION_ID = "trial";
const BODY_STICKY_CLASS = "has-sticky-cta";

function isProgrammeDetailPath(pathname: string): boolean {
  const path = pathname.split("?")[0]?.replace(/\/$/, "") || "/";
  return /^\/programs\/[^/]+$/.test(path);
}

function subscribeNoop() {
  return () => undefined;
}

function getSoftHideSnapshot() {
  return isSoftHideTargetInView();
}

function getSoftHideServerSnapshot() {
  return false;
}

/**
 * Mobile-only sticky conversion bar. Desktop relies on header CTA.
 *
 * Copy and href follow programme conversionIntent (trial vs service-enquiry).
 */
export function StickyCtaBar({
  hideOnPaths = ["/book-a-free-trial"],
  pathname: pathnameProp,
}: StickyCtaBarProps) {
  const detectedPathname = usePathname() ?? "";
  const pathname = detectedPathname || pathnameProp || "";
  const eligible = isStickyCtaEligiblePath(pathname);
  const hardHidden = hideOnPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const active = eligible && !hardHidden;
  const presentation = getStickyCtaPresentation(pathname);

  const isHomepage = pathname === "/" || pathname === "";
  const isSoftHideRoute = pathname === "/pricing" || pathname === "/timetable";
  const isProgrammeRoute = isProgrammeDetailPath(pathname);
  const [homeVisibility, setHomeVisibility] = useState({
    heroVisible: true,
    trialVisible: false,
  });
  const targetInView = useSyncExternalStore(
    isSoftHideRoute || isProgrammeRoute ? subscribeSoftHide : subscribeNoop,
    getSoftHideSnapshot,
    getSoftHideServerSnapshot,
  );
  const inPageCtaVisible = (isSoftHideRoute || isProgrammeRoute) && targetInView;

  useEffect(() => {
    if (active) {
      document.body.classList.add(BODY_STICKY_CLASS);
    } else {
      document.body.classList.remove(BODY_STICKY_CLASS);
    }
    return () => document.body.classList.remove(BODY_STICKY_CLASS);
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

  if (!active) {
    return null;
  }

  const reveal =
    (!isHomepage || (!homeVisibility.heroVisible && !homeVisibility.trialVisible)) &&
    !inPageCtaVisible;

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
      data-sticky-cta-intent={presentation.intent}
      data-sticky-cta-programme={isProgrammeRoute ? "true" : "false"}
    >
      <div className="flex w-full items-center gap-3 px-[var(--layout-gutter)] py-2.5">
        <p className="min-w-0 flex-1 truncate text-[length:var(--text-caption)] text-[var(--color-muted-on-field)]">
          {presentation.supportingText}
        </p>
        <Link
          href={presentation.href}
          tabIndex={reveal ? undefined : -1}
          {...(presentation.href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className={[
            "inline-flex min-h-11 shrink-0 items-center justify-center px-3 sm:px-4",
            "bg-accent text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-accent-foreground touch-target sm:text-xs sm:tracking-[0.08em]",
            "whitespace-nowrap",
            "transition-[background-color,transform] duration-[var(--duration-fast)]",
            "hover:bg-accent-hover active:scale-[0.98] motion-reduce:active:scale-100",
            "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-volt)]",
          ].join(" ")}
        >
          {presentation.label}
        </Link>
      </div>
    </div>
  );
}
