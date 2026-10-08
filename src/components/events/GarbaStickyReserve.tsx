"use client";

import { EventBookingCTA } from "./EventBookingCTA";
import styles from "./garba-night.module.css";

/** Mobile-only sticky reserve CTA — safe-area aware; hidden from md+. */
export function GarbaStickyReserve() {
  return (
    <div className={styles.stickyBar} data-sticky="garba-reserve">
      <div className={styles.stickyInner}>
        <EventBookingCTA
          source="sticky-mobile"
          variant="sticky"
          className={styles.stickyCta}
        />
      </div>
    </div>
  );
}
