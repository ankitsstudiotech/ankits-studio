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
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold text-ink">Page not found</h1>
        <p className="max-w-md text-ink-muted">The page you&apos;re looking for doesn&apos;t exist or may have moved.</p>
        <Link href="/" className="rounded bg-accent px-4 py-2 font-medium text-white">
          Return home
        </Link>
      </main>
    </SiteChrome>
  );
}
