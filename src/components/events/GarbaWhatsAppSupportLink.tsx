"use client";

import { trackGarbaWhatsAppSupport } from "@/lib/analytics";
import { getGarbaWhatsAppSupportAction } from "@/lib/events";

export type GarbaWhatsAppSupportLinkProps = {
  className?: string;
  source?: string;
};

/** Secondary support contact — never primary ticket conversion. */
export function GarbaWhatsAppSupportLink({
  className,
  source = "event-support",
}: GarbaWhatsAppSupportLinkProps) {
  const action = getGarbaWhatsAppSupportAction();

  return (
    <a
      href={action.href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      data-garba-support="whatsapp"
      onClick={() => trackGarbaWhatsAppSupport(source)}
    >
      {action.label}
    </a>
  );
}
