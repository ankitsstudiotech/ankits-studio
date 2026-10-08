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
 * Suppressed on Home (Garba already owns the hero) and on the event page.
 */
export function GarbaCampaignRibbon({
  eventPath,
  memberPriceLabel,
  guestPriceLabel,
}: GarbaCampaignRibbonProps) {
  const pathname = usePathname();
  const path = pathname?.split("?")[0]?.replace(/\/$/, "") || "/";
  const isHome = path === "/" || path === "";
  const isEvent =
    path === eventPath || path.startsWith(`${eventPath}/`);

  if (isHome || isEvent) {
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
