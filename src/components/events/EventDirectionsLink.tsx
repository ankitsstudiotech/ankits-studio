"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";
import { getGarbaDirectionsUrl } from "@/lib/events";

export type EventDirectionsLinkProps = {
  className?: string;
  children?: ReactNode;
};

export function EventDirectionsLink({
  className,
  children = "Get Directions",
}: EventDirectionsLinkProps) {
  const href = getGarbaDirectionsUrl();

  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackEvent("garba_directions_click", { source: "venue" });
      }}
    >
      {children}
    </a>
  );
}
