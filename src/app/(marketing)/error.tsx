"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";
import styles from "@/components/status/pulse/status.module.css";

/**
 * Scoped to the `(marketing)` route group only (not `programs/` or
 * `locations/`, per docs/DECISIONS.md ADR-013 ARCH-003). Sits below
 * `(marketing)/layout.tsx` in the tree, so `SiteChrome` (header/footer)
 * still renders around this — unlike the chrome-less root `error.tsx`,
 * which has no layout above it to inherit chrome from.
 */
export default function MarketingErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Something went wrong.</h1>
      <p className={styles.body}>
        We couldn&apos;t load this page. Try again, or contact Ankit&apos;s Studio if you need help.
      </p>
      <div className={styles.actions}>
        <button type="button" onClick={() => unstable_retry()} className={styles.primary}>
          Try again
        </button>
        <Link href="/" className={styles.secondary}>
          Home
        </Link>
        <Link href="/contact" className={styles.secondary}>
          Contact
        </Link>
      </div>
    </main>
  );
}
