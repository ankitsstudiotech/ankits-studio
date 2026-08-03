import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { FooterLinkGroup } from "./types";

export type SiteFooterProps = {
  brandName?: string;
  tagline?: string;
  groups: FooterLinkGroup[];
  disclaimer?: string;
};

export function SiteFooter({
  brandName = "Ankit's Studio",
  tagline = "Strength, yoga, dance — one neighbourhood studio across Navi Mumbai.",
  groups,
  disclaimer = "Business facts shown as mock or reference-only remain labelled until the owner verifies them.",
}: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t border-white/10 bg-field text-ink-inverse">
      <Container className="py-[var(--spacing-section)]">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_repeat(2,minmax(0,1fr))]">
          <div className="max-w-sm">
            <p className="mb-3 font-[family-name:var(--font-display)] text-[length:var(--text-title)] leading-[var(--text-title--line-height)] tracking-[var(--text-title--letter-spacing)]">
              {brandName}
            </p>
            <p className="text-[length:var(--text-caption)] leading-[var(--text-caption--line-height)] text-[var(--color-muted-on-field)]">
              {tagline}
            </p>
          </div>

          {groups.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--text-overline--letter-spacing)] text-[var(--color-muted-on-field)]">
                {group.title}
              </p>
              <ul className="flex flex-col gap-2">
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

        <p className="mt-10 max-w-3xl border-t border-white/10 pt-6 text-xs text-[var(--color-muted-on-field)]">
          {disclaimer}
        </p>
      </Container>
    </footer>
  );
}
