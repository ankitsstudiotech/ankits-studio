import Link from "next/link";
import { SiteChrome } from "@/components/layout";

/**
 * Wrapped in the same `SiteChrome` every real route uses, so a 404 doesn't
 * strand a visitor without header/nav/footer — see docs/DECISIONS.md
 * ADR-013 (VIS-006).
 */
export default function NotFound() {
  return (
    <SiteChrome>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-[var(--spacing-gutter)] py-[var(--spacing-section)] text-center">
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] tracking-[var(--text-title--letter-spacing)] text-ink-inverse">
          Page not found
        </h1>
        <p className="max-w-md text-[var(--color-muted-on-field)]">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center justify-center bg-accent px-6 text-xs font-bold uppercase tracking-[0.06em] text-accent-foreground hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
        >
          Return home
        </Link>
      </main>
    </SiteChrome>
  );
}
