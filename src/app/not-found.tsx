import Link from "next/link";
import { SiteChrome } from "@/components/layout";
import { RouteOpening } from "@/components/motion";
import styles from "@/components/status/pulse/status.module.css";

/**
 * Wrapped in the same `SiteChrome` every real route uses, so a 404 doesn't
 * strand a visitor without header/nav/footer — see docs/DECISIONS.md
 * ADR-013 (VIS-006).
 */
export default function NotFound() {
  return (
    <SiteChrome>
      <main className={styles.page}>
        <RouteOpening>
          <p className={styles.mark} aria-hidden="true" />
          <h1 className={styles.title}>Page not found</h1>
          <p className={styles.body}>
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>
        </RouteOpening>
        <div className={styles.actions}>
          <Link href="/" className={styles.primary}>
            Home
          </Link>
        </div>
        <div className={styles.secondaryRow}>
          <Link href="/programs" className={styles.secondary}>
            Programmes
          </Link>
          <Link href="/locations" className={styles.secondary}>
            Find a Studio
          </Link>
          <Link href="/trial" className={styles.secondary}>
            Book a Free Trial
          </Link>
        </div>
      </main>
    </SiteChrome>
  );
}
