"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { DURATION, EASE } from "@/components/motion/tokens";
import type { NavItem } from "./types";

export type MobileNavProps = {
  items: NavItem[];
  pathname?: string;
};

function getFocusable(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true");
}

/**
 * Mobile navigation — designed open/close (≤300ms), Escape, focus return, scroll lock.
 */
export function MobileNav({ items, pathname = "" }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusable = getFocusable(panel);
    focusable[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) {
      triggerRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  const onTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" && !open) {
      event.preventDefault();
      setOpen(true);
    }
  };

  const openMs = reduce ? 0 : DURATION.menuOpen;
  const closeMs = reduce ? 0 : DURATION.menuClose;

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        className={[
          "inline-flex min-h-11 min-w-11 items-center justify-center",
          "border border-white/25 bg-field-raised text-ink-inverse",
          "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-volt)]",
          "touch-target",
        ].join(" ")}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={onTriggerKeyDown}
      >
        <span aria-hidden className="flex w-5 flex-col gap-1.5">
          <span
            className={[
              "block h-0.5 w-full bg-current transition-transform duration-[var(--motion-menu-open)] motion-reduce:transition-none",
              open ? "translate-y-2 rotate-45" : "",
            ].join(" ")}
          />
          <span
            className={[
              "block h-0.5 w-full bg-current transition-opacity duration-[var(--motion-menu-open)] motion-reduce:transition-none",
              open ? "opacity-0" : "",
            ].join(" ")}
          />
          <span
            className={[
              "block h-0.5 w-full bg-current transition-transform duration-[var(--motion-menu-open)] motion-reduce:transition-none",
              open ? "-translate-y-2 -rotate-45" : "",
            ].join(" ")}
          />
        </span>
      </button>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <>
                  <motion.div
                    key="nav-backdrop"
                    className="fixed inset-0 z-40 bg-black/70"
                    aria-hidden
                    onClick={close}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: openMs, ease: EASE.exit }}
                  />
                  <motion.div
                    key="nav-panel"
                    ref={panelRef}
                    id={panelId}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile navigation"
                    className={[
                      "fixed inset-y-0 right-0 z-50 flex w-[min(100%,22rem)] flex-col",
                      "border-l border-white/10 bg-field",
                    ].join(" ")}
                    initial={reduce ? false : { x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{
                      duration: open ? openMs : closeMs,
                      ease: open ? EASE.enter : EASE.exit,
                    }}
                  >
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                      <p className="font-[family-name:var(--font-display)] text-xl tracking-[0.04em] text-ink-inverse">
                        Menu
                      </p>
                      <button
                        type="button"
                        className="inline-flex min-h-11 min-w-11 items-center justify-center text-ink-inverse touch-target focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-volt)]"
                        aria-label="Close menu"
                        onClick={close}
                      >
                        <span aria-hidden className="text-2xl leading-none">
                          ×
                        </span>
                      </button>
                    </div>

                    <nav aria-label="Mobile primary" className="flex-1 overflow-y-auto px-3 py-4">
                      <ul className="flex flex-col gap-1">
                        {items.map((item, index) => {
                          const active = pathname === item.href;
                          return (
                            <motion.li
                              key={item.id}
                              initial={reduce ? false : { opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: reduce ? 0 : 0.18,
                                delay: reduce ? 0 : Math.min(0.04 + index * 0.03, 0.2),
                                ease: EASE.enter,
                              }}
                            >
                              <Link
                                href={item.href}
                                aria-current={active ? "page" : undefined}
                                onClick={close}
                                {...(item.href.startsWith("http")
                                  ? { target: "_blank", rel: "noopener noreferrer" }
                                  : {})}
                                className={[
                                  "flex min-h-11 items-center px-3 text-sm font-medium touch-target",
                                  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-volt)]",
                                  item.isPrimaryCta
                                    ? "bg-accent text-accent-foreground justify-center font-bold uppercase tracking-[0.08em] text-xs"
                                    : active
                                      ? "bg-field-raised text-ink-inverse"
                                      : "text-[var(--color-muted-on-field)] hover:bg-field-raised hover:text-ink-inverse",
                                ].join(" ")}
                              >
                                {item.label}
                              </Link>
                            </motion.li>
                          );
                        })}
                      </ul>
                    </nav>
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}

      {!open ? <div id={panelId} hidden /> : null}
    </div>
  );
}
