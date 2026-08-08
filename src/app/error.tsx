"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";
import styles from "@/components/status/pulse/status.module.css";

export default function ErrorPage({
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
    <div className={styles.page}>
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
    </div>
  );
}
