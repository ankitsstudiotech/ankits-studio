"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";

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
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold text-ink">Something went wrong</h1>
      <p className="max-w-md text-ink-muted">
        We hit an unexpected error loading this page. You can try again, or head back home.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="rounded bg-accent px-4 py-2 font-medium text-white"
        >
          Try again
        </button>
        <Link href="/" className="rounded border border-ink/20 px-4 py-2 font-medium text-ink">
          Return home
        </Link>
      </div>
    </main>
  );
}
