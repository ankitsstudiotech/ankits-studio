"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EventBookingCTA } from "./EventBookingCTA";
import styles from "./garba-night.module.css";

export type GarbaCampaignRibbonProps = {
  eventPath: string;
  memberPriceLabel: string;
  guestPriceLabel: string;
};

/**
 * Site-wide seasonal campaign band below the header.
 * Suppressed on the event page itself to avoid redundant messaging.
 */
export function GarbaCampaignRibbon({
  eventPath,
  memberPriceLabel,
  guestPriceLabel,
}: GarbaCampaignRibbonProps) {
  const pathname = usePathname();
  if (pathname === eventPath || pathname?.startsWith(`${eventPath}/`)) {
    return null;
  }

  return (
    <aside className={styles.campaignRibbon} aria-label="Garba Night campaign">
      <div className={styles.campaignRibbonInner}>
        <Link href={eventPath} className={styles.campaignRibbonPrimary}>
          Garba Night · 17 Oct · Airoli
        </Link>
        <p className={styles.campaignRibbonPrices}>
          Members {memberPriceLabel}
          <span aria-hidden="true"> · </span>
          Guests {guestPriceLabel}
        </p>
        <EventBookingCTA
          source="campaign-ribbon"
          className={styles.campaignRibbonCta}
        />
      </div>
    </aside>
  );
}
