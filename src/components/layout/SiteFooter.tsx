import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { FooterLinkGroup } from "./types";

export type SiteFooterProps = {
  brandName?: string;
  tagline?: string;
  phone?: string;
  email?: string;
  groups: FooterLinkGroup[];
  copyright?: string;
};

/**
 * Dark Pulse footer — brand column + explore/branches, full-width divider,
 * concise copyright line.
 */
export function SiteFooter({
  brandName = "Ankit's Studio",
  tagline = "Strength, yoga, dance — one neighbourhood studio across Navi Mumbai.",
  phone,
  email,
  groups,
  copyright = `© ${new Date().getFullYear()} Ankit's Studio`,
}: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t border-white/10 bg-field text-ink-inverse">
      <Container className="py-[var(--spacing-section)]">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.35fr)_repeat(2,minmax(0,1fr))]">
          <div className="max-w-sm">
            <p className="mb-3 font-[family-name:var(--font-display)] text-[length:var(--text-title)] uppercase leading-[var(--text-title--line-height)] tracking-[var(--text-title--letter-spacing)]">
              {brandName}
            </p>
            <p className="mb-4 text-[length:var(--text-body)] leading-[var(--text-body--line-height)] text-[var(--color-muted-on-field)]">
              {tagline}
            </p>
            {phone ? (
              <p className="mb-1">
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="inline-flex min-h-11 items-center text-sm text-ink-inverse underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-volt)]"
                >
                  {phone}
                </a>
              </p>
            ) : null}
            {email ? (
              <p>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex min-h-11 items-center text-sm text-[var(--color-muted-on-field)] underline-offset-4 hover:text-ink-inverse hover:underline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-volt)]"
                >
                  {email}
                </a>
              </p>
            ) : null}
          </div>

          {groups.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--text-overline--letter-spacing)] text-[var(--color-muted-on-field)]">
                {group.title}
              </p>
              <ul className="flex flex-col gap-1">
                {group.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="-mx-2 inline-flex min-h-11 min-w-11 items-center px-2 text-sm text-[var(--color-muted-on-field)] transition-colors hover:text-ink-inverse focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-volt)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-[var(--color-border-on-field)] pt-6">
          <p className="text-xs text-[var(--color-muted-on-field)]">{copyright}</p>
        </div>
      </Container>
    </footer>
  );
}
