"use client";

import type { ReactNode } from "react";
import { HeroReveal } from "./PulseReveal";

export type RouteOpeningProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Thin client wrapper for route opening blocks (kicker, h1, lede, CTA).
 * Sequences children via HeroReveal; safe to nest inside server pages.
 */
export function RouteOpening({ children, className }: RouteOpeningProps) {
  return <HeroReveal className={className}>{children}</HeroReveal>;
}
